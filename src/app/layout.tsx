import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vanguard Interior Design",
  description: "High-end interior design and architectural visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} style={{ colorScheme: "dark" }}>
      <body className="min-h-[100dvh] antialiased bg-[#050505] text-white selection:bg-white/20">
        <div className="noise-overlay" />
        <SmoothScrolling>
          <Navbar />
          {children}
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
