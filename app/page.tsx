import type { Metadata } from "next";
import { LandingProposals } from "@/components/design/landing-proposals";

export const metadata: Metadata = {
  title: "Midnight Review Lab | Code Review Katas",
  description:
    "Practice AI-era code review katas in the Midnight Review Lab with fast drills, scoring, and instant coaching.",
};

export default function Home() {
  return <LandingProposals />;
}
