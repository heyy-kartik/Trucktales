

"use client";

import * as React from "react";
import {
  ArrowRight,
  Mic,
  MapPin,
  Zap,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const labels = [
  { icon: Mic, label: "Voice-First Hindi AI" },
  { icon: MapPin, label: "Real-Time Tracking" },
  { icon: Zap, label: "60-Second Payments" },
];

const features = [
  {
    icon: Mic,
    label: "Live Tale Map",
    description:
      "Drivers speak updates in Hindi → AI converts to live map markers. No typing, safe while driving.",
  },
  {
    icon: CreditCard,
    label: "POD → UPI in 60 Seconds",
    description:
      "Photo proof of delivery triggers instant UPI payment. Blockchain-verified, zero disputes.",
  },
  {
    icon: AlertTriangle,
    label: "AI Jam Prediction",
    description:
      "Machine learning predicts congestion from voice tales. Save 6 hours & ₹3,000 fuel per incident.",
  },
];

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = [
    "TURNING",
    "DRIVERS",
    "INTO",
    "STORYTELLERS",
    "NOT",
    "DATA POINTS",
  ];

  return (
    <section className="min-h-screen bg-background">
      <NavigationBar />
      <main className="container mx-auto px-4">
        <section className="py-24">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                  }}
                  className="inline-block mx-2 md:mx-4"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-xl text-foreground font-mono"
            >
              India&apos;s logistics revolution speaks Hindi, not spreadsheets.
              Voice-first AI for 10M unorganized truckers — eliminating 45-day
              payment delays &amp; 18-22% fuel waste.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              {labels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.8 + index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  className="flex items-center gap-2 px-6"
                >
                  <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            >
              <Button
                size="lg"
                className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
                asChild
              >
                <Link href="/sign-up" className="text-white">
                  GET STARTED <ArrowRight className="ml-1 w-4 h-4 " />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="container" ref={ref} id="features">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 3.0,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            className="text-center text-4xl font-mono font-bold mb-6"
          >
            Three Core Innovations
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="grid md:grid-cols-3 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 3.2 + index * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
                className="flex flex-col items-center text-center p-8 bg-background border"
              >
                <div className="mb-6 rounded-full bg-[#FF6B2C]/10 p-4">
                  <feature.icon className="h-8 w-8 text-[#FF6B2C]" />
                </div>
                <h3 className="mb-4 text-xl font-mono font-bold">
                  {feature.label}
                </h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </section>
  );
}
