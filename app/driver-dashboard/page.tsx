"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { DriverLayout } from "@/components/driver/DriverLayout";
import { DriverStatusToggle } from "@/components/driver/DriverStatusToggle";
import { RequestCard } from "@/components/driver/RequestCard";
import { ActiveTripPanel } from "@/components/driver/ActiveTripPanel";
import { QuickStats } from "@/components/driver/QuickStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Send,
  AlertCircle,
  MapPin,
  Radio,
  RefreshCw,
  Map,
  Truck,
  Package,
  Clock,
  IndianRupee,
  Navigation,
  AlertTriangle,
  CloudRain,
  Construction,
  Car,
} from "lucide-react";

// Dynamic import for Leaflet map to avoid SSR issues
const IncidentMapDynamic = dynamic(
  () => import("@/components/IncidentMap").then((mod) => mod.IncidentMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <Map className="h-12 w-12 text-gray-400" />
      </div>
    ),
  }
);

// Speech Recognition Types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
}

// Indian Languages for voice input
const LANGUAGES = [
  { code: "hi-IN", name: "Hindi (हिंदी)", flag: "🇮🇳" },
  { code: "en-IN", name: "English (India)", flag: "🇬🇧" },
  { code: "ta-IN", name: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "mr-IN", name: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali (বাংলা)", flag: "🇮🇳" },
  { code: "gu-IN", name: "Gujarati (ગુજરાતી)", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada (ಕನ್ನಡ)", flag: "🇮🇳" },
  { code: "ml-IN", name: "Malayalam (മലയാളം)", flag: "🇮🇳" },
  { code: "pa-IN", name: "Punjabi (ਪੰਜਾਬੀ)", flag: "🇮🇳" },
];

interface Tale {
  id: string;
  text: string;
  driverName: string;
  location?: string;
  issue?: string;
  severity: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

// Mock requests
const mockRequests = [
  {
    id: "req1",
    pickupLocation: "Sector 18, Noida",
    dropLocation: "Connaught Place, Delhi",
    distance: 25.5,
    estimatedTime: "1h 15m",
    loadType: "General Cargo",
    weight: 500,
    fare: 1500,
  },
  {
    id: "req2",
    pickupLocation: "Gurugram Sector 14",
    dropLocation: "Nehru Place, Delhi",
    distance: 18.2,
    estimatedTime: "50m",
    loadType: "Electronics",
    weight: 300,
    fare: 1200,
  },
  {
    id: "req3",
    pickupLocation: "Faridabad",
    dropLocation: "Rajouri Garden, Delhi",
    distance: 32.7,
    estimatedTime: "1h 30m",
    loadType: "Furniture",
    weight: 750,
    fare: 2000,
  },
];

const mockActiveTrip = {
  pickupLocation: "Sector 18, Noida",
  dropLocation: "Connaught Place, Delhi",
  currentStep: 2,
};

// Severity badge styling
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-500 text-white";
    case "high":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-yellow-500 text-black";
    default:
      return "bg-green-500 text-white";
  }
};

const getIssueIcon = (issue?: string) => {
  if (!issue) return <AlertCircle className="h-4 w-4" />;
  const lowerIssue = issue.toLowerCase();
  if (lowerIssue.includes("traffic")) return <Car className="h-4 w-4" />;
  if (lowerIssue.includes("rain") || lowerIssue.includes("weather"))
    return <CloudRain className="h-4 w-4" />;
  if (lowerIssue.includes("construction") || lowerIssue.includes("road"))
    return <Construction className="h-4 w-4" />;
  if (lowerIssue.includes("accident"))
    return <AlertTriangle className="h-4 w-4" />;
  return <AlertCircle className="h-4 w-4" />;
};

export default function DriverDashboardPage() {
  const { toast } = useToast();

  // Navigation & Status
  const [activeTab, setActiveTab] = useState<"requests" | "active">("requests");
  const [, setStatus] = useState<"available" | "on_trip" | "offline">(
    "offline"
  );

  // Voice Recording
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hi-IN");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Tales & Incidents
  const [incidents, setIncidents] = useState<Tale[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Fetch tales from API
  const fetchTales = useCallback(async () => {
    try {
      const incidentsRes = await fetch("/api/tales?type=incidents&limit=10");

      if (incidentsRes.ok) {
        const incidentsData = await incidentsRes.json();
        setIncidents(Array.isArray(incidentsData) ? incidentsData : []);
      }
    } catch (error) {
      console.error("Error fetching tales:", error);
    }
  }, []);

  // Auto-refresh tales
  useEffect(() => {
    fetchTales();
    const interval = setInterval(fetchTales, 5000);
    return () => clearInterval(interval);
  }, [fetchTales]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI =
        (
          window as Window & {
            SpeechRecognition?: new () => SpeechRecognition;
            webkitSpeechRecognition?: new () => SpeechRecognition;
          }
        ).SpeechRecognition ||
        (
          window as Window & {
            SpeechRecognition?: new () => SpeechRecognition;
            webkitSpeechRecognition?: new () => SpeechRecognition;
          }
        ).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        setVoiceSupported(true);

        // Only create new recognition if not already created
        if (!recognitionRef.current) {
          const recognition = new SpeechRecognitionAPI() as SpeechRecognition;

          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = selectedLanguage;

          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => setIsListening(false);
          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setIsListening(false);
            // Only show error toast for actual errors, not aborted
            if (event.error !== "aborted" && event.error !== "no-speech") {
              toast({
                title: "Voice Error",
                description: event.error,
                variant: "destructive",
              });
            }
          };

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = "";
            let final = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptPart = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                final += transcriptPart + " ";
              } else {
                interim += transcriptPart;
              }
            }

            if (final) setTranscript((prev) => prev + final);
            setInterimTranscript(interim);
          };

          recognitionRef.current = recognition;
        }
      }
    }

    return () => {
      // Don't abort on cleanup - let it continue
    };
  }, []); // Empty deps - only run once on mount

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      // If currently listening, stop first, update lang, then optionally restart
      const wasListening = isListening;
      if (wasListening) {
        recognitionRef.current.stop();
      }
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage, isListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Reset transcript when starting fresh
        setInterimTranscript("");
        recognitionRef.current.start();
      } catch (error: unknown) {
        // Handle "already started" error gracefully
        if (
          error instanceof Error &&
          error.message.includes("already started")
        ) {
          console.log("Recognition already running");
        } else {
          console.error("Error starting recognition:", error);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  const sendVoiceTale = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Message",
        description: "Please record something before sending",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/process-tale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript,
          language: selectedLanguage,
          driverId: "driver_123",
          truckId: "truck_456",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Tale Sent! 📡",
          description: "Your update has been broadcast to the community",
        });
        setTranscript("");
        setInterimTranscript("");
        await fetchTales();
      } else {
        throw new Error(data.error || "Failed to send tale");
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Could not send your update. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log("Accepted request:", requestId);
    setActiveTab("active");
    setStatus("on_trip");
    toast({
      title: "Request Accepted",
      description: "Navigate to pickup location",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    console.log("Rejected request:", requestId);
  };

  const handleTripAction = (
    action: "reached_pickup" | "start_trip" | "complete_delivery"
  ) => {
    console.log("Trip action:", action);
    toast({
      title: "Status Updated",
      description: `Trip action: ${action.replace(/_/g, " ")}`,
    });
  };

  return (
    <DriverLayout>
      <div className="space-y-6 p-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Driver Dashboard
            </h1>
            <p className="text-gray-600">
              Record voice updates • View live incidents
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTales}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Badge variant="outline" className="gap-2 py-2">
              <Radio className="h-4 w-4 animate-pulse text-green-500" />
              Live Feed
            </Badge>
            <DriverStatusToggle />
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats
          todaysTrips={3}
          todaysEarnings={4200}
          completedTrips={127}
        />

        {/* Map Section */}
        {showMap && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Navigation className="h-5 w-5 text-blue-600" />
                Live Incident Map
              </CardTitle>
              <CardDescription>
                Real-time incidents reported by drivers across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentMapDynamic incidents={incidents} />

              {/* Map Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span>Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Voice Recorder */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-600" />
                Voice Command Center
              </CardTitle>
              <CardDescription>
                Speak in your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Language</label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mic Button */}
              <div className="flex justify-center py-4">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  disabled={!voiceSupported}
                  className={`h-24 w-24 rounded-full transition-all ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-10 w-10" />
                  ) : (
                    <Mic className="h-10 w-10" />
                  )}
                </Button>
              </div>

              <div className="text-center">
                {isListening ? (
                  <Badge variant="destructive" className="animate-pulse">
                    🎤 Listening...
                  </Badge>
                ) : (
                  <Badge variant="secondary">Tap mic to start</Badge>
                )}
              </div>

              {/* Transcript Box */}
              <div className="min-h-[120px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Your Message:
                </p>
                {transcript && (
                  <p className="text-sm text-gray-900">{transcript}</p>
                )}
                {interimTranscript && (
                  <p className="text-sm text-gray-400 italic">
                    {interimTranscript}
                  </p>
                )}
                {!transcript && !interimTranscript && (
                  <p className="text-sm text-gray-400 italic">
                    Start speaking to see your words...
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setTranscript("");
                    setInterimTranscript("");
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={!transcript || loading}
                >
                  Clear
                </Button>
                <Button
                  onClick={sendVoiceTale}
                  className="flex-1"
                  disabled={!transcript || loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Commands */}
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-900 mb-1">
                  💡 Quick Commands:
                </p>
                <ul className="text-xs text-blue-800 space-y-0.5">
                  <li>• &quot;NH44 pe traffic hai&quot;</li>
                  <li>• &quot;Heavy traffic on highway&quot;</li>
                  <li>• &quot;Rain causing delays&quot;</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Incidents Feed */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Community Incidents
              </CardTitle>
              <CardDescription>Real-time updates from drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-3">
                  {incidents.length > 0 ? (
                    incidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                              {incident.driverName?.[0] || "D"}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {incident.driverName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  incident.timestamp
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={getSeverityColor(incident.severity)}
                          >
                            {incident.severity}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                          {incident.text}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {incident.location && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <MapPin className="h-3 w-3" />
                              {incident.location}
                            </Badge>
                          )}
                          {incident.issue && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              {getIssueIcon(incident.issue)}
                              {incident.issue}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Radio className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No community incidents yet</p>
                      <p className="text-xs">Be the first to report!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Requests / Active Trip */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "requests" | "active")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requests">
                    Requests ({mockRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="active">Active Trip</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {activeTab === "requests" ? (
                <ScrollArea className="h-[400px] pr-2">
                  <div className="space-y-3">
                    {mockRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        id={request.id}
                        pickupLocation={request.pickupLocation}
                        dropLocation={request.dropLocation}
                        distance={request.distance}
                        estimatedTime={request.estimatedTime}
                        loadType={request.loadType}
                        weight={request.weight}
                        fare={request.fare}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <ActiveTripPanel
                  pickupLocation={mockActiveTrip.pickupLocation}
                  dropLocation={mockActiveTrip.dropLocation}
                  currentStep={mockActiveTrip.currentStep}
                  onAction={handleTripAction}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-xs">Start Shift</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-xs">New Load</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-xs">Take Break</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <IndianRupee className="h-5 w-5 text-purple-600" />
                <span className="text-xs">Earnings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  );
}
