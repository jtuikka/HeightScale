export type Language = 'en' | 'fi';

export interface Translations {
  // Common
  save: string;
  cancel: string;
  delete: string;
  reset: string;
  close: string;
  home: string;
  history: string;
  settings: string;
  
  // Navigation
  navHome: string;
  navHistory: string;
  navSettings: string;
  
  // Home Screen
  appTitle: string;
  useBLE: string;
  connectScale: string;
  disconnect: string;
  noMeasurements: string;
  noMeasurementsSubtext: string;
  noMeasurementsSubtextBLE: string;
  lastUpdated: string;
  statusBLE: string;
  statusAPI: string;
  statusOffline: string;
  statusConnectedBLE: string;
  statusConnectedAPI: string;
  statusOfflineMode: string;
  
  // Measurement Card
  latestMeasurement: string;
  height: string;
  weight: string;
  impedance: string;
  bmi: string;
  noMeasurementData: string;
  stepOnScale: string;
  
  // History Screen
  measurementHistory: string;
  measurements: string;
  clearHistory: string;
  clearHistoryConfirm: string;
  clearHistoryQuestion: string;
  historyCleared: string;
  clearFailed: string;
  noHistory: string;
  noHistorySubtext: string;
  measurement: string;
  
  // Settings Screen (settings already in Common section)
  settingsSubtitle: string;
  
  // Measurement Info
  measurementInfo: string;
  targetBMI: string;
  targetBMIHint: string;
  
  // BLE Settings
  bleSettings: string;
  scaleAddress: string;
  scaleAddressHint: string;
  
  // General Settings
  generalSettings: string;
  metricSystem: string;
  metricSystemHint: string;
  autoSync: string;
  autoSyncHint: string;
  language: string;
  languageHint: string;
  
  // App Info
  appInfo: string;
  version: string;
  device: string;
  connectionMethods: string;
  
  // Actions
  saveChanges: string;
  resetDefaults: string;
  resetDefaultsConfirm: string;
  resetDefaultsQuestion: string;
  
  // Messages
  saved: string;
  settingsSaved: string;
  error: string;
  saveFailed: string;
  
  // Tips
  tip: string;
  scaleAddressTip: string;
  
  // Alerts
  alertError: string;
  alertSuccess: string;
  scaleNotFound: string;
  scaleNotFoundMessage: string;
  bleConnectionFailed: string;
  
  // BLE Connection Alerts
  bleConnectionTitle: string;
  bleConnectionMessage: string;
  onScale: string;
  bluetoothPermissionError: string;
  connecting: string;
  searchingScale: string;
  connected: string;
  scaleFoundConnected: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    reset: 'Reset',
    close: 'Close',
    home: 'Home',
    history: 'History',
    settings: 'Settings',
    
    // Navigation
    navHome: 'Home',
    navHistory: 'History',
    navSettings: 'Settings',
    
    // Home Screen
    appTitle: 'HeightScale',
    useBLE: 'Use BLE Connection',
    connectScale: '🔵 Connect to Scale (BLE)',
    disconnect: '❌ Disconnect',
    noMeasurements: 'No measurements',
    noMeasurementsSubtext: 'Pull down to refresh or take a measurement',
    noMeasurementsSubtextBLE: 'Connect to scale via BLE and step on it',
    lastUpdated: 'Last updated',
    statusBLE: 'BLE',
    statusAPI: 'API',
    statusOffline: 'Offline',
    statusConnectedBLE: '🔵 Connected via BLE',
    statusConnectedAPI: '🟢 Connected via API',
    statusOfflineMode: '🔴 Offline mode',
    
    // Measurement Card
    latestMeasurement: 'Latest Measurement',
    height: 'Height',
    weight: 'Weight',
    impedance: 'Impedance',
    bmi: 'BMI',
    noMeasurementData: 'No measurement data',
    stepOnScale: 'Step on the scale to start measuring',
    
