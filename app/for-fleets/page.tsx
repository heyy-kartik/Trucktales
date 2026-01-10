"use client";

import React, { useState } from 'react';
import { Map, Zap, Users, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { NavigationBar } from "@/components/NavigationBar";

const FleetManagementSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: Map,
      title: "Live Tale Map with Real-Time Updates",
      description: "GPS tracking via AI for precise location monitoring",
      details: [
        "GPS tracking via AI for precise location monitoring",
        "Real-time fleet visibility across all vehicles",
        "Live route progress tracking",
        "Historical tracking data and analytics"
      ],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Jam Prediction & Auto-Rerouting Engine",
      description: "AI-powered traffic prediction with automatic optimization",
      details: [
        "AI-powered traffic prediction",
        "Automatic route optimization",
        "Real-time traffic analysis",
        "Fuel-efficient path selection"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community-Based Reporting",
      description: "Driver-reported road conditions for better coordination",
      details: [
        "Driver-reported road conditions",
        "Efficient transport coordination",
        "Fuel-saving route recommendations",
        "Sustainable sourcing optimization"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: ShieldCheck,
      title: "AI-Verified Digital POD System",
      description: "Proof of delivery verification through Google ML Kit",
      details: [
        "Proof of Delivery verification through Google ML Kit",
        "Fraud prevention mechanisms",
        "Digital document authentication",
        "Secure delivery confirmation"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: LayoutDashboard,
      title: "Dynamic Services",
      description: "User-friendly interface with real-time dashboard updates",
      details: [
        "User-friendly interface",
        "Real-time dashboard updates",
        "Efficient logistics management",
        "Scalable and adaptable solutions"
      ],
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #ffffff, #f1f5f9)' }}>
      {/* Hero Section */}
      <NavigationBar/>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to right, #ea580c, #dc2626)', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: 0.1 }}></div>
        <div style={{ position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Empowering Fleet Managers
            </h1>
            <p style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginBottom: '2rem', color: '#fed7aa', maxWidth: '48rem', margin: '0 auto 2rem' }}>
              Advanced AI-powered tools for enterprise logistics - real-time tracking, predictive routing, and intelligent automation
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.5rem', borderRadius: '9999px' }}>
                <Map style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Live Tale Map</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.5rem', borderRadius: '9999px' }}>
                <Zap style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Auto-Rerouting</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.5rem', borderRadius: '9999px' }}>
                <ShieldCheck style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>AI-Verified POD</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4rem', background: 'linear-gradient(to top, #f8fafc, transparent)' }}></div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Core Innovations for Fleet Management
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '42rem', margin: '0 auto' }}>
            Everything you need to optimize operations, reduce costs, and improve efficiency
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'all 0.3s'
                }}
              >
                {/* Gradient Background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to bottom right, ${feature.gradient.includes('orange') ? '#f97316, #ef4444' : feature.gradient.includes('blue') ? '#3b82f6, #06b6d4' : feature.gradient.includes('purple') ? '#a855f7, #ec4899' : feature.gradient.includes('green') ? '#10b981, #059669' : '#6366f1, #3b82f6'})`,
                  opacity: isHovered ? 0.1 : 0,
                  transition: 'opacity 0.3s'
                }}></div>
                
                {/* Card Content */}
                <div style={{ position: 'relative', padding: '1.5rem' }}>
                  {/* Icon */}
                  <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '0.75rem',
                    background: `linear-gradient(to bottom right, ${feature.gradient.includes('orange') ? '#f97316, #ef4444' : feature.gradient.includes('blue') ? '#3b82f6, #06b6d4' : feature.gradient.includes('purple') ? '#a855f7, #ec4899' : feature.gradient.includes('green') ? '#10b981, #059669' : '#6366f1, #3b82f6'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1) rotate(0deg)',
                    transition: 'transform 0.3s'
                  }}>
                    <Icon style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#4b5563',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {feature.description}
                  </p>

                  {/* Details List */}
                  <div style={{
                    opacity: isHovered ? 1 : 0,
                    maxHeight: isHovered ? '24rem' : 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }}>
                    {feature.details.map((detail, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                        <div style={{
                          width: '0.375rem',
                          height: '0.375rem',
                          borderRadius: '9999px',
                          background: `linear-gradient(to bottom right, ${feature.gradient.includes('orange') ? '#f97316, #ef4444' : feature.gradient.includes('blue') ? '#3b82f6, #06b6d4' : feature.gradient.includes('purple') ? '#a855f7, #ec4899' : feature.gradient.includes('green') ? '#10b981, #059669' : '#6366f1, #3b82f6'})`,
                          marginTop: '0.375rem',
                          flexShrink: 0
                        }}></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '1rem' }}>
            <button style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(to right, #ea580c, #dc2626)',
              color: 'white',
              fontWeight: '600',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              Get Started Now →
            </button>
            <button style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#ea580c',
              fontWeight: '600',
              borderRadius: '0.75rem',
              border: '2px solid #ea580c',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fb923c, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10,000+</div>
              <div style={{ color: '#d1d5db' }}>Active Fleet Vehicles</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fb923c, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real-Time</div>
              <div style={{ color: '#d1d5db' }}>GPS Tracking & Analytics</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fb923c, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>30%</div>
              <div style={{ color: '#d1d5db' }}>Cost Reduction Achieved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetManagementSection;