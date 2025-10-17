export interface ScaleMeasurement {
  weight: number;
  impedance: number;
  height: number;
  timestamp: string;
}

export interface BodyCompositionMessage {
  stabilized: boolean;
  measurement: ScaleMeasurement;
}
