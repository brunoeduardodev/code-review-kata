import type { Metadata } from "next";
import Link from "next/link";

const heroStats = [
  { label: "Scenarios", value: "30" },
  { label: "Defect Classes", value: "6" },
  { label: "Time per Drill", value: "5 min" },
];

const featureCards = [
  {
    title: "PR-style simulations",
    description:
      "Review realistic code diffs modeled after AI-assisted engineering workflows, not toy snippets.",
  },
  {
    title: "Instant hints + final report",
    description:
      "Get real-time coaching while writing and a scored report with missed risks and exemplar comments.",
  },
  {
    title: "Score and XP progression",
    description:
      "Track completion and review quality over repeated rounds to build high-signal review habits.",
  },
];

const flowSteps = [
  {
    title: "Pick a 5-minute scenario",
    description: "Choose from 30 mixed-level review drills mapped to real AI-generated code failure modes.",
  },
  {
    title: "Submit findings under timebox",
    description:
      "Write severity-ranked findings with impact and fix guidance, just like in real pull-request comments.",
  },
  {
    title: "Improve with coaching feedback",
    description:
      "Use instant hints and answer key examples to close gaps in correctness, security, testing, and performance.",
  },
];

const riskAreas = [
  "Hallucinated APIs",
  "Subtle logic bugs",
  "Missing edge cases",
  "Security vulnerabilities",
  "Poor tests",
  "Performance regressions",
];

const faqs = [
  {
    question: "Who is this built for?",
    answer:
      "Engineers who want to improve review quality quickly, especially when working with AI-generated or AI-assisted code.",
  },
  {
    question: "Does this require GitHub integration?",
    answer:
      "No. v1 is self-serve and works entirely in-browser with local progress persistence.",
  },
  {
    question: "How long does one practice session take?",
    answer:
      "Each kata is designed for 5 minutes, and most users complete 2-4 scenarios in a 20-minute session.",
  },
  {
    question: "Do I get reference solutions?",
    answer:
      "Yes. Every scenario includes an answer key and exemplar review comments in the final report.",
  },
];

export const metadata: Metadata = {
  title: "AI-Era Code Review Katas",
  description:
    "AI writes faster than teams can review. Train with 5-minute PR simulations and raise review quality before merge.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="hero-shell">
        <div aria-hidden className="hero-orb hero-orb-a" />
        <div aria-hidden className="hero-orb hero-orb-b" />

        <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-6 md:px-8">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            ReviewForge
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
            <a href="#features" className="hover:text-[var(--ink)] focus-ring rounded-md px-1 py-0.5">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[var(--ink)] focus-ring rounded-md px-1 py-0.5">
              How it works
            </a>
            <a href="#faq" className="hover:text-[var(--ink)] focus-ring rounded-md px-1 py-0.5">
              FAQ
            </a>
          </nav>
          <Link href="/kata" className="btn-primary">
            Start free kata
          </Link>
        </header>

        <section className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 pb-16 pt-6 md:px-8 md:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="reveal-up">
            <p className="eyebrow">Review Training For The AI Development Era</p>
            <h1 className="display-title mt-4 text-4xl md:text-6xl">AI writes faster than teams can review.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-xl">
              Practice pull-request reviews with realistic code review katas. Catch high-risk defects in correctness,
              security, performance, and tests before they ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/kata">
                Run your first review
              </Link>
              <a className="btn-secondary" href="#coverage">
                See defect coverage
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="metric-chip">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <aside className="reveal-up panel hero-preview" style={{ animationDelay: "120ms" }}>
            <p className="eyebrow">Live Preview</p>
            <h2 className="section-title mt-2 text-2xl">Kata report output</h2>
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Sample score</p>
              <p className="mt-2 text-5xl font-bold text-emerald-300">87</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Coverage 83% | +147 XP</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="rounded-lg border border-emerald-700/45 bg-emerald-900/25 px-3 py-2 text-emerald-100">
                  Caught: SQL injection via interpolated query.
                </p>
                <p className="rounded-lg border border-amber-700/45 bg-amber-900/25 px-3 py-2 text-amber-100">
                  Missed: account ownership authorization check.
                </p>
                <p className="rounded-lg border border-[var(--line)] bg-[color:var(--surface)] px-3 py-2">
                  Exemplar comment: &quot;Enforce account-level auth before query execution.&quot;
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-14 md:px-8" id="features">
        <div className="reveal-up">
          <p className="eyebrow">Why teams use ReviewForge</p>
          <h2 className="display-title mt-3 text-3xl md:text-4xl">High-signal review training, not passive content</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <article
              key={card.title}
              className="reveal-up panel"
              style={{ animationDelay: `${(index + 1) * 90}ms` }}
            >
              <h3 className="section-title text-xl">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-8" id="how-it-works">
        <div className="panel">
          <p className="eyebrow">How it works</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {flowSteps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Step 0{index + 1}
                </p>
                <h3 className="section-title mt-2 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-14 md:px-8" id="coverage">
        <div className="reveal-up flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Scenario coverage</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Train the defects AI code introduces most often</h2>
          </div>
          <Link href="/kata" className="btn-secondary h-fit">
            Open kata bank
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {riskAreas.map((risk) => (
            <div key={risk} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
              <p className="section-title text-lg">{risk}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8">
        <div className="panel">
          <p className="eyebrow">Proof placeholder</p>
          <h2 className="display-title mt-3 text-3xl md:text-4xl">Built for measurable review improvement</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
              Team logos placeholder
            </div>
            <div className="rounded-2xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
              Testimonial placeholder
            </div>
            <div className="rounded-2xl border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
              Before/after score chart placeholder
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8" id="faq">
        <div className="reveal-up">
          <p className="eyebrow">FAQ</p>
          <h2 className="display-title mt-3 text-3xl md:text-4xl">Questions teams ask before rollout</h2>
        </div>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
              <summary className="cursor-pointer list-none text-base font-semibold text-[var(--ink)]">{faq.question}</summary>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8 md:px-8">
        <div className="panel bg-[linear-gradient(145deg,rgba(51,211,155,0.16),rgba(15,23,21,0.95))]">
          <p className="eyebrow">Final CTA</p>
          <h2 className="display-title mt-3 text-3xl md:text-5xl">Raise your team&apos;s review quality starting this week</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Start with one 5-minute kata today, set your baseline score, and build reliable review habits for AI-assisted
            delivery.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/kata" className="btn-primary">
              Start free kata
            </Link>
            <a href="#features" className="btn-secondary">
              View features
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
