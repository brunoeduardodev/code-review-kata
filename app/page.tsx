import type { Metadata } from "next";
import { LandingProposals } from "@/components/design/landing-proposals";

export const metadata: Metadata = {
  title: "Design Proposals | Midnight Review Lab",
  description:
    "Test six dark-mode landing proposals for AI-era code review katas, including distinct interaction and positioning strategies.",
};

export default function Home() {
  return <LandingProposals />;
}
