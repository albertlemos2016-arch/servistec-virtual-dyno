import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo } from 'react';
import { useSimulationStore } from './store/simulationStore';
import { TelemetryPanel } from './components/TelemetryPanel';
import { ChartsPanel } from './components/ChartsPanel';
import { WorkshopScene } from './components/WorkshopScene';

function App() {
  const snapshot = useSimulationStore((state) => state.snapshot);
  const history = useSimulationStore((state) => state.history);
  const selectedQuality = useSimulationStore((state) => state.selectedQuality);
  const updateFrame = useSimulationStore((state) => state.updateFrame);
  const toggleEngine = useSimulationStore((state) => state.toggleEngine);
  const startRun = useSimulationStore((state) => state.startRun);
  const stopRun = useSimulationStore((state) => state.stopRun);
  const reset = useSimulationStore((state) => state.reset);
  const setGear = useSimulationStore((state) => state.setGear);
  const setThrottle = useSimulationStore((state) => state.setThrottle);
  const setQuality = useSimulationStore((state) => state.setQuality);

  useEffect(() => {
    let rafId = 0;
    const tick = (time: number) => {
      updateFrame(time);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [updateFrame]);

  const chartData = useMemo(() => {
    if (history.length === 0) {
      return [{ name: 0, rpm: 0, torque: 0, power: 0, speed: 0, temp: 45, turbo: 0 }];
    }

    return history.map((item, index) => ({
      name: index,
      rpm: Math.round(item.rpm),
      torque: Number(item.torque.toFixed(1)),
      power: Number(item.powerKw.toFixed(1)),
      speed: Number(item.speedKmh.toFixed(1)),
      temp: Number(item.temperature.toFixed(1)),
      turbo: Number(item.turboPressure.toFixed(2))
    }));
  }, [history]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">SERVISTEC VIRTUAL DYNO</p>
          <h1>Simulador 3D de oficina + dinamômetro</h1>
        </div>

        <div className="top-actions">
          <button onClick={toggleEngine}>{snapshot.engineOn ? 'Desligar motor' : 'Ligar motor'}</button>
          <button onClick={startRun}>Iniciar puxada</button>
          <button onClick={stopRun}>Interromper</button>
          <button onClick={reset}>Reiniciar</button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="viewport-panel">
          <div className="viewport-header">
            <span>Oficina de diagnóstico</span>
            <span className="status-dot">{snapshot.state}</span>
          </div>

          <div className="viewport-wrap">
            <Canvas shadows dpr={[1, 2]}>
              <color attach="background" args={['#050b12']} />
              <PerspectiveCamera makeDefault position={[8, 4, 9]} fov={42} />
              <fog attach="fog" args={['#050b12', 8, 26]} />

              <WorkshopScene snapshot={snapshot} />

              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                damping={0.15}
                minDistance={6}
                maxDistance={18}
                minPolarAngle={Math.PI / 5.5}
                maxPolarAngle={Math.PI / 2.1}
                target={[0, 1.2, 0]}
              />

              <EffectComposer>
                <Bloom intensity={0.7} luminanceThreshold={0.38} luminanceSmoothing={0.7} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.18} darkness={0.88} />
                <ChromaticAberration offset={[0.0008, 0.0012]} />
              </EffectComposer>

              <Environment preset="studio" />
            </Canvas>
          </div>
        </section>

        <aside className="panel-right">
          <TelemetryPanel
            snapshot={snapshot}
            onGearChange={setGear}
            onThrottleChange={setThrottle}
            quality={selectedQuality}
            onQualityChange={setQuality}
          />
        </aside>
      </main>

      <section className="charts-panel">
        <ChartsPanel data={chartData} />
      </section>
    </div>
  );
}

export default App;
