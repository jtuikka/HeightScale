import axios from 'axios';
import { ScaleMeasurement } from './types';

// Vaihda tämä tietokoneen IP-osoitteeseen kun käytät Expo Go:ta
// esim. 'http://192.168.1.100:8000'
const API_BASE_URL = '';

export const scaleApi = {
  /**
   * Hakee viimeisimmän mittauksen
   */
  getLatestMeasurement: async (): Promise<ScaleMeasurement | null> => {
    try {
      const response = await axios.get<ScaleMeasurement>(`${API_BASE_URL}/api/measurement/latest`);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest measurement:', error);
      return null;
    }
  },

  /**
   * Hakee kaikki mittaukset
   */
  getAllMeasurements: async (): Promise<ScaleMeasurement[]> => {
    try {
      const response = await axios.get<ScaleMeasurement[]>(`${API_BASE_URL}/api/measurements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }
  },

  /**
   * Tarkistaa onko backend saavutettavissa
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      await axios.get(`${API_BASE_URL}/api/health`);
      return true;
    } catch (error) {
      return false;
    }
  }
};
