'use client';

import { useGardenStore } from '@/lib/store';
import { formatDistance } from '@/lib/calculations';

export default function MeasurementsList() {
  const points = useGardenStore((state) => state.points);
  const measurements = useGardenStore((state) => state.measurements);
  const deleteMeasurement = useGardenStore((state) => state.deleteMeasurement);

  const getPointLabel = (id: string) => {
    return points.find(p => p.id === id)?.label || '?';
  };

  if (measurements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold text-lg mb-4">Measurements</h2>
        <p className="text-gray-500 text-sm">No measurements added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Measurements ({measurements.length})</h2>
      <div className="space-y-2">
        {measurements.map((measurement) => (
          <div
            key={measurement.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <div>
              <p className="font-medium">
                {getPointLabel(measurement.pointAId)} → {getPointLabel(measurement.pointBId)}
              </p>
              <p className="text-sm text-gray-600">
                {formatDistance(measurement.distance, measurement.unit)}
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Delete this measurement?')) {
                  deleteMeasurement(measurement.id);
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
