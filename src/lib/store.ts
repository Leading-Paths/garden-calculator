import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GardenData, MeasurementPoint, DistanceMeasurement, UnitOfMeasurement, CalculationResults } from '@/types/garden';

interface GardenStore extends GardenData {
  setUnit: (unit: UnitOfMeasurement) => void;
  setNotes: (notes: string) => void;
  addPoint: (label: string) => void;
  updatePoint: (id: string, updates: Partial<MeasurementPoint>) => void;
  deletePoint: (id: string) => void;
  addMeasurement: (pointAId: string, pointBId: string, distance: number) => void;
  updateMeasurement: (id: string, updates: Partial<DistanceMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  calculations: CalculationResults | null;
  updateCalculations: (results: CalculationResults) => void;
  reset: () => void;
}

const initialState: GardenData = {
  points: [],
  measurements: [],
  unit: 'meters',
  notes: '',
};

export const useGardenStore = create<GardenStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        calculations: null,
        setUnit: (unit) => set({ unit }),
        setNotes: (notes) => set({ notes }),
        addPoint: (label) => set((state) => ({
          points: [...state.points, { id: `point-${Date.now()}`, label, notes: '' }],
        })),
        updatePoint: (id, updates) => set((state) => ({
          points: state.points.map((p) => p.id === id ? { ...p, ...updates } : p),
        })),
        deletePoint: (id) => set((state) => ({
          points: state.points.filter((p) => p.id !== id),
          measurements: state.measurements.filter((m) => m.pointAId !== id && m.pointBId !== id),
        })),
        addMeasurement: (pointAId, pointBId, distance) => set((state) => ({
          measurements: [...state.measurements, {
            id: `measurement-${Date.now()}`,
            pointAId,
            pointBId,
            distance,
            unit: state.unit,
          }],
        })),
        updateMeasurement: (id, updates) => set((state) => ({
          measurements: state.measurements.map((m) => m.id === id ? { ...m, ...updates } : m),
        })),
        deleteMeasurement: (id) => set((state) => ({
          measurements: state.measurements.filter((m) => m.id !== id),
        })),
        updateCalculations: (results) => set({ calculations: results }),
        reset: () => set({ ...initialState, calculations: null }),
      }),
      { name: 'garden-store' }
    )
  )
);
