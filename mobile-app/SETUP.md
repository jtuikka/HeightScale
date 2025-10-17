# HeightScale Mobile - Käynnistysohje

## ✅ Kaikki virheet korjattu!

### 📋 Seuraavat askeleet:

## 1️⃣ Käynnistä Backend-palvelut

### Käynnistä API-serveri (terminaali 1):
```powershell
# Siirry projektin juureen
cd C:\Users\janne\Documents\GitHub\HeightScale

# Käynnistä API
.\start_api.bat
```
TAI klikkaa `start_api.bat` oikealla → "Suorita järjestelmänvalvojana"

### Käynnistä BLE-skanneri (terminaali 2):
```powershell
# Siirry projektin juureen
cd C:\Users\janne\Documents\GitHub\HeightScale

# Käynnistä skanneri
.\run.bat
```
TAI klikkaa `run.bat` oikealla → "Suorita järjestelmänvalvojana"

## 2️⃣ Konfiguroi mobiilisovellus

### Selvitä tietokoneesi IP-osoite:
```powershell
ipconfig
```
Etsi "IPv4 Address" (esim. 192.168.1.100)

### Päivitä api.ts:
Avaa `mobile-app/api.ts` ja vaihda:
```typescript
const API_BASE_URL = 'http://192.168.1.100:8000';  // <-- Käytä omaa IP:täsi
```

## 3️⃣ Käynnistä mobiilisovellus

```powershell
cd mobile-app
npm start
```

## 4️⃣ Avaa Expo Go:lla

1. Asenna Expo Go puhelimeesi (App Store / Google Play)
2. Skannaa QR-koodi joka näkyy terminaalissa
3. Sovellus aukeaa puhelimessa!

## 🎯 Testaus

1. Varmista että molemmat backend-palvelut ovat käynnissä
2. Astu vaa'an päälle
3. Mittaus ilmestyy mobiilisovellukseen ~5 sekunnin kuluessa
4. Voit myös päivittää manuaalisesti vetämällä alaspäin

## 🐛 Ongelmia?

### "Ei yhteyttä" -viesti sovelluksessa:
- Tarkista että API-serveri on käynnissä
- Tarkista että IP-osoite on oikein `api.ts`:ssä
- Varmista että puhelin ja tietokone ovat samassa WiFi-verkossa
- Tarkista palomuuri (portti 8000 pitää olla auki)

### BLE ei toimi:
- Aja `run.bat` järjestelmänvalvojana
- Varmista että Bluetooth on päällä
- Käynnistä tietokone uudelleen

### Mittaukset eivät tule:
- Tarkista että BLE-skanneri löytää vaa'an (konsolissa pitäisi näkyä "found device: MIBFS")
- Astu vaa'an päälle aktivoidaksesi sen
- Odota että mittaus stabiloituu (vihreä tähti vaa'an näytöllä)

## 📱 Kehitysvinkkejä

- Metro bundler (Expo) käynnistyy automaattisesti
- Voit tehdä muutoksia koodiin ja ne päivittyvät automaattisesti
- Käytä `r` terminaalissa ladataksesi sovelluksen uudelleen
- Käytä `j` avataksesi Chrome DevTools

Onnea kehitykseen! 🚀
