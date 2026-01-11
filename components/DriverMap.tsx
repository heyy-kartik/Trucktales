"use client";

import { GoogleMap, Marker, DirectionsRenderer, useLoadScript, InfoWindow } from "@react-google-maps/api";
import { useCallback, useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Fuel } from 'lucide-react';

interface RoadCondition {
  id: string;
  position: google.maps.LatLngLiteral;
  type: 'accident' | 'road_closure' | 'bad_road' | 'traffic';
  timestamp: Date;
  reportedBy: string;
}

export interface FuelStation {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: string;
  hasParking: boolean;
  hasRestroom: boolean;
  hasRestaurant: boolean;
  position: {
    lat: number;
    lng: number;
  };
}

export interface DriverMapProps {
  activeView?: 'current' | 'nextStop' | 'incidents' | 'alerts' | 'fuel';
  onLocationClick?: (location: { lat: number; lng: number }) => void;
  currentLocation?: { lat: number; lng: number };
  nextStopLocation?: { lat: number; lng: number };
  onReportSubmit?: (condition: Omit<RoadCondition, 'id' | 'timestamp' | 'reportedBy'>) => void;
  roadConditions?: RoadCondition[];
  fuelStations?: FuelStation[];
  onStationSelect?: (station: FuelStation) => void;
  selectedStation?: FuelStation | null;
}

export interface DriverMapRef {
  panTo: (location: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 28.6139, // Delhi
  lng: 77.209,
};

const DriverMap = forwardRef<DriverMapRef, DriverMapProps>(({ 
  activeView = 'current',
  onLocationClick,
  currentLocation: propCurrentLocation,
  nextStopLocation,
  onReportSubmit,
  roadConditions: propRoadConditions = [],
  fuelStations = [],
  onStationSelect,
  selectedStation: propSelectedStation
}, ref) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(propCurrentLocation || null);
  const [roadConditions, setRoadConditions] = useState<RoadCondition[]>(propRoadConditions);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<'accident' | 'road_closure' | 'bad_road' | 'traffic'>('bad_road');
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  // Handle prop changes
  useEffect(() => {
    if (propSelectedStation) {
      setSelectedStation(propSelectedStation);
    }
  }, [propSelectedStation]);

  // Expose map methods via ref
  useImperativeHandle(ref, () => ({
    panTo: (location) => {
      if (mapInstance.current) {
        mapInstance.current.panTo(location);
      }
    },
    setZoom: (zoom) => {
      if (mapInstance.current) {
        mapInstance.current.setZoom(zoom);
      }
    },
    getMap: () => mapInstance.current
  }));

  // Get current location if not provided
  useEffect(() => {
    if (!propCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        }
      );
    } else if (propCurrentLocation) {
      setCurrentLocation(propCurrentLocation);
    }
  }, [propCurrentLocation]);

  // Load sample directions
  useEffect(() => {
    if (!isLoaded) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: currentLocation || "Sector 18, Noida",
        destination: "Connaught Place, Delhi",
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, currentLocation]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    if (onLocationClick) {
      onLocationClick(position);
    }

    if (activeView === 'incidents') {
      setShowReportDialog(true);
    }
    
    // Clear selected station when clicking on the map
    if (activeView === 'fuel' && selectedStation) {
      setSelectedStation(null);
    }
  }, [activeView, onLocationClick, selectedStation]);
  
  const handleStationClick = useCallback((station: FuelStation, e: google.maps.MapMouseEvent) => {
    e.stop();
    setSelectedStation(station);
    if (onStationSelect) {
      onStationSelect(station);
    }
    
    if (mapInstance.current) {
      mapInstance.current.panTo(station.position);
    }
  }, [onStationSelect]);

  const handleReportCondition = useCallback(() => {
    if (!currentLocation || !onReportSubmit) return;
    
    const newCondition = {
      position: currentLocation,
      type: selectedCondition,
      reportedBy: 'You',
    };

    onReportSubmit(newCondition);
    setShowReportDialog(false);
  }, [currentLocation, selectedCondition, onReportSubmit]);

  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return '🚨';
      case 'road_closure':
        return '🚧';
      case 'bad_road':
        return '🕳️';
      case 'traffic':
        return '🚗💨';
      default:
        return '⚠️';
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || center}
        zoom={15}
        onClick={handleMapClick}
        onLoad={(map) => {
          mapInstance.current = map;
        }}
      >
        {currentLocation && (
          <Marker 
            position={currentLocation} 
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
        
        {/* Show road conditions */}
        {roadConditions.map((condition) => (
          <Marker
            key={`condition-${condition.id}`}
            position={condition.position}
            label={{
              text: getConditionIcon(condition.type),
              fontSize: '20px',
            }}
            title={`${condition.type.replace('_', ' ')} - Reported by ${condition.reportedBy}`}
          />
        ))}
        
        {/* Show fuel stations */}
        {activeView === 'fuel' && fuelStations?.map((station: FuelStation) => (
          <Marker
            key={`station-${station.id}`}
            position={station.position}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${selectedStation?.id === station.id ? '#2563eb' : '#f59e0b'}" width="32" height="32">
                  <path d="M18 10a1 1 0 0 1 1 1v7h1a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h1v-7a1 1 0 0 1 1-1h12zM8 12v5h8v-5H8zm-1-6h10l1 2H6l1-2z" />
                </svg>`
              )}`,
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16)
            }}
            onClick={(e) => handleStationClick(station, e)}
          >
            {(selectedStation?.id === station.id) && (
              <InfoWindow
                position={station.position}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="p-2">
                  <h4 className="font-medium">{station.name}</h4>
                  <p className="text-sm text-gray-600">{station.address}</p>
                  <p className="text-sm font-medium text-yellow-600 mt-1">{station.price}</p>
                  <div className="flex mt-1 space-x-1">
                    {station.hasParking && (
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                        Parking
                      </span>
                    )}
                    {station.hasRestroom && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                        Restroom
                      </span>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="absolute top-4 text-gray-800 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
          <h3 className="font-bold mb-2">Report Road Condition</h3>
          <select 
            className="w-full p-2 border rounded mb-2"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value as any)}
          >
            <option value="bad_road">Bad Road</option>
            <option value="accident">Accident</option>
            <option value="road_closure">Road Closure</option>
            <option value="traffic">Heavy Traffic</option>
          </select>
          <div className="flex justify-between">
            <button 
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setShowReportDialog(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleReportCondition}
            >
              Report
            </button>
          </div>
        </div>
      )}

      {/* Road Conditions List */}
      {(roadConditions.length > 0 && activeView === 'alerts') && (
        <div className="absolute bottom-4 text-gray-800 left-4 bg-white p-4 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          <h3 className="font-bold mb-2">Road Conditions</h3>
          <div className="space-y-2">
            {roadConditions.map((condition) => (
              <div key={condition.id} className="flex items-center gap-2">
                <span className="text-xl">{getConditionIcon(condition.type)}</span>
                <div>
                  <p className="font-medium">{condition.type.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500">
                    Reported by {condition.reportedBy} • {condition.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default DriverMap;