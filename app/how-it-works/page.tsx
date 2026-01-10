"use client";

import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";

export default function HowItWorksPage(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const steps = [
    {
      title: "Speak, Don’t Type",
      content: (
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>Press the microphone button and talk naturally.</li>
          <li>Works even in noisy truck cabins.</li>
          <li>Examples: "What’s my next load?" or "Show nearest fuel station."</li>
          <li>AI understands Hindi and English seamlessly.</li>
        </ul>
      ),
    },
    {
      title: "Instant Payments",
      content: (
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>Receive payments in under 60 seconds.</li>
          <li>Blockchain-verified, zero disputes.</li>
          <li>No hidden fees or delays.</li>
          <li>Secure and reliable transactions.</li>
        </ul>
      ),
    },
    {
      title: "Save on Fuel",
      content: (
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>Save 18-22% on fuel costs.</li>
          <li>Access exclusive discounts at partner stations.</li>
          <li>Track fuel expenses effortlessly.</li>
          <li>Optimize routes to save time and money.</li>
        </ul>
      ),
    },
    {
      title: "Stay Connected",
      content: (
        <ul className="list-disc pl-6 space-y-3 text-black">
          <li>Get real-time updates from other drivers.</li>
          <li>Report road conditions with a single tap.</li>
          <li>Stay informed about traffic and weather.</li>
          <li>Join a community of 10,000+ drivers.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen bg-background">
      <NavigationBar />

      <main>
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">
            How TruckTales Works
          </h1>
          <p className="text-black text-lg max-w-2xl mx-auto">
            Discover how TruckTales makes logistics simple, fast, and efficient for drivers and fleet owners. Join thousands who trust us to save time, reduce costs, and stay connected.
          </p>
        </section>

        <section className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`bg-white text-black rounded-xl border border-border shadow-md p-6 transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? "shadow-[0_0_25px_10px_rgba(255,107,44,0.8)] border-[#FF6B2C]"
                    : "hover:shadow-[0_0_15px_5px_rgba(255,107,44,0.5)] hover:border-[#FF6B2C]"
                }`}
              >
                <h3 className="text-xl font-semibold text-[#FF6B2C] mb-4">
                  {step.title}
                </h3>
                {activeIndex === index && (
                  <div className="text-black">
                    {step.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold text-black mb-4">
            Trusted by Thousands of Drivers
          </h2>
          <p className="text-black text-lg max-w-2xl mx-auto mb-8">
            Join a growing community of drivers and fleet owners who rely on TruckTales to streamline their operations and improve their bottom line.
          </p>
          <button className="px-6 py-3 bg-[#FF6B2C] text-white font-semibold rounded-lg shadow-md hover:shadow-[0_0_20px_5px_rgba(255,107,44,0.8)] hover:bg-[#FF6B2C]/90 transition">
            Get Started with TruckTales
          </button>
        </section>
      </main>
    </div>
  );
}