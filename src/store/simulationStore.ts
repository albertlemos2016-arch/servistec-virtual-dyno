import { create } from 'zustand';
import { DynoSimulationEngine } from '../simulation/DynoSimulationEngine';
import type { DynoSnapshot } from '../types/simulation';

const engine = new DynoSimulationEngine();

interface SimulationState {
  snapshot: DynoSnapshot;
  history: DynoSnapshot[];
  engineOn: boolean;
  selectedQuality: 'High' | 'Medium' | 'Low';
  toggleEngine: () => void;
  startRun: () => void;
  stopRun: () => void;
  reset: () => void;
  setGear: (gear: number) => void;
  setThrottle: (value: number) => void;
  setQuality: (quality: 'High' | 'Medium' | 'Low') => void;
  updateFrame: (timestamp: number) => void;
}

const emptySnapshot: DynoSnapshot = {
  rpm: 0,
  speedKmh: 0,
  torque: 0,
  powerKw: 0,
  temperature: 45,
  turboPressure: 0,
  throttle: 0,
  acceleration: 0,
  gear: 1,
  rollersRpm: 0,
  state: 'IDLE',
  fanOn: true,
  engineOn: false,
  elapsed: 0
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  snapshot: emptySnapshot,
  history: [],
  engineOn: false,
  selectedQuality: 'High',

  toggleEngine: () => {
    const next = !get().engineOn;
    engine.setEngineRunning(next);
    const snapshot = engine.getState();
    set((state) => ({
      engineOn: snapshot.engineOn,
      snapshot,
      history: [...state.history.slice(-49), snapshot]
    }));
  },

  startRun: () => {
    engine.startRun();
    const snapshot = engine.getState();
    set((state) => ({
      snapshot,
      history: [...state.history.slice(-49), snapshot]
    }));
  },

  stopRun: () => {
    engine.stopRun();
    const snapshot = engine.getState();
    set((state) => ({
      snapshot,
      history: [...state.history.slice(-49), snapshot]
    }));
  },

  reset: () => {
    engine.reset();
    const snapshot = engine.getState();
    set({ snapshot, history: [], engineOn: false });
  },

  setGear: (gear) => {
    engine.setGear(gear);
    const snapshot = engine.getState();
    set({ snapshot });
  },

  setThrottle: (value) => {
    engine.setThrottle(value);
    const snapshot = engine.getState();
    set({ snapshot });
  },

  setQuality: (quality) => set({ selectedQuality: quality }),

  updateFrame: (timestamp) => {
    engine.update(timestamp);
    const snapshot = engine.getState();
    set((state) => ({
      snapshot,
      engineOn: snapshot.engineOn,
      history: [...state.history.slice(-49), snapshot]
    }));
  }
}));
