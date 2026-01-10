"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Check if Convex URL is configured
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const isConvexConfigured = convexUrl && convexUrl !== "your_convex_url";

// Only create client if URL is valid
const convex = isConvexConfigured ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!convex) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold text-red-600">
            Convex Not Configured
          </h2>
          <p className="text-muted-foreground mt-2">
            Please set NEXT_PUBLIC_CONVEX_URL in your .env.local file
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Run{" "}
            <code className="bg-muted px-2 py-1 rounded">npx convex dev</code>{" "}
            to set up Convex
          </p>
        </div>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
