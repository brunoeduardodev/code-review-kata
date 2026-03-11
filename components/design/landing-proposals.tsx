"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { KataWorkbench } from "@/components/kata/kata-workbench";
import { SignInModal } from "@/components/sign-in-modal";

const riskAreas = [
  {
    title: "Hallucinated dependencies",
    signal: "SDK drift",
    note: "Catch invented methods and unofficial APIs before they hit production paths.",
  },
  {
    title: "Authorization gaps",
    signal: "Access edge",
    note: "Trace privilege boundaries instead of trusting generated happy paths.",
  },
  {
    title: "State and logic drift",
    signal: "Boundary fault",
    note: "Review threshold math, empty states, retries, and irreversible flows.",
  },
  {
    title: "Coverage blind spots",
    signal: "Test debt",
    note: "Pressure the missing assertions that make subtle defects survive review.",
  },
  {
    title: "Data leakage vectors",
    signal: "Exposure path",
    note: "Look for logging, interpolation, and transport decisions that leak sensitive data.",
  },
  {
    title: "Performance regressions",
    signal: "Hot path",
    note: "Spot hidden N+1s, wasteful recomputation, and payload bloat in generated code.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Read the pull request like an incident brief",
    detail: "Treat the snippet as a live production decision, not a coding exercise.",
  },
  {
    step: "02",
    title: "Write ranked findings with impact and repair direction",
    detail: "A good review names severity, blast radius, and the shortest credible fix.",
  },
  {
    step: "03",
    title: "Debrief against the answer key and sharpen your pattern memory",
    detail: "Every round ends with coverage feedback so the next review gets faster.",
  },
];

const proofMetrics = [
  { value: "5 min", label: "per review round" },
  { value: "30", label: "scenario drills in rotation" },
  { value: "6", label: "AI defect families covered" },
];

const heroSignals = [
  "Daily PR runs inline on the landing page",
  "Anonymous reviewers can finish the first round",
  "Sign-in only unlocks the follow-up queue",
  "Every submission returns a coverage report",
];

const faqs = [
  {
    question: "Who should run these katas?",
    answer:
      "Software engineers and engineering leads who need sharper, faster review quality in AI-assisted workflows.",
  },
  {
    question: "Is GitHub integration required?",
    answer: "No. The MVP runs locally in-browser with persisted progress via local storage.",
  },
  {
    question: "How long is a full session?",
    answer: "Each kata is 5 minutes, so a focused 20-minute session usually covers 2 to 4 rounds.",
  },
];

export function LandingProposals() {
  return <MidnightLabLanding />;
}

function SiteHeader({
  brand,
  onSignIn,
  primaryHref = "#daily-review",
}: {
  brand: string;
  onSignIn?: () => void;
  primaryHref?: string;
}) {
  return (
    <header className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-6 px-4 py-6 md:px-8">
      <Link
        href="/"
        className="group flex items-center gap-4 rounded-full border border-[color:var(--line)]/80 bg-[color:var(--surface)]/70 px-3 py-2 backdrop-blur"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
          PR
        </span>
        <span className="block">
          <span className="wire-label block text-[0.62rem]">ReviewForge</span>
          <span className="font-display text-xl tracking-tight text-[var(--ink)] transition group-hover:text-white md:text-2xl">
            {brand}
          </span>
        </span>
      </Link>
      <nav className="hidden items-center gap-2 rounded-full border border-[color:var(--line)]/75 bg-black/10 p-2 text-sm font-medium text-[var(--muted)] backdrop-blur md:flex">
        <a href="#features" className="focus-ring rounded-full px-3 py-2 hover:bg-white/5 hover:text-[var(--ink)]">
          Features
        </a>
        <a href="#workflow" className="focus-ring rounded-full px-3 py-2 hover:bg-white/5 hover:text-[var(--ink)]">
          Workflow
        </a>
        <a href="#faq" className="focus-ring rounded-full px-3 py-2 hover:bg-white/5 hover:text-[var(--ink)]">
          FAQ
        </a>
      </nav>
      {onSignIn ? (
        <button onClick={onSignIn} className="btn-primary">
          Sign In
        </button>
      ) : (
        <Link href={primaryHref} className="btn-primary">
          Start Free Kata
        </Link>
      )}
    </header>
  );
}

function RiskGrid() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-3">
      {riskAreas.map((risk, index) => (
        <article
          key={risk.title}
          className="group relative overflow-hidden rounded-[26px] border border-[color:var(--line)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface)_88%,white_12%),color-mix(in_srgb,var(--bg-elevated)_86%,black_14%))] p-5 shadow-[0_26px_50px_rgba(0,0,0,0.22)]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent opacity-70" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="wire-label">Class 0{index + 1}</p>
              <h3 className="section-title mt-3 text-2xl leading-tight">{risk.title}</h3>
            </div>
            <span className="rounded-full border border-[var(--line-strong)] bg-black/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              {risk.signal}
            </span>
          </div>
          <p className="mt-6 max-w-[32ch] text-sm leading-7 text-[var(--muted)]">{risk.note}</p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--line)] to-transparent transition duration-300 group-hover:from-[var(--accent)]/70" />
        </article>
      ))}
    </div>
  );
}

