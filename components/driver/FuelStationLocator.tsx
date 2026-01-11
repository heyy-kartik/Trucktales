"use client";

import { useEffect, useState } from 'react';
import { Fuel, MapPin, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FuelStation {
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

interface FuelStationLocatorProps {
  onStationSelect?: (station: FuelStation) => void;
  currentLocation?: { lat: number; lng: number };
}

export function FuelStationLocator({ onStationSelect, currentLocation }: FuelStationLocatorProps) {
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  // Mock data - in a real app, this would be an API call
  useEffect(() => {
    if (!currentLocation) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStations([
        {
          id: '1',
          name: 'Indian Oil Fuel Station',
          address: 'NH 48, Sector 32, Noida',
          distance: '2.5 km',
          price: '₹94.5/L',
          hasParking: true,
          hasRestroom: true,
          hasRestaurant: false,
          position: {
            lat: currentLocation.lat + 0.01,
            lng: currentLocation.lng + 0.01
          }
        },
        {
          id: '2',
          name: 'Bharat Petroleum',
          address: 'Sector 18, Noida',
          distance: '3.1 km',
          price: '₹94.2/L',
          hasParking: true,
          hasRestroom: true,
          hasRestaurant: true,
          position: {
            lat: currentLocation.lat + 0.008,
            lng: currentLocation.lng - 0.008
          }
        },
        {
          id: '3',
          name: 'HP Petrol Pump',
          address: 'Sector 62, Noida',
          distance: '4.7 km',
          price: '₹94.8/L',
          hasParking: true,
          hasRestroom: false,
          hasRestaurant: false,
          position: {
            lat: currentLocation.lat - 0.01,
            lng: currentLocation.lng + 0.01
          }
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, [currentLocation]);

  const handleStationSelect = (station: FuelStation) => {
    setSelectedStation(station);
    if (onStationSelect) {
      onStationSelect(station);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Finding nearby fuel stations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Fuel className="h-5 w-5 text-yellow-600" />
          Nearby Fuel Stations
        </h3>
        <span className="text-sm text-gray-500">{stations.length} found</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {stations.map((station) => (
          <Card 
            key={station.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStation?.id === station.id ? 'border-blue-500 border-2' : ''
            }`}
            onClick={() => handleStationSelect(station)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{station.name}</CardTitle>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {station.price}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{station.address}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm">
                  {station.hasParking && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Parking
                    </span>
                  )}
                  {station.hasRestroom && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Restroom
                    </span>
                  )}
                  {station.hasRestaurant && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      Restaurant
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                  {station.distance}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedStation && (
        <div className="mt-4">
          <Button className="w-full" onClick={() => {
            // In a real app, this would open navigation
            console.log('Navigating to:', selectedStation.name);
          }}>
            <MapPin className="h-4 w-4 mr-2" />
            Navigate to {selectedStation.name.split(' ')[0]}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
