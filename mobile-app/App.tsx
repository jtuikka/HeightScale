import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { MeasurementCard } from './MeasurementCard';
import { scaleApi } from './api';
import { ScaleMeasurement } from './types';

export default function App() {
  const [measurement, setMeasurement] = useState<ScaleMeasurement | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMeasurement = async () => {
    const data = await scaleApi.getLatestMeasurement();
    if (data) {
      setMeasurement(data);
      setLastUpdate(new Date());
    }
  };

  const checkConnection = async () => {
    const connected = await scaleApi.checkHealth();
    setIsConnected(connected);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMeasurement(), checkConnection()]);
    setRefreshing(false);
  };

  useEffect(() => {
    // Tarkista yhteys ja hae data alussa
    checkConnection();
    fetchMeasurement();

    // Päivitä data automaattisesti 5 sekunnin välein
    const interval = setInterval(() => {
      fetchMeasurement();
      checkConnection();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HeightScale</Text>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#f44336' }]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Yhdistetty' : 'Ei yhteyttä'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
            1. Varmista että Python-backend on käynnissä{'\n'}
            2. Päivitä api.ts tiedostossa API_BASE_URL vastaamaan tietokoneesi IP-osoitetta{'\n'}
            3. Astu vaa'an päälle mittauksen aloittamiseksi{'\n'}
            4. Sovellus päivittyy automaattisesti 5 sekunnin välein
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
