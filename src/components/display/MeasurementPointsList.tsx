'use client';

import { useGardenStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function MeasurementPointsList() {
  const { measurementPoints, deleteMeasurementPoint } = useGardenStore();

  const handleDelete = (id: string, label: string) => {
    if (confirm(`Delete measurement point "${label}"?`)) {
      deleteMeasurementPoint(id);
      toast.success('Measurement point deleted');
    }
  };

  if (measurementPoints.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">Measurement Points</h3>
        <p className="text-sm text-gray-500">No measurement points added yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Measurement Points ({measurementPoints.length})</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {measurementPoints.map((point) => (
          <div key={point.id} className="flex justify-between items-start p-3 bg-gray-50 rounded hover:bg-gray-100">
            <div className="flex-1">
              <p className="font-medium">{point.label}</p>
              <p className="text-xs text-gray-600">
                {point.position.lat.toFixed(6)}, {point.position.lng.toFixed(6)}
              </p>
              {point.notes && (
                <p className="text-xs text-gray-500 mt-1">{point.notes}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(point.id, point.label)}
              className="text-red-600 hover:text-red-800 text-sm"
              aria-label={`Delete ${point.label}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
