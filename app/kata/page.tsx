import type { Metadata } from "next";
import { KataWorkbench } from "@/components/kata/kata-workbench";

export const metadata: Metadata = {
  title: "Practice Katas",
  description:
    "ReviewForge kata workspace with 30 code-review simulations, instant hints, final scoring, and XP progression.",
};

export default function KataPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <KataWorkbench />
    </main>
  );
}
