"use client";

import { useState, useMemo } from "react";

import MapboxDashboard from "@/components/MapboxDashboard";
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

  const incidents = useMemo(() => {
    return mockIncidents.filter((incident) => {
      const severityMatch = !selectedSeverity || incident.severity === selectedSeverity;
      const statusMatch = !selectedStatus || incident.status === selectedStatus;
      return severityMatch && statusMatch;
    });
  }, [selectedSeverity, selectedStatus]);

  const trucks = mockTrucks;

  return (
    <div>
      shipeer huu me re sasta saa 
    </div>
  );
}
