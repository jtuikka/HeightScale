import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScaleMeasurement } from './types';
import { getUseMetric, formatHeight } from './utils/conversions';
import { useTranslation } from './i18n/useTranslation';

interface MeasurementCardProps {
  measurement: ScaleMeasurement | null;
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement }) => {
  const { t } = useTranslation();
  const [useMetric, setUseMetric] = useState(true);

  useEffect(() => {
    loadMetricSetting();
  }, [measurement]);

  const loadMetricSetting = async () => {
    const metric = await getUseMetric();
    setUseMetric(metric);
  };

  if (!measurement) {
    return (
      <View style={styles.card}>
        <Text style={styles.noDataText}>{t.noMeasurementData}</Text>
        <Text style={styles.infoText}>{t.stepOnScale}</Text>
      </View>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fi-FI');
  };

  const heightFormatted = formatHeight(measurement.height, useMetric);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t.latestMeasurement}</Text>
      <Text style={styles.timestamp}>{formatDate(measurement.timestamp)}</Text>
      
      <View style={styles.measurementContainer}>
        <View style={styles.measurementItem}>
          <Text style={styles.label}>{t.height}</Text>
          <Text style={styles.value}>{heightFormatted}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#6a5acd', // Slate Blue violetti
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // Valkoinen - paras kontrasti
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f0e6ff', // Hyvin vaalea violetti
    marginBottom: 24,
  },
  measurementContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f0e6ff', // Hyvin vaalea violetti - parempi kontrasti
    marginBottom: 12,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff', // Valkoinen - paras kontrasti
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff', // Valkoinen - paras kontrasti
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f0e6ff', // Hyvin vaalea violetti
    textAlign: 'center',
  },
});
