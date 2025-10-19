"use client";

import PointForm from "@/components/forms/PointForm";
import MeasurementForm from "@/components/forms/MeasurementForm";
import PointsList from "@/components/display/PointsList";
import MeasurementsList from "@/components/display/MeasurementsList";
import ResultsDisplay from "@/components/display/ResultsDisplay";
import ShapeVisualization from "@/components/ShapeVisualization";

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <h1 className='text-3xl font-bold text-gray-900'>Garden Shape Calculator</h1>
          <p className='text-gray-600 mt-1'>Calculate area and shape from distance measurements between points</p>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Input Forms */}
          <div className='space-y-6'>
            <PointForm />
            <MeasurementForm />
            <ResultsDisplay />
          </div>

          {/* Middle Column - Visualization */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-white rounded-lg shadow p-4'>
              <h2 className='font-semibold text-lg mb-4'>2D Visualization</h2>
              <ShapeVisualization />
            </div>
          </div>
        </div>

        {/* Bottom Section - Lists */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
          <PointsList />
          <MeasurementsList />
        </div>
      </main>

      <footer className='bg-white mt-12 border-t'>
        <div className='max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm'>
          <p>Garden Shape Calculator - Calculate area from distance measurements</p>
        </div>
      </footer>
    </div>
  );
}
