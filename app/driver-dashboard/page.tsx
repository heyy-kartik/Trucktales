"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { DriverLayout } from '@/components/driver/DriverLayout';
import { DriverStatusToggle } from '@/components/driver/DriverStatusToggle';
import { RequestCard } from '@/components/driver/RequestCard';
import { ActiveTripPanel } from '@/components/driver/ActiveTripPanel';
import { QuickStats } from '@/components/driver/QuickStats';
import { MapPin, Clock, Truck, Package, IndianRupee, LocateFixed } from 'lucide-react';
import DriverMap, { DriverMapRef } from '@/components/DriverMap';

interface RoadCondition {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  type: 'accident' | 'road_closure' | 'bad_road' | 'traffic';
  timestamp: Date;
  reportedBy: string;
}

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
  const [activeView, setActiveView] = useState<'current' | 'nextStop' | 'incidents' | 'alerts'>('current');
  const [roadConditions, setRoadConditions] = useState<RoadCondition[]>([]);
  const mapRef = useRef<DriverMapRef>(null);
  
  // Mock current location (in a real app, this would come from geolocation)
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.5355,  // Noida coordinates
    lng: 77.3910
  });
  
  // Mock next stop location
  const [nextStopLocation] = useState({
    lat: 28.6139,  // Delhi coordinates
    lng: 77.2090
  });
  
  const handleViewChange = useCallback((view: 'current' | 'nextStop' | 'incidents' | 'alerts') => {
    setActiveView(view);
    
    if (!mapRef.current) return;
    
    switch (view) {
      case 'current':
        mapRef.current.panTo(currentLocation);
        mapRef.current.setZoom(15);
        break;
      case 'nextStop':
        mapRef.current.panTo(nextStopLocation);
        mapRef.current.setZoom(15);
        break;
      case 'incidents':
        // Enable incident reporting mode
        console.log('Incident reporting mode enabled');
        break;
      case 'alerts':
        // Show all alerts
        console.log('Showing all alerts');
        break;
    }
  }, [currentLocation, nextStopLocation]);

  const handleLocationUpdate = useCallback((location: { lat: number; lng: number }) => {
    console.log('Location updated:', location);
    setCurrentLocation(location);
  }, []);

  const handleReportSubmit = useCallback((condition: Omit<RoadCondition, 'id' | 'timestamp' | 'reportedBy'>) => {
    const newCondition = {
      ...condition,
      id: Date.now().toString(),
      timestamp: new Date(),
      reportedBy: 'You',
    };
    setRoadConditions(prev => [...prev, newCondition]);
  }, []);

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
    <DriverLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <DriverStatusToggle />
        </div>

        {/* Quick Stats */}
        <QuickStats 
          todaysTrips={3}
          todaysEarnings={4200}
          completedTrips={127}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <div className="h-96 rounded-lg overflow-hidden">
              <DriverMap 
                ref={mapRef}
                activeView={activeView}
                onLocationClick={handleLocationUpdate}
                currentLocation={currentLocation}
                nextStopLocation={nextStopLocation}
                onReportSubmit={handleReportSubmit}
                roadConditions={roadConditions}
              />
            </div>
            
            {/* Trip Info */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button 
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeView === 'current' 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleViewChange('current')}
              >
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium text-gray-900 ">Sector 18, Noida</p>
              </button>
              
              <button 
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeView === 'nextStop' 
                    ? 'bg-green-100 border-2 border-green-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleViewChange('nextStop')}
              >
                <p className="text-sm text-gray-500">Next Stop</p>
                <p className="font-medium text-gray-900 ">Connaught Place, Delhi</p>
              </button>
              
              <button 
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeView === 'incidents' 
                    ? 'bg-yellow-100 border-2 border-yellow-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleViewChange('incidents')}
              >
                <p className="text-sm text-gray-500">Report Incident</p>
                <p className="font-medium text-gray-900">Click on map to report</p>
              </button>
              
              <button 
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeView === 'alerts' 
                    ? 'bg-red-100 border-2 border-red-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleViewChange('alerts')}
              >
                <p className="text-sm text-gray-500">Alerts</p>
                <p className="font-medium text-gray-900">
                  {roadConditions.length > 0 
                    ? `${roadConditions.length} active alerts` 
                    : 'No active alerts'}
                </p>
              </button>
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
      </div>
    </DriverLayout>
  );
}