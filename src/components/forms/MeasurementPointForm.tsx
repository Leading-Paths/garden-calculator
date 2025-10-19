"use client";

import { useState } from "react";
import { useGardenStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function MeasurementPointForm() {
  const { addMeasurementPoint } = useGardenStore();
  const [label, setLabel] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim()) {
      toast.error("Label is required");
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      toast.error("Valid latitude required (-90 to 90)");
      return;
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      toast.error("Valid longitude required (-180 to 180)");
      return;
    }

    addMeasurementPoint({
      label: label.trim(),
      position: { lat: latitude, lng: longitude },
      notes: notes.trim() || undefined,
      isReference: true, // This is a GPS reference point
    });

    toast.success("GPS reference point added");

    // Reset form
    setLabel("");
    setLat("");
    setLng("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 p-4 bg-white rounded-lg shadow'>
      <h3 className='font-semibold text-lg'>Add GPS Reference Point</h3>
      <p className='text-xs text-gray-600'>Add at least one GPS reference point. Other points can be added using distance and bearing.</p>

      <div>
        <label htmlFor='label' className='block text-sm font-medium mb-1'>
          Label *
        </label>
        <input
          id='label'
          type='text'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder='e.g., Point A'
          className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='lat' className='block text-sm font-medium mb-1'>
            Latitude *
          </label>
          <input
            id='lat'
            type='number'
            step='any'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder='e.g., 51.505'
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label htmlFor='lng' className='block text-sm font-medium mb-1'>
            Longitude *
          </label>
          <input
            id='lng'
            type='number'
            step='any'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder='e.g., -0.09'
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div>
        <label htmlFor='notes' className='block text-sm font-medium mb-1'>
          Notes
        </label>
        <textarea
          id='notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='Additional notes...'
          rows={2}
          className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <button type='submit' className='w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition'>
        Add Point
      </button>
    </form>
  );
}
