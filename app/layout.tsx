import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "sanAI Studio — Turn your path into powerful stories",
  description:
    "Create Instagram-ready visual stories from your photos. Upload images, add a topic, get AI slide texts, and download.",
  applicationName: "sanAI Studio",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "sanAI Studio",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen antialiased font-sans">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
