'use client';

import { useState } from 'react';
import { useGardenStore } from '@/lib/store';

export default function PointForm() {
  const [label, setLabel] = useState('');
  const addPoint = useGardenStore((state) => state.addPoint);
  const points = useGardenStore((state) => state.points);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    
    addPoint(label.toUpperCase());
    setLabel('');
  };

  const getNextLabel = () => {
    if (points.length === 0) return 'A';
    const lastLabel = points[points.length - 1].label;
    return String.fromCharCode(lastLabel.charCodeAt(0) + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Add Point</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
            Point Label
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`e.g., ${getNextLabel()}`}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              maxLength={3}
            />
            <button
              type="button"
              onClick={() => setLabel(getNextLabel())}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Auto
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {points.length} point{points.length !== 1 ? 's' : ''} added
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Point
        </button>
      </form>
    </div>
  );
}
