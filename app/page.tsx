import { MynaHero } from "@/components/myna-hero";
import { TestimonialsSectionDemo } from "@/components/Testimonialreal";
import { Footer } from "@/components/footer-section";
import React from "react";

export default function Home() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <MynaHero />
        <TestimonialsSectionDemo />
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
