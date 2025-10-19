import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { Language } from '../i18n/translations';

const SETTINGS_KEY = '@heightscale_settings';

interface Settings {
  targetBMI: string;
  scaleAddress: string;
  useMetric: boolean;
  autoSync: boolean;
  language: Language;
}

const DEFAULT_SETTINGS: Settings = {
  targetBMI: '21',
  scaleAddress: '0C:95:41:CB:23:FF',
  useMetric: true,
  autoSync: true,
  language: 'en',
};

const LANGUAGE_OPTIONS = [
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'fi' as Language, name: 'Suomi', flag: '🇫🇮' },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const { t, reloadLanguage, changeLanguage } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      reloadLanguage();
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const loadedSettings = JSON.parse(stored);
        // Varmista että language on mukana
        if (!loadedSettings.language) {
          loadedSettings.language = 'en';
        }
        setSettings(loadedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setHasChanges(false);
      await reloadLanguage(); // Päivitä kieli heti
      Alert.alert(t.saved, t.settingsSaved);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(t.error, t.saveFailed);
    }
  };

  const resetSettings = () => {
    Alert.alert(
      t.resetDefaultsConfirm,
      t.resetDefaultsQuestion,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.reset,
          style: 'destructive',
          onPress: () => {
            setSettings(DEFAULT_SETTINGS);
            setHasChanges(true);
          },
        },
      ]
    );
  };

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const selectLanguage = async (lang: Language) => {
    updateSetting('language', lang);
    setLanguageModalVisible(false);
    await changeLanguage(lang);
  };

  const getSelectedLanguage = () => {
    return LANGUAGE_OPTIONS.find(opt => opt.code === settings.language) || LANGUAGE_OPTIONS[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.settings}</Text>
        <Text style={styles.subtitle}>{t.settingsSubtitle}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Mittaustiedot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.measurementInfo}</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.targetBMI}</Text>
            <TextInput
              style={styles.input}
              value={settings.targetBMI}
              onChangeText={(value) => updateSetting('targetBMI', value)}
              keyboardType="decimal-pad"
              placeholder="21"
            />
            <Text style={styles.settingHint}>
              {t.targetBMIHint}
            </Text>
          </View>
        </View>

        {/* BLE-asetukset */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.bleSettings}</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.scaleAddress}</Text>
            <TextInput
              style={styles.input}
              value={settings.scaleAddress}
              onChangeText={(value) => updateSetting('scaleAddress', value)}
              placeholder="0C:95:41:CB:23:FF"
              autoCapitalize="characters"
            />
            <Text style={styles.settingHint}>
              {t.scaleAddressHint}
            </Text>
          </View>
        </View>

        {/* Yleiset asetukset */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.generalSettings}</Text>

          <View style={styles.settingItem}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>{t.metricSystem}</Text>
                <Text style={styles.settingHint}>
                  {t.metricSystemHint}
                </Text>
              </View>
              <Switch
                value={settings.useMetric}
                onValueChange={(value) => updateSetting('useMetric', value)}
                trackColor={{ false: '#767577', true: '#9370db' }}
                thumbColor={settings.useMetric ? '#e6e6fa' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>{t.autoSync}</Text>
                <Text style={styles.settingHint}>
                  {t.autoSyncHint}
                </Text>
              </View>
              <Switch
                value={settings.autoSync}
                onValueChange={(value) => updateSetting('autoSync', value)}
                trackColor={{ false: '#767577', true: '#9370db' }}
                thumbColor={settings.autoSync ? '#e6e6fa' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.language}</Text>
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={() => setLanguageModalVisible(true)}
            >
              <Text style={styles.languageSelectorText}>
                {getSelectedLanguage().flag} {getSelectedLanguage().name}
              </Text>
              <Text style={styles.languageSelectorArrow}>▼</Text>
            </TouchableOpacity>
            <Text style={styles.settingHint}>
              {t.languageHint}
            </Text>
          </View>
        </View>

        {/* Sovellustiedot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.appInfo}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.version}</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.device}</Text>
            <Text style={styles.infoValue}>Mi Body Composition Scale 2</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.connectionMethods}</Text>
            <Text style={styles.infoValue}>BLE, REST API</Text>
          </View>
        </View>

        {/* Toiminnot */}
        <View style={styles.actions}>
          {hasChanges && (
            <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
              <Text style={styles.saveButtonText}>{t.saveChanges}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
            <Text style={styles.resetButtonText}>{t.resetDefaults}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t.tip}: {t.scaleAddressTip}
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.language}</Text>
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.languageOption,
                  settings.language === option.code && styles.languageOptionActive
                ]}
                onPress={() => selectLanguage(option.code)}
              >
                <Text style={styles.languageFlag}>{option.flag}</Text>
                <Text style={[
                  styles.languageOptionText,
                  settings.language === option.code && styles.languageOptionTextActive
                ]}>
                  {option.name}
                </Text>
                {settings.language === option.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f0e6ff', // Hyvin vaalea violetti
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#6a5acd', // Slate Blue violetti
    marginTop: 15,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Valkoinen
    marginBottom: 15,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f0e6ff', // Hyvin vaalea violetti
    marginBottom: 8,
  },
  settingHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#e0d0ff', // Vaalea violetti
    marginTop: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Läpinäkyvä valkoinen tausta
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Läpinäkyvä valkoinen reunus
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff', // Valkoinen teksti
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  languageSelectorArrow: {
    fontSize: 12,
    color: '#e0d0ff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2d2d5f',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#6a5acd',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageOptionActive: {
    backgroundColor: '#9370db',
    borderColor: '#e6e6fa',
    borderWidth: 2,
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 15,
  },
  languageOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#f0e6ff',
  },
  languageOptionTextActive: {
    color: '#ffffff',
  },
  checkmark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  languageButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#9370db', // Medium Purple
    borderColor: '#e6e6fa',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f0e6ff',
  },
  languageButtonTextActive: {
    color: '#ffffff',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Läpinäkyvä valkoinen
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f0e6ff', // Hyvin vaalea violetti
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff', // Valkoinen
    fontWeight: '500',
  },
  actions: {
    padding: 15,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#9370db', // Medium Purple
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Läpinäkyvä valkoinen
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Läpinäkyvä valkoinen reunus
  },
  resetButtonText: {
    color: '#f0e6ff', // Hyvin vaalea violetti
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#e0d0ff', // Vaalea violetti
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
