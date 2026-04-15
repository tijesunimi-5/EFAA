import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/components/context/Alert";
import { UserProvider } from "@/components/context/User";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Emergency First-Aid Assistant - EFAA",
//   description: "EFAA (Emergency First Aid Assistant) is a mobile-first, offline-capable emergency support web app designed to guide people through critical first-aid situations with calm, clear, step-by-step instructions.",
// };

export const metadata: Metadata = {
  title: "Emergency First-Aid Assistant - EFAA",
  description: "EFAA (Emergency First Aid Assistant) is a mobile-first, offline-capable emergency support web app designed to guide people through critical first-aid situations with calm, clear, step-by-step instructions.",
  manifest: "/manifest.json", // Automatically handled if using manifest.ts
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EFAA",
  },
  formatDetection: {
    telephone: true, // Crucial for your emergency contact dialing!
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents accidental zooming during high-stress use
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </UserProvider>
      </body>
    </html>
  );
}
