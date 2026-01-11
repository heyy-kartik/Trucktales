"use client";

import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { PODCapture } from "@/components/pod/PODCapture";
import { PODList } from "@/components/pod/PODList";
import { PODStats } from "@/components/pod/PODStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, List, BarChart3, Shield } from "lucide-react";

export default function PODPage() {
  const [activeTab, setActiveTab] = useState("capture");

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-mono mb-4">
            Proof of Delivery
          </h1>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
            POD → UPI in 60 Seconds. Blockchain-verified, AI-powered delivery
            confirmation with instant payments.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4 text-center">
            <Camera className="h-8 w-8 mx-auto mb-2 text-[#FF6B2C]" />
            <h3 className="font-semibold font-mono">Capture</h3>
            <p className="text-sm text-muted-foreground">Take POD photo</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-[#FF6B2C]" />
            <h3 className="font-semibold font-mono">AI Verify</h3>
            <p className="text-sm text-muted-foreground">Gemini Vision check</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <svg
              className="h-8 w-8 mx-auto mb-2 text-[#FF6B2C]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h3 className="font-semibold font-mono">Blockchain</h3>
            <p className="text-sm text-muted-foreground">Polygon registry</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <svg
              className="h-8 w-8 mx-auto mb-2 text-[#FF6B2C]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M12 12h.01M8 12h.01M16 12h.01" />
            </svg>
            <h3 className="font-semibold font-mono">UPI Payment</h3>
            <p className="text-sm text-muted-foreground">60s settlement</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="capture" className="font-mono">
              <Camera className="h-4 w-4 mr-2" />
              Capture POD
            </TabsTrigger>
            <TabsTrigger value="list" className="font-mono">
              <List className="h-4 w-4 mr-2" />
              POD Registry
            </TabsTrigger>
            <TabsTrigger value="stats" className="font-mono">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture">
            <PODCapture />
          </TabsContent>

          <TabsContent value="list">
            <PODList />
          </TabsContent>

          <TabsContent value="stats">
            <PODStats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
