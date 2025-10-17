from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Optional
import json
import os

app = FastAPI()

# Salli CORS kaikista lähteistä (kehitystä varten)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tiedosto mittausten tallentamiseen
MEASUREMENTS_FILE = "measurements.json"

# Lataa aiemmat mittaukset
def load_measurements() -> List[dict]:
    if os.path.exists(MEASUREMENTS_FILE):
        with open(MEASUREMENTS_FILE, 'r') as f:
            return json.load(f)
    return []

# Tallenna mittaukset
def save_measurements(measurements: List[dict]):
    with open(MEASUREMENTS_FILE, 'w') as f:
        json.dump(measurements, f, indent=2)

# Lisää uusi mittaus
def add_measurement(weight: float, impedance: int, height: float):
    measurements = load_measurements()
    measurement = {
        "weight": weight,
        "impedance": impedance,
        "height": height,
        "timestamp": datetime.now().isoformat()
    }
    measurements.append(measurement)
    # Pidä vain viimeiset 100 mittausta
    if len(measurements) > 100:
        measurements = measurements[-100:]
    save_measurements(measurements)
    return measurement

@app.get("/api/health")
async def health_check():
    """Tarkistaa että API on toiminnassa"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.get("/api/measurement/latest")
async def get_latest_measurement():
    """Palauttaa viimeisimmän mittauksen"""
    measurements = load_measurements()
    if measurements:
        return measurements[-1]
    return None

@app.get("/api/measurements")
async def get_all_measurements():
    """Palauttaa kaikki mittaukset"""
    return load_measurements()

@app.post("/api/measurement")
async def create_measurement(weight: float, impedance: int, height: float):
    """Lisää uusi mittaus"""
    measurement = add_measurement(weight, impedance, height)
    return measurement

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
