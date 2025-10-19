import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@heightscale_settings';

/**
 * Hakee käyttäjän metrijärjestelmäasetuksen
 */
export async function getUseMetric(): Promise<boolean> {
  try {
    const settingsStr = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      return settings.useMetric !== false; // Oletus true
    }
  } catch (error) {
    console.log('Could not load metric setting, using default (metric)');
  }
  return true; // Oletus metrijärjestelmä
}

/**
 * Muuntaa painon metristen ja brittiläisten yksiköiden välillä
 */
export function convertWeight(kg: number, toMetric: boolean): number {
  if (toMetric) {
    return kg;
  }
  // kg -> lbs (1 kg = 2.20462 lbs)
  return kg * 2.20462;
}

/**
 * Muuntaa pituuden metristen ja brittiläisten yksiköiden välillä
 */
export function convertHeight(meters: number, toMetric: boolean): number {
  if (toMetric) {
    return meters * 100; // metrit -> senttimetrit
  }
  // metrit -> tuumat (1 m = 39.3701 inches)
  return meters * 39.3701;
}

/**
 * Palauttaa painon formatoituna yksiköineen
 */
export function formatWeight(kg: number, useMetric: boolean): string {
  const value = convertWeight(kg, useMetric);
  const unit = useMetric ? 'kg' : 'lbs';
  return `${value.toFixed(1)} ${unit}`;
}

/**
 * Palauttaa pituuden formatoituna yksiköineen
 */
export function formatHeight(meters: number, useMetric: boolean): string {
  const value = convertHeight(meters, useMetric);
  
  if (useMetric) {
    // Senttimetrit
    return `${value.toFixed(0)} cm`;
  } else {
    // Tuumat -> jalat ja tuumat
    const totalInches = Math.round(value);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}' ${inches}"`;
  }
}

/**
 * Palauttaa yksikön nimen
 */
export function getWeightUnit(useMetric: boolean): string {
  return useMetric ? 'kg' : 'lbs';
}

export function getHeightUnit(useMetric: boolean): string {
  return useMetric ? 'cm' : 'in';
}
