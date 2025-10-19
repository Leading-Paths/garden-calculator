'use client';

import { useEffect } from 'react';
import { useGardenStore } from '@/lib/store';
import { calculateGardenMetrics, formatArea, formatDistance } from '@/lib/calculations';

export default function ResultsDisplay() {
  const points = useGardenStore((state) => state.points);
  const measurements = useGardenStore((state) => state.measurements);
  const unit = useGardenStore((state) => state.unit);
  const notes = useGardenStore((state) => state.notes);
  const calculations = useGardenStore((state) => state.calculations);
  const updateCalculations = useGardenStore((state) => state.updateCalculations);

  useEffect(() => {
    if (points.length >= 3 && measurements.length > 0) {
      const results = calculateGardenMetrics({ points, measurements, unit, notes });
      updateCalculations(results);
    }
  }, [points, measurements, unit, notes, updateCalculations]);

  if (!calculations || points.length < 3) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold text-lg mb-4">Results</h2>
        <p className="text-gray-500 text-sm">
          Add at least 3 points and measurements to see results
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Calculation Results</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Area</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatArea(calculations.area, unit)}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Perimeter</p>
            <p className="text-2xl font-bold text-green-600">
              {formatDistance(calculations.perimeter, unit)}
            </p>
          </div>
        </div>

        <div className={`p-3 rounded-md ${calculations.isValid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          <p className="text-sm font-medium">
            {calculations.isValid ? '✓ Valid configuration' : '⚠ ' + calculations.errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
