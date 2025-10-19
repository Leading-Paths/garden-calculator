import type { Point2D, MeasurementPoint, DistanceMeasurement, GardenData, CalculationResults, UnitOfMeasurement } from '@/types/garden';

// Tolerance for measurement inaccuracies (5% by default)
export const MEASUREMENT_TOLERANCE = 0.05;

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

function findMeasurement(measurements: DistanceMeasurement[], pointA: string, pointB: string): DistanceMeasurement | undefined {
  return measurements.find(m =>
    (m.pointAId === pointA && m.pointBId === pointB) ||
    (m.pointBId === pointA && m.pointAId === pointB)
  );
}

function trilateratePoint(p1: Point2D, p2: Point2D, d1: number, d2: number): Point2D | null {
  // Calculate position of a third point given distances to two known points
  // Uses the intersection of two circles

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return null;

  // Check if circles can intersect (with tolerance)
  const maxDist = d1 + d2;
  const minDist = Math.abs(d1 - d2);
  const tolerance = (d1 + d2) * MEASUREMENT_TOLERANCE;

  if (dist > maxDist + tolerance || dist < minDist - tolerance) {
    return null;
  }

  // Find intersection point (choose the one that creates a CCW polygon)
  const a = (d1 * d1 - d2 * d2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(0, d1 * d1 - a * a));

  const px = p1.x + (a / dist) * dx;
  const py = p1.y + (a / dist) * dy;

  // Return the point that's above the line (CCW orientation)
  const x = px - (h / dist) * dy;
  const y = py + (h / dist) * dx;

  return { x, y };
}

export function computePointPositions(points: MeasurementPoint[], measurements: DistanceMeasurement[]): Record<string, Point2D> {
  if (points.length === 0) return {};
  if (points.length === 1) return { [points[0].id]: { x: 0, y: 0 } };

  const positions: Record<string, Point2D> = {};
  const computed = new Set<string>();

  // Step 1: Place first point at origin
  positions[points[0].id] = { x: 0, y: 0 };
  computed.add(points[0].id);

  // Step 2: Place second point on x-axis
  if (points.length >= 2) {
    const m = findMeasurement(measurements, points[0].id, points[1].id);
    if (m) {
      positions[points[1].id] = { x: m.distance, y: 0 };
      computed.add(points[1].id);
    }
  }

  // Step 3: Compute remaining points using trilateration
  const maxIterations = points.length * 2; // Prevent infinite loops
  let iteration = 0;

  while (computed.size < points.length && iteration < maxIterations) {
    iteration++;
    let progressMade = false;

    for (const point of points) {
      if (computed.has(point.id)) continue;

      // Try to find two reference points with known positions
      const references: Array<{ point: Point2D; distance: number }> = [];

      for (const refPointId of computed) {
        const measurement = findMeasurement(measurements, point.id, refPointId);
        if (measurement && positions[refPointId]) {
          references.push({
            point: positions[refPointId],
            distance: measurement.distance,
          });
        }

        if (references.length >= 2) break;
      }

      // If we have at least 2 references, we can compute the position
      if (references.length >= 2) {
        const newPos = trilateratePoint(
          references[0].point,
          references[1].point,
          references[0].distance,
          references[1].distance
        );

        if (newPos) {
          // If we have a third reference, validate the position
          if (references.length >= 3) {
            const dist = calculateDistance2D(newPos, references[2].point);
            const expectedDist = references[2].distance;
            const tolerance = expectedDist * MEASUREMENT_TOLERANCE;

            // Only accept if within tolerance
            if (Math.abs(dist - expectedDist) <= tolerance) {
              positions[point.id] = newPos;
              computed.add(point.id);
              progressMade = true;
            }
          } else {
            positions[point.id] = newPos;
            computed.add(point.id);
            progressMade = true;
          }
        }
      }
    }

    if (!progressMade) break;
  }

  // Fallback: place remaining points in a default pattern
  for (let i = 0; i < points.length; i++) {
    if (!positions[points[i].id]) {
      positions[points[i].id] = { x: i * 10, y: i * 5 };
    }
  }

  return positions;
}

export function calculateGardenMetrics(gardenData: GardenData): CalculationResults {
  const { points, measurements } = gardenData;

  if (points.length < 3) {
    return {
      area: 0,
      perimeter: 0,
      isValid: false,
      errorMessage: 'Need at least 3 points to form a shape'
    };
  }

  const computedPoints = computePointPositions(points, measurements);
  const orderedPositions = points.map(p => computedPoints[p.id]).filter((p): p is Point2D => p !== undefined);

  if (orderedPositions.length < 3) {
    return {
      area: 0,
      perimeter: 0,
      isValid: false,
      errorMessage: 'Unable to compute all point positions. Add more measurements between points.',
      computedPoints
    };
  }

  // Validate measurements against computed positions (with tolerance)
  let hasInconsistency = false;
  const inconsistentMeasurements: string[] = [];

  for (const measurement of measurements) {
    const posA = computedPoints[measurement.pointAId];
    const posB = computedPoints[measurement.pointBId];

    if (posA && posB) {
      const computedDistance = calculateDistance2D(posA, posB);
      const expectedDistance = measurement.distance;
      const tolerance = expectedDistance * MEASUREMENT_TOLERANCE;
      const difference = Math.abs(computedDistance - expectedDistance);

      if (difference > tolerance) {
        hasInconsistency = true;
        const pointA = points.find(p => p.id === measurement.pointAId);
        const pointB = points.find(p => p.id === measurement.pointBId);
        inconsistentMeasurements.push(
          `${pointA?.label}-${pointB?.label}: ${difference.toFixed(2)} ${gardenData.unit} off`
        );
      }
    }
  }

  const area = calculatePolygonArea(orderedPositions);
  const perimeter = calculatePerimeter(orderedPositions);

  if (hasInconsistency) {
    return {
      area,
      perimeter,
      isValid: false,
      errorMessage: `Measurements inconsistent (${MEASUREMENT_TOLERANCE * 100}% tolerance): ${inconsistentMeasurements.join(', ')}`,
      computedPoints
    };
  }

  return {
    area,
    perimeter,
    isValid: true,
    computedPoints
  };
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
