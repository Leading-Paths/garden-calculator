import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  GardenData,
  MeasurementPoint,
  GardenSection,
  Shape,
  UnitOfMeasurement,
  GPSCoordinate,
  CalculationResults,
} from '@/types/garden';

interface GardenStore extends GardenData {
  // Actions
  setDimensions: (length: number, width: number, unit: UnitOfMeasurement) => void;
  setDistanceBetweenPoints: (distance: number) => void;
  setNumberOfPoints: (count: number) => void;
  setCenterCoordinate: (coordinate: GPSCoordinate) => void;
  setNotes: (notes: string) => void;

  // Measurement points
  addMeasurementPoint: (point: Omit<MeasurementPoint, 'id'>) => void;
  updateMeasurementPoint: (id: string, updates: Partial<MeasurementPoint>) => void;
  deleteMeasurementPoint: (id: string) => void;

  // Sections
  addSection: (name: string) => void;
  updateSection: (id: string, updates: Partial<GardenSection>) => void;
  deleteSection: (id: string) => void;
  toggleSectionVisibility: (id: string) => void;

  // Shapes
  addShape: (sectionId: string, shape: Omit<Shape, 'id'>) => void;
  updateShape: (sectionId: string, shapeId: string, updates: Partial<Shape>) => void;
  deleteShape: (sectionId: string, shapeId: string) => void;
  toggleShapeVisibility: (sectionId: string, shapeId: string) => void;

  // Calculations
  calculations: CalculationResults | null;
  updateCalculations: (results: CalculationResults) => void;

  // Reset
  reset: () => void;
}

const initialState: GardenData = {
  dimensions: {
    length: 0,
    width: 0,
    unit: 'meters',
  },
  measurementPoints: [],
  sections: [],
  distanceBetweenPoints: 1,
  numberOfPoints: 4,
  notes: '',
};

export const useGardenStore = create<GardenStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        calculations: null,

        setDimensions: (length, width, unit) =>
          set({ dimensions: { length, width, unit } }),

        setDistanceBetweenPoints: (distance) =>
          set({ distanceBetweenPoints: distance }),

        setNumberOfPoints: (count) =>
          set({ numberOfPoints: count }),

        setCenterCoordinate: (coordinate) =>
          set({ centerCoordinate: coordinate }),

        setNotes: (notes) =>
          set({ notes }),

        addMeasurementPoint: (point) =>
          set((state) => ({
            measurementPoints: [
              ...state.measurementPoints,
              { ...point, id: `point-${Date.now()}-${Math.random()}` },
            ],
          })),

        updateMeasurementPoint: (id, updates) =>
          set((state) => ({
            measurementPoints: state.measurementPoints.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          })),

        deleteMeasurementPoint: (id) =>
          set((state) => ({
            measurementPoints: state.measurementPoints.filter((p) => p.id !== id),
          })),

        addSection: (name) =>
          set((state) => ({
            sections: [
              ...state.sections,
              {
                id: `section-${Date.now()}-${Math.random()}`,
                name,
                shapes: [],
                visible: true,
              },
            ],
          })),

        updateSection: (id, updates) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          })),

        deleteSection: (id) =>
          set((state) => ({
            sections: state.sections.filter((s) => s.id !== id),
          })),

        toggleSectionVisibility: (id) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === id ? { ...s, visible: !s.visible } : s
            ),
          })),

        addShape: (sectionId, shape) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === sectionId
                ? {
                  ...s,
                  shapes: [
                    ...s.shapes,
                    {
                      ...shape,
                      id: `shape-${Date.now()}-${Math.random()}`,
                      visible: true,
                    },
                  ],
                }
                : s
            ),
          })),

        updateShape: (sectionId, shapeId, updates) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === sectionId
                ? {
                  ...s,
                  shapes: s.shapes.map((shape) =>
                    shape.id === shapeId ? { ...shape, ...updates } : shape
                  ),
                }
                : s
            ),
          })),

        deleteShape: (sectionId, shapeId) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === sectionId
                ? {
                  ...s,
                  shapes: s.shapes.filter((shape) => shape.id !== shapeId),
                }
                : s
            ),
          })),

        toggleShapeVisibility: (sectionId, shapeId) =>
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === sectionId
                ? {
                  ...s,
                  shapes: s.shapes.map((shape) =>
                    shape.id === shapeId
                      ? { ...shape, visible: !shape.visible }
                      : shape
                  ),
                }
                : s
            ),
          })),

        updateCalculations: (results) =>
          set({ calculations: results }),

        reset: () =>
          set({
            ...initialState,
            calculations: null,
          }),
      }),
      {
        name: 'garden-calculator-storage',
      }
    )
  )
);
