import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "SLSGB Nationals 2026 — Après-Surf Entertainment",
  description:
    "Evening entertainment at the Beach Marquee, Holywell Bay. Live bands, DJ nights, karaoke, rockaoke and a silent disco finale during SLSGB Nationals Championships week.",
  openGraph: {
    title: "SLSGB Nationals 2026 — Après-Surf Entertainment",
    description:
      "Live music, DJ nights & a silent disco finale at Holywell Bay. Every evening 18:00–20:00 during championships week.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a1628] text-white">
        {children}
      </body>
    </html>
  );
}
