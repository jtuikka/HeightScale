import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  RefreshControl, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MeasurementCard } from '../MeasurementCard';
import { scaleApi } from '../api';
import { bleService } from '../bleService';
import { storageService } from '../storage';
import { ScaleMeasurement } from '../types';
import { getUseMetric } from '../utils/conversions';
import { useTranslation } from '../i18n/useTranslation';

type ConnectionMode = 'ble' | 'api' | 'offline';

export default function HomeScreen() {
  const { t, reloadLanguage } = useTranslation();
  const [measurement, setMeasurement] = useState<ScaleMeasurement | null>(null);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('offline');
  const [useBLE, setUseBLE] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [bleConnected, setBleConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const measurementCallbackRef = useRef<((m: ScaleMeasurement) => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      reloadLanguage();
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const fetchMeasurement = async () => {
    try {
      const local = await storageService.getLatestMeasurement();
      if (local) {
        setMeasurement(local);
        setLastUpdate(new Date());
      }

      if (useBLE && connectionMode !== 'api') {
        return;
      }

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

  const checkConnection = async () => {
    if (useBLE) {
      const bleEnabled = await bleService.isBluetoothEnabled();
      if (bleEnabled && bleConnected) {
        setConnectionMode('ble');
        return;
      }
    }

    const apiConnected = await scaleApi.checkHealth();
    if (apiConnected) {
      setConnectionMode('api');
      return;
    }

    setConnectionMode('offline');
  };

  const handleNewMeasurement = useCallback(async (newMeasurement: ScaleMeasurement) => {
    await storageService.saveMeasurement(newMeasurement);
    setMeasurement(newMeasurement);
    setLastUpdate(new Date());

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
  }, []);

  useEffect(() => {
    measurementCallbackRef.current = handleNewMeasurement;
  }, [handleNewMeasurement]);

  const startBLEConnection = async () => {
    try {
      Alert.alert(
        t.bleConnectionTitle,
        t.bleConnectionMessage,
        [
          {
            text: t.cancel,
            style: 'cancel'
          },
          {
            text: t.onScale,
            onPress: async () => {
              const hasPermissions = await bleService.requestPermissions();
              if (!hasPermissions) {
                Alert.alert(t.alertError, t.bluetoothPermissionError);
                return;
              }

              Alert.alert(t.connecting, t.searchingScale);
              const connected = await bleService.connect();
              
              if (connected) {
                setBleConnected(true);
                setConnectionMode('ble');

                await bleService.startMonitoring((newMeasurement) => {
                  if (measurementCallbackRef.current) {
                    measurementCallbackRef.current(newMeasurement);
                  }
                });

                Alert.alert(t.connected, t.scaleFoundConnected);
              } else {
                Alert.alert(t.scaleNotFound, t.scaleNotFoundMessage);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('BLE connection error:', error);
      Alert.alert(t.alertError, t.bleConnectionFailed);
    }
  };

  const stopBLEConnection = async () => {
    await bleService.stopMonitoring();
    await bleService.disconnect();
    setBleConnected(false);
    await checkConnection();
  };

  const toggleBLE = async (enabled: boolean) => {
    setUseBLE(enabled);
    
    if (!enabled && bleConnected) {
      await stopBLEConnection();
    }
    
    await checkConnection();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMeasurement(), checkConnection()]);
    setRefreshing(false);
  };

  useEffect(() => {
    checkConnection();
    fetchMeasurement();

    const interval = setInterval(() => {
      if (connectionMode === 'api') {
        fetchMeasurement();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [connectionMode]);

  useFocusEffect(
    useCallback(() => {
      fetchMeasurement();
    }, [])
  );

  const getConnectionStatusText = () => {
    switch (connectionMode) {
      case 'ble':
        return t.statusConnectedBLE;
      case 'api':
        return t.statusConnectedAPI;
      case 'offline':
        return t.statusOfflineMode;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionMode) {
      case 'ble':
        return '#9370db'; // Medium Purple
      case 'api':
        return '#8a2be2'; // Blue Violet
      case 'offline':
        return '#4b0082'; // Indigo
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t.appTitle}</Text>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>{t.useBLE}</Text>
          <Switch
            value={useBLE}
            onValueChange={toggleBLE}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={useBLE ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        {/* Yhteystila ja yhdistäminen */}
        {useBLE && !bleConnected && (
          <View style={styles.connectionSection}>
            <Image 
              source={require('../assets/xiaomi-smart-scale-2.jpg')} 
              style={styles.scaleImage}
              resizeMode="cover"
            />
            <View style={[styles.statusBadge, { backgroundColor: getConnectionStatusColor() }]}>
              <Text style={styles.statusText}>{getConnectionStatusText()}</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={startBLEConnection}>
              <Text style={styles.connectButtonText}>{t.connectScale}</Text>
            </TouchableOpacity>
          </View>
        )}

        {useBLE && bleConnected && (
          <View style={styles.connectionSection}>
            <Image 
              source={require('../assets/xiaomi-smart-scale-2.jpg')} 
              style={styles.scaleImage}
              resizeMode="cover"
            />
            <View style={[styles.statusBadge, { backgroundColor: getConnectionStatusColor() }]}>
              <Text style={styles.statusText}>{getConnectionStatusText()}</Text>
            </View>
            <TouchableOpacity style={styles.disconnectButton} onPress={stopBLEConnection}>
              <Text style={styles.disconnectButtonText}>{t.disconnect}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* API tai offline-tila */}
        {!useBLE && (
          <View style={styles.connectionSection}>
            <View style={[styles.statusBadge, { backgroundColor: getConnectionStatusColor() }]}>
              <Text style={styles.statusText}>{getConnectionStatusText()}</Text>
            </View>
          </View>
        )}

        {measurement ? (
          <MeasurementCard key={refreshKey} measurement={measurement} />
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>{t.noMeasurements}</Text>
            <Text style={styles.noDataSubtext}>
              {useBLE 
                ? t.noMeasurementsSubtextBLE
                : t.noMeasurementsSubtext}
            </Text>
          </View>
        )}

        {lastUpdate && (
          <Text style={styles.lastUpdate}>
            {t.lastUpdated}: {lastUpdate.toLocaleTimeString('fi-FI')}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970', // Midnight Blue
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#2d2d5f', // Tumma violetti
    borderBottomWidth: 1,
    borderBottomColor: '#6a5acd', // Slate Blue
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // Valkoinen - parempi kontrasti
  },
  connectionSection: {
    padding: 0,
    backgroundColor: '#6a5acd', // Slate Blue violetti
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    position: 'relative',
    height: 250,
    overflow: 'hidden',
  },
  statusBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Tumma läpinäkyvä tausta
    zIndex: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6a5acd', // Slate Blue violetti
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Valkoinen - parempi kontrasti
  },
  connectButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(147, 112, 219, 0.9)', // Medium Purple, hieman läpinäkyvä
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disconnectButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(139, 0, 139, 0.9)', // Dark Magenta, hieman läpinäkyvä
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noData: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f0e6ff', // Hyvin vaalea violetti - parempi kontrasti
    marginBottom: 10,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#e0d0ff', // Vaalea violetti
    textAlign: 'center',
  },
  lastUpdate: {
    textAlign: 'center',
    color: '#e0d0ff', // Vaalea violetti - parempi kontrasti
    marginTop: 10,
    marginBottom: 20,
    fontSize: 12,
    fontWeight: '500',
  },
  scaleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
