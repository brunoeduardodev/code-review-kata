"use client";

import Link from "next/link";
import { useActiveDesignTheme } from "@/lib/design-runtime";

const riskAreas = [
  "Hallucinated dependencies",
  "Authorization gaps",
  "State and logic drift",
  "Coverage blind spots",
  "Data leakage vectors",
  "Performance regressions",
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
  const theme = useActiveDesignTheme();

  if (theme === "obsidian-ember") return <ObsidianEmberLanding />;
  if (theme === "cyan-circuit") return <CyanCircuitLanding />;
  if (theme === "crimson-audit") return <CrimsonAuditLanding />;
  if (theme === "forest-relay") return <ForestRelayLanding />;
  if (theme === "polar-terminal") return <PolarTerminalLanding />;

  return <MidnightLabLanding />;
}

function SiteHeader({ brand }: { brand: string }) {
  return (
    <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-6 md:px-8">
      <Link href="/" className="font-display text-2xl tracking-tight text-[var(--ink)]">
        {brand}
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
        <a href="#features" className="focus-ring rounded-md px-1 py-0.5 hover:text-[var(--ink)]">
          Features
        </a>
        <a href="#workflow" className="focus-ring rounded-md px-1 py-0.5 hover:text-[var(--ink)]">
          Workflow
        </a>
        <a href="#faq" className="focus-ring rounded-md px-1 py-0.5 hover:text-[var(--ink)]">
          FAQ
        </a>
      </nav>
      <Link href="/kata" className="btn-primary">
        Start Free Kata
      </Link>
    </header>
  );
}

function RiskGrid() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {riskAreas.map((risk) => (
        <div key={risk} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
          <p className="wire-label mb-2">Category</p>
          <p className="section-title text-lg">{risk}</p>
        </div>
      ))}
    </div>
  );
}

