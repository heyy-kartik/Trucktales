"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { LocateFixed } from "lucide-react";

type RealTimeLocationProps = {
  onLocationUpdate?: (position: GeolocationPosition) => void;
  onMapLoad?: (map: google.maps.Map) => void;
};

export function RealTimeLocation({
  onLocationUpdate,
  onMapLoad,
}: RealTimeLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const watchId = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const centerOnMe = useCallback(() => {
    if (marker.current?.getPosition() && mapInstance.current) {
      mapInstance.current.setCenter(marker.current.getPosition()!);
      mapInstance.current.setZoom(15);
    }
  }, []);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
      setIsLoading(true);

      try {
        // Initialize the loader
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places"],
        });

        // Load the Google Maps API
        await loader.load();
        
        // Now we can use the global google object
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const { Marker } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

        // Create map instance
        const map = new Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // Center of India
          zoom: 5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstance.current = map;
        marker.current = new Marker({ map });

        onMapLoad?.(map);

        // Handle geolocation
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser");
          return;
        }

        const success = (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          marker.current?.setPosition(pos);
          map.setCenter(pos);
          map.setZoom(15);
          
          onLocationUpdate?.(position);
        };

        const error = (err: GeolocationPositionError) => {
          console.error("Error getting location:", err);
          setError("Could not get your location. Please check your browser settings.");
        };

        // Get current position
        navigator.geolocation.getCurrentPosition(success, error, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });

        // Watch position
        watchId.current = navigator.geolocation.watchPosition(success, error, {
          enableHighAccuracy: true
        });

      } catch (err) {
        console.error("Error loading Google Maps:", err);
        setError("Failed to load Google Maps. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [onLocationUpdate, onMapLoad]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-50 p-4">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error</p>
            <p className="text-sm text-gray-700 mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" />

      {!isLoading && !error && (
        <button
          onClick={centerOnMe}
          className="absolute bottom-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg"
          aria-label="Center on my location"
        >
          <LocateFixed className="h-5 w-5 text-indigo-600" />
        </button>
      )}
    </div>
  );
}