import type { GPSCoordinate, GardenDimensions, MeasurementPoint } from '@/types/garden';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateDimensions(dimensions: GardenDimensions): ValidationError[] {
  const errors: ValidationError[] = [];
  if (dimensions.length <= 0) {
    errors.push({ field: 'length', message: 'Length must be greater than 0' });
  }
  if (dimensions.width <= 0) {
    errors.push({ field: 'width', message: 'Width must be greater than 0' });
  }
  return errors;
}

export function validateGPSCoordinate(coordinate: GPSCoordinate): ValidationError[] {
  const errors: ValidationError[] = [];
  if (coordinate.lat < -90 || coordinate.lat > 90) {
    errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
  }
  if (coordinate.lng < -180 || coordinate.lng > 180) {
    errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
  }
  return errors;
}

export function validateMeasurementPoint(point: Partial<MeasurementPoint>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!point.label || point.label.trim() === '') {
    errors.push({ field: 'label', message: 'Label is required' });
  }
  if (point.position) {
    const coordErrors = validateGPSCoordinate(point.position);
    errors.push(...coordErrors);
  } else {
    errors.push({ field: 'position', message: 'GPS coordinates are required' });
  }
  return errors;
}
