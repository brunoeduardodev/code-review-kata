# Proposed Skill: `kata-authoring`

No curated skill currently targets end-to-end kata product authoring (spec -> UX -> premium landing -> scenario engine -> scoring). Following `$skill-creator` guidance, this is the proposed skill for future reuse.

## Skill Frontmatter Draft
```yaml
---
name: kata-authoring
description: Create or evolve software-engineering training kata products, including one-page product specs, UX/IA, premium landing pages, scenario design, scoring rubrics, and Next.js implementation patterns. Use when users ask for code-review kata/training experiences or workshop-style engineering drills.
---
```

## SKILL.md Body Outline
1. **Workflow Overview**
- Convert idea into goals, non-goals, and measurable outcomes.
- Ask minimum clarifying questions.
- Produce spec + IA + design tokens before coding.

2. **Kata Design Rules**
- Define level mix (junior/mid/senior).
- Enforce scenario timeboxes.
- Define rubric categories and scoring weights.
- Include answer-key and exemplar comments.

3. **Premium Landing Pattern**
- Generate 3 hero variants (outcome/pain/authority).
- Select winning variant and refine copy.
- Build sections: features, flow, proof placeholders, FAQ, final CTA.

4. **Next.js App Router Build Pattern**
- Route structure for landing + kata workspace.
- Data model for scenarios and expected issues.
- Instant hint engine and final report model.
- XP progression and completion persistence.

5. **Quality Gates**
- Accessibility checks (focus, contrast, semantics).
- Performance defaults (minimal client JS, optimized fonts, metadata).
- Lint/build verification and release checklist.

## References To Include
- `references/scenario-patterns.md`: issue archetypes and sample snippets.
- `references/rubric-weights.md`: scoring schema by seniority.
- `references/landing-copy-templates.md`: high-conversion copy blocks.
- `references/nextjs-architecture.md`: app structure and implementation guardrails.

## Optional Bundled Resources
- `assets/landing-sections/`: reusable section templates.
- `scripts/generate-scenarios.ts`: deterministic scenario seeding tool.
- `scripts/score-review.ts`: scorer for hint/report parity tests.

