'use client';

import dynamic from 'next/dynamic';
import GardenDimensionsForm from '@/components/forms/GardenDimensionsForm';
import MeasurementPointForm from '@/components/forms/MeasurementPointForm';
import ShapeForm from '@/components/forms/ShapeForm';
import CalculationResults from '@/components/display/CalculationResults';
import MeasurementPointsList from '@/components/display/MeasurementPointsList';
import SectionsList from '@/components/display/SectionsList';
import GardenSuggestions from '@/components/display/GardenSuggestions';

const GardenMap = dynamic(() => import('@/components/GardenMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Garden Calculator</h1>
          <p className="text-gray-600 mt-1">Plan and manage your garden layout with precision</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            <GardenDimensionsForm />
            <MeasurementPointForm />
            <ShapeForm />
          </div>

          {/* Middle Column - Map and Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Garden Map</h2>
              <div className="h-[500px]">
                <GardenMap />
              </div>
            </div>
            
            <CalculationResults />
            <GardenSuggestions />
          </div>
        </div>

        {/* Bottom Section - Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MeasurementPointsList />
          <SectionsList />
        </div>
      </main>

      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Garden Calculator - Plan your perfect garden layout</p>
        </div>
      </footer>
    </div>
  );
}