function FaqBlock() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 py-18 md:px-8" id="faq">
      <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        <div className="reveal-up lg:sticky lg:top-8">
          <p className="eyebrow">FAQ</p>
          <h2 className="display-title mt-2 text-4xl md:text-5xl">Questions before teams begin</h2>
          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
            Short, practical answers for engineers deciding whether this belongs in their weekly operating rhythm.
          </p>
          <div className="mt-8 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)]/75 p-5">
            <p className="wire-label">Deployment Shape</p>
            <p className="mt-3 text-lg font-semibold text-[var(--ink)]">Local-first training loop</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              No GitHub dependency, no team setup, no waiting room. Open the page and start reviewing.
            </p>
          </div>
        </div>
        <div className="mt-1 space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)]/78 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--ink)]">
                <span>
                  <span className="wire-label mr-3 align-middle text-[0.62rem] text-[var(--accent)]">0{index + 1}</span>
                  <span className="align-middle">{faq.question}</span>
                </span>
                <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)] transition group-open:text-[var(--accent)]">
                  Open
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function MidnightLabLanding() {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem("reviewforge-user");
      return stored ? (JSON.parse(stored) as { name: string }) : null;
    } catch {
      return null;
    }
  });

  const handleSignIn = useCallback((name: string) => {
    setUser({ name });
    setModalOpen(false);
    document.getElementById("daily-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} onSignIn={handleSignIn} />

      <div className="hero-shell">
        <div aria-hidden className="hero-orb hero-orb-a" />
        <div aria-hidden className="hero-orb hero-orb-b" />

        <SiteHeader
          brand="Midnight Review Lab"
          onSignIn={user ? undefined : () => setModalOpen(true)}
          primaryHref="#daily-review"
        />

        <section className="mx-auto grid w-full max-w-[1360px] gap-10 px-4 pb-20 pt-8 md:px-8 xl:grid-cols-[minmax(0,1.15fr)_420px] xl:items-start">
          <div className="reveal-up" id="daily-review">
            <KataWorkbench embedded />
          </div>

          <div className="reveal-up xl:sticky xl:top-8" style={{ animationDelay: "110ms" }}>
            <p className="eyebrow">Review Discipline For AI Delivery</p>
            <h1 className="display-title mt-4 text-balance text-5xl md:text-6xl">AI writes fast. Teams still need sharper reviewers.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg md:leading-9">
              Each day, a new AI-generated pull request lands here. Catch the defects before they reach production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" href="#review-input">
                {user ? `Continue as ${user.name}` : "Jump Into The Review"}
              </Link>
              {!user ? (
                <button className="btn-secondary" onClick={() => setModalOpen(true)}>
                  Sign In for Follow-ups
                </button>
              ) : null}
              <a className="btn-secondary" href="#coverage">
                Explore Defect Coverage
              </a>
            </div>
            <div className="mt-10 rounded-[28px] border border-[color:var(--line)] bg-[linear-gradient(155deg,rgba(17,23,34,0.9),rgba(7,11,17,0.96))] p-5 shadow-[0_28px_60px_rgba(0,0,0,0.22)]">
              <p className="wire-label">Operator Briefing</p>
              <div className="mt-5 grid gap-3">
                {heroSignals.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[color:var(--line)]/80 bg-black/10 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--line-strong)] text-[0.68rem] font-semibold text-[var(--accent)]">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[var(--muted)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {proofMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-[color:var(--line)] bg-black/10 px-4 py-4">
                  <p className="text-2xl font-semibold text-[var(--ink)]">{metric.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-18 md:px-8" id="features">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <div className="reveal-up lg:sticky lg:top-8">
            <p className="eyebrow">Why Teams Stay</p>
            <h2 className="display-title mt-2 text-4xl md:text-5xl">Training built for reviewers, not spectators</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
              ReviewForge is designed to feel like a live review desk: active PRs, explicit pressure, and immediate
              debrief instead of passive reading.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "PR-native simulations",
                note: "The landing page opens directly into the daily review so intent and interaction are aligned.",
              },
              {
                title: "Live coach telemetry",
                note: "Writers get signal previews while drafting, which reinforces good review habits in real time.",
              },
              {
                title: "Scored progression loop",
                note: "Every round produces a report, XP movement, and a clear reason to come back tomorrow.",
              },
            ].map((item, index) => (
              <article key={item.title} className="panel min-h-[240px]">
                <p className="wire-label">0{index + 1}</p>
                <h3 className="section-title mt-4 text-2xl">{item.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8" id="workflow">
        <div className="panel overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[color:var(--line)]/80 pb-6">
            <div>
              <p className="eyebrow">Operating Rhythm</p>
              <h2 className="display-title mt-2 text-4xl md:text-5xl">A review loop that feels closer to real work</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
              The page should feel like an active desk, not a brochure. These three steps keep the landing flow honest:
              open the PR, review it, then compare your instincts to the answer key.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-2)]/88 p-5"
              >
                <p className="wire-label text-[var(--accent-warm)]">Stage {item.step}</p>
                <h3 className="section-title mt-4 text-2xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-8" id="coverage">
        <p className="eyebrow">Coverage Map</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Defect classes that matter in AI-generated code</h2>
        <RiskGrid />
      </section>

      <FaqBlock />

      <section className="mx-auto w-full max-w-[1240px] px-4 pb-18 pt-4 md:px-8">
        <div className="panel overflow-hidden bg-[linear-gradient(145deg,var(--hero-preview-a),color-mix(in_srgb,var(--bg-elevated)_95%,black_5%))]">
          <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_top,rgba(85,230,193,0.16),transparent_62%)] lg:block" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <p className="eyebrow">Final CTA</p>
              <h2 className="display-title mt-2 max-w-3xl text-4xl md:text-6xl">
                Put the review ritual where engineers can actually feel it.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
                Open the daily PR, write the review, and leave with sharper instincts than you had ten minutes earlier.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="#daily-review" className="btn-primary">
                  Start Reviewing
                </Link>
                <a href="#workflow" className="btn-secondary">
                  See The Flow
                </a>
              </div>
            </div>
            <div className="grid gap-3">
              {[
                "Daily PR always visible",
                "Coach and report in the same flow",
                "Follow-up queue ready after sign-in",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[color:var(--line)] bg-black/10 px-4 py-4 text-sm text-[var(--ink)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
