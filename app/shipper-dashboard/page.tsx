"use client";

import { useState, useMemo } from "react";

import ShipperFleetMap from "@/components/ShipperFleetMap";
import IncidentsList from "@/components/IncidentsList";
import Analytics from "@/components/Analytics";
import { NavigationBar } from "@/components/NavigationBar";
import { Filter } from "lucide-react";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";

// Mock data for incidents
const mockIncidents = [
  {
    _id: "1",
    highway: "NH-48",
    kilometer: 125,
    issue: "Pothole reported on left lane",
    severity: "medium",
    latitude: 28.4595,
    longitude: 77.0266,
    reportedAt: Date.now() - 3600000,
    status: "open",
  },
  {
    _id: "2",
    highway: "NH-44",
    kilometer: 340,
    issue: "Accident - two vehicles involved",
    severity: "high",
    latitude: 28.6139,
    longitude: 77.209,
    reportedAt: Date.now() - 1800000,
    status: "in-progress",
  },
  {
    _id: "3",
    highway: "NH-48",
    kilometer: 89,
    issue: "Road debris on highway",
    severity: "low",
    latitude: 28.5355,
    longitude: 77.391,
    reportedAt: Date.now() - 7200000,
    status: "resolved",
  },
  {
    _id: "4",
    highway: "NH-19",
    kilometer: 200,
    issue: "Heavy traffic congestion",
    severity: "medium",
    latitude: 28.7041,
    longitude: 77.1025,
    reportedAt: Date.now() - 900000,
    status: "open",
  },
];

// Mock data for trucks
const mockTrucks = [
  {
    _id: "t1",
    truckId: "TRK-001",
    driverName: "Rajesh Kumar",
    phoneNumber: "+91-9876543210",
    currentHighway: "NH-48",
    currentKilometer: 120,
    latitude: 28.4595,
    longitude: 77.0266,
    status: "active",
    lastUpdated: Date.now(),
  },
  {
    _id: "t2",
    truckId: "TRK-002",
    driverName: "Amit Singh",
    phoneNumber: "+91-9876543211",
    currentHighway: "NH-44",
    currentKilometer: 335,
    latitude: 28.6139,
    longitude: 77.209,
    status: "active",
    lastUpdated: Date.now(),
  },
  {
    _id: "t3",
    truckId: "TRK-003",
    driverName: "Suresh Patel",
    phoneNumber: "+91-9876543212",
    currentHighway: "NH-19",
    currentKilometer: 195,
    latitude: 28.7041,
    longitude: 77.1025,
    status: "idle",
    lastUpdated: Date.now() - 600000,
  },
];

export default function DashboardPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'analytics'>('overview');

  const incidents = useMemo(() => {
    return mockIncidents.filter((incident) => {
      const severityMatch = !selectedSeverity || incident.severity === selectedSeverity;
      const statusMatch = !selectedStatus || incident.status === selectedStatus;
      return severityMatch && statusMatch;
    });
  }, [selectedSeverity, selectedStatus]);

  const trucks = mockTrucks;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipper Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your fleet and shipments in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <ClerkLoaded>
              <UserButton />
            </ClerkLoaded>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'shipments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Shipments
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Map</h2>
              <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                <ShipperFleetMap trucks={trucks} incidents={incidents} />
              </div>
            </div>

            {/* Incidents Sidebar */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Incidents</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                <IncidentsList incidents={incidents} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Shipments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Truck ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trucks.map((truck) => (
                    <tr key={truck._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {truck.truckId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {truck.driverName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {truck.currentHighway} - KM {truck.currentKilometer}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            truck.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {truck.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(truck.lastUpdated).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <Analytics incidents={incidents} trucks={trucks} />
          </div>
        )}
      </div>
    </div>
  );
}