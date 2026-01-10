"use client";

import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 28.6139, // Delhi
  lng: 77.209,
};

export default function DriverMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [roadConditions, setRoadConditions] = useState<Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    type: 'accident' | 'road_closure' | 'bad_road' | 'traffic';
    timestamp: Date;
    reportedBy: string;
  }>>([]);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<'accident' | 'road_closure' | 'bad_road' | 'traffic'>('bad_road');
  const mapRef = useRef<google.maps.Map | null>(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
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
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  }, []);

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

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setShowReportDialog(true);
    }
  };

  const handleReportCondition = () => {
    if (!currentLocation) return;
    
    const newCondition = {
      id: Date.now().toString(),
      position: currentLocation,
      type: selectedCondition,
      timestamp: new Date(),
      reportedBy: 'You',
    };

    setRoadConditions(prev => [...prev, newCondition]);
    setShowReportDialog(false);
    
    // In a real app, you would send this to your backend
    console.log('Reported condition:', newCondition);
  };

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
          mapRef.current = map;
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
            key={condition.id}
            position={condition.position}
            label={{
              text: getConditionIcon(condition.type),
              fontSize: '20px',
            }}
            title={`${condition.type.replace('_', ' ')} - Reported by ${condition.reportedBy}`}
          />
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
      {roadConditions.length > 0 && (
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
}