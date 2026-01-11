"use client";

import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useCallback, useState, useRef } from "react";
import { Truck, AlertTriangle, Navigation } from 'lucide-react';

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

interface TruckData {
  _id: string;
  truckId: string;
  driverName?: string;
  latitude: number;
  longitude: number;
  status: string;
  currentHighway?: string;
  currentKilometer?: number;
  lastUpdated?: number;
}

export interface ShipperFleetMapProps {
  trucks: TruckData[];
  incidents: Incident[];
  onTruckClick?: (truck: TruckData) => void;
  onIncidentClick?: (incident: Incident) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 28.6139, // Delhi
  lng: 77.209,
};

export default function ShipperFleetMap({ 
  trucks,
  incidents,
  onTruckClick,
  onIncidentClick
}: ShipperFleetMapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // Fit bounds to show all trucks
    if (trucks.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      trucks.forEach(truck => {
        bounds.extend({ lat: truck.latitude, lng: truck.longitude });
      });
      incidents.forEach(incident => {
        if (incident.latitude && incident.longitude) {
          bounds.extend({ lat: incident.latitude, lng: incident.longitude });
        }
      });
      map.fitBounds(bounds);
    }
  }, [trucks, incidents]);

  const handleTruckClick = (truck: TruckData) => {
    setSelectedTruck(truck);
    setSelectedIncident(null);
    onTruckClick?.(truck);
  };

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setSelectedTruck(null);
    onIncidentClick?.(incident);
  };

  const getTruckMarkerColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e'; // green
      case 'idle':
        return '#eab308'; // yellow
      case 'offline':
        return '#6b7280'; // gray
      default:
        return '#3b82f6'; // blue
    }
  };

  const getIncidentMarkerColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // orange
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={10}
      onLoad={onMapLoad}
      options={{
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      {/* Truck Markers */}
      {trucks.map((truck) => (
        <Marker
          key={truck._id}
          position={{ lat: truck.latitude, lng: truck.longitude }}
          onClick={() => handleTruckClick(truck)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getTruckMarkerColor(truck.status),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      ))}

      {/* Incident Markers */}
      {incidents.map((incident) => {
        if (!incident.latitude || !incident.longitude) return null;
        
        return (
          <Marker
            key={incident._id}
            position={{ lat: incident.latitude, lng: incident.longitude }}
            onClick={() => handleIncidentClick(incident)}
            icon={{
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: getIncidentMarkerColor(incident.severity),
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              rotation: 180,
            }}
          />
        );
      })}

      {/* Truck Info Window */}
      {selectedTruck && (
        <InfoWindow
          position={{ lat: selectedTruck.latitude, lng: selectedTruck.longitude }}
          onCloseClick={() => setSelectedTruck(null)}
        >
          <div className="p-2 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-sm">{selectedTruck.truckId}</h3>
            </div>
            {selectedTruck.driverName && (
              <p className="text-xs text-gray-600 mb-1">
                Driver: {selectedTruck.driverName}
              </p>
            )}
            <p className="text-xs mb-1">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedTruck.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : selectedTruck.status === 'idle'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedTruck.status}
              </span>
            </p>
            {selectedTruck.currentHighway && (
              <p className="text-xs text-gray-600">
                <Navigation className="h-3 w-3 inline mr-1" />
                {selectedTruck.currentHighway} - KM {selectedTruck.currentKilometer}
              </p>
            )}
            {selectedTruck.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Updated: {new Date(selectedTruck.lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </InfoWindow>
      )}

      {/* Incident Info Window */}
      {selectedIncident && selectedIncident.latitude && selectedIncident.longitude && (
        <InfoWindow
          position={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
          onCloseClick={() => setSelectedIncident(null)}
        >
          <div className="p-2 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`h-4 w-4 ${
                selectedIncident.severity === 'high'
                  ? 'text-red-600'
                  : selectedIncident.severity === 'medium'
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`} />
              <h3 className="font-bold text-sm">
                {selectedIncident.highway} - KM {selectedIncident.kilometer}
              </h3>
            </div>
            <p className="text-xs text-gray-700 mb-1">{selectedIncident.issue}</p>
            <div className="flex gap-2 mt-2">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedIncident.severity === 'high'
                  ? 'bg-red-100 text-red-800'
                  : selectedIncident.severity === 'medium'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedIncident.severity}
              </span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedIncident.status === 'resolved'
                  ? 'bg-green-100 text-green-800'
                  : selectedIncident.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedIncident.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Reported: {new Date(selectedIncident.reportedAt).toLocaleString()}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
