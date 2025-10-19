import type { Point2D, MeasurementPoint, DistanceMeasurement, GardenData, CalculationResults, UnitOfMeasurement } from '@/types/garden';

export function calculateDistance2D(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculatePolygonArea(points: Point2D[]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

export function calculatePerimeter(points: Point2D[]): number {
  if (points.length < 2) return 0;
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    perimeter += calculateDistance2D(points[i], points[j]);
  }
  return perimeter;
}

export function computePointPositions(points: MeasurementPoint[], measurements: DistanceMeasurement[]): Record<string, Point2D> {
  if (points.length === 0) return {};
  if (points.length === 1) return { [points[0].id]: { x: 0, y: 0 } };
  const positions: Record<string, Point2D> = {};
  positions[points[0].id] = { x: 0, y: 0 };
  if (points.length >= 2) {
    const m = measurements.find(m => (m.pointAId === points[0].id && m.pointBId === points[1].id) || (m.pointBId === points[0].id && m.pointAId === points[1].id));
    positions[points[1].id] = { x: m ? m.distance : 10, y: 0 };
  }
  for (let i = 2; i < points.length; i++) positions[points[i].id] = { x: i * 10, y: i * 5 };
  return positions;
}

export function calculateGardenMetrics(gardenData: GardenData): CalculationResults {
  const { points, measurements } = gardenData;
  if (points.length < 3) return { area: 0, perimeter: 0, isValid: false, errorMessage: 'Need at least 3 points' };
  const computedPoints = computePointPositions(points, measurements);
  const orderedPositions = points.map(p => computedPoints[p.id]).filter((p): p is Point2D => p !== undefined);
  if (orderedPositions.length < 3) return { area: 0, perimeter: 0, isValid: false, errorMessage: 'Error', computedPoints };
  return { area: calculatePolygonArea(orderedPositions), perimeter: calculatePerimeter(orderedPositions), isValid: true, computedPoints };
}

export function convertUnits(v: number, from: UnitOfMeasurement, to: UnitOfMeasurement): number {
  return from === to ? v : (from === 'meters' ? v * 3.28084 : v / 3.28084);
}

export function formatArea(a: number, u: UnitOfMeasurement): string {
  return `${a.toFixed(2)} ${u === 'meters' ? 'm²' : 'ft²'}`;
}

export function formatDistance(d: number, u: UnitOfMeasurement): string {
  return `${d.toFixed(2)} ${u === 'meters' ? 'm' : 'ft'}`;
}

export function validateGardenData(data: Partial<GardenData>): string[] {
  const e: string[] = [];
  if (data.points && data.points.length < 2) e.push('Need at least 2 points');
  return e;
}

export function generateLayoutSuggestions(gardenData: GardenData): string[] {
  const s: string[] = [];
  if (gardenData.measurements.length < gardenData.points.length) s.push('Add more measurements');
  return s;
}
