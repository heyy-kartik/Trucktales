"use client";

import { useState, useMemo } from "react";
import ShipperFleetMap from "@/components/ShipperFleetMap";
import IncidentsList from "@/components/IncidentsList";
import Analytics from "@/components/Analytics";
import { NavigationBar } from "@/components/NavigationBar";
import { Filter, TrendingUp, Package, Truck, AlertTriangle } from "lucide-react";
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
  {
    _id: "t4",
    truckId: "TRK-004",
    driverName: "Vikram Sharma",
    phoneNumber: "+91-9876543213",
    currentHighway: "NH-48",
    currentKilometer: 85,
    latitude: 28.5355,
    longitude: 77.391,
    status: "active",
    lastUpdated: Date.now(),
  },
];

// Mock shipment data
const mockShipments = [
  {
    id: "SH-001",
    truckId: "TRK-001",
    origin: "Delhi",
    destination: "Mumbai",
    status: "in-transit",
    progress: 45,
    eta: "2h 30m",
    driver: "Rajesh Kumar",
  },
  {
    id: "SH-002",
    truckId: "TRK-002",
    origin: "Bangalore",
    destination: "Chennai",
    status: "in-transit",
    progress: 70,
    eta: "1h 15m",
    driver: "Amit Singh",
  },
  {
    id: "SH-003",
    truckId: "TRK-004",
    origin: "Pune",
    destination: "Hyderabad",
    status: "in-transit",
    progress: 30,
    eta: "4h 00m",
    driver: "Vikram Sharma",
  },
  {
    id: "SH-004",
    truckId: "TRK-003",
    origin: "Kolkata",
    destination: "Delhi",
    status: "idle",
    progress: 0,
    eta: "Not started",
    driver: "Suresh Patel",
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

  // Calculate stats
  const stats = {
    totalTrucks: trucks.length,
    activeTrucks: trucks.filter(t => t.status === 'active').length,
    totalShipments: mockShipments.length,
    activeIncidents: incidents.filter(i => i.status === 'open' || i.status === 'in-progress').length,
  };

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trucks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrucks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trucks</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeTrucks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShipments}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Incidents</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeIncidents}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
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
                      Shipment ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Truck ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ETA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shipment.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shipment.truckId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shipment.driver}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shipment.origin} → {shipment.destination}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${shipment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{shipment.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            shipment.status === 'in-transit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shipment.eta}
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
