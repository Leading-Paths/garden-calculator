import type { GardenData, MeasurementPoint, Shape, GPSCoordinate } from '@/types/garden';

/**
 * Validate garden dimensions
 */
export function validateDimensions(length: number, width: number): string[] {
    const errors: string[] = [];

    if (isNaN(length) || length <= 0) {
        errors.push('Garden length must be a positive number');
    }
    if (length > 10000) {
        errors.push('Garden length seems unusually large. Please verify.');
    }

    if (isNaN(width) || width <= 0) {
        errors.push('Garden width must be a positive number');
    }
    if (width > 10000) {
        errors.push('Garden width seems unusually large. Please verify.');
    }

    return errors;
}

/**
 * Validate distance between points
 */
export function validateDistanceBetweenPoints(distance: number): string[] {
    const errors: string[] = [];

    if (isNaN(distance) || distance <= 0) {
        errors.push('Distance between points must be a positive number');
    }
    if (distance > 1000) {
        errors.push('Distance between points seems unusually large. Please verify.');
    }

    return errors;
}

/**
 * Validate number of points
 */
export function validateNumberOfPoints(count: number): string[] {
    const errors: string[] = [];

    if (isNaN(count) || count < 2) {
        errors.push('Number of measurement points must be at least 2');
    }
    if (count > 1000) {
        errors.push('Number of measurement points seems unusually large. Please verify.');
    }

    return errors;
}

/**
 * Validate GPS coordinates
 */
export function validateGPSCoordinate(coord: GPSCoordinate): string[] {
    const errors: string[] = [];

    if (isNaN(coord.lat) || coord.lat < -90 || coord.lat > 90) {
        errors.push('Latitude must be between -90 and 90 degrees');
    }

    if (isNaN(coord.lng) || coord.lng < -180 || coord.lng > 180) {
        errors.push('Longitude must be between -180 and 180 degrees');
    }

    return errors;
}

/**
 * Validate measurement point
 */
export function validateMeasurementPoint(point: Omit<MeasurementPoint, 'id'>): string[] {
    const errors: string[] = [];

    if (!point.label || point.label.trim() === '') {
        errors.push('Measurement point must have a label');
    }

    errors.push(...validateGPSCoordinate(point.position));

    return errors;
}

/**
 * Validate shape
 */
export function validateShape(shape: Omit<Shape, 'id'>, allPoints: MeasurementPoint[]): string[] {
    const errors: string[] = [];

    if (shape.measurementPoints.length === 0) {
        errors.push('Shape must have at least one measurement point');
    }

    // Validate point references exist
    const pointIds = new Set(allPoints.map(p => p.id));
    const invalidRefs = shape.measurementPoints.filter(id => !pointIds.has(id));
    if (invalidRefs.length > 0) {
        errors.push(`Shape references non-existent measurement points: ${invalidRefs.join(', ')}`);
    }

    // Validate shape-specific requirements
    switch (shape.type) {
        case 'rectangle':
            if (shape.measurementPoints.length !== 4) {
                errors.push('Rectangle must have exactly 4 measurement points');
            }
            break;
        case 'triangle':
            if (shape.measurementPoints.length !== 3) {
                errors.push('Triangle must have exactly 3 measurement points');
            }
            break;
        case 'circle':
            if (!shape.radius || shape.radius <= 0) {
                errors.push('Circle must have a valid radius');
            }
            if (shape.measurementPoints.length !== 1) {
                errors.push('Circle must have exactly 1 measurement point (center)');
            }
            break;
        case 'polygon':
            if (shape.measurementPoints.length < 3) {
                errors.push('Polygon must have at least 3 measurement points');
            }
            break;
    }

    return errors;
}

/**
 * Validate entire garden data
 */
export function validateGardenData(data: Partial<GardenData>): string[] {
    const errors: string[] = [];

    // Validate dimensions
    if (data.dimensions) {
        errors.push(...validateDimensions(data.dimensions.length, data.dimensions.width));
    }

    // Validate distance between points
    if (data.distanceBetweenPoints !== undefined) {
        errors.push(...validateDistanceBetweenPoints(data.distanceBetweenPoints));
    }

    // Validate number of points
    if (data.numberOfPoints !== undefined) {
        errors.push(...validateNumberOfPoints(data.numberOfPoints));
    }

    // Validate center coordinate
    if (data.centerCoordinate) {
        errors.push(...validateGPSCoordinate(data.centerCoordinate));
    }

    // Validate measurement points
    if (data.measurementPoints) {
        data.measurementPoints.forEach((point, index) => {
            const pointErrors = validateGPSCoordinate(point.position);
            if (pointErrors.length > 0) {
                errors.push(`Point ${index + 1} (${point.label}): ${pointErrors.join(', ')}`);
            }
        });
    }

    // Validate sections and shapes
    if (data.sections && data.measurementPoints) {
        data.sections.forEach((section) => {
            section.shapes.forEach((shape, shapeIndex) => {
                const shapeErrors = validateShape(shape, data.measurementPoints!);
                if (shapeErrors.length > 0) {
                    errors.push(`Section "${section.name}", Shape ${shapeIndex + 1}: ${shapeErrors.join(', ')}`);
                }
            });
        });
    }

    return errors;
}
