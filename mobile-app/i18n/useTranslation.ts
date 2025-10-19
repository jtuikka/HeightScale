import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Translations, getTranslation } from './translations';

const SETTINGS_KEY = '@heightscale_settings';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');
  const [t, setT] = useState<Translations>(getTranslation('en'));

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const settingsStr = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        const lang = (settings.language || 'en') as Language;
        setLanguage(lang);
        setT(getTranslation(lang));
      }
    } catch (error) {
      console.log('Could not load language, using English');
    }
  };

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    setT(getTranslation(lang));
  };

  return { t, language, changeLanguage, reloadLanguage: loadLanguage };
}
