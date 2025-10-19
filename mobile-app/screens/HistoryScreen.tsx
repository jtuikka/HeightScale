import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { storageService } from '../storage';
import { ScaleMeasurement } from '../types';
import { getUseMetric, formatWeight, formatHeight } from '../utils/conversions';
import { useTranslation } from '../i18n/useTranslation';

export default function HistoryScreen() {
  const { t, reloadLanguage } = useTranslation();
  const [measurements, setMeasurements] = useState<ScaleMeasurement[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [useMetric, setUseMetric] = useState(true);

  useFocusEffect(
    useCallback(() => {
      reloadLanguage();
    }, [])
  );
  const loadHistory = async () => {
    try {
      const history = await storageService.getAllMeasurements();
      setMeasurements(history);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const loadMetricSetting = async () => {
    const metric = await getUseMetric();
    setUseMetric(metric);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMetricSetting();
      loadHistory();
    }, [])
  );

  const clearHistory = () => {
    Alert.alert(
      t.clearHistoryConfirm,
      t.clearHistoryQuestion,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              setMeasurements([]);
              Alert.alert(t.alertSuccess, t.historyCleared);
            } catch (error) {
              Alert.alert(t.alertError, t.clearFailed);
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMetricSetting();
    await loadHistory();
    setRefreshing(false);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateBMI = (weight: number, height: number) => {
    if (height <= 0) return 0;
    return (weight / (height * height)).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.measurementHistory}</Text>
        <Text style={styles.count}>{measurements.length} {t.measurements}</Text>
      </View>

      {measurements.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>{t.clearHistory}</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {measurements.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t.noHistory}</Text>
            <Text style={styles.emptySubtext}>
              {t.noHistorySubtext}
            </Text>
          </View>
        ) : (
          measurements.map((measurement, index) => (
            <View key={index} style={styles.measurementCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardDate}>
                  {formatDate(measurement.timestamp)}
                </Text>
                <Text style={styles.cardIndex}>#{measurements.length - index}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.dataRow}>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>{t.weight}</Text>
                    <Text style={styles.dataValue}>
                      {formatWeight(measurement.weight, useMetric)}
                    </Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>{t.bmi}</Text>
                    <Text style={styles.dataValue}>
                      {calculateBMI(measurement.weight, measurement.height)}
                    </Text>
                  </View>
                </View>

                <View style={styles.dataRow}>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>{t.impedance}</Text>
                    <Text style={styles.dataValue}>
                      {measurement.impedance} Ω
                    </Text>
                  </View>

                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>{t.height}</Text>
                    <Text style={styles.dataValue}>
                      {formatHeight(measurement.height, useMetric)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
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
    color: '#ffffff', // Valkoinen
    marginBottom: 5,
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f0e6ff', // Hyvin vaalea violetti
  },
  clearButton: {
    backgroundColor: '#8b008b', // Dark Magenta
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f0e6ff', // Hyvin vaalea violetti
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e0d0ff', // Vaalea violetti
    textAlign: 'center',
  },
  measurementCard: {
    backgroundColor: '#6a5acd', // Slate Blue violetti
    margin: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Läpinäkyvä valkoinen
  },
  cardDate: {
    fontSize: 14,
    color: '#f0e6ff', // Hyvin vaalea violetti
    fontWeight: '500',
  },
  cardIndex: {
    fontSize: 14,
    color: '#e0d0ff', // Vaalea violetti
    fontWeight: '600',
  },
  cardBody: {
    gap: 10,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataItem: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f0e6ff', // Hyvin vaalea violetti
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // Valkoinen
  },
});
