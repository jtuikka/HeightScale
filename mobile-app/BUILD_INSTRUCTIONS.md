# HeightScale - BLE-tuettu Mobiilisovellus

## 🎉 Uudet ominaisuudet!

✅ **Suora BLE-yhteys vaa'aan** - Ei tarvetta tietokoneelle/backendille!  
✅ **Paikallinen tallennus** - Mittaukset tallennetaan puhelimeen  
✅ **Hybridi-tila** - Toimii sekä BLE:llä että backendin kautta  
✅ **Automaattinen synkronointi** - Synkronoi backendiin jos saatavilla  

---

## 📱 Käyttöönotto (Ensimmäinen kerta)

### Vaihe 1: Asenna EAS CLI

```bash
npm install -g eas-cli
```

### Vaihe 2: Kirjaudu Expo-tilille

```bash
eas login
```

(Jos sinulla ei ole tiliä, luo ilmainen tili: https://expo.dev/signup)

### Vaihe 3: Konfiguroi projekti

```bash
cd mobile-app
eas build:configure
```

### Vaihe 4: Rakenna Dev Client

**Android:**
```bash
eas build --profile development --platform android
```

**iOS (vaatii Mac + Apple Developer -tilin):**
```bash
eas build --profile development --platform ios
```

⏱️ **Odotusaika:** 15-30 minuuttia (ensimmäinen build)

### Vaihe 5: Asenna Dev Client puhelimeen

1. Build valmistuu → Saat linkin
2. Skannaa QR-koodi puhelimellasi
3. Asenna Dev Client -sovellus
4. Valmis! 🎊

---

## 🚀 Päivittäinen käyttö (Dev Clientin kanssa)

### Käynnistä kehityspalvelin:

```bash
cd mobile-app
npm start --dev-client
```

### Avaa sovellus:

1. Avaa HeightScale Dev Client puhelimessasi
2. Skannaa QR-koodi
3. Sovellus latautuu ja päivittyy reaaliajassa!

---

## 🔵 BLE-yhteyden käyttö

### Ensimmäinen yhdistäminen:

1. Avaa sovellus
2. Varmista että "Käytä BLE-yhteyttä" on päällä
3. Paina **"Yhdistä vaa'aan (BLE)"**
4. **Astu vaa'an päälle** aktivoidaksesi sen
5. Sovellus yhdistää automaattisesti

### Mittauksen ottaminen:

1. Astu vaa'an päälle
2. Odota että paino stabiloituu
3. Mittaus ilmestyy automaattisesti sovellukseen! ✨

### Ominaisuudet:

- ✅ Toimii **ilman internet-yhteyttä**
- ✅ Mittaukset tallennetaan **paikallisesti**
- ✅ **Automaattinen synkronointi** backendiin (jos saatavilla)
- ✅ **Mittaushistoria** säilyy puhelimessa

---

## 🔧 Backend-tilan käyttö (valinnainen)

Jos haluat käyttää tietokonepohjaista backendiä:

1. Sammuta BLE-tila sovelluksessa (toggle off)
2. Käynnistä backend tietokoneella:
   ```bash
   cd ..
   .\start_api.bat
   ```
3. Päivitä `api.ts` IP-osoite
4. Sovellus yhdistää backendiin automaattisesti

---

## 📦 Production Build (jaettava APK)

Kun haluat jakaa sovelluksen muille:

```bash
# Android APK
eas build --profile production --platform android

# Odota build valmistumista (15-30 min)
# Lataa APK ja jaa se!
```

---

## 🐛 Ongelmia?

### "Cannot find module 'buffer'"
```bash
npm install buffer --legacy-peer-deps
```

### "BLE permissions denied"
- Android: Varmista että Location-oikeus on päällä (Android 12+)
- iOS: Hyväksy Bluetooth-oikeus kun kysytään

### "Scale not found"
1. Astu vaa'an päälle aktivoidaksesi sen
2. Varmista että Bluetooth on päällä puhelimessa
3. Varmista että olet lähellä vaa'aa (<10m)

### "Build failed"
- Tarkista että olet kirjautunut: `eas whoami`
- Tarkista EAS CLI versio: `eas --version` (pitää olla >= 13.2.0)

---

## 📊 Projektin rakenne

```
mobile-app/
├── App.tsx                 # Pääsovellus (hybridi-tila)
├── bleService.ts          # BLE-yhteys ja mittausten luku
├── storage.ts             # Paikallinen tallennus (AsyncStorage)
├── api.ts                 # Backend API (valinnainen)
├── MeasurementCard.tsx    # Mittaustulosten näyttö
├── types.ts               # TypeScript-tyypit
├── app.json               # Expo-konfiguraatio + BLE-oikeudet
├── eas.json               # EAS Build -konfiguraatio
└── package.json           # Riippuvuudet
```

---

## 🎯 Teknologiat

- **React Native** (Expo SDK 54)
- **TypeScript**
- **react-native-ble-plx** (Bluetooth Low Energy)
- **AsyncStorage** (paikallinen tallennus)
- **FastAPI** (valinnainen backend)
- **EAS Build** (native builds)

---

## 📝 Muistiinpanot

- **Dev Client** tarvitsee rebuildin vain kun lisäät uusia native-moduuleita
- **Hot reload** toimii normaalisti koodimuutoksille
- **BLE-yhteys** toimii täysin offline-tilassa
- **Mittaushistoria** tallentuu paikallisesti (max 100 mittausta)

---

## 🚀 Seuraavat askeleet

1. ✅ Rakenna Dev Client
2. ✅ Testaa BLE-yhteys
3. ✅ Testaa mittaukset
4. 📈 Lisää graafinen mittaushistoria (tulevaisuudessa)
5. 📊 Lisää BMI-laskenta (tulevaisuudessa)

---

**Ongelmia tai kysymyksiä?** Tarkista dokumentaatio tai ota yhteyttä! 📧