function FaqBlock() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 py-14 md:px-8" id="faq">
      <div className="reveal-up">
        <p className="eyebrow">FAQ</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Questions before teams begin</h2>
      </div>
      <div className="mt-7 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface)] p-4">
            <summary className="cursor-pointer list-none text-base font-semibold text-[var(--ink)]">{faq.question}</summary>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function MidnightLabLanding() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="hero-shell">
        <div aria-hidden className="hero-orb hero-orb-a" />
        <div aria-hidden className="hero-orb hero-orb-b" />

        <SiteHeader brand="Midnight Review Lab" />

        <section className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 pb-20 pt-8 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="reveal-up">
            <p className="eyebrow">Review Discipline For AI Delivery</p>
            <h1 className="display-title mt-4 text-balance text-5xl md:text-7xl">AI writes fast. Teams still need sharper reviewers.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-xl md:leading-9">
              Run high-pressure pull-request drills built for modern engineering teams. Train correctness, security,
              performance, and testing judgment before defects reach production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/kata">
                Run Your First Round
              </Link>
              <a className="btn-secondary" href="#coverage">
                Explore Defect Coverage
              </a>
            </div>
          </div>

          <aside className="reveal-up panel hero-preview" style={{ animationDelay: "130ms" }}>
            <div className="flex items-center justify-between border-b border-[var(--line)]/70 pb-3">
              <p className="wire-label">Session Telemetry</p>
              <p className="wire-label text-[var(--accent-warm)]">Round 11</p>
            </div>
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[color:var(--bg-elevated)]/85 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Current score</p>
              <p className="mt-2 text-5xl font-semibold text-[var(--accent)]">91</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Coverage 88% | +162 XP</p>
              <div className="mt-5 space-y-2 text-sm">
                <p className="rounded-lg border border-emerald-700/55 bg-emerald-950/30 px-3 py-2 text-emerald-100">
                  Caught: unsafe file path concatenation in upload route.
                </p>
                <p className="rounded-lg border border-amber-700/55 bg-amber-950/30 px-3 py-2 text-amber-100">
                  Missed: absent tenant-level authorization check.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-8" id="features">
        <p className="eyebrow">Why Teams Stay</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Training built for reviewers, not spectators</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "PR-native simulations",
            "Live coach telemetry",
            "Scored progression loop",
          ].map((title, index) => (
            <article key={title} className="panel">
              <p className="wire-label">0{index + 1}</p>
              <h3 className="section-title mt-3 text-xl">{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8" id="workflow">
        <div className="panel">
          <p className="eyebrow">How It Works</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {["Select a mission", "Review under pressure", "Debrief with report"].map((step, index) => (
              <article key={step} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-5">
                <p className="wire-label text-[var(--accent-warm)]">Step 0{index + 1}</p>
                <h3 className="section-title mt-2 text-xl">{step}</h3>
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
        <div className="panel bg-[linear-gradient(145deg,var(--hero-preview-a),color-mix(in_srgb,var(--bg-elevated)_95%,black_5%))]">
          <p className="eyebrow">Final CTA</p>
          <h2 className="display-title mt-2 text-4xl md:text-6xl">Build a stronger review culture in one week</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/kata" className="btn-primary">
              Start Free Kata
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ObsidianEmberLanding() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <SiteHeader brand="Obsidian Ember Review Studio" />
      <section className="mx-auto grid w-full max-w-[1240px] gap-6 px-4 pb-8 pt-6 md:px-8 lg:grid-cols-[1.2fr_0.8fr]" id="features">
        <article className="panel">
          <p className="eyebrow">Editorial Proposal</p>
          <h1 className="display-title mt-4 text-5xl md:text-7xl">Train reviewers like an incident editorial desk.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
            This concept frames every kata as a published postmortem draft. Engineers annotate risk narratives, justify
            severity, and submit polished review comments under a timebox.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kata" className="btn-primary">
              Open Editorial Mode
            </Link>
            <a href="#workflow" className="btn-secondary">
              See Session Format
            </a>
          </div>
        </article>
        <aside className="panel">
          <p className="wire-label">Issue Desk Snapshot</p>
          <div className="mt-4 space-y-3">
            {["Risk lead", "Reviewer", "Decision owner"].map((label) => (
              <div key={label} className="rounded-xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3">
                <p className="wire-label">Role</p>
                <p className="section-title mt-1 text-lg">{label}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8" id="workflow">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Read scenario context like an incident brief",
            "Write ranked findings with business impact",
            "Publish final review and compare against answer key",
          ].map((copy, index) => (
            <article key={copy} className="panel">
              <p className="wire-label text-[var(--accent-warm)]">Stage 0{index + 1}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-8" id="coverage">
        <p className="eyebrow">Coverage</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Six recurring AI failure narratives to master</h2>
        <RiskGrid />
      </section>

      <FaqBlock />
    </main>
  );
}

function CyanCircuitLanding() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="border-b border-[var(--line)]/70">
        <SiteHeader brand="Cyan Circuit Review Ops" />
      </div>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8" id="features">
        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="panel">
            <p className="wire-label">System Online</p>
            <h1 className="display-title mt-3 text-5xl md:text-7xl">Run code review drills like an ops dashboard.</h1>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              Cyan Circuit treats reviews as signal operations. You monitor issue match-rate, resolve misses, and iterate
              until your review output reaches production-grade confidence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/kata">
                Launch Ops Kata
              </Link>
              <a className="btn-secondary" href="#coverage">
                Inspect Defect Signals
              </a>
            </div>
          </article>

          <article className="panel">
            <p className="wire-label">Live Metrics</p>
            <div className="mt-3 grid gap-3">
              {["Signal Match 82%", "Miss Queue 03", "XP Throughput +149"].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--line)] bg-[color:var(--surface-2)] px-3 py-2">
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-6 md:px-8" id="workflow">
        <div className="panel">
          <p className="eyebrow">Operational Workflow</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {["Load mission", "Detect defects", "Dispatch comments", "Close with report"].map((step, index) => (
              <div key={step} className="rounded-xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
                <p className="wire-label">Node 0{index + 1}</p>
                <p className="section-title mt-2 text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-8" id="coverage">
        <p className="eyebrow">Defect Signal Board</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Train for the highest-frequency AI breakpoints</h2>
        <RiskGrid />
      </section>

      <FaqBlock />
    </main>
  );
}

function CrimsonAuditLanding() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <SiteHeader brand="Crimson Audit Room" />
      <section className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-5 md:px-8" id="features">
        <div className="panel border-rose-700/40">
          <p className="wire-label text-rose-300">High-Risk Review Proposal</p>
          <h1 className="display-title mt-3 text-5xl md:text-7xl">Prioritize severity first. Validate every critical path.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)]">
            Crimson Audit redesigns the landing and kata flow around triage pressure: identify blast radius, escalate
            high-impact vulnerabilities, and only then refine medium and low-level findings.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/kata" className="btn-primary">
              Enter Triage Mode
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-6 md:px-8" id="workflow">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Critical", tone: "border-rose-700/60 bg-rose-950/30" },
            { label: "Important", tone: "border-amber-700/60 bg-amber-950/30" },
            { label: "Advisory", tone: "border-cyan-700/60 bg-cyan-950/30" },
          ].map((lane) => (
            <article key={lane.label} className={`panel ${lane.tone}`}>
              <p className="wire-label">Triage Lane</p>
              <h3 className="section-title mt-2 text-2xl">{lane.label}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">Each review starts by resolving this lane before proceeding.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-8" id="coverage">
        <p className="eyebrow">Audit Scope</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Six classes of risk, ordered by blast radius</h2>
        <RiskGrid />
      </section>

      <FaqBlock />
    </main>
  );
}

function ForestRelayLanding() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <SiteHeader brand="Forest Relay Review Garden" />

      <section className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-6 md:px-8" id="features">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="panel">
            <p className="eyebrow">Coaching-Centric Proposal</p>
            <h1 className="display-title mt-3 text-5xl md:text-7xl">Grow review instincts through guided repetition.</h1>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              Forest Relay shifts the product voice from alarm to deliberate mastery. The landing emphasizes progression,
              while kata sessions reward consistent, well-explained findings over rushed output.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/kata" className="btn-primary">
                Start Coaching Track
              </Link>
            </div>
          </article>

          <article className="panel">
            <p className="wire-label">Weekly Growth Loop</p>
            <div className="mt-4 space-y-3">
              {["Monday: baseline kata", "Wednesday: gap focus", "Friday: score retest"].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3">
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-6 md:px-8" id="workflow">
        <div className="panel">
          <p className="eyebrow">Practice Relay</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["Observe", "Diagnose", "Reinforce"].map((step) => (
              <article key={step} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-5">
                <h3 className="section-title text-2xl">{step}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">A complete kata round mapped to skill retention.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-8" id="coverage">
        <p className="eyebrow">Scenario Garden</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Coverage designed for long-term review fluency</h2>
        <RiskGrid />
      </section>

      <FaqBlock />
    </main>
  );
}

function PolarTerminalLanding() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <SiteHeader brand="Polar Terminal Review Deck" />

      <section className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8" id="features">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="panel">
            <p className="eyebrow">Minimal Data Proposal</p>
            <h1 className="display-title mt-3 text-5xl md:text-7xl">Precision review practice with clean analytical framing.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
              Polar Terminal removes narrative clutter and focuses on measurable outcomes: issue coverage, severity
              correctness, and consistency across repeated simulations.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/kata" className="btn-primary">
                Open Analytical Mode
              </Link>
            </div>
          </article>
          <article className="panel">
            <p className="wire-label">Benchmarks</p>
            <div className="mt-4 grid gap-3">
              {["Median score trend", "False-positive rate", "Review depth index"].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--line)] bg-[color:var(--surface-2)] px-3 py-2">
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-6 md:px-8" id="workflow">
        <div className="grid gap-3 md:grid-cols-2">
          <article className="panel">
            <p className="wire-label">Workflow A</p>
            <h3 className="section-title mt-2 text-2xl">Evidence-first review</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Capture proof snippets, then map findings to severity.</p>
          </article>
          <article className="panel">
            <p className="wire-label">Workflow B</p>
            <h3 className="section-title mt-2 text-2xl">Coverage-first review</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Systematically check all risk classes before submit.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-12 md:px-8" id="coverage">
        <p className="eyebrow">Benchmark Coverage</p>
        <h2 className="display-title mt-2 text-4xl md:text-5xl">Scenario set tuned for measurable evaluation</h2>
        <RiskGrid />
      </section>

      <FaqBlock />
    </main>
  );
}
