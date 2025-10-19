"use client";

import { useMemo, useRef, useState } from "react";
import { useGardenStore } from "@/lib/store";
import { computePointPositions, calculatePolygonArea, calculatePerimeter, formatArea, formatDistance } from "@/lib/calculations";
import type { Point2D } from "@/types/garden";

export default function ShapeVisualization() {
  const points = useGardenStore((state) => state.points);
  const measurements = useGardenStore((state) => state.measurements);
  const unit = useGardenStore((state) => state.unit);
  const svgRef = useRef<SVGSVGElement>(null);

  const [zoom, setZoom] = useState(1);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const { computedPoints, bounds, scale, area, perimeter } = useMemo(() => {
    if (points.length === 0) {
      return { computedPoints: {}, bounds: null, scale: 1, area: 0, perimeter: 0 };
    }

    const positions = computePointPositions(points, measurements);

    // Calculate bounds
    const pointPositions = Object.values(positions);
    if (pointPositions.length === 0) {
      return { computedPoints: positions, bounds: null, scale: 1, area: 0, perimeter: 0 };
    }

    const xs = pointPositions.map((p) => p.x);
    const ys = pointPositions.map((p) => p.y);
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

    // Calculate area and perimeter
    const orderedPositions = points.map((p) => positions[p.id]).filter((p): p is Point2D => p !== undefined);
    const area = orderedPositions.length >= 3 ? calculatePolygonArea(orderedPositions) : 0;
    const perimeter = orderedPositions.length >= 2 ? calculatePerimeter(orderedPositions) : 0;

    return { computedPoints: positions, bounds, scale, area, perimeter };
  }, [points, measurements]);

  const toSVG = (p: Point2D): { x: number; y: number } => {
    if (!bounds) return { x: 250, y: 250 };

    // Transform to SVG coordinates
    let x = (p.x - bounds.minX) * scale;
    let y = 500 - (p.y - bounds.minY) * scale;

    // Apply flips
    if (flipX) x = 500 - x;
    if (flipY) y = 500 - y;

    return { x, y };
  };

  const handleExportImage = async () => {
    if (!svgRef.current) return;

    try {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgRef.current.cloneNode(true) as SVGElement;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);

      // Create a canvas to convert SVG to PNG
      const canvas = document.createElement("canvas");
      canvas.width = 1000; // Higher resolution
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        URL.revokeObjectURL(url);

        // Convert to blob and copy to clipboard
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
              alert("Image copied to clipboard!");
            } catch (err) {
              console.error("Failed to copy image:", err);
              // Fallback: download the image
              const downloadUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = downloadUrl;
              a.download = "garden-diagram.png";
              a.click();
              URL.revokeObjectURL(downloadUrl);
            }
          }
        });
      };

      img.src = url;
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export image");
    }
  };

  if (points.length === 0) {
    return (
      <div className='w-full bg-gray-50 rounded-lg flex items-center justify-center' style={{ minHeight: "500px" }}>
        <p className='text-gray-500'>Add points to see visualization</p>
      </div>
    );
  }

  const polygonPoints = points
    .map((p) => computedPoints[p.id])
    .filter((p): p is Point2D => p !== undefined)
    .map((p) => toSVG(p))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const centerX = 250;
  const centerY = 250;
  const viewBoxSize = 500 / zoom;
  const viewBoxX = centerX - viewBoxSize / 2;
  const viewBoxY = centerY - viewBoxSize / 2;

  return (
    <div className='w-full bg-white rounded-lg border border-gray-200'>
      {/* Control Panel */}
      <div className='flex flex-wrap items-center justify-between gap-2 p-3 border-b border-gray-200 bg-gray-50'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-700'>Controls:</span>
          <button
            onClick={() => setFlipX(!flipX)}
            className={`px-3 py-1 text-xs rounded ${flipX ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:opacity-80 transition-opacity`}
            title='Flip horizontally'>
            Flip X
          </button>
          <button
            onClick={() => setFlipY(!flipY)}
            className={`px-3 py-1 text-xs rounded ${flipY ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:opacity-80 transition-opacity`}
            title='Flip vertically'>
            Flip Y
          </button>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-700'>Zoom:</span>
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className='px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors' title='Zoom out'>
            −
          </button>
          <span className='text-xs text-gray-600 min-w-[3rem] text-center'>{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.25))} className='px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors' title='Zoom in'>
            +
          </button>
          <button onClick={() => setZoom(1)} className='px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors' title='Reset zoom'>
            Reset
          </button>
        </div>

        <button onClick={handleExportImage} className='px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors' title='Copy diagram to clipboard'>
          📋 Copy Image
        </button>
      </div>

      {/* SVG Canvas */}
      <div className='p-4' style={{ minHeight: "500px" }}>
        <svg ref={svgRef} viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxSize} ${viewBoxSize}`} className='w-full h-full' style={{ maxHeight: "500px" }}>
          {/* Grid */}
          <defs>
            <pattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'>
              <path d='M 50 0 L 0 0 0 50' fill='none' stroke='#e5e7eb' strokeWidth='1' />
            </pattern>
          </defs>
          <rect width='500' height='500' fill='url(#grid)' />

          {/* Polygon */}
          {polygonPoints && (
            <>
              <polygon points={polygonPoints} fill='rgba(59, 130, 246, 0.1)' stroke='#3b82f6' strokeWidth='2' />

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
                    <line x1={svgA.x} y1={svgA.y} x2={svgB.x} y2={svgB.y} stroke='#9ca3af' strokeWidth='1' strokeDasharray='4,4' />
                    <text x={midX} y={midY} fill='#6b7280' fontSize='10' textAnchor='middle' className='select-none'>
                      {measurement.distance.toFixed(1)}
                      {unit === "meters" ? "m" : "ft"}
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
                <circle cx={svgPos.x} cy={svgPos.y} r='6' fill='#3b82f6' stroke='white' strokeWidth='2' />
                <text x={svgPos.x} y={svgPos.y - 12} fill='#1f2937' fontSize='14' fontWeight='bold' textAnchor='middle' className='select-none'>
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Area and Perimeter Display */}
          {area > 0 && (
            <g>
              <rect x='10' y='10' width='180' height='60' fill='white' stroke='#d1d5db' strokeWidth='1' rx='4' opacity='0.95' />
              <text x='20' y='30' fill='#1f2937' fontSize='12' fontWeight='bold' className='select-none'>
                Area: {formatArea(area, unit)}
              </text>
              <text x='20' y='50' fill='#1f2937' fontSize='12' fontWeight='bold' className='select-none'>
                Perimeter: {formatDistance(perimeter, unit)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
