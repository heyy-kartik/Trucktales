import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trucktales - Highway Monitoring System",
  description: "Real-time highway monitoring and truck tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
