'use client';

import { useState } from 'react';
import { useGardenStore } from '@/lib/store';
import { calculatePointFromDistance } from '@/lib/calculations';
import toast from 'react-hot-toast';

export default function MeasurementPointDistanceForm() {
  const { measurementPoints, addMeasurementPoint, dimensions } = useGardenStore();
  const [label, setLabel] = useState('');
  const [distance, setDistance] = useState('');
  const [bearing, setBearing] = useState('0');
  const [notes, setNotes] = useState('');

  const hasReferencePoints = measurementPoints.some(p => p.isReference);
  const lastPoint = measurementPoints[measurementPoints.length - 1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!label.trim()) {
      toast.error('Label is required');
      return;
    }

    if (!hasReferencePoints) {
      toast.error('Please add at least one GPS reference point first');
      return;
    }
    
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      toast.error('Valid distance required (greater than 0)');
      return;
    }
    
    const bearingNum = parseFloat(bearing);
    if (isNaN(bearingNum) || bearingNum < 0 || bearingNum >= 360) {
      toast.error('Bearing must be between 0 and 359 degrees');
      return;
    }

    if (!lastPoint) {
      toast.error('No previous point to calculate from');
      return;
    }

    // Calculate new GPS position from distance and bearing
    const newPosition = calculatePointFromDistance(
      lastPoint.position,
      distanceNum,
      bearingNum,
      dimensions.unit
    );

    addMeasurementPoint({
      label: label.trim(),
      position: newPosition,
      notes: notes.trim() || undefined,
      isReference: false,
      distanceFromPrevious: distanceNum,
      bearing: bearingNum,
    });
    
    toast.success(`Point added ${distanceNum}${dimensions.unit === 'meters' ? 'm' : 'ft'} from previous point`);
    
    // Reset form
    setLabel('');
    setDistance('');
    setBearing('0');
    setNotes('');
  };

  if (!hasReferencePoints) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-lg mb-2 text-yellow-900">Add Point by Distance</h3>
        <p className="text-sm text-yellow-800">
          Please add at least one GPS reference point first before using distance-based positioning.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg">Add Point by Distance</h3>
      <p className="text-xs text-gray-600">
        Calculate position from the last point ({lastPoint?.label}) using distance and bearing.
      </p>
      
      <div>
        <label htmlFor="label" className="block text-sm font-medium mb-1">
          Label *
        </label>
        <input
          id="label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Point B"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="distance" className="block text-sm font-medium mb-1">
            Distance ({dimensions.unit === 'meters' ? 'meters' : 'feet'}) *
          </label>
          <input
            id="distance"
            type="number"
            min="0"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g., 5.0"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="bearing" className="block text-sm font-medium mb-1">
            Bearing (degrees) *
          </label>
          <input
            id="bearing"
            type="number"
            min="0"
            max="359"
            step="1"
            value={bearing}
            onChange={(e) => setBearing(e.target.value)}
            placeholder="0-359"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        <strong>Bearing Guide:</strong> 0° = North, 90° = East, 180° = South, 270° = West
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          rows={2}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Calculate & Add Point
      </button>
    </form>
  );
}
