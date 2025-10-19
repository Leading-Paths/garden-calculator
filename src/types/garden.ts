export type UnitOfMeasurement = 'feet' | 'meters';

export type ObjectType =
  | 'plant'
  | 'tree'
  | 'decoration'
  | 'retaining-wall'
  | 'steps'
  | 'pathway'
  | 'flower-bed'
  | 'vegetable-patch'
  | 'other';

// 2D coordinate in local space (computed from distances)
export interface Point2D {
  x: number;
  y: number;
}

// A labeled point in the garden (A, B, C, etc.)
export interface MeasurementPoint {
  id: string;
  label: string; // A, B, C, D, etc.
  notes?: string;
  computedPosition?: Point2D; // Calculated from distance measurements
  isFixed?: boolean; // If true, this point's position is fixed as origin/reference
}

// Distance measurement between two points
export interface DistanceMeasurement {
  id: string;
  pointAId: string; // ID of first point
  pointBId: string; // ID of second point
  distance: number; // Distance in specified unit
  unit: UnitOfMeasurement;
  notes?: string;
}

// The complete garden/figure data
export interface GardenData {
  points: MeasurementPoint[];
  measurements: DistanceMeasurement[];
  unit: UnitOfMeasurement;
  objectType?: ObjectType; // What this figure represents
  notes?: string;
}

// Results of calculations
export interface CalculationResults {
  area: number; // Area of the polygon formed by points
  perimeter: number; // Total perimeter
  isValid: boolean; // Whether the measurements form a valid figure
  errorMessage?: string;
  angles?: Record<string, number>; // Angles at each point
  computedPoints?: Record<string, Point2D>; // Computed positions for each point
}
