# ReviewForge

ReviewForge is a Next.js App Router kata platform that helps engineers improve code reviews for AI-generated code.

## What is included

- Premium conversion landing page (`/`) with high-intent CTA.
- Kata workspace (`/kata`) with 30 PR-style scenarios.
- Instant hinting while users draft findings.
- Final report with score, missed risks, answer key, and exemplar review comments.
- Local XP progression and completion tracking.

## Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- React 19

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Environment variables

No environment variables are required for v1.

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Build command: `pnpm build`.
4. Output: Next.js default.

## Project structure

```text
app/
  page.tsx              # Landing page
  kata/page.tsx         # Kata workspace route
  layout.tsx            # Metadata + fonts
  globals.css           # Design tokens + shared styles
components/
  kata/kata-workbench.tsx
lib/
  kata-data.ts          # 30 scenario generator + answer-key data
  kata-engine.ts        # scoring, hints, levels
docs/
  mvp-spec.md
  skill-proposal-kata-authoring.md
```

## Notes

- Progress is persisted in `localStorage` using key `reviewforge-progress-v1`.
- v1 is intentionally backend-free to keep onboarding fast for teams.
