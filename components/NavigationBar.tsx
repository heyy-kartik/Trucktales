"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Truck, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { ModeToggle } from "@/components/mode-toggle";

const navigationItems = [
  { id: "features", title: "FEATURES", href: "/" },
  { id: "how-it-works", title: "HOW IT WORKS", href: "/how-it-works" },
  { id: "for-drivers", title: "FOR DRIVERS", href: "/for-drivers" },
  { id: "for-fleets", title: "FOR FLEETS", href: "/for-fleets" },
];

export function NavigationBar(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 bg-background shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2">
          <Truck className="h-8 w-8 hover:bg-amber-50 bg-amber-50" />
          <span className="font-mono text-xl font-bold text-black">
            TruckTales
          </span>
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm font-mono text-foreground hover:text-[#D35400] transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            className="hidden md:flex cursor-pointer rounded-none bg-[#D35400] hover:bg-[#D35400]/90 font-mono text-white"
            asChild
          >
            <a href="/dashboard">
              GET STARTED <ArrowRight className="ml-1 h-4 w-4 text-white" />
            </a>
          </Button>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-6 mt-6">
                {navigationItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-sm font-mono text-foreground hover:text-[#D35400] transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
                <Button
                  className="cursor-pointer rounded-none bg-[#D35400] hover:bg-[#D35400]/90 font-mono text-white"
                  asChild
                >
                  <a href="/dashboard">
                    GET STARTED <ArrowRight className="ml-1 h-4 w-4 text-white" />
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
