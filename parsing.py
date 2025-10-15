from dataclasses import dataclass
from math import sqrt


@dataclass
class ScaleMeasurement:
    weight: float
    impedance: int
    height: int


@dataclass
class BodyCompositionMessage:
    stabilized: bool
    measurement: ScaleMeasurement


def parse_scale_measurement(buffer: bytearray) -> ScaleMeasurement:
    weight = ((buffer[12] << 8) + buffer[11]) / 200
    impedance = (buffer[10] << 8) + buffer[9]
    height = sqrt(weight / 21.0)

    return ScaleMeasurement(weight=weight, impedance=impedance, height=height)


def parse_body_composition_message(buffer: bytearray) -> BodyCompositionMessage:
    stabilized = (buffer[1] & 32) > 0
    measurement = parse_scale_measurement(buffer)

    return BodyCompositionMessage(stabilized=stabilized, measurement=measurement)
