"use client";

import { useState, useMemo } from "react";

import MapboxDashboard from "@/components/MapboxDashboard";
import IncidentsList from "@/components/IncidentsList";
import Analytics from "@/components/Analytics";
import { NavigationBar } from "@/components/NavigationBar";

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
  const [selectedSeverity, setSelectedSeverity] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  // Filter incidents based on selected filters
  const incidents = useMemo(() => {
    return mockIncidents.filter((incident) => {
      if (selectedSeverity && incident.severity !== selectedSeverity)
        return false;
      if (selectedStatus && incident.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedSeverity, selectedStatus]);

  const trucks = mockTrucks;

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map View - takes most of the space */}
          <div className="lg:col-span-2">
            <MapboxDashboard incidents={incidents} trucks={trucks} />
          </div>

          {/* Sidebar with filters + analytics + list */}
          <div className="space-y-6">
            {/* Analytics Card */}
            <Analytics incidents={incidents} trucks={trucks} />

            {/* Filters Card */}
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>
              <div className="space-y-4">
                {/* Severity Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Severity
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedSeverity ?? ""}
                    onChange={(e) =>
                      setSelectedSeverity(e.target.value || undefined)
                    }
                  >
                    <option value="">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedStatus ?? ""}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value || undefined)
                    }
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Incidents List */}
            <IncidentsList incidents={incidents} />
          </div>
        </div>
      </main>
    </div>
  );
}
