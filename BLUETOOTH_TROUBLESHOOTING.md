# HeightScale - BLE-skannerin käynnistysongelma

## ❌ Ongelma
BLE-skanneri ei löydä mitään Bluetooth-laitteita Windowsissa.

## ✅ Ratkaisu

### Tapa 1: Aja järjestelmänvalvojana (SUOSITELTU)

1. **Sulje nykyinen PowerShell/terminaali**

2. **Avaa PowerShell järjestelmänvalvojana:**
   - Paina `Windows + X`
   - Valitse "Terminal (Admin)" tai "PowerShell (järjestelmänvalvoja)"
   - Klikkaa "Kyllä" UAC-kysymykseen

3. **Siirry projektikansioon:**
   ```powershell
   cd C:\Users\janne\Documents\GitHub\HeightScale
   ```

4. **Aja BLE-skanneri:**
   ```powershell
   .\.venv\Scripts\python.exe scan.py
   ```

5. **TAI käytä valmista bat-tiedostoa:**
   ```powershell
   .\run.bat
   ```

### Tapa 2: Tarkista Bluetooth-asetukset

1. **Avaa Windows-asetukset** → Bluetooth ja laitteet
2. **Varmista että Bluetooth on PÄÄLLÄ**
3. **Tarkista että vaaka näkyy lähellä olevissa laitteissa** (valinnainen)

### Tapa 3: Kokeile Windows Bluetooth -työkaluja

Jos admin-oikeudetkaan eivät auta:
1. Käynnistä tietokone uudelleen
2. Varmista että Bluetooth-ajurit ovat ajantasalla
3. Kokeile poistaa ja lisätä Bluetooth-sovitin uudelleen

## 📱 Ilman BLE-skanneria

Sovellus toimii jo ilman BLE-skanneria! Se näyttää vain "Ei mittaustuloksia" kunnes:
- Lisäät mittauksen manuaalisesti API:n kautta, TAI
- Saat BLE-skannerin toimimaan

## 🧪 Testaa API manuaalisesti

Voit testata sovellusta lisäämällä mittauksen manuaalisesti:

```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/measurement?weight=75.5&impedance=500&height=1.75" -Method POST
```

Tämän jälkeen sovelluksesi pitäisi näyttää mittaus!
