'use client';

import { useState } from 'react';
import { useGardenStore } from '@/lib/store';

export default function MeasurementForm() {
  const [pointAId, setPointAId] = useState('');
  const [pointBId, setPointBId] = useState('');
  const [distance, setDistance] = useState('');
  
  const points = useGardenStore((state) => state.points);
  const unit = useGardenStore((state) => state.unit);
  const setUnit = useGardenStore((state) => state.setUnit);
  const addMeasurement = useGardenStore((state) => state.addMeasurement);
  const measurements = useGardenStore((state) => state.measurements);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointAId || !pointBId || !distance) return;
    if (pointAId === pointBId) {
      alert('Please select two different points');
      return;
    }

    const dist = parseFloat(distance);
    if (isNaN(dist) || dist <= 0) {
      alert('Distance must be a positive number');
      return;
    }

    addMeasurement(pointAId, pointBId, dist);
    setPointAId('');
    setPointBId('');
    setDistance('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Add Distance Measurement</h2>
      
      {points.length < 2 ? (
        <p className="text-gray-500 text-sm">Add at least 2 points first</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pointA" className="block text-sm font-medium text-gray-700 mb-1">
                From Point
              </label>
              <select
                id="pointA"
                value={pointAId}
                onChange={(e) => setPointAId(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select...</option>
                {points.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pointB" className="block text-sm font-medium text-gray-700 mb-1">
                To Point
              </label>
              <select
                id="pointB"
                value={pointBId}
                onChange={(e) => setPointBId(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select...</option>
                {points.map((point) => (
                  <option key={point.id} value={point.id} disabled={point.id === pointAId}>
                    {point.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distance
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'meters' | 'feet')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="meters">m</option>
                <option value="feet">ft</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {measurements.length} measurement{measurements.length !== 1 ? 's' : ''} added
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Measurement
          </button>
        </form>
      )}
    </div>
  );
}
