import { MynaHero } from "@/components/myna-hero";
import { TestimonialsSectionDemo } from "@/components/Testimonialreal";
import { Footer } from "@/components/footer-section";
import React from "react";
export default function Home() {
  return (
    <React.Fragment>
      <MynaHero />
      <TestimonialsSectionDemo />
      <div className="relative flex min-h-svh flex-col">
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="font-mono text-2xl font-bold">Scroll Down!</h1>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
}
