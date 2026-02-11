"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { aiRiskLabel, getScenarioById, kataScenarios, KataScenario } from "@/lib/kata-data";
import {
  evaluateReview,
  formatSeverityLabel,
  getLevelFromXp,
  getLevelProgress,
  getLiveHintPreview,
  ProgressState,
  ReviewReport,
} from "@/lib/kata-engine";

const STORAGE_KEY = "reviewforge-progress-v1";

const defaultProgress: ProgressState = {
  completedIds: [],
  totalXp: 0,
  bestScores: {},
};

function readProgress(): ProgressState {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as ProgressState;

    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      totalXp: typeof parsed.totalXp === "number" ? parsed.totalXp : 0,
      bestScores: parsed.bestScores ?? {},
    };
  } catch {
    return defaultProgress;
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remaining}`;
}

function difficultyLabel(scenario: KataScenario): string {
  if (scenario.difficulty === "advanced") return "Advanced";
  if (scenario.difficulty === "applied") return "Applied";
  return "Foundations";
}

function scoreTone(score: number): string {
  if (score >= 85) return "text-emerald-300";
  if (score >= 65) return "text-amber-300";
  return "text-rose-300";
}

function severityTone(severity: "high" | "medium" | "low"): string {
  if (severity === "high") return "bg-rose-950/35 text-rose-200 border-rose-800/70";
  if (severity === "medium") return "bg-amber-950/35 text-amber-200 border-amber-800/70";
  return "bg-sky-950/35 text-sky-200 border-sky-800/70";
}

export function KataWorkbench() {
  const [selectedId, setSelectedId] = useState(kataScenarios[0].id);
  const [reviewText, setReviewText] = useState("");
  const [report, setReport] = useState<ReviewReport | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(kataScenarios[0].timeboxMinutes * 60);
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  const scenario = useMemo(() => getScenarioById(selectedId), [selectedId]);
  const activeIndex = useMemo(
    () => kataScenarios.findIndex((item) => item.id === scenario.id),
    [scenario.id],
  );
  const nextScenario = kataScenarios[(activeIndex + 1) % kataScenarios.length];

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 0) {
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const hintPreview = useMemo(() => getLiveHintPreview(scenario, reviewText), [scenario, reviewText]);

  const canSubmit = reviewText.trim().length >= 120;
  const level = getLevelFromXp(progress.totalXp);
  const levelProgress = getLevelProgress(progress.totalXp);
  const completedCount = progress.completedIds.length;
  const completionRate = Math.round((completedCount / kataScenarios.length) * 100);
  const bestScore = progress.bestScores[scenario.id] ?? 0;

  function loadScenario(id: string) {
    const next = getScenarioById(id);
    setSelectedId(id);
    setRemainingSeconds(next.timeboxMinutes * 60);
    setReviewText("");
    setReport(null);
    setStatusMessage("");
  }

  function handleSubmit() {
    if (!canSubmit) {
      setStatusMessage("Add at least 120 characters so the report has enough signal.");
      return;
    }

    const alreadyCompleted = progress.completedIds.includes(scenario.id);
    const result = evaluateReview(scenario, reviewText);
    setReport(result);

    setProgress((current) => {
      const wasCompleted = current.completedIds.includes(scenario.id);
      const previousBest = current.bestScores[scenario.id] ?? 0;
      const improved = result.score > previousBest;
      const improvementBonus = improved ? Math.round((result.score - previousBest) / 2) : 0;

      return {
        completedIds: wasCompleted ? current.completedIds : [...current.completedIds, scenario.id],
        totalXp: current.totalXp + (wasCompleted ? improvementBonus : result.xpAward),
        bestScores: {
          ...current.bestScores,
          [scenario.id]: Math.max(previousBest, result.score),
        },
      };
    });

    setStatusMessage(
      alreadyCompleted
        ? "Scenario already completed. Improvement XP applied if your score improved."
        : `Report ready. +${result.xpAward} XP awarded.`,
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-14 pt-8 md:px-8">
      <div className="panel">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Code Review Kata</p>
            <h1 className="display-title mt-2 text-3xl md:text-4xl">Practice PR reviews in 5-minute rounds</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
              Work through 30 realistic AI-era defects across correctness, security, performance, architecture, and tests.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="metric-chip">
              <span>Level</span>
              <strong>{level}</strong>
            </div>
            <div className="metric-chip">
              <span>Total XP</span>
              <strong>{progress.totalXp}</strong>
            </div>
            <div className="metric-chip">
              <span>Completed</span>
              <strong>
                {completedCount}/{kataScenarios.length}
              </strong>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--line)]/65">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all"
              style={{ width: `${Math.max(levelProgress * 100, 4)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">Level progress {Math.round(levelProgress * 100)}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[332px_minmax(0,1fr)]">
        <aside className="panel h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-lg">Scenario Bank</h2>
            <span className="rounded-full bg-[color:var(--accent)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
              {completionRate}% complete
            </span>
          </div>
          <div className="mt-4 max-h-[66vh] space-y-2 overflow-y-auto pr-1">
            {kataScenarios.map((item) => {
              const isActive = item.id === scenario.id;
              const isDone = progress.completedIds.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => loadScenario(item.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] ${
                    isActive
                      ? "border-[var(--accent)] bg-[color:var(--accent)]/7"
                      : "border-[var(--line)] bg-[color:var(--surface-2)] hover:border-[var(--accent)]/45"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">{difficultyLabel(item)}</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[var(--ink)]">{item.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-[color:var(--line)]/45 px-2 py-1">{aiRiskLabel(item.aiRiskTag)}</span>
                    {isDone ? (
                      <span className="rounded-full bg-emerald-950/35 px-2 py-1 font-medium text-emerald-200">Complete</span>
                    ) : (
                      <span className="rounded-full bg-amber-950/35 px-2 py-1 font-medium text-amber-200">Pending</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-6">
          <article className="panel">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="eyebrow">Active Scenario</p>
                <h2 className="section-title mt-2 text-2xl">{scenario.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{scenario.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scenario.focus.map((focusArea) => (
                    <span key={focusArea} className="rounded-full bg-[color:var(--line)]/55 px-2.5 py-1 text-xs font-medium capitalize">
                      {focusArea}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Timebox</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">{formatTime(remainingSeconds)}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Target: {scenario.timeboxMinutes} min</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0f1e17]">
              <div className="flex items-center justify-between border-b border-emerald-900/60 px-4 py-2 text-xs text-emerald-100/80">
                <span>{scenario.stack}</span>
                <span>{difficultyLabel(scenario)}</span>
              </div>
              <pre className="max-h-[320px] overflow-auto px-4 py-4 text-[0.82rem] leading-relaxed text-emerald-50">
                <code>{scenario.snippet}</code>
              </pre>
            </div>
          </article>

          <article className="panel">
            <h3 className="section-title text-xl">Submit your review findings</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Focus on severity, impact, and fix direction. Mention concrete evidence from the snippet.
            </p>
            <label className="mt-4 block text-sm font-semibold text-[var(--ink)]" htmlFor="review-input">
              Review notes
            </label>
            <textarea
              id="review-input"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              placeholder="Example: High severity - the SQL query interpolates user input, which enables injection. Use parameterized placeholders and enforce account ownership checks before querying."
              className="mt-2 min-h-[200px] w-full rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4 text-sm leading-7 text-[var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70 transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[var(--muted)]">
                {reviewText.trim().length} chars. Minimum 120 chars for a scored report.
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => setReviewText("")}>
                  Clear
                </button>
                <button type="button" className="btn-primary" onClick={handleSubmit}>
                  Score review
                </button>
              </div>
            </div>

            {statusMessage ? <p className="mt-3 text-sm text-[var(--muted)]">{statusMessage}</p> : null}
          </article>

          <article className="panel">
            <h3 className="section-title text-xl">Instant coach</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Real-time signals from your draft. Improve before you submit the final report.
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  Matched issue signals: {hintPreview.matchedCount}/{scenario.expectedIssues.length}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Mention explicit risks and remediation steps to improve match quality.
                </p>
              </div>

              {hintPreview.missing.slice(0, 3).map((issue) => (
                <div key={issue.id} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${severityTone(issue.severity)}`}>
                      {formatSeverityLabel(issue.severity)}
                    </span>
                    <p className="text-sm font-semibold text-[var(--ink)]">{issue.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{issue.hint}</p>
                </div>
              ))}
            </div>
          </article>

          {report ? (
            <article className="panel">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="eyebrow">Final Report</p>
                  <h3 className="section-title mt-2 text-2xl">Scenario performance</h3>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Score</p>
                  <p className={`mt-1 text-4xl font-semibold ${scoreTone(report.score)}`}>{report.score}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">Coverage {report.coverageScore}%</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/35 p-4">
                  <p className="text-sm font-semibold text-emerald-200">What you caught</p>
                  <ul className="mt-2 space-y-2 text-sm text-emerald-100">
                    {report.matchedIssues.length ? (
                      report.matchedIssues.map((issue) => (
                        <li key={issue.id}>
                          <span className="font-semibold">{issue.title}</span>
                          <span className="text-emerald-100"> - {issue.explanation}</span>
                        </li>
                      ))
                    ) : (
                      <li>No issue patterns matched yet.</li>
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-800/70 bg-amber-950/35 p-4">
                  <p className="text-sm font-semibold text-amber-200">What to improve</p>
                  <ul className="mt-2 space-y-2 text-sm text-amber-100">
                    {report.missedIssues.length ? (
                      report.missedIssues.map((issue) => (
                        <li key={issue.id}>
                          <span className="font-semibold">{issue.title}</span>
                          <span> - {issue.hint}</span>
                        </li>
                      ))
                    ) : (
                      <li>Great coverage. No missed issue categories in this scenario.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
                  <p className="text-sm font-semibold text-[var(--ink)]">Strengths</p>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                    {report.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
                  <p className="text-sm font-semibold text-[var(--ink)]">Next actions</p>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                    {report.nextSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4">
                <p className="text-sm font-semibold text-[var(--ink)]">Answer key and exemplar comments</p>
                <div className="mt-3 space-y-3">
                  {scenario.expectedIssues.map((issue) => (
                    <div key={issue.id} className="rounded-xl border border-[var(--line)]/70 bg-[color:var(--surface)] p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${severityTone(issue.severity)}`}>
                          {formatSeverityLabel(issue.severity)}
                        </span>
                        <p className="text-sm font-semibold text-[var(--ink)]">{issue.title}</p>
                      </div>
                      <p className="mt-2 text-sm text-[var(--muted)]">{issue.explanation}</p>
                      <p className="mt-2 rounded-lg bg-[color:var(--line)]/35 px-3 py-2 text-sm text-[var(--ink)]">
                        <span className="font-semibold">Exemplar comment:</span> {issue.exemplarComment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={() => loadScenario(nextScenario.id)}>
                  Next scenario
                </button>
                <button type="button" className="btn-secondary" onClick={() => loadScenario(scenario.id)}>
                  Retry scenario
                </button>
                <Link className="btn-secondary" href="/">
                  Back to landing
                </Link>
              </div>

              {bestScore ? (
                <p className="mt-3 text-xs text-[var(--muted)]">Best score on this scenario: {bestScore}</p>
              ) : null}
            </article>
          ) : null}
        </section>
      </div>
    </div>
  );
}
