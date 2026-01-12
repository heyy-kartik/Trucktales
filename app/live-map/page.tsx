"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  Mic,
  AlertTriangle,
  Cloud,
  Construction,
  Filter,
  Layers,
  Navigation,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Types
interface TruckData {
  _id: string;
  truckId: string;
  driverId: string;
  driverName: string;
  driverPhoto?: string;
  driverPhone?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  status: "available" | "on_trip" | "offline" | "delayed";
  isOnTime: boolean;
  currentShipmentId?: string;
  origin?: string;
  destination?: string;
  eta?: string;
  etaMinutes?: number;
  routeCoordinates?: number[][];
  shipperId?: string;
  shipperName?: string;
  lastUpdate: number;
}

interface VoiceTale {
  _id: string;
  taleId: string;
  truckId: string;
  driverId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  transcription: string;
  summary?: string;
  category:
    | "traffic"
    | "weather"
    | "road_condition"
    | "incident"
    | "checkpoint"
    | "general";
  severity: "low" | "medium" | "high";
  audioUrl?: string;
  duration?: number;
  isActive: boolean;
  createdAt: number;
}

interface CongestionZone {
  _id: string;
  zoneId: string;
  latitude: number;
  longitude: number;
  radius: number;
  intensity: number;
  cause: "traffic" | "accident" | "construction" | "event" | "weather";
  description?: string;
  isActive: boolean;
}

interface Shipper {
  id: string;
  name: string;
}

// Mock data for demo (will be replaced by Convex data when available)
const mockTrucks: TruckData[] = [
  {
    _id: "1",
    truckId: "TRK-001",
    driverId: "DRV-001",
    driverName: "Rajesh Kumar",
    driverPhoto: "/avatars/driver1.jpg",
    driverPhone: "+91 98765 43210",
    latitude: 28.6139,
    longitude: 77.209,
    heading: 45,
    speed: 65,
    status: "on_trip",
    isOnTime: true,
    currentShipmentId: "SHP-001",
    origin: "Delhi",
    destination: "Mumbai",
    eta: "2026-01-11T18:30:00Z",
    etaMinutes: 420,
    routeCoordinates: [
      [77.209, 28.6139],
      [77.1, 28.5],
      [76.8, 27.8],
      [76.5, 26.9],
      [75.8, 25.4],
      [73.8, 22.7],
      [72.8777, 19.076],
    ],
    shipperId: "SHP-101",
    shipperName: "Tata Motors",
    lastUpdate: Date.now(),
  },
  {
    _id: "2",
    truckId: "TRK-002",
    driverId: "DRV-002",
    driverName: "Suresh Patel",
    driverPhoto: "/avatars/driver2.jpg",
    driverPhone: "+91 98765 43211",
    latitude: 19.076,
    longitude: 72.8777,
    heading: 90,
    speed: 45,
    status: "delayed",
    isOnTime: false,
    currentShipmentId: "SHP-002",
    origin: "Mumbai",
    destination: "Bangalore",
    eta: "2026-01-12T10:00:00Z",
    etaMinutes: 840,
    shipperId: "SHP-102",
    shipperName: "Reliance Industries",
    lastUpdate: Date.now() - 120000,
  },
  {
    _id: "3",
    truckId: "TRK-003",
    driverId: "DRV-003",
    driverName: "Amit Singh",
    latitude: 12.9716,
    longitude: 77.5946,
    status: "available",
    isOnTime: true,
    shipperId: "SHP-101",
    shipperName: "Tata Motors",
    lastUpdate: Date.now(),
  },
  {
    _id: "4",
    truckId: "TRK-004",
    driverId: "DRV-004",
    driverName: "Vijay Sharma",
    latitude: 22.5726,
    longitude: 88.3639,
    status: "on_trip",
    isOnTime: true,
    origin: "Kolkata",
    destination: "Chennai",
    etaMinutes: 960,
    shipperId: "SHP-103",
    shipperName: "Flipkart",
    lastUpdate: Date.now(),
  },
  {
    _id: "5",
    truckId: "TRK-005",
    driverId: "DRV-005",
    driverName: "Mohan Das",
    latitude: 17.385,
    longitude: 78.4867,
    status: "offline",
    isOnTime: true,
    lastUpdate: Date.now() - 3600000,
  },
];

