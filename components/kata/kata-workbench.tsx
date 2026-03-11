"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SignInModal } from "@/components/sign-in-modal";
import { getScenarioById, kataScenarios, KataScenario } from "@/lib/kata-data";
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

function getDailyScenarioId(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return kataScenarios[dayOfYear % kataScenarios.length].id;
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
  if (score >= 85) return "text-[var(--accent)]";
  if (score >= 65) return "text-amber-300";
  return "text-rose-300";
}

function severityTone(severity: "high" | "medium" | "low"): string {
  if (severity === "high") return "border-rose-800/70 bg-rose-950/35 text-rose-200";
  if (severity === "medium") return "border-amber-800/70 bg-amber-950/35 text-amber-200";
  return "border-cyan-800/70 bg-cyan-950/35 text-cyan-200";
}

type StoredUser = {
  name: string;
  email?: string;
};

type WorkbenchProps = {
  scenario: KataScenario;
  progress: ProgressState;
  reviewText: string;
  setReviewText: (value: string) => void;
  report: ReviewReport | null;
  statusMessage: string;
  remainingSeconds: number;
  level: number;
  levelProgress: number;
  completionRate: number;
  bestScore: number;
  hintPreview: ReturnType<typeof getLiveHintPreview>;
  nextScenarioId: string;
  showBackLink: boolean;
  onLoadScenario: (id: string) => void;
  onSubmit: () => void;
};

function HeaderBar({
  title,
  subtitle,
  showBackLink,
  level,
  totalXp,
  completionRate,
  levelProgress,
}: {
  title: string;
  subtitle: string;
  showBackLink: boolean;
  level: number;
  totalXp: number;
  completionRate: number;
  levelProgress: number;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)]/70 pb-4">
        <p className="wire-label">{title}</p>
        {showBackLink ? (
          <Link href="/" className="btn-secondary">
            Back To Landing
          </Link>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Code Review Kata</p>
          <h1 className="display-title mt-2 text-4xl md:text-5xl">{subtitle}</h1>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="metric-chip">
            <span>Level</span>
            <strong>{level}</strong>
          </div>
          <div className="metric-chip">
            <span>Total XP</span>
            <strong>{totalXp}</strong>
          </div>
          <div className="metric-chip">
            <span>Completion</span>
            <strong>{completionRate}%</strong>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--line)]/65">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${Math.max(levelProgress * 100, 4)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">Level progress {Math.round(levelProgress * 100)}%</p>
      </div>
    </div>
  );
}

function ScenarioInspector({ scenario, remainingSeconds }: { scenario: KataScenario; remainingSeconds: number }) {
  return (
    <article className="panel">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Today&apos;s Challenge</p>
          <h2 className="section-title mt-2 text-2xl">{scenario.title}</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{scenario.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scenario.focus.map((focusArea) => (
              <span
                key={focusArea}
                className="rounded-full border border-[var(--line)] bg-[color:var(--surface)] px-2.5 py-1 text-xs font-medium capitalize"
              >
                {focusArea}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3 text-right">
          <p className="wire-label">Timebox</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">{formatTime(remainingSeconds)}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Target: {scenario.timeboxMinutes} min</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#070d15]">
        <div className="flex items-center justify-between border-b border-cyan-900/40 px-4 py-2 text-xs text-cyan-100/80">
          <span>{scenario.stack}</span>
          <span>{difficultyLabel(scenario)}</span>
        </div>
        <pre className="max-h-[320px] overflow-auto px-4 py-4 text-[0.82rem] leading-relaxed text-cyan-50">
          <code>{scenario.snippet}</code>
        </pre>
      </div>
    </article>
  );
}

function ReviewEditor({
  reviewText,
  setReviewText,
  statusMessage,
  onSubmit,
}: {
  reviewText: string;
  setReviewText: (value: string) => void;
  statusMessage: string;
  onSubmit: () => void;
}) {
  return (
    <article className="panel">
      <h3 className="section-title text-xl">Submit your review findings</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Prioritize severity, impact, and practical fix direction. Cite specific evidence from the snippet.
      </p>

      <label className="mt-4 block text-sm font-semibold text-[var(--ink)]" htmlFor="review-input">
        Review notes
      </label>
      <textarea
        id="review-input"
        value={reviewText}
        onChange={(event) => setReviewText(event.target.value)}
        placeholder="Example: High severity - request path allows traversal through unsanitized file name. Normalize input and enforce allowed root directories before read/write."
        className="mt-2 min-h-[200px] w-full rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] p-4 text-sm leading-7 text-[var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70 transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[var(--muted)]">{reviewText.trim().length} chars. Minimum 120 chars for scoring.</p>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setReviewText("")}>
            Clear
          </button>
          <button type="button" className="btn-primary" onClick={onSubmit}>
            Score Review
          </button>
        </div>
      </div>

      {statusMessage ? <p className="mt-3 text-sm text-[var(--muted)]">{statusMessage}</p> : null}
    </article>
  );
}

function CoachPanel({ hintPreview, scenario }: { hintPreview: ReturnType<typeof getLiveHintPreview>; scenario: KataScenario }) {
  return (
    <article className="panel">
      <h3 className="section-title text-xl">Instant coach</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Preview missing issue signals as you write and tighten your review before final submission.
      </p>
      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--ink)]">
            Matched issue signals: {hintPreview.matchedCount}/{scenario.expectedIssues.length}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Mention explicit vulnerabilities, logical flaws, and concrete remediations.</p>
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
  );
}

