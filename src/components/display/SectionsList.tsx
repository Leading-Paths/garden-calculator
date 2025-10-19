'use client';

import { useGardenStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function SectionsList() {
  const { sections, toggleSectionVisibility, deleteSection, toggleShapeVisibility, deleteShape } = useGardenStore();

  const handleDeleteSection = (id: string, name: string) => {
    if (confirm(`Delete section "${name}" and all its shapes?`)) {
      deleteSection(id);
      toast.success('Section deleted');
    }
  };

  const handleDeleteShape = (sectionId: string, shapeId: string, objectType: string) => {
    if (confirm(`Delete ${objectType} shape?`)) {
      deleteShape(sectionId, shapeId);
      toast.success('Shape deleted');
    }
  };

  if (sections.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">Garden Sections</h3>
        <p className="text-sm text-gray-500">No sections added yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Garden Sections ({sections.length})</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSectionVisibility(section.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  aria-label={`Toggle ${section.name} visibility`}
                >
                  {section.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <h4 className="font-medium">{section.name}</h4>
                <span className="text-xs text-gray-500">({section.shapes.length} shapes)</span>
              </div>
              <button
                onClick={() => handleDeleteSection(section.id, section.name)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
            
            {section.shapes.length > 0 ? (
              <div className="space-y-1 ml-6">
                {section.shapes.map((shape) => (
                  <div key={shape.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleShapeVisibility(section.id, shape.id)}
                        className="text-xs text-blue-600"
                        aria-label={`Toggle shape visibility`}
                      >
                        {shape.visible ? '👁️' : '👁️‍🗨️'}
                      </button>
                      <span>{shape.objectType}</span>
                      <span className="text-xs text-gray-500">({shape.type})</span>
                    </div>
                    <button
                      onClick={() => handleDeleteShape(section.id, shape.id, shape.objectType)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 ml-6">No shapes in this section</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
