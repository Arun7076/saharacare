import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaharaCare MVP | Patient Medication & Caregiver Monitoring",
  description: "Accessible, audio-assisted patient medication adherence and family caregiver monitoring platform for Nepal.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-mint-50 text-forest-900 antialiased">
        {children}
      </body>
    </html>
  );
}