function FinalReport({
  report,
  scenario,
  bestScore,
  nextScenarioId,
  onLoadScenario,
}: {
  report: ReviewReport;
  scenario: KataScenario;
  bestScore: number;
  nextScenarioId: string;
  onLoadScenario: (id: string) => void;
}) {
  return (
    <article className="panel">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Final Report</p>
          <h3 className="section-title mt-2 text-2xl">Scenario performance</h3>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-2)] px-4 py-3 text-right">
          <p className="wire-label">Score</p>
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
              <p className="mt-2 rounded-lg border border-[var(--line)]/70 bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[var(--ink)]">
                <span className="font-semibold">Exemplar comment:</span> {issue.exemplarComment}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => onLoadScenario(nextScenarioId)}>
          Next scenario
        </button>
        <button type="button" className="btn-secondary" onClick={() => onLoadScenario(scenario.id)}>
          Retry scenario
        </button>
      </div>

      {bestScore ? <p className="mt-3 text-xs text-[var(--muted)]">Best score on this scenario: {bestScore}</p> : null}
    </article>
  );
}

function MidnightLayout(props: WorkbenchProps) {
  return (
    <div className="mx-auto w-full max-w-[860px] px-4 pb-14 pt-8 md:px-8">
      <HeaderBar
        title="Midnight Review Lab / Practice Workspace"
        subtitle="Practice PR reviews in 5-minute rounds"
        showBackLink={props.showBackLink}
        level={props.level}
        totalXp={props.progress.totalXp}
        completionRate={props.completionRate}
        levelProgress={props.levelProgress}
      />

      <section className="mt-6 space-y-6">
        <ScenarioInspector scenario={props.scenario} remainingSeconds={props.remainingSeconds} />
        <ReviewEditor
          reviewText={props.reviewText}
          setReviewText={props.setReviewText}
          statusMessage={props.statusMessage}
          onSubmit={props.onSubmit}
        />
        <CoachPanel hintPreview={props.hintPreview} scenario={props.scenario} />
        {props.report ? (
          <FinalReport
            report={props.report}
            scenario={props.scenario}
            bestScore={props.bestScore}
            nextScenarioId={props.nextScenarioId}
            onLoadScenario={props.onLoadScenario}
          />
        ) : null}
      </section>
    </div>
  );
}

export function KataWorkbench({ embedded = false }: { embedded?: boolean }) {
  const [selectedId, setSelectedId] = useState(() => getDailyScenarioId());
  const [reviewText, setReviewText] = useState("");
  const [report, setReport] = useState<ReviewReport | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [user, setUser] = useState<StoredUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw = window.localStorage.getItem("reviewforge-user");
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  });
  const [signInOpen, setSignInOpen] = useState(false);
  const [pendingScenarioId, setPendingScenarioId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const daily = getScenarioById(getDailyScenarioId());
    return daily.timeboxMinutes * 60;
  });
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());
  const dailyScenarioId = getDailyScenarioId();

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

  function handleScenarioChange(id: string) {
    const needsSignIn = !user && id !== selectedId && id !== dailyScenarioId;

    if (needsSignIn) {
      setPendingScenarioId(id);
      setSignInOpen(true);
      setStatusMessage("Sign in to unlock follow-up PRs after today's daily review.");
      return;
    }

    loadScenario(id);
  }

  function handleSignIn(name: string) {
    const raw = window.localStorage.getItem("reviewforge-user");

    if (raw) {
      try {
        setUser(JSON.parse(raw) as StoredUser);
      } catch {
        setUser({ name });
      }
    } else {
      setUser({ name });
    }

    setSignInOpen(false);

    if (pendingScenarioId) {
      const nextId = pendingScenarioId;
      setPendingScenarioId(null);
      loadScenario(nextId);
    }
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

  const commonProps: WorkbenchProps = {
    scenario,
    progress,
    reviewText,
    setReviewText,
    report,
    statusMessage,
    remainingSeconds,
    level,
    levelProgress,
    completionRate,
    bestScore,
    hintPreview,
    nextScenarioId: nextScenario.id,
    showBackLink: !embedded,
    onLoadScenario: handleScenarioChange,
    onSubmit: handleSubmit,
  };

  const followUpModal = (
    <SignInModal
      open={signInOpen}
      onClose={() => setSignInOpen(false)}
      onSignIn={handleSignIn}
      eyebrow="Follow-up Queue"
      title="Sign in to review follow-up PRs"
      description="Today's daily PR stays open to everyone. Sign in when you want to continue into additional review rounds."
      submitLabel="Unlock Follow-up PRs"
    />
  );

  return (
    <>
      {followUpModal}
      <MidnightLayout {...commonProps} />
    </>
  );
}
