"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { LocateFixed } from 'lucide-react';

type RealTimeLocationProps = {
  onLocationUpdate?: (position: GeolocationPosition) => void;
  onMapLoad?: (map: google.maps.Map) => void;
};

export function RealTimeLocation({ onLocationUpdate, onMapLoad }: RealTimeLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const watchId = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const centerOnMe = useCallback(() => {
    if (marker.current?.getPosition() && mapInstance.current) {
      mapInstance.current.setCenter(marker.current.getPosition()!);
    }
  }, []);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: "weekly",
      });

      try {
        const { Map } = await loader.importLibrary('maps');
        const { Marker } = await loader.importLibrary('marker');
        
        if (mapRef.current && !mapInstance.current) {
          const map = new Map(mapRef.current, {
            center: { lat: 20.5937, lng: 78.9629 }, // Center of India
            zoom: 5,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          mapInstance.current = map;
          marker.current = new Marker({ map });

          if (onMapLoad) {
            onMapLoad(map);
          }

          // Start watching position
          if (navigator.geolocation) {
            watchId.current = navigator.geolocation.watchPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                // Update marker
                if (marker.current) {
                  marker.current.setPosition(pos);
                }

                // Center map on position
                if (mapInstance.current) {
                  mapInstance.current.setCenter(pos);
                }

                // Callback with position data
                if (onLocationUpdate) {
                  onLocationUpdate(position);
                }
              },
              (error) => {
                console.error('Error getting location:', error);
                setError('Unable to retrieve your location. Please ensure location services are enabled.');
              },
              {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
              }
            );
          } else {
            setError('Geolocation is not supported by your browser.');
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Clean up
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [onLocationUpdate, onMapLoad]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-4 z-10">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {!isLoading && !error && (
        <button
          onClick={centerOnMe}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 z-10"
          aria-label="Center on my location"
        >
          <LocateFixed className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