const mockTales: VoiceTale[] = [
  {
    _id: "t1",
    taleId: "TALE-001",
    truckId: "TRK-001",
    driverId: "DRV-001",
    driverName: "Rajesh Kumar",
    latitude: 28.5,
    longitude: 77.1,
    locationName: "NH-48, Gurugram",
    transcription: "Heavy traffic near toll plaza. Expect 30 minute delay.",
    summary: "Traffic jam at toll",
    category: "traffic",
    severity: "medium",
    isActive: true,
    createdAt: Date.now() - 1800000,
  },
  {
    _id: "t2",
    taleId: "TALE-002",
    truckId: "TRK-002",
    driverId: "DRV-002",
    driverName: "Suresh Patel",
    latitude: 18.5,
    longitude: 73.8,
    locationName: "Mumbai-Pune Expressway",
    transcription:
      "Road construction ahead. Single lane operation for next 5 km.",
    summary: "Construction zone",
    category: "road_condition",
    severity: "high",
    isActive: true,
    createdAt: Date.now() - 900000,
  },
  {
    _id: "t3",
    taleId: "TALE-003",
    truckId: "TRK-004",
    driverId: "DRV-004",
    driverName: "Vijay Sharma",
    latitude: 22.0,
    longitude: 87.5,
    locationName: "NH-16, Odisha",
    transcription: "Light rain started. Road is slippery. Reducing speed.",
    summary: "Rainy conditions",
    category: "weather",
    severity: "low",
    isActive: true,
    createdAt: Date.now() - 600000,
  },
];

const mockCongestion: CongestionZone[] = [
  {
    _id: "c1",
    zoneId: "ZONE-001",
    latitude: 28.55,
    longitude: 77.15,
    radius: 2000,
    intensity: 0.8,
    cause: "traffic",
    description: "Rush hour congestion",
    isActive: true,
  },
  {
    _id: "c2",
    zoneId: "ZONE-002",
    latitude: 19.1,
    longitude: 72.9,
    radius: 1500,
    intensity: 0.6,
    cause: "accident",
    description: "Minor accident",
    isActive: true,
  },
  {
    _id: "c3",
    zoneId: "ZONE-003",
    latitude: 18.6,
    longitude: 73.85,
    radius: 3000,
    intensity: 0.9,
    cause: "construction",
    description: "Road widening work",
    isActive: true,
  },
];

const mockShippers: Shipper[] = [
  { id: "SHP-101", name: "Tata Motors" },
  { id: "SHP-102", name: "Reliance Industries" },
  { id: "SHP-103", name: "Flipkart" },
  { id: "SHP-104", name: "Amazon India" },
];

