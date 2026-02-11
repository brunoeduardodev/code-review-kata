# ReviewForge MVP Spec

## 1) Product Definition (One Page)

### Problem
Engineering teams are receiving more AI-generated code and need faster, higher-quality human review skills to catch correctness, security, performance, test, and architecture issues before merge.

### Goals
- Train engineers through short PR-style review simulations.
- Improve review quality with immediate coaching plus an end report.
- Motivate repetition using score + XP progression.

### Non-Goals (v1)
- Live GitHub integration.
- Multiplayer collaboration.
- AI-generated custom scenarios.
- Enterprise auth / billing.

### Persona
- Primary: self-serve software engineer practicing code review like HackerRank-style drills.
- Secondary: engineering managers evaluating team review baseline.

### Core Loop
1. User lands on conversion-focused homepage.
2. User starts a 5-minute kata scenario.
3. User submits findings; system gives instant coaching + final report.
4. User gains XP and unlocks next scenarios.
5. User repeats to improve score trend.

### Success Metrics
- Primary: median review score increase per user over 7-day window.
- Secondary: kata completion rate.
- Secondary: XP growth consistency (sessions/week).

### MVP Scope (Next week)
- Premium landing page and CTA to start practice.
- 30 PR-style scenarios (5 minutes each) from six AI-risk categories.
- Kata workbench with scenario list, snippet viewer, finding submission, instant hints.
- Final report with matched/missed issues and exemplar review comments.
- Local XP + completion tracking.

## 2) UX Plan + IA

### Routes
- `/` Landing page (marketing + conversion).
- `/kata` Practice workspace.

### Main Journey
- Landing -> "Start free kata" -> scenario pick -> submit review -> report -> continue.

### Key States
- Empty state: no completions, XP level 1.
- Active state: reviewing scenario with countdown guidance.
- Feedback state: instant coach hints while writing.
- Completion state: end report + answer key + exemplary comments.

### Edge Cases
- Very short review text: block submit with helper copy.
- No matched findings: still show guided misses and next action.
- Returning user: hydrate progress from local storage safely.

## 3) Design System

### Brand Direction
- Confident editorial + technical precision.
- Warm neutral base, emerald signal color, steel accents.
- High legibility and strong vertical rhythm.

### Tokens
- Color
  - `--bg`: `#f8f7f2`
  - `--surface`: `#fefdfa`
  - `--ink`: `#14231c`
  - `--muted`: `#4a5d52`
  - `--line`: `#cad7cf`
  - `--accent`: `#0f8a62`
  - `--accent-strong`: `#0a6b4b`
  - `--warning`: `#b45309`
  - `--danger`: `#9f1239`
- Typography
  - Display/headline: `Space Grotesk`
  - Body/UI: `Public Sans`
  - Code: `IBM Plex Mono`
- Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`
- Radius: `10, 16, 24`
- Grid: 12-column desktop, 4-column mobile.

### Core Components
- Header with sticky nav and CTA.
- Hero module with credibility chips and dual CTA.
- Feature cards, timeline steps, social-proof placeholder rail.
- Scenario card grid with filters.
- Review editor panel + instant coach panel.
- Score/XP badge, progress rail, report panel.

## 4) Landing Page Copy Exploration

### Hero Variant A: Outcome-First
- H1: "Ship safer code in 5-minute review drills."
- Sub: "Practice spotting AI-era defects before they hit production."
- CTA: "Start free kata"

### Hero Variant B: Pain-Aware
- H1: "AI writes faster than teams can review."
- Sub: "Train your review muscle with realistic pull-request simulations."
- CTA: "Run your first review"

### Hero Variant C: Authority-Proof
- H1: "The code review gym for modern engineering teams."
- Sub: "Scenario-based drills with scoring, coaching, and benchmarked progress."
- CTA: "Practice like top teams"

### Selected Hero (B)
Chosen for strongest emotional resonance with the exact problem statement and immediate conversion clarity.

### Full Landing Sections (v1)
- Hero + trust rail.
- "Why teams use ReviewForge" features.
- "How it works" 3-step flow.
- Scenario coverage (AI defect categories).
- Proof placeholders (team logos / testimonials placeholders).
- FAQ.
- Final CTA.

## 5) Implementation Notes
- Framework: Next.js App Router + TypeScript strict.
- Styling: Tailwind CSS v4 with CSS variable tokens.
- No external backend in v1; local mock scenario engine + localStorage progression.
- SEO metadata and OpenGraph set in layout + page metadata.

