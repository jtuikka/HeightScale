import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { Buffer } from 'buffer';
import { ScaleMeasurement } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCALE_ADDRESS = '0C:95:41:CB:23:FF';
const BODY_COMPOSITION_SERVICE_UUID = '0000181b-0000-1000-8000-00805f9b34fb';
const BODY_COMPOSITION_MEASUREMENT_UUID = '00002a9c-0000-1000-8000-00805f9b34fb';
const SETTINGS_KEY = '@heightscale_settings';

export class BLEService {
  private manager: BleManager;
  private device: Device | null = null;
  private scanTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  /**
   * Tarkistaa onko Bluetooth päällä
   */
  async isBluetoothEnabled(): Promise<boolean> {
    const state = await this.manager.state();
    return state === 'PoweredOn';
  }

  /**
   * Pyytää Bluetooth-oikeudet (Android 12+)
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const apiLevel = Platform.Version;
        
        if (apiLevel >= 31) {
          // Android 12+ (API 31+)
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          return (
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          // Android < 12
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      
      // iOS
      const state = await this.manager.state();
      return state === 'PoweredOn';
    } catch (error) {
      console.error('Error requesting Bluetooth permissions:', error);
      return false;
    }
  }

  /**
   * Etsii Mi Body Composition Scale 2:n
   */
  async findScale(timeoutMs: number = 20000): Promise<Device | null> {
    console.log('🔍 Starting BLE scan for scale:', SCALE_ADDRESS);
    return new Promise((resolve) => {
      let found = false;
      let devicesFound = 0;

      this.scanTimeout = setTimeout(() => {
        if (!found) {
          console.log('⏰ Scan timeout - scale not found');
          console.log(`📱 Found ${devicesFound} BLE devices total`);
          this.manager.stopDeviceScan();
          resolve(null);
        }
      }, timeoutMs);

      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('❌ Scan error:', error);
          this.manager.stopDeviceScan();
          resolve(null);
          return;
        }

        if (device) {
          devicesFound++;
          console.log(`📡 Found device: ${device.id} (${device.name || 'unnamed'})`);
          
          if (device.id.toUpperCase() === SCALE_ADDRESS.toUpperCase()) {
            console.log('✅ Scale found!');
            found = true;
            this.manager.stopDeviceScan();
            if (this.scanTimeout) {
              clearTimeout(this.scanTimeout);
            }
            console.log('Found scale:', device.name, device.id);
            resolve(device);
          }
        }
      });
    });
  }

  /**
   * Yhdistää vaa'aan
   */
  async connect(): Promise<boolean> {
    try {
      console.log('🔌 Starting connection process...');
      
      // Tarkista Bluetooth-tila ensin
      const state = await this.manager.state();
      console.log('📶 Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        console.log('⚠️ Bluetooth is not powered on!');
        return false;
      }
      
      const device = await this.findScale();
      if (!device) {
        console.log('❌ Scale not found after scan');
        return false;
      }

      console.log('🔗 Connecting to device...');
      this.device = await device.connect();
      
      console.log('🔍 Discovering services...');
      await this.device.discoverAllServicesAndCharacteristics();
      
      console.log('✅ Connected to scale successfully');
      return true;
    } catch (error) {
      console.error('❌ Connection error:', error);
      return false;
    }
  }

  /**
   * Katkaisee yhteyden
   */
  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.device.cancelConnection();
        this.device = null;
        console.log('Disconnected from scale');
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  }

  /**
   * Parsii mittausdata vaa'alta
   */
  private async parseMeasurement(data: string): Promise<ScaleMeasurement | null> {
    try {
      // Muunna base64 -> bytes
      const bytes = Buffer.from(data, 'base64');
      
      console.log('📊 Raw BLE data (hex):', bytes.toString('hex'));
      console.log('📊 Data length:', bytes.length);
      
      // Tarkista että dataa on tarpeeksi
      if (bytes.length < 13) {
        console.log('⚠️ Not enough data, need at least 13 bytes');
        return null;
      }

      // Paino: tavut 11-12 (little-endian)
      const weightRaw = bytes[11] + (bytes[12] << 8);
      const weight = weightRaw / 200;

      // Impedanssi: tavut 9-10 (little-endian)
      const impedance = bytes[9] + (bytes[10] << 8);

      // Hae BMI asetuksista
      let targetBMI = 21.0; // Oletus
      try {
        const settingsStr = await AsyncStorage.getItem(SETTINGS_KEY);
        if (settingsStr) {
          const settings = JSON.parse(settingsStr);
          targetBMI = parseFloat(settings.targetBMI) || 21.0;
        }
      } catch (error) {
        console.log('Could not load BMI from settings, using default 21');
      }

      // Pituus lasketaan painosta ja BMI:stä: height = sqrt(weight / BMI)
      const height = Math.sqrt(weight / targetBMI);

      // Tarkista onko mittaus stabiloitunut (bitti 5 tavussa 1)
      const stabilized = (bytes[1] & 0x20) > 0;

      console.log('📊 Parsed values:', {
        weightRaw,
        weight,
        impedance,
        height,
        targetBMI,
        stabilized,
        byte1: bytes[1].toString(16)
      });

      if (!stabilized || impedance >= 3000) {
        // Mittaus ei valmis tai impedanssi liian korkea
        console.log('⚠️ Measurement not ready or impedance too high');
        return null;
      }

      console.log('✅ Valid measurement!');
      return {
        weight,
        impedance,
        height,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  }

  /**
   * Aloittaa mittausten kuuntelun
   */
  async startMonitoring(onMeasurement: (measurement: ScaleMeasurement) => void): Promise<boolean> {
    if (!this.device) {
      console.error('Not connected to device');
      return false;
    }

    try {
      await this.device.monitorCharacteristicForService(
        BODY_COMPOSITION_SERVICE_UUID,
        BODY_COMPOSITION_MEASUREMENT_UUID,
        async (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            const measurement = await this.parseMeasurement(characteristic.value);
            if (measurement) {
              console.log('New measurement:', measurement);
              onMeasurement(measurement);
            }
          }
        }
      );

      console.log('Started monitoring measurements');
      return true;
    } catch (error) {
      console.error('Monitoring error:', error);
      return false;
    }
  }

  /**
   * Lopettaa mittausten kuuntelun
   */
  async stopMonitoring(): Promise<void> {
    if (this.device) {
      try {
        // BleManager hoitaa monitoroinnin lopettamisen automaattisesti
        console.log('Stopped monitoring');
      } catch (error) {
        console.error('Stop monitoring error:', error);
      }
    }
  }

  /**
   * Puhdistaa resurssit
   */
  destroy(): void {
    this.manager.destroy();
  }
}

export const bleService = new BLEService();