export default function LiveMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const talePopupsRef = useRef<Map<string, mapboxgl.Popup>>(new Map());

  // Use mock data (replace with Convex queries when configured)
  const trucks = mockTrucks;
  const tales = mockTales;
  const congestionZones = mockCongestion;
  const shippers = mockShippers;

  // State
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("trucks");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shipperFilter, setShipperFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  // Map layers
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showTales, setShowTales] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  // Filtered trucks
  const filteredTrucks = trucks.filter((truck) => {
    if (statusFilter !== "all" && truck.status !== statusFilter) return false;
    if (shipperFilter !== "all" && truck.shipperId !== shipperFilter)
      return false;
    return true;
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [78.9629, 20.5937], // Center of India
      zoom: 4.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    map.current.on("load", () => {
      // Add heatmap source
      map.current!.addSource("congestion-heat", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Add heatmap layer
      map.current!.addLayer({
        id: "congestion-heatmap",
        type: "heatmap",
        source: "congestion-heat",
        paint: {
          "heatmap-weight": ["get", "intensity"],
          "heatmap-intensity": 1,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.2,
            "rgba(255,255,0,0.3)",
            0.4,
            "rgba(255,165,0,0.5)",
            0.6,
            "rgba(255,69,0,0.7)",
            0.8,
            "rgba(255,0,0,0.8)",
            1,
            "rgba(139,0,0,0.9)",
          ],
          "heatmap-radius": 50,
          "heatmap-opacity": 0.7,
        },
      });

      // Add route source
      map.current!.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      // Add route layer
      map.current!.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update heatmap data
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource(
      "congestion-heat"
    ) as mapboxgl.GeoJSONSource;
    if (!source) return;

    const features = congestionZones.map((zone) => ({
      type: "Feature" as const,
      properties: {
        intensity: zone.intensity,
        cause: zone.cause,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [zone.longitude, zone.latitude],
      },
    }));

    source.setData({
      type: "FeatureCollection",
      features,
    });

    // Toggle heatmap visibility
    map.current.setLayoutProperty(
      "congestion-heatmap",
      "visibility",
      showHeatmap ? "visible" : "none"
    );
  }, [congestionZones, showHeatmap]);

  // Create custom truck marker element
  const createTruckMarkerElement = useCallback((truck: TruckData) => {
    const el = document.createElement("div");
    el.className = "truck-marker";

    const color =
      truck.status === "delayed" || !truck.isOnTime
        ? "#ef4444" // red
        : truck.status === "on_trip"
          ? "#22c55e" // green
          : truck.status === "available"
            ? "#3b82f6" // blue
            : "#6b7280"; // gray for offline

    el.innerHTML = `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
        ${truck.heading ? `transform: rotate(${truck.heading}deg);` : ""}
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5">
          <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
          <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
          <path d="M5 17h-2v-4m-1 -8h11v12h-9"/>
          <path d="M9 17l6 0"/>
          <path d="M13 6h5l3 5v6h-2"/>
        </svg>
      </div>
    `;

    el.addEventListener("mouseenter", () => {
      el.style.transform = "scale(1.2)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "scale(1)";
    });

    return el;
  }, []);

  // Update truck markers
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers not in current trucks
    markersRef.current.forEach((marker, truckId) => {
      if (!filteredTrucks.find((t) => t.truckId === truckId)) {
        marker.remove();
        markersRef.current.delete(truckId);
      }
    });

    // Add/update markers
    filteredTrucks.forEach((truck) => {
      const existingMarker = markersRef.current.get(truck.truckId);

      if (existingMarker) {
        existingMarker.setLngLat([truck.longitude, truck.latitude]);
      } else {
        const el = createTruckMarkerElement(truck);
        const marker = new mapboxgl.Marker(el)
          .setLngLat([truck.longitude, truck.latitude])
          .addTo(map.current!);

        el.addEventListener("click", () => {
          setSelectedTruck(truck);
          setSidebarOpen(true);

          // Show route if available
          if (truck.routeCoordinates && showRoutes) {
            const source = map.current!.getSource(
              "route"
            ) as mapboxgl.GeoJSONSource;
            if (source) {
              source.setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: truck.routeCoordinates,
                },
              });
            }
          }

          // Fly to truck
          map.current?.flyTo({
            center: [truck.longitude, truck.latitude],
            zoom: 10,
            duration: 1000,
          });
        });

        markersRef.current.set(truck.truckId, marker);
      }
    });
  }, [filteredTrucks, createTruckMarkerElement, showRoutes]);

  // Create tale popup element
  const createTalePopupElement = useCallback((tale: VoiceTale) => {
    const severityColors = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#22c55e",
    };

    const categoryIcons = {
      traffic: "🚗",
      weather: "🌧️",
      road_condition: "🚧",
      incident: "⚠️",
      checkpoint: "🛃",
      general: "📢",
    };

    return `
      <div class="tale-popup" style="
        background: #1f2937;
        color: white;
        padding: 12px;
        border-radius: 8px;
        max-width: 250px;
        border-left: 4px solid ${severityColors[tale.severity]};
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">${categoryIcons[tale.category]}</span>
          <span style="font-weight: 600;">${tale.driverName}</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #d1d5db;">
          ${tale.summary || tale.transcription.slice(0, 100)}...
        </p>
        <div style="margin-top: 8px; font-size: 11px; color: #9ca3af;">
          ${new Date(tale.createdAt).toLocaleTimeString()}
          ${tale.locationName ? ` • ${tale.locationName}` : ""}
        </div>
      </div>
    `;
  }, []);

  // Update tale popups with animation
  useEffect(() => {
    if (!map.current || !showTales) {
      // Remove all tale popups if tales are hidden
      talePopupsRef.current.forEach((popup) => popup.remove());
      talePopupsRef.current.clear();
      return;
    }

    // Remove old popups
    talePopupsRef.current.forEach((popup, taleId) => {
      if (!tales.find((t) => t.taleId === taleId)) {
        popup.remove();
        talePopupsRef.current.delete(taleId);
      }
    });

    // Add new popups with animation
    tales.forEach((tale) => {
      if (!talePopupsRef.current.has(tale.taleId)) {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: "bottom",
          offset: 20,
          className: "tale-popup-container animate-bounce-in",
        })
          .setLngLat([tale.longitude, tale.latitude])
          .setHTML(createTalePopupElement(tale))
          .addTo(map.current!);

        talePopupsRef.current.set(tale.taleId, popup);

        // Auto-hide after 10 seconds for new tales
        const age = Date.now() - tale.createdAt;
        if (age < 60000) {
          // Less than 1 minute old
          setTimeout(() => {
            popup.remove();
            talePopupsRef.current.delete(tale.taleId);
          }, 10000);
        }
      }
    });
  }, [tales, showTales, createTalePopupElement]);

  // Clear route when deselecting truck
  const clearRoute = useCallback(() => {
    if (!map.current) return;
    const source = map.current.getSource("route") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      });
    }
  }, []);

  // Format ETA
  const formatETA = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_trip":
        return "bg-green-500";
      case "available":
        return "bg-blue-500";
      case "delayed":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "traffic":
        return <Truck className="h-4 w-4" />;
      case "weather":
        return <Cloud className="h-4 w-4" />;
      case "road_condition":
        return <Construction className="h-4 w-4" />;
      case "incident":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Mic className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on_trip">On Trip</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              <Select value={shipperFilter} onValueChange={setShipperFilter}>
                <SelectTrigger className="w-[150px] h-8">
                  <SelectValue placeholder="Shipper" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shippers</SelectItem>
                  {shippers.map((shipper) => (
                    <SelectItem key={shipper.id} value={shipper.id}>
                      {shipper.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Layer Controls */}
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Button
                variant={showHeatmap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                <Layers className="h-4 w-4 mr-1" />
                Heatmap
              </Button>
              <Button
                variant={showTales ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTales(!showTales)}
              >
                <Mic className="h-4 w-4 mr-1" />
                Tales
              </Button>
              <Button
                variant={showRoutes ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRoutes(!showRoutes)}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Routes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Card */}
      <div className="absolute top-4 right-16 z-10">
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{filteredTrucks.length}</div>
                <div className="text-muted-foreground text-xs">Trucks</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="font-bold text-lg text-green-500">
                  {filteredTrucks.filter((t) => t.status === "on_trip").length}
                </div>
                <div className="text-muted-foreground text-xs">On Trip</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="font-bold text-lg text-red-500">
                  {filteredTrucks.filter((t) => t.status === "delayed").length}
                </div>
                <div className="text-muted-foreground text-xs">Delayed</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="font-bold text-lg text-amber-500">
                  {tales.length}
                </div>
                <div className="text-muted-foreground text-xs">
                  Active Tales
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {selectedTruck ? "Truck Details" : "Live Tracking"}
            </SheetTitle>
          </SheetHeader>

          {selectedTruck ? (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTruck(null);
                  clearRoute();
                }}
                className="mb-4"
              >
                <X className="h-4 w-4 mr-1" />
                Back to list
              </Button>

              {/* Driver Info */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTruck.driverPhoto} />
                  <AvatarFallback>
                    {selectedTruck.driverName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedTruck.driverName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTruck.truckId}
                  </p>
                  <Badge
                    className={cn("mt-1", getStatusColor(selectedTruck.status))}
                  >
                    {selectedTruck.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>

              {selectedTruck.driverPhone && (
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTruck.driverPhone}</span>
                </div>
              )}

              {/* Trip Info */}
              {selectedTruck.origin && (
                <Card className="mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Trip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Origin
                          </p>
                          <p className="font-medium">{selectedTruck.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Destination
                          </p>
                          <p className="font-medium">
                            {selectedTruck.destination}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">ETA</span>
                        </div>
                        <span
                          className={cn(
                            "font-semibold",
                            selectedTruck.isOnTime
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {formatETA(selectedTruck.etaMinutes)}
                        </span>
                      </div>
                      {selectedTruck.speed && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Speed
                          </span>
                          <span className="font-medium">
                            {selectedTruck.speed} km/h
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Latest Tale */}
              {tales.filter((t) => t.truckId === selectedTruck.truckId).length >
                0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Latest Voice Tale
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tales
                      .filter((t) => t.truckId === selectedTruck.truckId)
                      .slice(0, 1)
                      .map((tale) => (
                        <div key={tale.taleId} className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(tale.category)}
                            <Badge variant="outline">{tale.category}</Badge>
                            <Badge
                              variant={
                                tale.severity === "high"
                                  ? "destructive"
                                  : tale.severity === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {tale.severity}
                            </Badge>
                          </div>
                          <p className="text-sm">{tale.transcription}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tale.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trucks">Trucks</TabsTrigger>
                <TabsTrigger value="tales">Tales</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
              </TabsList>

              <TabsContent value="trucks">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2 pr-4">
                    {filteredTrucks.map((truck) => (
                      <Card
                        key={truck.truckId}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          setSelectedTruck(truck);
                          if (truck.routeCoordinates && showRoutes) {
                            const source = map.current?.getSource(
                              "route"
                            ) as mapboxgl.GeoJSONSource;
                            if (source) {
                              source.setData({
                                type: "Feature",
                                properties: {},
                                geometry: {
                                  type: "LineString",
                                  coordinates: truck.routeCoordinates,
                                },
                              });
                            }
                          }
                          map.current?.flyTo({
                            center: [truck.longitude, truck.latitude],
                            zoom: 10,
                          });
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full",
                                  getStatusColor(truck.status)
                                )}
                              />
                              <div>
                                <p className="font-medium">
                                  {truck.driverName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {truck.truckId}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {truck.destination && (
                                <p className="text-sm">→ {truck.destination}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                ETA: {formatETA(truck.etaMinutes)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="tales">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2 pr-4">
                    {tales.map((tale) => (
                      <Card
                        key={tale.taleId}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          map.current?.flyTo({
                            center: [tale.longitude, tale.latitude],
                            zoom: 12,
                          });
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            {getCategoryIcon(tale.category)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {tale.driverName}
                                </span>
                                <Badge
                                  variant={
                                    tale.severity === "high"
                                      ? "destructive"
                                      : tale.severity === "medium"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {tale.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {tale.summary || tale.transcription}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(tale.createdAt).toLocaleTimeString()}
                                {tale.locationName && ` • ${tale.locationName}`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="filters">
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          From
                        </Label>
                        <Input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              start: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          To
                        </Label>
                        <Input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            setDateRange({ ...dateRange, end: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-2 block">Quick Filters</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusFilter("delayed")}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                        Delayed Only
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusFilter("on_trip")}
                      >
                        <Truck className="h-4 w-4 mr-1 text-green-500" />
                        Active Trips
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setStatusFilter("all");
                          setShipperFilter("all");
                          setDateRange({ start: "", end: "" });
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      {/* CSS for animations */}
      <style jsx global>{`
        .tale-popup-container .mapboxgl-popup-content {
          background: transparent;
          padding: 0;
          box-shadow: none;
        }

        .tale-popup-container .mapboxgl-popup-tip {
          display: none;
        }

        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .truck-marker {
          z-index: 1;
        }

        .truck-marker:hover {
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
