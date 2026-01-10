"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "./ui/card";

interface Incident {
  _id: string;
  highway: string;
  kilometer: number;
  issue: string;
  severity: string;
  latitude?: number;
  longitude?: number;
  status: string;
  reportedAt: number;
}

interface Truck {
  _id: string;
  truckId: string;
  latitude: number;
  longitude: number;
  status: string;
  currentHighway?: string;
  currentKilometer?: number;
}

interface Props {
  incidents: Incident[];
  trucks: Truck[];
}

export default function MapboxDashboard({ incidents, trucks }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Mapbox token not configured");
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716], // Default to Bangalore, India
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update incident markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing incident markers
    const existingMarkers = document.querySelectorAll(".incident-marker");
    existingMarkers.forEach((marker) => {
      const parent = marker.parentElement;
      if (parent) parent.remove();
    });

    // Add incident markers
    incidents.forEach((incident) => {
      if (!incident.latitude || !incident.longitude) return;

      const el = document.createElement("div");
      el.className = "incident-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      // Color based on severity
      const severityColors = {
        low: "#22c55e",
        medium: "#eab308",
        high: "#ef4444",
      };
      el.style.backgroundColor =
        severityColors[incident.severity as keyof typeof severityColors] ||
        severityColors.medium;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">${incident.highway} KM ${incident.kilometer}</h3>
          <p class="text-xs mb-1">${incident.issue}</p>
          <p class="text-xs text-gray-600">Severity: ${incident.severity}</p>
          <p class="text-xs text-gray-600">Status: ${incident.status}</p>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([incident.longitude, incident.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [incidents, mapLoaded]);

  // Update truck markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing truck markers
    const existingMarkers = document.querySelectorAll(".truck-marker");
    existingMarkers.forEach((marker) => {
      const parent = marker.parentElement;
      if (parent) parent.remove();
    });

    // Add truck markers
    trucks.forEach((truck) => {
      const el = document.createElement("div");
      el.className = "truck-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "4px";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      // Color based on status
      const statusColors = {
        active: "#3b82f6",
        idle: "#64748b",
        offline: "#9ca3af",
      };
      el.style.backgroundColor =
        statusColors[truck.status as keyof typeof statusColors] ||
        statusColors.active;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">Truck ${truck.truckId}</h3>
          <p class="text-xs text-gray-600">Status: ${truck.status}</p>
          ${truck.currentHighway ? `<p class="text-xs text-gray-600">Highway: ${truck.currentHighway}</p>` : ""}
          ${truck.currentKilometer ? `<p class="text-xs text-gray-600">KM: ${truck.currentKilometer}</p>` : ""}
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([truck.longitude, truck.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [trucks, mapLoaded]);

  return (
    <Card className="overflow-hidden">
      <div ref={mapContainer} className="h-[600px] w-full" />
      {!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">
            Please configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          </p>
        </div>
      )}
    </Card>
  );
}
