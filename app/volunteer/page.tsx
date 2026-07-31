import type { Metadata } from "next";
import Volunteers from "@/components/Volunteers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Volunteer — SLSGB Nationals 2026",
  description:
    "Sign up to volunteer with the evening entertainment production crew at the Beach Marquee, Holywell Bay, during SLSGB Nationals Championships week.",
  robots: { index: false, follow: false },
};

export default function VolunteerPage() {
  return (
    <>
      <Volunteers />
      <Footer />
    </>
  );
}
