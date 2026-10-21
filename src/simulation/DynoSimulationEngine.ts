import type { DynoConfig, DynoSnapshot, DynoStatus, TorquePoint } from '../types/simulation';

export class DynoSimulationEngine {
  private readonly fixedStep = 1 / 60;
  private accumulator = 0;
  private lastTime = 0;
  private status: DynoStatus = 'IDLE';
  private engineOn = false;
  private running = false;
  private rpm = 0;
  private torque = 0;
  private powerKw = 0;
  private speedKmh = 0;
  private temperature = 45;
  private turboPressure = 0;
  private throttle = 0;
  private acceleration = 0;
  private elapsed = 0;
  private gear = 1;
  private rollersRpm = 0;
  private fanOn = true;

  private readonly torqueCurve: TorquePoint[] = [
    { rpm: 800, torque: 320 },
    { rpm: 1500, torque: 420 },
    { rpm: 2500, torque: 480 },
    { rpm: 3500, torque: 520 },
    { rpm: 4500, torque: 560 },
    { rpm: 5500, torque: 510 },
    { rpm: 6200, torque: 470 }
  ];

  private readonly config: DynoConfig = {
    maxRpm: 7000,
    torquePeak: 560,
    efficiency: 0.88,
    massEquivalent: 1350,
    wheelRadius: 0.33,
    finalDrive: 3.5,
    gearRatios: [3.2, 2.1, 1.52, 1.16, 0.93],
    turboBoost: 1.4,
    baseResistance: 180,
    dragC1: 2.6,
    dragC2: 0.15
  };

  setEngineRunning(active: boolean) {
    this.engineOn = active;
    if (!active) {
      this.status = 'IDLE';
      this.running = false;
      this.rpm = 0;
      this.throttle = 0;
      this.turboPressure = 0;
      this.temperature = 45;
      this.acceleration = 0;
      return;
    }

    if (this.status === 'IDLE') {
      this.status = 'PREPARING';
      this.throttle = 0.22;
      this.temperature = 52;
    }
  }

  startRun() {
    if (!this.engineOn) return;
    this.running = true;
    this.status = 'RUNNING';
    this.elapsed = 0;
    this.throttle = 0.8;
  }

  stopRun() {
    this.running = false;
    this.status = 'COOLDOWN';
    this.throttle = 0.15;
  }

  reset() {
    this.status = 'IDLE';
    this.engineOn = false;
    this.running = false;
    this.rpm = 0;
    this.torque = 0;
    this.powerKw = 0;
    this.speedKmh = 0;
    this.temperature = 45;
    this.turboPressure = 0;
    this.throttle = 0;
    this.acceleration = 0;
    this.elapsed = 0;
    this.gear = 1;
    this.rollersRpm = 0;
    this.fanOn = true;
    this.accumulator = 0;
    this.lastTime = 0;
  }

  setThrottle(value: number) {
    this.throttle = Math.min(1, Math.max(0, value));
  }

  setGear(value: number) {
    this.gear = Math.min(5, Math.max(1, value));
  }

  setFanOn(on: boolean) {
    this.fanOn = on;
  }

  getState(): DynoSnapshot {
    return {
      rpm: this.rpm,
      speedKmh: this.speedKmh,
      torque: this.torque,
      powerKw: this.powerKw,
      temperature: this.temperature,
      turboPressure: this.turboPressure,
      throttle: this.throttle,
      acceleration: this.acceleration,
      gear: this.gear,
      rollersRpm: this.rollersRpm,
      state: this.status,
      fanOn: this.fanOn,
      engineOn: this.engineOn,
      elapsed: this.elapsed
    };
  }

  update(timestamp: number) {
    if (!this.lastTime) {
      this.lastTime = timestamp;
    }

    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    this.accumulator += delta;

    while (this.accumulator >= this.fixedStep) {
      this.tick(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }
  }

  private tick(dt: number) {
    const targetRpm = this.engineOn ? (this.running ? 2000 + this.throttle * 4200 : 1000 + this.throttle * 1600) : 0;
    this.rpm += (targetRpm - this.rpm) * 0.08;
    this.rpm = Math.max(0, Math.min(this.config.maxRpm, this.rpm));

    const curveTorque = this.interpolateTorque(this.rpm);
    const torqueFactor = 0.85 + this.throttle * 0.9;
    this.torque = curveTorque * torqueFactor * (this.engineOn ? 1 : 0);
    this.powerKw = (this.torque * this.rpm * 2 * Math.PI) / 60000;

    this.turboPressure += ((this.throttle * (this.engineOn ? 1 : 0) * this.config.turboBoost) - this.turboPressure) * 0.04;
    this.temperature += (this.rpm * 0.007 + this.throttle * 2.3 + this.turboPressure * 4.5 - this.temperature * 0.08) * dt * 2;

    if (this.running) {
      this.elapsed += dt;
      const gearRatio = this.config.gearRatios[Math.min(this.gear - 1, this.config.gearRatios.length - 1)] ?? this.config.gearRatios[0];
      const wheelSpeed = (this.rpm * 2 * Math.PI) / 60 / (this.gear * this.config.finalDrive);
      const speedMps = wheelSpeed * this.config.wheelRadius * 0.88;
      const driveForce = (this.torque * gearRatio * this.config.efficiency) / this.config.wheelRadius;
      const resistance = this.config.baseResistance + this.config.dragC1 * this.speedKmh + this.config.dragC2 * this.speedKmh ** 2;
      const netForce = driveForce - resistance;
      this.acceleration = netForce / this.config.massEquivalent;
      this.speedKmh = Math.max(0, (speedMps * 3.6) + this.speedKmh * 0.25);
      this.rpm += this.speedKmh * 11 * dt;
      this.rollersRpm = this.rpm * 0.36;
    } else {
      this.acceleration *= 0.9;
      this.speedKmh *= 0.985;
      this.rollersRpm = this.rpm * 0.2;
      if (this.status === 'COOLDOWN' && this.temperature < 68) {
        this.status = 'COMPLETED';
      }
    }

    if (this.status === 'RUNNING' && this.rpm > this.config.maxRpm * 0.95) {
      this.status = 'ERROR';
      this.throttle = 0.1;
      this.running = false;
    }

    if (this.status === 'ERROR' && this.temperature > 110) {
      this.status = 'COOLDOWN';
      this.running = false;
    }

    if (this.temperature > 128) {
      this.status = 'ERROR';
      this.running = false;
    }

    if (!this.engineOn && this.status !== 'IDLE') {
      this.status = 'IDLE';
    }
  }

  private interpolateTorque(rpm: number): number {
    const points = this.torqueCurve;
    if (rpm <= points[0].rpm) return points[0].torque;
    if (rpm >= points[points.length - 1].rpm) return points[points.length - 1].torque;

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (rpm >= a.rpm && rpm <= b.rpm) {
        const t = (rpm - a.rpm) / (b.rpm - a.rpm);
        return a.torque + (b.torque - a.torque) * t;
      }
    }

    return points[points.length - 1].torque;
  }
}
