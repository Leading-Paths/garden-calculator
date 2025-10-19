import type { GPSCoordinate, MeasurementPoint, Shape, GardenData, CalculationResults } from '@/types/garden';

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(coord1: GPSCoordinate, coord2: GPSCoordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate angle between three points in degrees
 */
export function calculateAngle(p1: GPSCoordinate, vertex: GPSCoordinate, p2: GPSCoordinate): number {
  const angle1 = Math.atan2(p1.lat - vertex.lat, p1.lng - vertex.lng);
  const angle2 = Math.atan2(p2.lat - vertex.lat, p2.lng - vertex.lng);
  let angle = ((angle2 - angle1) * 180) / Math.PI;
  
  if (angle < 0) angle += 360;
  if (angle > 180) angle = 360 - angle;
  
  return angle;
}

/**
 * Calculate area of a polygon using the Shoelace formula
 * Coordinates should be in order (clockwise or counter-clockwise)
 */
export function calculatePolygonArea(points: GPSCoordinate[]): number {
  if (points.length < 3) return 0;

  // Convert GPS coordinates to meters using a local projection
  const centerLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const centerLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((centerLat * Math.PI) / 180);

  const localPoints = points.map(p => ({
    x: (p.lng - centerLng) * metersPerDegreeLng,
    y: (p.lat - centerLat) * metersPerDegreeLat,
  }));

  let area = 0;
  for (let i = 0; i < localPoints.length; i++) {
    const j = (i + 1) % localPoints.length;
    area += localPoints[i].x * localPoints[j].y;
    area -= localPoints[j].x * localPoints[i].y;
  }

  return Math.abs(area / 2);
}

/**
 * Calculate area of a circle
 */
export function calculateCircleArea(radius: number): number {
  return Math.PI * radius * radius;
}

/**
 * Calculate perimeter of a polygon
 */
export function calculatePerimeter(points: GPSCoordinate[]): number {
  if (points.length < 2) return 0;

  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    perimeter += calculateDistance(points[i], points[j]);
  }

  return perimeter;
}

/**
 * Calculate perimeter of a circle
 */
export function calculateCirclePerimeter(radius: number): number {
  return 2 * Math.PI * radius;
}

/**
 * Calculate area for a specific shape
 */
export function calculateShapeArea(shape: Shape, points: MeasurementPoint[]): number {
  const shapePoints = shape.measurementPoints
    .map(id => points.find(p => p.id === id))
    .filter((p): p is MeasurementPoint => p !== undefined)
    .map(p => p.position);

  switch (shape.type) {
    case 'circle':
      return shape.radius ? calculateCircleArea(shape.radius) : 0;
    case 'rectangle':
    case 'triangle':
    case 'polygon':
      return calculatePolygonArea(shapePoints);
    default:
      return 0;
  }
}

/**
 * Calculate all garden metrics
 */
export function calculateGardenMetrics(gardenData: GardenData): CalculationResults {
  const { measurementPoints, sections, dimensions } = gardenData;

  // Calculate total area from dimensions
  const totalArea = dimensions.length * dimensions.width;

  // Calculate perimeter from dimensions (assuming rectangular garden)
  const perimeter = 2 * (dimensions.length + dimensions.width);

  // Calculate section areas
  const sectionAreas: Record<string, number> = {};
  sections.forEach(section => {
    const sectionArea = section.shapes.reduce((sum, shape) => {
      return sum + calculateShapeArea(shape, measurementPoints);
    }, 0);
    sectionAreas[section.id] = sectionArea;
  });

  // Calculate angles between consecutive measurement points
  const angles: Record<string, number> = {};
  if (measurementPoints.length >= 3) {
    measurementPoints.forEach((point, index) => {
      if (index > 0 && index < measurementPoints.length - 1) {
        const prevPoint = measurementPoints[index - 1];
        const nextPoint = measurementPoints[index + 1];
        const angle = calculateAngle(
          prevPoint.position,
          point.position,
          nextPoint.position
        );
        angles[point.id] = angle;
      }
    });
  }

  return {
    totalArea,
    perimeter,
    sectionAreas,
    angles,
  };
}

/**
 * Convert units
 */
export function convertUnits(value: number, from: 'meters' | 'feet', to: 'meters' | 'feet'): number {
  if (from === to) return value;
  if (from === 'meters' && to === 'feet') return value * 3.28084;
  if (from === 'feet' && to === 'meters') return value / 3.28084;
  return value;
}

/**
 * Format area with appropriate units
 */
export function formatArea(area: number, unit: 'meters' | 'feet'): string {
  const unitSymbol = unit === 'meters' ? 'm²' : 'ft²';
  return `${area.toFixed(2)} ${unitSymbol}`;
}

/**
 * Format distance with appropriate units
 */
export function formatDistance(distance: number, unit: 'meters' | 'feet'): string {
  const unitSymbol = unit === 'meters' ? 'm' : 'ft';
  return `${distance.toFixed(2)} ${unitSymbol}`;
}

/**
 * Validate garden data
 */
export function validateGardenData(data: Partial<GardenData>): string[] {
  const errors: string[] = [];

  if (data.dimensions) {
    if (data.dimensions.length <= 0) {
      errors.push('Garden length must be greater than 0');
    }
    if (data.dimensions.width <= 0) {
      errors.push('Garden width must be greater than 0');
    }
  }

  if (data.distanceBetweenPoints !== undefined && data.distanceBetweenPoints <= 0) {
    errors.push('Distance between points must be greater than 0');
  }

  if (data.numberOfPoints !== undefined && data.numberOfPoints < 2) {
    errors.push('Number of points must be at least 2');
  }

  return errors;
}

/**
 * Generate garden layout suggestions based on best practices
 */
export function generateLayoutSuggestions(gardenData: GardenData): string[] {
  const suggestions: string[] = [];
  const { dimensions, sections, measurementPoints } = gardenData;

  // Check garden size
  const area = dimensions.length * dimensions.width;
  if (area < 10) {
    suggestions.push('Consider container gardening or vertical gardening for small spaces');
  }

  // Check for vegetable patches
  const hasVegetables = sections.some(s =>
    s.shapes.some(shape => shape.objectType === 'vegetable-patch')
  );
  if (hasVegetables) {
    suggestions.push('Ensure vegetable patches receive at least 6-8 hours of sunlight daily');
    suggestions.push('Consider crop rotation for vegetable patches to maintain soil health');
  }

  // Check for flower beds
  const hasFlowers = sections.some(s =>
    s.shapes.some(shape => shape.objectType === 'flower-bed')
  );
  if (hasFlowers) {
    suggestions.push('Group plants with similar water and sunlight needs together');
    suggestions.push('Consider adding mulch to flower beds to retain moisture and suppress weeds');
  }

  // Check for pathways
  const hasPathways = sections.some(s =>
    s.shapes.some(shape => shape.objectType === 'pathway')
  );
  if (!hasPathways && area > 20) {
    suggestions.push('Consider adding pathways for easy access to different garden areas');
  }

  // Check for trees
  const hasTrees = sections.some(s =>
    s.shapes.some(shape => shape.objectType === 'tree')
  );
  if (hasTrees) {
    suggestions.push('Ensure trees have adequate spacing (at least 3-6 meters) for root development');
    suggestions.push('Consider the mature size of trees to avoid overcrowding');
  }

  // General suggestions
  if (measurementPoints.length < 4) {
    suggestions.push('Add more measurement points for more accurate garden planning');
  }

  return suggestions;
}
