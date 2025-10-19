'use client';

import { useState } from 'react';
import { useGardenStore } from '@/lib/store';
import type { ObjectType, ShapeType } from '@/types/garden';
import toast from 'react-hot-toast';

export default function ShapeForm() {
  const { sections, measurementPoints, addShape, addSection } = useGardenStore();
  const [sectionId, setSectionId] = useState('');
  const [shapeType, setShapeType] = useState<ShapeType>('polygon');
  const [objectType, setObjectType] = useState<ObjectType>('flower-bed');
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [radius, setRadius] = useState('');
  const [notes, setNotes] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast.error('Section name is required');
      return;
    }
    addSection(newSectionName.trim());
    toast.success('Section added');
    setNewSectionName('');
  };

  const handleTogglePoint = (pointId: string) => {
    setSelectedPoints(prev =>
      prev.includes(pointId)
        ? prev.filter(id => id !== pointId)
        : [...prev, pointId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sectionId) {
      toast.error('Please select a section');
      return;
    }
    
    if (shapeType === 'circle' && selectedPoints.length !== 1) {
      toast.error('Circle requires exactly 1 point (center)');
      return;
    }
    
    if (shapeType === 'triangle' && selectedPoints.length !== 3) {
      toast.error('Triangle requires exactly 3 points');
      return;
    }
    
    if (shapeType === 'rectangle' && selectedPoints.length !== 4) {
      toast.error('Rectangle requires exactly 4 points');
      return;
    }
    
    if (shapeType === 'polygon' && selectedPoints.length < 3) {
      toast.error('Polygon requires at least 3 points');
      return;
    }
    
    if (shapeType === 'circle') {
      const radiusNum = parseFloat(radius);
      if (isNaN(radiusNum) || radiusNum <= 0) {
        toast.error('Valid radius required for circle');
        return;
      }
    }
    
    addShape(sectionId, {
      type: shapeType,
      objectType,
      measurementPoints: selectedPoints,
      radius: shapeType === 'circle' ? parseFloat(radius) : undefined,
      notes: notes.trim() || undefined,
    });
    
    toast.success('Shape added');
    
    // Reset form
    setSelectedPoints([]);
    setRadius('');
    setNotes('');
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg">Add Shape</h3>
      
      {/* Section management */}
      <div className="border-b pb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="New section name"
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Section
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="section" className="block text-sm font-medium mb-1">
            Section *
          </label>
          <select
            id="section"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a section</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="shapeType" className="block text-sm font-medium mb-1">
              Shape Type *
            </label>
            <select
              id="shapeType"
              value={shapeType}
              onChange={(e) => setShapeType(e.target.value as ShapeType)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="polygon">Polygon</option>
              <option value="rectangle">Rectangle</option>
              <option value="triangle">Triangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="objectType" className="block text-sm font-medium mb-1">
              Object Type *
            </label>
            <select
              id="objectType"
              value={objectType}
              onChange={(e) => setObjectType(e.target.value as ObjectType)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="flower-bed">Flower Bed</option>
              <option value="vegetable-patch">Vegetable Patch</option>
              <option value="pathway">Pathway</option>
              <option value="plant">Plant</option>
              <option value="tree">Tree</option>
              <option value="decoration">Decoration</option>
              <option value="retaining-wall">Retaining Wall</option>
              <option value="steps">Steps</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        {shapeType === 'circle' && (
          <div>
            <label htmlFor="radius" className="block text-sm font-medium mb-1">
              Radius (meters) *
            </label>
            <input
              id="radius"
              type="number"
              min="0"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Points * ({shapeType === 'circle' ? '1' : shapeType === 'triangle' ? '3' : shapeType === 'rectangle' ? '4' : '3+'})
          </label>
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {measurementPoints.length === 0 ? (
              <p className="text-sm text-gray-500">No measurement points available</p>
            ) : (
              measurementPoints.map(point => (
                <label key={point.id} className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPoints.includes(point.id)}
                    onChange={() => handleTogglePoint(point.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{point.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="shapeNotes" className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="shapeNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={2}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
        >
          Add Shape
        </button>
      </form>
    </div>
  );
}
