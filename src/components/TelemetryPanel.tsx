import type { DynoSnapshot } from '../types/simulation';

interface TelemetryPanelProps {
  snapshot: DynoSnapshot;
  onGearChange: (gear: number) => void;
  onThrottleChange: (value: number) => void;
  quality: 'High' | 'Medium' | 'Low';
  onQualityChange: (quality: 'High' | 'Medium' | 'Low') => void;
}

export function TelemetryPanel({ snapshot, onGearChange, onThrottleChange, quality, onQualityChange }: TelemetryPanelProps) {
  return (
    <div className="telemetry-panel">
      <div className="mini-grid">
        <div className="metric-card">
          <span>RPM</span>
          <strong>{Math.round(snapshot.rpm)}</strong>
        </div>
        <div className="metric-card">
          <span>Velocidade</span>
          <strong>{snapshot.speedKmh.toFixed(1)} km/h</strong>
        </div>
        <div className="metric-card">
          <span>Torque</span>
          <strong>{snapshot.torque.toFixed(0)} Nm</strong>
        </div>
        <div className="metric-card">
          <span>Potência</span>
          <strong>{snapshot.powerKw.toFixed(1)} kW</strong>
        </div>
      </div>

      <div className="controls-block">
        <label>
          Estado:
          <strong>{snapshot.state}</strong>
        </label>

        <label>
          Marcha:
          <select value={snapshot.gear} onChange={(e) => onGearChange(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>

        <label className="range-label">
          Acelerador: {snapshot.throttle.toFixed(2)}
          <input type="range" min="0" max="1" step="0.01" value={snapshot.throttle} onChange={(e) => onThrottleChange(Number(e.target.value))} />
        </label>

        <label>
          Perfil visual:
          <select value={quality} onChange={(e) => onQualityChange(e.target.value as 'High' | 'Medium' | 'Low')}>
            <option value="High">Alto</option>
            <option value="Medium">Médio</option>
            <option value="Low">Baixo</option>
          </select>
        </label>
      </div>

      <div className="status-list">
        <div><span>Temp. óleo</span><strong>{snapshot.temperature.toFixed(0)}°C</strong></div>
        <div><span>Turbo</span><strong>{snapshot.turboPressure.toFixed(2)} bar</strong></div>
        <div><span>Rolos</span><strong>{snapshot.rollersRpm.toFixed(0)} rpm</strong></div>
        <div><span>Tempo</span><strong>{snapshot.elapsed.toFixed(1)} s</strong></div>
      </div>
    </div>
  );
}
