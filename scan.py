import asyncio
import logging

from bleak import BleakClient, BleakScanner
from bleak.backends.characteristic import BleakGATTCharacteristic

from parsing import parse_body_composition_message
import requests

BODY_COMPOSITION_MEASUREMENT_UUID = "00002a9c-0000-1000-8000-00805f9b34fb"
API_URL = "http://localhost:8000/api/measurement"

# Mi Body Composition Scale 2 tiedot
SCALE_ADDRESS = "0C:95:41:CB:23:FF"  # Vaa'an Bluetooth-osoite
SCALE_NAMES = ["MIBCS", "MIBFS", "MI_SCALE"]  # Mahdolliset nimet

logger = logging.getLogger(__name__)

async def find_miscale_device():
    """Etsii Mi Body Composition Scale 2:n osoitteen tai nimen perusteella"""
    logger.info(f"Looking for scale with address: {SCALE_ADDRESS}")
    
    # Yritä ensin osoitteella (luotettavin tapa)
    device = await BleakScanner.find_device_by_address(SCALE_ADDRESS, timeout=10.0)
    if device:
        logger.info(f"Found scale by address: {device.name} ({device.address})")
        return device
    
    # Jos osoitteella ei löydy, kokeile nimiä
    for name in SCALE_NAMES:
        device = await BleakScanner.find_device_by_name(name, timeout=5.0)
        if device:
            logger.info(f"Found scale by name: {device.name} ({device.address})")
            return device
    
    logger.warning("Scale not found by address or name")
    return None


def notification_handler(_characteristic: BleakGATTCharacteristic, data: bytearray):
    """parses body composition data and logs it"""
    message = parse_body_composition_message(data)

    logger.debug(message)

    if message.stabilized and message.measurement.impedance < 3000:
        # when the measurement is stable and the impedance is below 3000 ohm, the measurement is valid
        logger.info(message)
        
        # Lähetä mittaus API:lle
        try:
            response = requests.post(API_URL, params={
                "weight": message.measurement.weight,
                "impedance": message.measurement.impedance,
                "height": message.measurement.height
            })
            if response.status_code == 200:
                logger.info("Measurement sent to API successfully")
            else:
                logger.warning(f"Failed to send measurement to API: {response.status_code}")
        except Exception as e:
            logger.error(f"Error sending measurement to API: {e}")


async def connect_and_measure():
    disconnected_event = asyncio.Event()

    def disconnected_callback(_bleak_client: BleakClient):
        logger.info("disconnected callback")
        disconnected_event.set()

    device = await find_miscale_device()
    logger.info("found device: %s", device.name if device else "None")
    if not device:
        logger.info("no device found")
        return

    client = BleakClient(device, disconnected_callback=disconnected_callback)

    async with client:
        await client.start_notify(
            BODY_COMPOSITION_MEASUREMENT_UUID, notification_handler
        )
        await disconnected_event.wait()


async def main():
    logger.info("starting scan")
    while True:
        await connect_and_measure()
        logger.info("restarting scan")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)-15s %(name)-8s %(levelname)s: %(message)s",
    )

    asyncio.run(main())