    // History Screen
    measurementHistory: 'Measurement History',
    measurements: 'measurements',
    clearHistory: '🗑️ Clear History',
    clearHistoryConfirm: 'Clear History',
    clearHistoryQuestion: 'Do you really want to delete all measurements?',
    historyCleared: 'History cleared',
    clearFailed: 'Failed to clear history',
    noHistory: '📊 No measurements',
    noHistorySubtext: 'Measurements are saved automatically when you take one',
    measurement: 'Measurement',
    
    // Settings Screen (settings already defined in Common)
    settingsSubtitle: 'Customize app settings',
    
    // Measurement Info
    measurementInfo: '📏 Measurement Info',
    targetBMI: 'BMI',
    targetBMIHint: 'Used to calculate height from weight (height = √(weight/BMI))',
    
    // BLE Settings
    bleSettings: '🔵 Bluetooth Settings',
    scaleAddress: 'Scale Address (MAC)',
    scaleAddressHint: 'Mi Body Composition Scale 2 MAC address',
    
    // General Settings
    generalSettings: '⚙️ General Settings',
    metricSystem: 'Metric System',
    metricSystemHint: 'kg and m (off: lb and ft)',
    autoSync: 'Auto Sync',
    autoSyncHint: 'Sync measurements to API automatically',
    language: 'Language',
    languageHint: 'App interface language',
    
    // App Info
    appInfo: 'ℹ️ About',
    version: 'Version',
    device: 'Device',
    connectionMethods: 'Connection Methods',
    
    // Actions
    saveChanges: '💾 Save Changes',
    resetDefaults: '🔄 Reset to Defaults',
    resetDefaultsConfirm: 'Reset to Defaults',
    resetDefaultsQuestion: 'Do you really want to restore default settings?',
    
    // Messages
    saved: 'Saved',
    settingsSaved: 'Settings have been saved',
    error: 'Error',
    saveFailed: 'Failed to save settings',
    
    // Tips
    tip: '💡 Tip',
    scaleAddressTip: 'Scale address can be found on the bottom of the scale or with a BLE scanner',
    
    // Alerts
    alertError: 'Error',
    alertSuccess: 'Success',
    scaleNotFound: 'Scale not found',
    scaleNotFoundMessage: 'Make sure the scale is nearby and turned on',
    bleConnectionFailed: 'Failed to connect to scale',
    
