'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Circle, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGardenStore } from '@/lib/store';
import type { MeasurementPoint, Shape } from '@/types/garden';
import L from 'leaflet';

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function ShapeRenderer({ 
  shape, 
  points, 
  color 
}: { 
  shape: Shape; 
  points: MeasurementPoint[];
  color: string;
}) {
  const shapePoints = shape.measurementPoints
    .map(id => points.find(p => p.id === id))
    .filter((p): p is MeasurementPoint => p !== undefined);

  if (!shape.visible) return null;

  if (shape.type === 'circle' && shape.radius && shapePoints.length > 0) {
    const center: LatLngExpression = [shapePoints[0].position.lat, shapePoints[0].position.lng];
    return (
      <Circle
        center={center}
        radius={shape.radius}
        pathOptions={{ color, fillColor: color, fillOpacity: 0.3 }}
      >
        <Popup>
          <div>
            <strong>{shape.objectType}</strong>
            {shape.notes && <p className="text-sm mt-1">{shape.notes}</p>}
          </div>
        </Popup>
      </Circle>
    );
  }

  if ((shape.type === 'rectangle' || shape.type === 'triangle' || shape.type === 'polygon') 
      && shapePoints.length >= 3) {
    const positions: LatLngExpression[] = shapePoints.map(p => [p.position.lat, p.position.lng]);
    return (
      <Polygon
        positions={positions}
        pathOptions={{ color, fillColor: color, fillOpacity: 0.3 }}
      >
        <Popup>
          <div>
            <strong>{shape.objectType}</strong>
            {shape.notes && <p className="text-sm mt-1">{shape.notes}</p>}
          </div>
        </Popup>
      </Polygon>
    );
  }

  return null;
}

export default function GardenMap() {
  const { measurementPoints, sections, centerCoordinate } = useGardenStore();

  const center: LatLngExpression = centerCoordinate 
    ? [centerCoordinate.lat, centerCoordinate.lng]
    : measurementPoints.length > 0 
      ? [measurementPoints[0].position.lat, measurementPoints[0].position.lng]
      : [51.505, -0.09]; // Default to London

  const shapeColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
  ];

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={18}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render measurement points */}
        {measurementPoints.map((point) => (
          <Marker
            key={point.id}
            position={[point.position.lat, point.position.lng]}
            icon={icon}
          >
            <Popup>
              <div>
                <strong>{point.label}</strong>
                <p className="text-sm">
                  Lat: {point.position.lat.toFixed(6)}<br />
                  Lng: {point.position.lng.toFixed(6)}
                </p>
                {point.notes && <p className="text-sm mt-1">{point.notes}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render shapes from sections */}
        {sections.map((section, sectionIndex) => 
          section.visible && section.shapes.map((shape, shapeIndex) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              points={measurementPoints}
              color={shape.color || shapeColors[(sectionIndex * 3 + shapeIndex) % shapeColors.length]}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
}
