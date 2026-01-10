import { TestimonialsSection } from "@/components/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "Ramesh Kumar",
      handle: "Truck Driver, NH-44",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    },
    text: "Pehle payment ke liye 45 din wait karta tha. Ab delivery ke 60 second mein UPI aa jata hai. Life badal gayi bhai!",
  },
  {
    author: {
      name: "Priya Sharma",
      handle: "Logistics Manager, Mumbai",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
    text: "No more calling drivers 20 times a day asking 'Kahan ho?' Real-time map shows everything. Saved 4 hours daily!",
  },
  {
    author: {
      name: "Rajesh Gupta",
      handle: "Fleet Owner, 200 Trucks",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    text: "18% fuel savings from AI routing alone. The jam prediction feature warned us about NH-48 flooding — saved ₃,000 per truck that day.",
  },
  {
    author: {
      name: "Suresh Yadav",
      handle: "Truck Driver, Jaipur",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "Hindi mein baat kar sakta hoon, typing nahi karni padti driving ke time. Bahut safe hai aur aasan bhi!",
  },
  {
    author: {
      name: "Anjali Mehta",
      handle: "Head of Operations, Delhi",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    },
    text: "Blockchain POD verification eliminated all payment disputes. Zero paperwork, complete audit trail. Game changer for compliance.",
  },
  {
    author: {
      name: "Vikram Singh",
      handle: "Shipper, Pune",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    text: "Finally I can see exactly where my shipment is without making phone calls. The live map updates every 5 seconds!",
  },
];

export function TestimonialsSectionDemo() {
  return (
    <TestimonialsSection
      title="Trusted by India's Trucking Community"
      description="Join 10,000+ drivers, fleet owners, and logistics managers transforming India's highways"
      testimonials={testimonials}
    />
  );
}
