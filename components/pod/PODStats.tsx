"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const dailyPODs = [
  { date: "Jan 5", verified: 45, rejected: 3, amount: 675000 },
  { date: "Jan 6", verified: 52, rejected: 2, amount: 780000 },
  { date: "Jan 7", verified: 38, rejected: 5, amount: 570000 },
  { date: "Jan 8", verified: 61, rejected: 1, amount: 915000 },
  { date: "Jan 9", verified: 55, rejected: 4, amount: 825000 },
  { date: "Jan 10", verified: 48, rejected: 2, amount: 720000 },
  { date: "Jan 11", verified: 23, rejected: 1, amount: 345000 },
];

const verificationBreakdown = [
  { name: "Fully Verified", value: 285, color: "#22c55e" },
  { name: "AI Verified", value: 42, color: "#3b82f6" },
  { name: "Pending", value: 18, color: "#f59e0b" },
  { name: "Rejected", value: 15, color: "#ef4444" },
];

const paymentTimes = [
  { range: "< 30s", count: 125 },
  { range: "30-60s", count: 180 },
  { range: "60-90s", count: 35 },
  { range: "> 90s", count: 20 },
];

export function PODStats() {
  const totalPODs = 360;
  const totalPayments = 4830000;
  const avgVerificationTime = 45;
  const successRate = 95.8;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Total PODs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono">{totalPODs}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-green-500" />
              Total Payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono">
              ₹{(totalPayments / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-muted-foreground">Processed via UPI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Avg. Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono">
              {avgVerificationTime}s
            </p>
            <p className="text-xs text-muted-foreground">POD to payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Success Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-mono">{successRate}%</p>
            <p className="text-xs text-muted-foreground">
              Verification success
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily PODs Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">
              Daily POD Activity
            </CardTitle>
            <CardDescription>
              Verified vs rejected PODs over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyPODs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="verified"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                    name="Verified"
                  />
                  <Area
                    type="monotone"
                    dataKey="rejected"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Rejected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Verification Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">
              Verification Status
            </CardTitle>
            <CardDescription>Breakdown by verification stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {verificationBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {verificationBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-mono font-bold ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">
              Payment Speed Distribution
            </CardTitle>
            <CardDescription>
              Time from POD capture to payment completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#FF6B2C"
                    radius={[4, 4, 0, 0]}
                    name="PODs"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Payment Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">
              Daily Payment Volume
            </CardTitle>
            <CardDescription>Total payments processed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyPODs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#FF6B2C"
                    fill="#FF6B2C"
                    fillOpacity={0.3}
                    name="Amount"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-lg">
            Blockchain Events Log
          </CardTitle>
          <CardDescription>Recent POD registrations on Polygon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                time: "2 min ago",
                event: "POD Registered",
                hash: "0x7a8b...f8c2",
                status: "success",
              },
              {
                time: "5 min ago",
                event: "Payment Triggered",
                hash: "0x3c4d...a1b2",
                status: "success",
              },
              {
                time: "8 min ago",
                event: "POD Registered",
                hash: "0x9e0f...5d6e",
                status: "success",
              },
              {
                time: "12 min ago",
                event: "Verification Failed",
                hash: "0x1a2b...c3d4",
                status: "failed",
              },
              {
                time: "15 min ago",
                event: "POD Registered",
                hash: "0x5f6a...7b8c",
                status: "success",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-muted rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full ${log.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{log.event}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {log.hash}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
