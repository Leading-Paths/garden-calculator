'use client';

import { useGardenStore } from '@/lib/store';
import { generateLayoutSuggestions } from '@/lib/calculations';

export default function GardenSuggestions() {
  const gardenData = useGardenStore();
  const suggestions = generateLayoutSuggestions(gardenData);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-lg mb-3 text-blue-900">💡 Garden Layout Suggestions</h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm text-blue-800 flex gap-2">
            <span className="text-blue-600">•</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
