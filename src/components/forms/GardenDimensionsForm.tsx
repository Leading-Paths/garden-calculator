'use client';

import { useState } from 'react';
import { useGardenStore } from '@/lib/store';
import type { UnitOfMeasurement } from '@/types/garden';
import toast from 'react-hot-toast';

export default function GardenDimensionsForm() {
  const { dimensions, setDimensions } = useGardenStore();
  const [length, setLength] = useState(dimensions.length);
  const [width, setWidth] = useState(dimensions.width);
  const [unit, setUnit] = useState<UnitOfMeasurement>(dimensions.unit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (length <= 0 || width <= 0) {
      toast.error('Dimensions must be greater than 0');
      return;
    }
    
    setDimensions(length, width, unit);
    toast.success('Garden dimensions updated');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg">Garden Dimensions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="length" className="block text-sm font-medium mb-1">
            Length
          </label>
          <input
            id="length"
            type="number"
            min="0"
            step="0.1"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="width" className="block text-sm font-medium mb-1">
            Width
          </label>
          <input
            id="width"
            type="number"
            min="0"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="unit" className="block text-sm font-medium mb-1">
          Unit of Measurement
        </label>
        <select
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value as UnitOfMeasurement)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="meters">Meters</option>
          <option value="feet">Feet</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Update Dimensions
      </button>
    </form>
  );
}
