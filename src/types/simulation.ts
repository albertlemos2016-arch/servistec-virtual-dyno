export type DynoStatus = 'IDLE' | 'PREPARING' | 'RUNNING' | 'COOLDOWN' | 'COMPLETED' | 'ERROR';

export interface TorquePoint {
  rpm: number;
  torque: number;
}

export interface DynoSnapshot {
  rpm: number;
  speedKmh: number;
  torque: number;
  powerKw: number;
  temperature: number;
  turboPressure: number;
  throttle: number;
  acceleration: number;
  gear: number;
  rollersRpm: number;
  state: DynoStatus;
  fanOn: boolean;
  engineOn: boolean;
  elapsed: number;
}

export interface DynoConfig {
  maxRpm: number;
  torquePeak: number;
  efficiency: number;
  massEquivalent: number;
  wheelRadius: number;
  finalDrive: number;
  gearRatios: number[];
  turboBoost: number;
  baseResistance: number;
  dragC1: number;
  dragC2: number;
}
