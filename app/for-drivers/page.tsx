"use client";

import React, { useState } from 'react';
import { Mic, Globe, Bell, MapPin, Navigation, Users, FileCheck, UserPlus } from 'lucide-react';
import { NavigationBar } from "@/components/NavigationBar";

const DriversSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: Mic,
      title: "Voice Recording & Speech-to-Text Module",
      description: "Audio-to-text transcription with hands-free communication",
      details: [
        "Audio-to-text transcription",
        "Hands-free communication",
        "Real-time voice processing",
        "Automatic notification delivery"
      ],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Hindi and Multilingual Voice Command Processing",
      description: "Voice commands in multiple languages including Hindi",
      details: [
        "Voice commands in multiple languages including Hindi",
        "Hands-free operation while driving",
        "Action-triggered voice commands",
        "Language-specific audio processing"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bell,
      title: "Audio Notifications in Various Languages",
      description: "Multilingual notification system with audio alerts",
      details: [
        "Multilingual notification system",
        "Audio alerts and updates",
        "Language preference settings",
        "Clear voice-based instructions"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Find Loads Section",
      description: "Discover and book available loads in real-time",
      details: [
        "Available loads discovery",
        "Load matching system",
        "Real-time load availability",
        "Easy load booking interface"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Navigation,
      title: "GPS Tracking via AI",
      description: "AI-powered route navigation and tracking",
      details: [
        "Driver location tracking",
        "Route navigation assistance",
        "AI-powered route suggestions",
        "Safety and compliance monitoring"
      ],
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Community-Based Reporting",
      description: "Share updates and collaborate with other drivers",
      details: [
        "Report road conditions",
        "Share traffic updates",
        "Contribute to fuel-saving routes",
        "Collaborative driver network"
      ],
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: FileCheck,
      title: "POD Verification Through Google ML Kit",
      description: "Quick and secure document verification",
      details: [
        "Easy document capture",
        "Fraud prevention for drivers",
        "Quick delivery confirmation",
        "Secure registration system"
      ],
      gradient: "from-teal-500 to-green-500"
    },
    {
      icon: UserPlus,
      title: "Registration System",
      description: "Simple onboarding with secure authentication",
      details: [
        "Simple driver onboarding",
        "Document verification",
        "Profile management",
        "Credential authentication"
      ],
      gradient: "from-rose-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
        <NavigationBar/>
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 animate-fade-in">
              Empowering Drivers
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Advanced tools designed for the modern trucker - voice-first, AI-powered, and built for the road
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Mic className="w-5 h-5" />
                <span>Voice-First Hindi AI</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Navigation className="w-5 h-5" />
                <span>Real-Time Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <MapPin className="w-5 h-5" />
                <span>60-Second Payments</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Core Innovations for Drivers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to work smarter, safer, and more efficiently on the road
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Card Content */}
                <div className="relative p-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {feature.description}
                  </p>

                  {/* Details List */}
                  <div className={`space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feature.gradient} mt-1.5 flex-shrink-0`}></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px' }}></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Started Now →
            </button>
            <button className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-600 hover:bg-orange-50 transform hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">10M+</div>
              <div className="text-gray-300">Unorganized Truckers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">45 Days</div>
              <div className="text-gray-300">Payment Delays Eliminated</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">18-22%</div>
              <div className="text-gray-300">Fuel Waste Reduced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversSection;