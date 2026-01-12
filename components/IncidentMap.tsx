"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on severity
const createCustomIcon = (severity: string) => {
  const color =
    severity === "critical"
      ? "#ef4444"
      : severity === "high"
        ? "#f97316"
        : severity === "medium"
          ? "#eab308"
          : "#22c55e";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

interface Incident {
  id: string;
  text: string;
  location?: string;
  issue?: string;
  severity: string;
  latitude?: number;
  longitude?: number;
  driverName: string;
  timestamp: string;
}

interface IncidentMapProps {
  incidents: Incident[];
}

export function IncidentMap({ incidents }: IncidentMapProps) {
  // Filter incidents that have coordinates
  const incidentsWithCoords = incidents.filter(
    (inc) => inc.latitude && inc.longitude
  );

  // Default center (India)
  const center: [number, number] = [20.5937, 78.9629];

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers for incidents */}
        {incidentsWithCoords.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude!, incident.longitude!]}
            icon={createCustomIcon(incident.severity)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-sm">{incident.driverName}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      incident.severity === "critical"
                        ? "bg-red-100 text-red-800"
                        : incident.severity === "high"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {incident.severity}
                  </span>
                </div>
                <p className="text-sm mb-2">{incident.text}</p>
                {incident.location && (
                  <p className="text-xs text-gray-600">
                    📍 {incident.location}
                  </p>
                )}
                {incident.issue && (
                  <p className="text-xs text-gray-600">⚠️ {incident.issue}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(incident.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
