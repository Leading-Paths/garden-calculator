'use client';

import { useEffect } from 'react';
import { useGardenStore } from '@/lib/store';
import { calculateGardenMetrics, formatArea, formatDistance } from '@/lib/calculations';

export default function CalculationResults() {
  const gardenData = useGardenStore();
  const { calculations, updateCalculations } = gardenData;

  useEffect(() => {
    const results = calculateGardenMetrics(gardenData);
    updateCalculations(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gardenData.dimensions,
    gardenData.measurementPoints,
    gardenData.sections,
  ]);

  if (!calculations) return null;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg">Calculation Results</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Total Area</p>
          <p className="text-xl font-bold text-blue-700">
            {formatArea(calculations.totalArea, gardenData.dimensions.unit)}
          </p>
        </div>
        
        <div className="p-3 bg-green-50 rounded">
          <p className="text-sm text-gray-600">Perimeter</p>
          <p className="text-xl font-bold text-green-700">
            {formatDistance(calculations.perimeter, gardenData.dimensions.unit)}
          </p>
        </div>
      </div>
      
      {Object.keys(calculations.sectionAreas).length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Section Areas</h4>
          <div className="space-y-2">
            {gardenData.sections.map(section => (
              <div key={section.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{section.name}</span>
                <span className="text-sm text-gray-600">
                  {formatArea(calculations.sectionAreas[section.id] || 0, gardenData.dimensions.unit)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {calculations.angles && Object.keys(calculations.angles).length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Angles at Points</h4>
          <div className="space-y-2">
            {Object.entries(calculations.angles).map(([pointId, angle]) => {
              const point = gardenData.measurementPoints.find(p => p.id === pointId);
              return point ? (
                <div key={pointId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{point.label}</span>
                  <span className="text-sm text-gray-600">{angle.toFixed(1)}°</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
