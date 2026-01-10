"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Incident {
  _id: string;
  highway: string;
  kilometer: number;
  issue: string;
  severity: string;
  status: string;
  reportedAt: number;
  eta?: string;
}

interface Props {
  incidents: Incident[];
}

export default function IncidentsList({ incidents }: Props) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "secondary",
      medium: "outline",
      high: "destructive",
    };
    return colors[severity as keyof typeof colors] || "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {incidents.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No incidents to display
            </p>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident._id}
                className="rounded-lg border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">
                      {incident.highway} KM {incident.kilometer}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(incident.reportedAt)}
                    </p>
                  </div>
                  <Badge variant={getSeverityColor(incident.severity) as any}>
                    {incident.severity}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{incident.issue}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Status: {incident.status}
                  </span>
                  {incident.eta && (
                    <span className="text-muted-foreground">ETA: {incident.eta}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
