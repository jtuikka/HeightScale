import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  RefreshControl, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Platform
} from 'react-native';
import { MeasurementCard } from './MeasurementCard';
import { scaleApi } from './api';
import { bleService } from './bleService';
import { storageService } from './storage';
import { ScaleMeasurement } from './types';

type ConnectionMode = 'ble' | 'api' | 'offline';

export default function App() {
  const [measurement, setMeasurement] = useState<ScaleMeasurement | null>(null);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('offline');
  const [useBLE, setUseBLE] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [bleConnected, setBleConnected] = useState(false);

  /**
   * Hakee mittauksen (BLE tai API tai paikallinen)
   */
  const fetchMeasurement = async () => {
    try {
      // Yritä ensin paikallista dataa
      const local = await storageService.getLatestMeasurement();
      if (local) {
        setMeasurement(local);
        setLastUpdate(new Date());
      }

      // Jos BLE on käytössä ja ei API-yhteyttä, käytä paikallista
      if (useBLE && connectionMode !== 'api') {
        return;
      }

      // Muuten yritä API:a
      if (connectionMode === 'api') {
        const data = await scaleApi.getLatestMeasurement();
        if (data) {
          setMeasurement(data);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Error fetching measurement:', error);
    }
  };

  /**
   * Tarkistaa yhteyden tilan
   */
  const checkConnection = async () => {
    // Tarkista BLE
    if (useBLE) {
      const bleEnabled = await bleService.isBluetoothEnabled();
      if (bleEnabled && bleConnected) {
        setConnectionMode('ble');
        return;
      }
    }

    // Tarkista API
    const apiConnected = await scaleApi.checkHealth();
    if (apiConnected) {
      setConnectionMode('api');
      return;
    }

    // Offline-tila
    setConnectionMode('offline');
  };

  /**
   * Käynnistää BLE-yhteyden
   */
  const startBLEConnection = async () => {
    try {
      Alert.alert(
        'BLE-yhteys',
        'Astu vaa\'an päälle aktivoidaksesi sen, sitten paina OK',
        [
          {
            text: 'Peruuta',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: async () => {
              // Tarkista oikeudet
              const hasPermissions = await bleService.requestPermissions();
              if (!hasPermissions) {
                Alert.alert('Virhe', 'Bluetooth-oikeudet puuttuvat');
                return;
              }

              // Yhdistä
              Alert.alert('Yhdistetään...', 'Etsitään vaa\'aa');
              const connected = await bleService.connect();
              
              if (connected) {
                setBleConnected(true);
                setConnectionMode('ble');

                // Aloita mittausten kuuntelu
                await bleService.startMonitoring(async (newMeasurement) => {
                  console.log('New measurement from scale:', newMeasurement);
                  
                  // Tallenna paikallisesti
                  await storageService.saveMeasurement(newMeasurement);
                  
                  // Päivitä näyttö
                  setMeasurement(newMeasurement);
                  setLastUpdate(new Date());

                  // Jos API saatavilla, synkronoi
                  const apiAvailable = await scaleApi.checkHealth();
                  if (apiAvailable) {
                    try {
                      await fetch(
                        `http://192.168.1.196:8000/api/measurement?weight=${newMeasurement.weight}&impedance=${newMeasurement.impedance}&height=${newMeasurement.height}`,
                        { method: 'POST' }
                      );
                    } catch (error) {
                      console.error('Failed to sync to API:', error);
                    }
                  }
                });

                Alert.alert('Yhdistetty!', 'Vaaka löytyi ja yhteys muodostettu');
              } else {
                Alert.alert('Virhe', 'Vaa\'aa ei löytynyt. Varmista että se on päällä ja lähellä.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('BLE connection error:', error);
      Alert.alert('Virhe', 'BLE-yhteyden muodostaminen epäonnistui');
    }
  };

  /**
   * Katkaisee BLE-yhteyden
   */
  const stopBLEConnection = async () => {
    await bleService.stopMonitoring();
    await bleService.disconnect();
    setBleConnected(false);
    await checkConnection();
  };

  /**
   * Vaihtaa BLE/API-tilaa
   */
  const toggleBLE = async (enabled: boolean) => {
    setUseBLE(enabled);
    
    if (enabled && !bleConnected) {
      // Käyttäjä voi myöhemmin painaa "Yhdistä BLE" -nappia
    } else if (!enabled && bleConnected) {
      await stopBLEConnection();
    }
    
    await checkConnection();
  };

  /**
   * Päivittää datan
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMeasurement(), checkConnection()]);
    setRefreshing(false);
  };

  useEffect(() => {
    // Alustus
    checkConnection();
    fetchMeasurement();

    // Päivitä data automaattisesti 5 sekunnin välein (jos API-tilassa)
    const interval = setInterval(() => {
      if (connectionMode === 'api') {
        fetchMeasurement();
      }
      checkConnection();
    }, 5000);

    return () => {
      clearInterval(interval);
      // Puhdista BLE-resurssit
      if (bleConnected) {
        bleService.stopMonitoring();
        bleService.disconnect();
      }
    };
  }, [connectionMode, useBLE]);

  const getConnectionColor = () => {
    switch (connectionMode) {
      case 'ble': return '#4CAF50'; // Vihreä
      case 'api': return '#2196F3'; // Sininen
      case 'offline': return '#f44336'; // Punainen
    }
  };

  const getConnectionText = () => {
    switch (connectionMode) {
      case 'ble': return 'BLE-yhteys';
      case 'api': return 'API-yhteys';
      case 'offline': return 'Offline-tila';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HeightScale</Text>
        <View style={[styles.statusIndicator, { backgroundColor: getConnectionColor() }]} />
        <Text style={styles.statusText}>{getConnectionText()}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* BLE-tilan vaihto */}
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Käytä BLE-yhteyttä</Text>
            <Switch
              value={useBLE}
              onValueChange={toggleBLE}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={useBLE ? '#2196F3' : '#f4f3f4'}
            />
          </View>
          
          {useBLE && !bleConnected && (
            <TouchableOpacity 
              style={styles.bleConnectButton} 
              onPress={startBLEConnection}
            >
              <Text style={styles.bleConnectButtonText}>🔵 Yhdistä vaa'aan (BLE)</Text>
            </TouchableOpacity>
          )}
          
          {useBLE && bleConnected && (
            <TouchableOpacity 
              style={[styles.bleConnectButton, { backgroundColor: '#f44336' }]} 
              onPress={stopBLEConnection}
            >
              <Text style={styles.bleConnectButtonText}>❌ Katkaise BLE-yhteys</Text>
            </TouchableOpacity>
          )}
        </View>

        <MeasurementCard measurement={measurement} />

        {lastUpdate && (
          <Text style={styles.updateTime}>
            Päivitetty: {lastUpdate.toLocaleTimeString('fi-FI')}
          </Text>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Päivitä</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Käyttöohje</Text>
          <Text style={styles.infoText}>
            {useBLE ? (
              <>
                <Text style={{ fontWeight: 'bold' }}>BLE-tila:{'\n'}</Text>
                1. Paina "Yhdistä vaa'aan (BLE)"{'\n'}
                2. Astu vaa'an päälle aktivoidaksesi sen{'\n'}
                3. Sovellus yhdistää automaattisesti{'\n'}
                4. Mittaukset tallennetaan paikallisesti{'\n'}
                {'\n'}
                Toimii ilman internet-yhteyttä! 📱
              </>
            ) : (
              <>
                <Text style={{ fontWeight: 'bold' }}>API-tila:{'\n'}</Text>
                1. Varmista että backend on käynnissä{'\n'}
                2. Astu vaa'an päälle mittauksen aloittamiseksi{'\n'}
                3. Sovellus päivittyy automaattisesti{'\n'}
                {'\n'}
                Vaatii tietokoneen + backendin 💻
              </>
            )}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d61ff',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bleConnectButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  bleConnectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateTime: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});
