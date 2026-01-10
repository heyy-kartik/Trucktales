import { MynaHero } from "@/components/myna-hero";
import { TestimonialsSectionDemo } from "@/components/Testimonialreal";
import { Footer } from "@/components/footer-section";
import React from "react";
export default function Home() {
  return (
    <React.Fragment>
      <MynaHero />
      <TestimonialsSectionDemo />
      <div className="relative flex min-h-screen flex-col">
        <div className="min-h-2xl pb-32 flex items-center justify-center">
          <h1 className="font-mono text-2xl font-bold">Scroll Down!</h1>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
}
