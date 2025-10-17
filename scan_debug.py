import asyncio
import logging
from bleak import BleakScanner

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)-15s %(name)-8s %(levelname)s: %(message)s",
)

logger = logging.getLogger(__name__)

SCALE_ADDRESS = "0C:95:41:CB:23:FF"

async def scan_all_devices():
    """Skannaa ja listaa kaikki BLE-laitteet"""
    logger.info("Scanning for ALL BLE devices...")
    logger.info(f"Looking specifically for: {SCALE_ADDRESS}")
    logger.info("")
    
    try:
        devices = await BleakScanner.discover(timeout=10.0)
        
        if not devices:
            logger.warning("No BLE devices found at all!")
            logger.info("This might indicate:")
            logger.info("  1. Bluetooth is not enabled")
            logger.info("  2. Script needs admin rights")
            logger.info("  3. Bluetooth adapter issues")
        else:
            logger.info(f"Found {len(devices)} BLE device(s):")
            for i, device in enumerate(devices, 1):
                match_marker = ""
                if device.address and device.address.upper() == SCALE_ADDRESS.upper():
                    match_marker = " <<< THIS IS YOUR SCALE!"
                elif device.name and any(name in device.name.upper() for name in ["MI", "SCALE", "MIBCS"]):
                    match_marker = " <<< Possible Xiaomi device"
                
                logger.info(f"  {i}. Name: '{device.name}' | Address: {device.address} | RSSI: {device.rssi}{match_marker}")
    
    except Exception as e:
        logger.error(f"Error during BLE scan: {e}")
        logger.error("This usually means Bluetooth permission issues on Windows")

if __name__ == "__main__":
    logger.info("BLE Device Scanner - Debug Tool")
    logger.info("=" * 50)
    asyncio.run(scan_all_devices())
    logger.info("=" * 50)
    logger.info("Scan complete!")
