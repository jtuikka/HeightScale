import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScaleMeasurement } from './types';

interface MeasurementCardProps {
  measurement: ScaleMeasurement | null;
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement }) => {
  if (!measurement) {
    return (
      <View style={styles.card}>
        <Text style={styles.noDataText}>Ei mittaustuloksia</Text>
        <Text style={styles.infoText}>Astu vaa'an päälle aloittaaksesi mittauksen</Text>
      </View>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fi-FI');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Viimeisin mittaus</Text>
      <Text style={styles.timestamp}>{formatDate(measurement.timestamp)}</Text>
      
      <View style={styles.measurementContainer}>
        <View style={styles.measurementItem}>
          <Text style={styles.label}>Paino</Text>
          <Text style={styles.value}>{measurement.weight.toFixed(1)}</Text>
          <Text style={styles.unit}>kg</Text>
        </View>

        <View style={styles.measurementItem}>
          <Text style={styles.label}>Pituus</Text>
          <Text style={styles.value}>{(measurement.height * 100).toFixed(0)}</Text>
          <Text style={styles.unit}>cm</Text>
        </View>

        <View style={styles.measurementItem}>
          <Text style={styles.label}>Impedanssi</Text>
          <Text style={styles.value}>{measurement.impedance}</Text>
          <Text style={styles.unit}>Ω</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  measurementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  measurementItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  unit: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