    // BLE Connection Alerts
    bleConnectionTitle: 'BLE Connection',
    bleConnectionMessage: 'IMPORTANT:\n\n1. Step on the scale NOW\n2. Press OK when display blinks\n3. Stay on the scale',
    onScale: 'OK - I\'m on the scale',
    bluetoothPermissionError: 'Bluetooth permissions are missing',
    connecting: 'Connecting...',
    searchingScale: 'Searching for scale... (20s)\n\nCheck console logs if not found',
    connected: 'Connected!',
    scaleFoundConnected: 'Scale found and connected',
  },
  fi: {
    // Common
    save: 'Tallenna',
    cancel: 'Peruuta',
    delete: 'Poista',
    reset: 'Palauta',
    close: 'Sulje',
    home: 'Koti',
    history: 'Historia',
    settings: 'Asetukset',
    
    // Navigation
    navHome: 'Koti',
    navHistory: 'Historia',
    navSettings: 'Asetukset',
    
    // Home Screen
    appTitle: 'HeightScale',
    useBLE: 'Käytä BLE-yhteyttä',
    connectScale: '🔵 Yhdistä vaa\'aan (BLE)',
    disconnect: '❌ Katkaise yhteys',
    noMeasurements: 'Ei mittauksia',
    noMeasurementsSubtext: 'Vedä alas päivittääksesi tai ota mittaus',
    noMeasurementsSubtextBLE: 'Yhdistä vaa\'aan BLE:llä ja astu sen päälle',
    lastUpdated: 'Viimeksi päivitetty',
    statusBLE: 'BLE',
    statusAPI: 'API',
    statusOffline: 'Offline',
    statusConnectedBLE: '🔵 Yhdistetty BLE:llä',
    statusConnectedAPI: '🟢 Yhdistetty API:in',
    statusOfflineMode: '🔴 Offline-tila',
    
    // Measurement Card
    latestMeasurement: 'Viimeisin mittaus',
    height: 'Pituus',
    weight: 'Paino',
    impedance: 'Impedanssi',
    bmi: 'BMI',
    noMeasurementData: 'Ei mittaustuloksia',
    stepOnScale: 'Astu vaa\'an päälle aloittaaksesi mittauksen',
    
    // History Screen
    measurementHistory: 'Mittaushistoria',
    measurements: 'mittausta',
    clearHistory: '🗑️ Tyhjennä historia',
    clearHistoryConfirm: 'Tyhjennä historia',
    clearHistoryQuestion: 'Haluatko varmasti poistaa kaikki mittaukset?',
    historyCleared: 'Historia tyhjennetty',
    clearFailed: 'Historian tyhjentäminen epäonnistui',
    noHistory: '📊 Ei mittauksia',
    noHistorySubtext: 'Mittaukset tallentuvat automaattisesti kun otat mittauksen',
    measurement: 'Mittaus',
    
    // Settings Screen (settings already defined in Common)
    settingsSubtitle: 'Mukauta sovelluksen asetuksia',
    
    // Measurement Info
    measurementInfo: '📏 Mittaustiedot',
    targetBMI: 'BMI',
    targetBMIHint: 'Käytetään pituuden laskemiseen painon perusteella (pituus = √(paino/BMI))',
    
    // BLE Settings
    bleSettings: '🔵 Bluetooth-asetukset',
    scaleAddress: 'Vaaka-osoite (MAC)',
    scaleAddressHint: 'Mi Body Composition Scale 2 MAC-osoite',
    
    // General Settings
    generalSettings: '⚙️ Yleiset asetukset',
    metricSystem: 'Metrijärjestelmä',
    metricSystemHint: 'kg ja m (pois: lb ja ft)',
    autoSync: 'Automaattinen synkronointi',
    autoSyncHint: 'Synkronoi mittaukset API:in automaattisesti',
    language: 'Kieli',
    languageHint: 'Sovelluksen käyttöliittymän kieli',
    
    // App Info
    appInfo: 'ℹ️ Tietoa sovelluksesta',
    version: 'Versio',
    device: 'Laite',
    connectionMethods: 'Yhteysmenetelmät',
    
    // Actions
    saveChanges: '💾 Tallenna muutokset',
    resetDefaults: '🔄 Palauta oletukset',
    resetDefaultsConfirm: 'Palauta oletusasetukset',
    resetDefaultsQuestion: 'Haluatko varmasti palauttaa oletusasetukset?',
    
    // Messages
    saved: 'Tallennettu',
    settingsSaved: 'Asetukset on tallennettu',
    error: 'Virhe',
    saveFailed: 'Asetusten tallennus epäonnistui',
    
    // Tips
    tip: '💡 Vinkki',
    scaleAddressTip: 'Vaaka-osoite löytyy vaa\'an pohjasta tai BLE-skannerilla',
    
    // Alerts
    alertError: 'Virhe',
    alertSuccess: 'Onnistui',
    scaleNotFound: 'Vaa\'aa ei löytynyt',
    scaleNotFoundMessage: 'Varmista että se on päällä ja lähellä.',
    bleConnectionFailed: 'BLE-yhteyden muodostaminen epäonnistui',
    
    // BLE Connection Alerts
    bleConnectionTitle: 'BLE-yhteys',
    bleConnectionMessage: 'TÄRKEÄÄ:\n\n1. Astu vaa\'an päälle NYT\n2. Paina OK kun näyttö vilkkuu\n3. Pysy vaa\'an päällä',
    onScale: 'OK - Olen vaa\'an päällä',
    bluetoothPermissionError: 'Bluetooth-oikeudet puuttuvat',
    connecting: 'Yhdistetään...',
    searchingScale: 'Etsitään vaa\'aa... (20s)\n\nKatso konsoli-lokeja jos ei löydy',
    connected: 'Yhdistetty!',
    scaleFoundConnected: 'Vaaka löytyi ja yhteys muodostettu',
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en;
}
