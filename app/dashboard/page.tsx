"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MapboxDashboard from "@/components/MapboxDashboard";
import IncidentsList from "@/components/IncidentsList";
import Analytics from "@/components/Analytics";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const incidents = useQuery(api.incidents.getIncidents, {
    severity: selectedSeverity,
    status: selectedStatus,
  });

  const trucks = useQuery(api.incidents.getTrucks, {});

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Highway Monitoring System</h1>
          <p className="text-muted-foreground">Real-time incident tracking and truck monitoring</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map View */}
          <div className="lg:col-span-2">
            <MapboxDashboard
              incidents={incidents || []}
              trucks={trucks || []}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics */}
            <Analytics incidents={incidents || []} trucks={trucks || []} />

            {/* Filters */}
            <div className="rounded-lg border bg-card p-4">
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Severity</label>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={selectedSeverity || ""}
                    onChange={(e) => setSelectedSeverity(e.target.value || undefined)}
                  >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Status</label>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={selectedStatus || ""}
                    onChange={(e) => setSelectedStatus(e.target.value || undefined)}
                  >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Incidents List */}
            <IncidentsList incidents={incidents || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
