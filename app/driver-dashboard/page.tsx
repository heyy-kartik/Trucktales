"use client";

"use client";

import { useState, useRef } from 'react';
import { DriverLayout } from '@/components/driver/DriverLayout';
import { DriverStatusToggle } from '@/components/driver/DriverStatusToggle';
import { RequestCard } from '@/components/driver/RequestCard';
import { ActiveTripPanel } from '@/components/driver/ActiveTripPanel';
import { QuickStats } from '@/components/driver/QuickStats';
import { RealTimeLocation } from '@/components/driver/RealTimeLocation';
import { MapPin, Clock, Truck, Package, IndianRupee, LocateFixed } from 'lucide-react';
import DriverMap from '@/components/DriverMap';
import { NavigationBar } from '@/components/NavigationBar';
import { ClerkLoaded, UserButton } from '@clerk/nextjs';

// Mock data for available requests
const mockRequests = [
  {
    id: 'req1',
    pickupLocation: 'Sector 18, Noida',
    dropLocation: 'Connaught Place, Delhi',
    distance: 25.5,
    estimatedTime: '1h 15m',
    loadType: 'General Cargo',
    weight: 500,
    fare: 1500,
  },
  {
    id: 'req2',
    pickupLocation: 'Gurugram Sector 14',
    dropLocation: 'Nehru Place, Delhi',
    distance: 18.2,
    estimatedTime: '50m',
    loadType: 'Electronics',
    weight: 300,
    fare: 1200,
  },
  {
    id: 'req3',
    pickupLocation: 'Faridabad',
    dropLocation: 'Rajouri Garden, Delhi',
    distance: 32.7,
    estimatedTime: '1h 30m',
    loadType: 'Furniture',
    weight: 750,
    fare: 2000,
  },
];

// Mock data for active trip
const mockActiveTrip = {
  pickupLocation: 'Sector 18, Noida',
  dropLocation: 'Connaught Place, Delhi',
  currentStep: 2, // 1: accepted, 2: reached pickup, 3: loaded, 4: in transit, 5: delivered
};

export default function DriverDashboardPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'active'>('requests');
  const [status, setStatus] = useState<'available' | 'on_trip' | 'offline'>('offline');
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp?: number;
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepted request:', requestId);
    setActiveTab('active');
    setStatus('on_trip');
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejected request:', requestId);
  };

  const handleTripAction = (action: 'reached_pickup' | 'start_trip' | 'complete_delivery') => {
    console.log('Trip action:', action);
    // In a real app, you would update the trip status in your state management
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <NavigationBar />

      {/* Page header */}
      <header className="border-b bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Highway Monitoring
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time incidents & fleet tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-medium">
              Live
            </div>
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats 
          todaysTrips={3}
          todaysEarnings={4200}
          completedTrips={127}
          />
        </header>
  
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <div className="h-96 rounded-lg overflow-hidden">
              <DriverMap />
            </div>
            
            {/* Trip Info */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium">Sector 18, Noida</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Next Stop</p>
                <p className="font-medium">Connaught Place, Delhi</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Distance Remaining</p>
                <p className="font-medium">18.5 km</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Estimated Time</p>
                <p className="font-medium">45 min</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Requests / Active Trip */}
          <div className="space-y-4">
            {activeTab === 'requests' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Available Requests</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {mockRequests.length} requests
                  </span>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {mockRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      id={request.id}
                      pickupLocation={request.pickupLocation}
                      dropLocation={request.dropLocation}
                      distance={request.distance}
                      estimatedTime={request.estimatedTime}
                      loadType={request.loadType}
                      weight={request.weight}
                      fare={request.fare}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <ActiveTripPanel
                pickupLocation={mockActiveTrip.pickupLocation}
                dropLocation={mockActiveTrip.dropLocation}
                currentStep={mockActiveTrip.currentStep}
                onAction={handleTripAction}
              />
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Truck className="h-5 w-5 mr-2" />
                  <span>Start Shift</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Package className="h-5 w-5 mr-2" />
                  <span>New Load</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Break</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                  <IndianRupee className="h-5 w-5 mr-2" />
                  <span>Earnings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}