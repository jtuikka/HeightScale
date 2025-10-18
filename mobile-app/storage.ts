import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScaleMeasurement } from './types';

const MEASUREMENTS_KEY = '@heightscale_measurements';
const MAX_MEASUREMENTS = 100;

export class StorageService {
  /**
   * Tallentaa mittauksen paikallisesti
   */
  async saveMeasurement(measurement: ScaleMeasurement): Promise<void> {
    try {
      const measurements = await this.getAllMeasurements();
      measurements.unshift(measurement); // Lisää alkuun (uusin ensin)
      
      // Pidä vain viimeiset MAX_MEASUREMENTS mittausta
      const trimmed = measurements.slice(0, MAX_MEASUREMENTS);
      
      await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(trimmed));
      console.log('Measurement saved locally');
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw error;
    }
  }

  /**
   * Hakee kaikki paikalliset mittaukset
   */
  async getAllMeasurements(): Promise<ScaleMeasurement[]> {
    try {
      const data = await AsyncStorage.getItem(MEASUREMENTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error loading measurements:', error);
      return [];
    }
  }

  /**
   * Hakee viimeisimmän mittauksen
   */
  async getLatestMeasurement(): Promise<ScaleMeasurement | null> {
    try {
      const measurements = await this.getAllMeasurements();
      return measurements.length > 0 ? measurements[0] : null;
    } catch (error) {
      console.error('Error loading latest measurement:', error);
      return null;
    }
  }

  /**
   * Tyhjentää kaikki mittaukset
   */
  async clearAllMeasurements(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MEASUREMENTS_KEY);
      console.log('All measurements cleared');
    } catch (error) {
      console.error('Error clearing measurements:', error);
      throw error;
    }
  }

  /**
   * Poistaa vanhat mittaukset (yli 30 päivää)
   */
  async cleanOldMeasurements(daysToKeep: number = 30): Promise<void> {
    try {
      const measurements = await this.getAllMeasurements();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filtered = measurements.filter(m => {
        const measurementDate = new Date(m.timestamp);
        return measurementDate > cutoffDate;
      });
      
      await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(filtered));
      console.log(`Cleaned measurements older than ${daysToKeep} days`);
    } catch (error) {
      console.error('Error cleaning old measurements:', error);
      throw error;
    }
  }

  /**
   * Synkronoi paikalliset mittaukset backendiin (jos saatavilla)
   */
  async syncToBackend(apiUrl: string): Promise<number> {
    try {
      const measurements = await this.getAllMeasurements();
      let syncedCount = 0;

      for (const measurement of measurements) {
        try {
          const response = await fetch(
            `${apiUrl}/api/measurement?weight=${measurement.weight}&impedance=${measurement.impedance}&height=${measurement.height}`,
            { method: 'POST' }
          );
          
          if (response.ok) {
            syncedCount++;
          }
        } catch (error) {
          // Jatka muiden kanssa vaikka yksi epäonnistuisi
          console.error('Failed to sync measurement:', error);
        }
      }

      console.log(`Synced ${syncedCount}/${measurements.length} measurements to backend`);
      return syncedCount;
    } catch (error) {
      console.error('Error syncing to backend:', error);
      return 0;
    }
  }
}

export const storageService = new StorageService();
