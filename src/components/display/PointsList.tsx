'use client';

import { useGardenStore } from '@/lib/store';

export default function PointsList() {
  const points = useGardenStore((state) => state.points);
  const deletePoint = useGardenStore((state) => state.deletePoint);

  if (points.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold text-lg mb-4">Points</h2>
        <p className="text-gray-500 text-sm">No points added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Points ({points.length})</h2>
      <div className="space-y-2">
        {points.map((point) => (
          <div
            key={point.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {point.label}
              </div>
              <div>
                <p className="font-medium">Point {point.label}</p>
                {point.notes && (
                  <p className="text-xs text-gray-500">{point.notes}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete point ${point.label}?`)) {
                  deletePoint(point.id);
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
