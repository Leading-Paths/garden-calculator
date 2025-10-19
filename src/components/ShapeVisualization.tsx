'use client';

import { useMemo } from 'react';
import { useGardenStore } from '@/lib/store';
import { computePointPositions } from '@/lib/calculations';
import type { Point2D } from '@/types/garden';

export default function ShapeVisualization() {
  const points = useGardenStore((state) => state.points);
  const measurements = useGardenStore((state) => state.measurements);
  const unit = useGardenStore((state) => state.unit);

  const { computedPoints, bounds, scale } = useMemo(() => {
    if (points.length === 0) {
      return { computedPoints: {}, bounds: null, scale: 1 };
    }

    const positions = computePointPositions(points, measurements);
    
    // Calculate bounds
    const pointPositions = Object.values(positions);
    if (pointPositions.length === 0) {
      return { computedPoints: positions, bounds: null, scale: 1 };
    }

    const xs = pointPositions.map(p => p.x);
    const ys = pointPositions.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const width = maxX - minX;
    const height = maxY - minY;
    const padding = Math.max(width, height) * 0.2;

    const bounds = {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
    };

    const boundsWidth = bounds.maxX - bounds.minX;
    const boundsHeight = bounds.maxY - bounds.minY;
    const scale = Math.min(500 / boundsWidth, 500 / boundsHeight);

    return { computedPoints: positions, bounds, scale };
  }, [points, measurements]);

  const toSVG = (p: Point2D): { x: number; y: number } => {
    if (!bounds) return { x: 250, y: 250 };
    
    // Transform to SVG coordinates (flip Y axis)
    const x = (p.x - bounds.minX) * scale;
    const y = 500 - (p.y - bounds.minY) * scale;
    return { x, y };
  };

  if (points.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Add points to see visualization</p>
      </div>
    );
  }

  const polygonPoints = points
    .map(p => computedPoints[p.id])
    .filter((p): p is Point2D => p !== undefined)
    .map(p => toSVG(p))
    .map(p => `${p.x},${p.y}`)
    .join(' ');

  return (
    <div className="w-full h-[500px] bg-white rounded-lg border border-gray-200 p-4">
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        style={{ maxHeight: '500px' }}
      >
        {/* Grid */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="500" height="500" fill="url(#grid)" />

        {/* Polygon */}
        {polygonPoints && (
          <>
            <polygon
              points={polygonPoints}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* Draw measurement lines */}
            {measurements.map((measurement) => {
              const posA = computedPoints[measurement.pointAId];
              const posB = computedPoints[measurement.pointBId];
              if (!posA || !posB) return null;

              const svgA = toSVG(posA);
              const svgB = toSVG(posB);
              const midX = (svgA.x + svgB.x) / 2;
              const midY = (svgA.y + svgB.y) / 2;

              return (
                <g key={measurement.id}>
                  <line
                    x1={svgA.x}
                    y1={svgA.y}
                    x2={svgB.x}
                    y2={svgB.y}
                    stroke="#9ca3af"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={midX}
                    y={midY}
                    fill="#6b7280"
                    fontSize="10"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {measurement.distance.toFixed(1)}{unit === 'meters' ? 'm' : 'ft'}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {/* Points */}
        {points.map((point) => {
          const pos = computedPoints[point.id];
          if (!pos) return null;

          const svgPos = toSVG(pos);
          return (
            <g key={point.id}>
              <circle
                cx={svgPos.x}
                cy={svgPos.y}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={svgPos.x}
                y={svgPos.y - 12}
                fill="#1f2937"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                className="select-none"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
