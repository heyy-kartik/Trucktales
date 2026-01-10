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
<<<<<<< HEAD
=======
    <div className="min-h-screen bg-background">
      <NavigationBar />
>>>>>>> 4ee9acb01449993acc663cc372af1400db103e43
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header - Cleaner + modern */}
      <header className="border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[2fr_1fr]">
          {/* ─── Map Area ─── */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/40 bg-white dark:bg-slate-900 h-[65vh] lg:h-[80vh]">
            <MapboxDashboard incidents={incidents} trucks={trucks} />
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-6 lg:space-y-8 order-first lg:order-last">
            {/* Analytics Card */}
            <div className="rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg shadow-slate-200/20 dark:shadow-black/30 p-5 lg:p-6">
              <Analytics incidents={incidents} trucks={trucks} />
            </div>

            {/* Filters - Modern style */}
            <div className="rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg shadow-slate-200/20 dark:shadow-black/30 p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              <div className="space-y-5">
                {/* Severity */}
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-muted-foreground">
                    Severity
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["", "low", "medium", "high"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedSeverity(val || undefined)}
                        className={`
                          py-2 px-3 text-sm rounded-lg transition-all
                          border font-medium
                          ${
                            selectedSeverity === val || (!val && !selectedSeverity)
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                              : "bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600"
                          }
                        `}
                      >
                        {val ? val.charAt(0).toUpperCase() + val.slice(1) : "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["", "open", "in-progress", "resolved"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedStatus(val || undefined)}
                        className={`
                          py-2 px-2.5 text-xs sm:text-sm rounded-lg transition-all font-medium border
                          ${
                            selectedStatus === val || (!val && !selectedStatus)
                              ? "bg-violet-600 text-white border-violet-600 shadow-md"
                              : "bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600"
                          }
                        `}
                      >
                        {val === "in-progress" ? "In Progress" : val ? val.charAt(0).toUpperCase() + val.slice(1) : "All"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Incidents List */}
            <div className="rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg shadow-slate-200/20 dark:shadow-black/30 p-5 lg:p-6">
              <IncidentsList incidents={incidents} />
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}