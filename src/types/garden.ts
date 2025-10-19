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

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'polygon';

export interface GPSCoordinate {
  lat: number;
  lng: number;
}

export interface MeasurementPoint {
  id: string;
  position: GPSCoordinate;
  label: string;
  notes?: string;
}

export interface Shape {
  id: string;
  type: ShapeType;
  objectType: ObjectType;
  measurementPoints: string[]; // IDs of measurement points
  radius?: number; // For circles
  notes?: string;
  color?: string;
  visible?: boolean;
}

export interface GardenSection {
  id: string;
  name: string;
  shapes: Shape[];
  visible?: boolean;
}

export interface GardenDimensions {
  length: number;
  width: number;
  unit: UnitOfMeasurement;
}

export interface GardenData {
  dimensions: GardenDimensions;
  measurementPoints: MeasurementPoint[];
  sections: GardenSection[];
  distanceBetweenPoints: number;
  numberOfPoints: number;
  centerCoordinate?: GPSCoordinate;
  notes?: string;
}

export interface CalculationResults {
  totalArea: number;
  perimeter: number;
  sectionAreas: Record<string, number>;
  angles?: Record<string, number>;
}
