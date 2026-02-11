import { ExpectedIssue, KataScenario, Severity } from "@/lib/kata-data";

export interface IssueResult extends ExpectedIssue {
  matched: boolean;
}

export interface ReviewReport {
  scenarioId: string;
  score: number;
  coverageScore: number;
  xpAward: number;
  matchedIssues: IssueResult[];
  missedIssues: IssueResult[];
  strengths: string[];
  nextSteps: string[];
}

export interface ProgressState {
  completedIds: string[];
  totalXp: number;
  bestScores: Record<string, number>;
}

const severityWeights: Record<Severity, number> = {
  high: 5,
  medium: 3,
  low: 2,
};

const coachingPrompts = ["risk", "impact", "fix", "test", "reproduce", "evidence"];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(normalizedText: string, candidates: string[]): boolean {
  return candidates.some((candidate) => normalizedText.includes(normalize(candidate)));
}

function communicationBonus(reviewText: string): number {
  const normalized = normalize(reviewText);
  const detailBonus = reviewText.length >= 420 ? 8 : reviewText.length >= 260 ? 6 : reviewText.length >= 140 ? 3 : 0;
  const coachTermHits = coachingPrompts.filter((term) => normalized.includes(term)).length;
  const termBonus = Math.min(6, coachTermHits * 2);
  const severityBonus = normalized.includes("high") || normalized.includes("critical") ? 3 : 0;

  return detailBonus + termBonus + severityBonus;
}

function buildIssueResults(scenario: KataScenario, reviewText: string): IssueResult[] {
  const normalizedReview = normalize(reviewText);

  return scenario.expectedIssues.map((issue) => ({
    ...issue,
    matched: includesAny(normalizedReview, issue.keywords),
  }));
}

export function evaluateReview(scenario: KataScenario, reviewText: string): ReviewReport {
  const issueResults = buildIssueResults(scenario, reviewText);
  const matchedIssues = issueResults.filter((issue) => issue.matched);
  const missedIssues = issueResults.filter((issue) => !issue.matched);

  const totalWeight = issueResults.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
  const matchedWeight = matchedIssues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);

  const coverageScore = totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);
  const score = clamp(Math.round(coverageScore * 0.88 + communicationBonus(reviewText)), 0, 100);
  const xpAward = 60 + score;

  const strengths: string[] = [];
  const nextSteps: string[] = [];

  if (matchedIssues.some((issue) => issue.severity === "high")) {
    strengths.push("You surfaced at least one high-severity production risk.");
  }

  if (reviewText.length >= 220) {
    strengths.push("Your review has enough detail for actionable follow-up.");
  }

  if (!strengths.length) {
    strengths.push("You submitted a complete review under time pressure.");
  }

  if (missedIssues.length) {
    nextSteps.push(
      `Prioritize missed ${missedIssues[0].severity}-severity issue: ${missedIssues[0].title.toLowerCase()}.`,
    );
  }

  if (reviewText.length < 220) {
    nextSteps.push("Increase specificity: call out impact and concrete remediation for each finding.");
  }

  if (!nextSteps.length) {
    nextSteps.push("Excellent pass. Try a higher-difficulty scenario to keep progressing.");
  }

  return {
    scenarioId: scenario.id,
    score,
    coverageScore,
    xpAward,
    matchedIssues,
    missedIssues,
    strengths,
    nextSteps,
  };
}

export interface HintPreview {
  missing: IssueResult[];
  matchedCount: number;
}

export function getLiveHintPreview(scenario: KataScenario, reviewText: string): HintPreview {
  const issueResults = buildIssueResults(scenario, reviewText);
  const missing = issueResults.filter((issue) => !issue.matched).sort((a, b) => {
    return severityWeights[b.severity] - severityWeights[a.severity];
  });

  return {
    missing,
    matchedCount: issueResults.length - missing.length,
  };
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 600) + 1;
}

export function getLevelProgress(xp: number): number {
  return (xp % 600) / 600;
}

export function formatSeverityLabel(severity: Severity): string {
  if (severity === "high") return "High";
  if (severity === "medium") return "Medium";
  return "Low";
}
