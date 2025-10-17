# HeightScale Mobile App

Mobiilisovellus Xiaomi Mi Scale 2 -vaa'an mittaustulosten näyttämiseen.

## 🚀 Pika-aloitus

### 1. Asenna riippuvuudet

```bash
cd mobile-app
npm install
```

### 2. Käynnistä Python backend

Avaa uusi terminaali ja aja:

```bash
# Käynnistä API-serveri
start_api.bat

# TAI järjestelmänvalvojana (suositeltavaa):
# Klikkaa start_api.bat oikealla -> "Suorita järjestelmänvalvojana"
```

API käynnistyy osoitteeseen `http://localhost:8000`

### 3. Käynnistä BLE-skanneri

Avaa toinen terminaali ja aja:

```bash
# Käynnistä BLE-skanneri
run.bat

# TAI järjestelmänvalvojana (suositeltavaa):
# Klikkaa run.bat oikealla -> "Suorita järjestelmänvalvojana"
```

### 4. Päivitä API-osoite mobiilisovellukseen

Kun käytät Expo Go:ta puhelimellasi, sinun täytyy käyttää tietokoneesi IP-osoitetta localhost:n sijaan.

1. Selvitä tietokoneesi IP-osoite:
   - Windows: Avaa komentokehote ja kirjoita `ipconfig`
   - Etsi "IPv4 Address" (esim. 192.168.1.100)

2. Päivitä `mobile-app/api.ts`:
   ```typescript
   // Vaihda localhost tietokoneesi IP-osoitteeseen
   const API_BASE_URL = 'http://192.168.1.100:8000';
   ```

### 5. Käynnistä mobiilisovellus

```bash
cd mobile-app
npm start
```

Skannaa QR-koodi Expo Go -sovelluksella puhelimestasi.

## 📱 Sovelluksen käyttö

1. Varmista että Python backend ja BLE-skanneri ovat käynnissä
2. Avaa sovellus Expo Go:lla
3. Astu vaa'an päälle aloittaaksesi mittauksen
4. Sovellus päivittyy automaattisesti 5 sekunnin välein
5. Voit myös päivittää manuaalisesti vetämällä alaspäin tai painamalla "Päivitä"-nappia

## 🔧 Teknologiat

- **Frontend**: React Native, TypeScript, Expo
- **Backend**: Python, FastAPI, Bleak (BLE), Uvicorn
- **Kommunikointi**: REST API

## 📂 Projektin rakenne

```
HeightScale/
├── mobile-app/              # React Native mobiilisovellus
│   ├── App.tsx             # Pääkomponentti
│   ├── MeasurementCard.tsx # Mittaustulosten näyttö
│   ├── api.ts              # API-integraatio
│   ├── types.ts            # TypeScript-tyypit
│   └── package.json        # npm-riippuvuudet
├── api_server.py           # FastAPI backend
├── scan.py                 # BLE-skanneri
├── parsing.py              # Datan parsinta
├── start_api.bat           # API-serverin käynnistys
└── run.bat                 # BLE-skannerin käynnistys
```

## 🐛 Ongelmanratkaisu

### Bluetooth ei toimi
- Varmista että Bluetooth on päällä Windows-asetuksissa
- Aja BLE-skanneri järjestelmänvalvojana
- Käynnistä tietokone uudelleen

### Ei yhteyttä API:in
- Tarkista että API-serveri on käynnissä
- Varmista että IP-osoite on oikein `api.ts`-tiedostossa
- Tarkista että puhelin ja tietokone ovat samassa verkossa
- Varmista että palomuuri ei estä porttia 8000

### Mittaukset eivät päivity
- Tarkista että BLE-skanneri on käynnissä
- Astu vaa'an päälle aktivoidaksesi sen
- Tarkista konsolista virheviestit

## 📝 API-endpointit

- `GET /api/health` - Tarkista API:n tila
- `GET /api/measurement/latest` - Hae viimeisin mittaus
- `GET /api/measurements` - Hae kaikki mittaukset
- `POST /api/measurement` - Lisää uusi mittaus

## 🎨 Ominaisuudet

✅ Reaaliaikainen mittaustulosten näyttö  
✅ Automaattinen päivitys 5 sekunnin välein  
✅ Manuaalinen päivitys (pull-to-refresh)  
✅ Yhteyden tilan näyttö  
✅ Viimeisimmän mittauksen aikaleima  
✅ Mittaushistorian tallennus  
✅ Suomenkielinen käyttöliittymä  
✅ Expo Go -yhteensopiva (ei tarvitse buildaa)  

## 📄 Lisenssi

MIT
