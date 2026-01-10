"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, Truck, CheckCircle2 } from "lucide-react";

interface Incident {
  _id: string;
  severity: string;
  status: string;
}

interface Truck {
  _id: string;
  status: string;
}

interface Props {
  incidents: Incident[];
  trucks: Truck[];
}

export default function Analytics({ incidents, trucks }: Props) {
  const stats = {
    totalIncidents: incidents.length,
    openIncidents: incidents.filter((i) => i.status === "open").length,
    highSeverity: incidents.filter((i) => i.severity === "high").length,
    activeTrucks: trucks.filter((t) => t.status === "active").length,
    totalTrucks: trucks.length,
    resolvedIncidents: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Open Incidents */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Open Incidents</span>
              </div>
              <span className="text-2xl font-bold">{stats.openIncidents}</span>
            </div>

            {/* High Severity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">High Severity</span>
              </div>
              <span className="text-2xl font-bold">{stats.highSeverity}</span>
            </div>

            {/* Active Trucks */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Active Trucks</span>
              </div>
              <span className="text-2xl font-bold">
                {stats.activeTrucks}/{stats.totalTrucks}
              </span>
            </div>

            {/* Resolved */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Resolved Today</span>
              </div>
              <span className="text-2xl font-bold">{stats.resolvedIncidents}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
