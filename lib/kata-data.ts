export type Severity = "high" | "medium" | "low";

export interface ExpectedIssue {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  hint: string;
  explanation: string;
  exemplarComment: string;
  keywords: string[];
}

export interface KataScenario {
  id: string;
  title: string;
  slug: string;
  stack: string;
  level: "junior" | "mid" | "senior" | "mixed";
  difficulty: "foundations" | "applied" | "advanced";
  aiRiskTag:
    | "hallucinated-apis"
    | "logic-bug"
    | "edge-case"
    | "security"
    | "testing"
    | "performance";
  summary: string;
  focus: string[];
  timeboxMinutes: number;
  snippet: string;
  expectedIssues: ExpectedIssue[];
}

interface DomainVariant {
  slug: string;
  label: string;
}

interface Blueprint {
  key: string;
  aiRiskTag: KataScenario["aiRiskTag"];
  stack: string;
  difficulty: KataScenario["difficulty"];
  summary: (domain: DomainVariant) => string;
  snippet: (domain: DomainVariant) => string;
  focus: string[];
  expectedIssues: (domain: DomainVariant) => Omit<ExpectedIssue, "id">[];
}

const domains: DomainVariant[] = [
  { slug: "retail-checkout", label: "Retail Checkout" },
  { slug: "health-claims", label: "Health Claims" },
  { slug: "fintech-ledger", label: "Fintech Ledger" },
  { slug: "travel-booking", label: "Travel Booking" },
  { slug: "dispatch-ops", label: "Dispatch Ops" },
];

const blueprints: Blueprint[] = [
  {
    key: "hallucinated-api",
    aiRiskTag: "hallucinated-apis",
    stack: "Next.js + TypeScript",
    difficulty: "foundations",
    summary: (domain) =>
      `Review an AI-authored invoice route for ${domain.label} and validate API correctness before merge.`,
    snippet: (domain) => `import { paymentsClient } from "@/lib/payments-client";

export async function POST(req: Request) {
  const body = await req.json();

  const invoice = await paymentsClient.invoices.generateSmartInvoice({
    tenant: "${domain.slug}",
    customerId: body.customerId,
    items: body.items,
  });

  return Response.json({ invoiceId: invoice.id });
}
`,
    focus: ["correctness", "architecture", "resilience"],
    expectedIssues: (domain) => [
      {
        title: "Calls a hallucinated SDK method",
        category: "correctness",
        severity: "high",
        hint: "Verify SDK methods against the official client API before approving.",
        explanation:
          "The route calls `generateSmartInvoice`, which is not part of the payments client. This will fail at runtime despite passing a superficial review.",
        exemplarComment:
          "`generateSmartInvoice` appears non-existent in the SDK. Please replace with the supported invoice creation endpoint and add a typed contract test.",
        keywords: [
          "generateSmartInvoice",
          "method does not exist",
          "hallucinated api",
          "unsupported sdk method",
          "nonexistent method",
        ],
      },
      {
        title: "No request payload validation",
        category: "security",
        severity: "medium",
        hint: "Validate shape and constraints for customerId/items before calling downstream APIs.",
        explanation:
          `Unvalidated request bodies in ${domain.label} can trigger malformed downstream calls and unexpected invoice creation behavior.`,
        exemplarComment:
          "Please add schema validation (zod/yup) for `customerId` and `items` before invoking the payments client.",
        keywords: [
          "validation",
          "schema",
          "zod",
          "unvalidated payload",
          "sanitize body",
        ],
      },
    ],
  },
  {
    key: "subtle-logic",
    aiRiskTag: "logic-bug",
    stack: "Node + TypeScript",
    difficulty: "applied",
    summary: (domain) =>
      `Review retry lockout logic for ${domain.label}; AI generated the implementation from a vague prompt.`,
    snippet: (domain) => `const MAX_ATTEMPTS = 5;

export function shouldLockAccount(attempts: number, hasAdminBypass: boolean) {
  if (hasAdminBypass) return false;

  // Lock only after too many failures
  if (attempts > MAX_ATTEMPTS) {
    return true;
  }

  return false;
}

export function recordFailedAttempt(current: number) {
  return current + 1;
}

export function mapAuditReason() {
  return "${domain.label}:account-lockout";
}
`,
    focus: ["correctness", "readability", "tests"],
    expectedIssues: () => [
      {
        title: "Off-by-one lockout bug",
        category: "correctness",
        severity: "high",
        hint: "Check whether lock should happen on the 5th or 6th failed attempt.",
        explanation:
          "The lock should trigger when attempts reach the max threshold, but `>` delays locking by one failed attempt.",
        exemplarComment:
          "`attempts > MAX_ATTEMPTS` likely misses the threshold boundary. Should this be `>=` to lock exactly at the policy limit?",
        keywords: ["off-by-one", ">=", "threshold", "boundary", "attempts >"],
      },
      {
        title: "No tests covering threshold boundary",
        category: "testing",
        severity: "medium",
        hint: "Boundary tests should cover 4, 5, and 6 attempts.",
        explanation:
          "Without explicit threshold tests, the defect is easy to miss in AI-generated policy logic.",
        exemplarComment:
          "Please add unit tests for attempts 4/5/6 to confirm lockout behavior at boundaries.",
        keywords: [
          "boundary test",
          "unit test",
          "threshold test",
          "missing tests",
          "test case",
        ],
      },
    ],
  },
  {
    key: "edge-case",
    aiRiskTag: "edge-case",
    stack: "Next.js Server Action",
    difficulty: "applied",
    summary: (domain) =>
      `Review edge-case handling for a ${domain.label} fulfillment estimator generated by AI autocomplete.`,
    snippet: (domain) => `type Shipment = {
  etaDays?: number;
  priority?: "standard" | "express";
};

export async function estimatePrimaryEta(shipments: Shipment[]) {
  const primary = shipments[0];

  if (primary.priority === "express") {
    return Math.max(1, primary.etaDays! - 2);
  }

  return primary.etaDays!.toString();
}

export function scopeTag() {
  return "${domain.slug}";
}
`,
    focus: ["correctness", "defensive coding", "readability"],
    expectedIssues: (domain) => [
      {
        title: "Assumes non-empty shipment array",
        category: "correctness",
        severity: "high",
        hint: "Handle the empty array path before reading index 0.",
        explanation:
          `If ${domain.label} has zero queued shipments, this throws before returning a fallback response.`,
        exemplarComment:
          "Please guard for empty shipments before dereferencing `shipments[0]`; current code can throw in valid no-shipment states.",
        keywords: [
          "empty array",
          "shipments[0]",
          "undefined",
          "null check",
          "guard clause",
        ],
      },
      {
        title: "Unsafe non-null assertions",
        category: "correctness",
        severity: "medium",
        hint: "`etaDays!` bypasses compiler checks and can hide null data defects.",
        explanation:
          "The function assumes `etaDays` always exists and may return mixed types (`number` and `string`).",
        exemplarComment:
          "`etaDays!` can mask missing data. Consider explicit fallback handling and a single return type.",
        keywords: [
          "non-null assertion",
          "etaDays!",
          "mixed return type",
          "type safety",
          "optional value",
        ],
      },
    ],
  },
  {
    key: "security-gap",
    aiRiskTag: "security",
    stack: "API Route + SQL",
    difficulty: "advanced",
    summary: (domain) =>
      `Review a data lookup endpoint for ${domain.label} focused on authn/authz and query safety.`,
    snippet: (domain) => `import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const accountId = url.searchParams.get("accountId");
  const status = url.searchParams.get("status") ?? "open";

  const sql = \`SELECT id, amount, status FROM transactions WHERE account_id = '\${accountId}' AND status = '\${status}'\`;
  const rows = await db.query(sql);

  return Response.json({ source: "${domain.label}", rows });
}
`,
    focus: ["security", "architecture", "correctness"],
    expectedIssues: () => [
      {
        title: "SQL injection risk via string interpolation",
        category: "security",
        severity: "high",
        hint: "Parameterized queries are mandatory for accountId and status.",
        explanation:
          "Directly interpolating query parameters in SQL enables injection and data exfiltration.",
        exemplarComment:
          "Query is vulnerable to SQL injection. Please switch to parameterized placeholders and bound values.",
        keywords: [
          "sql injection",
          "parameterized",
          "string interpolation",
          "prepared statement",
          "unsafe sql",
        ],
      },
      {
        title: "Missing authentication and authorization checks",
        category: "security",
        severity: "high",
        hint: "Verify caller identity and enforce account ownership before querying.",
        explanation:
          "The endpoint exposes transaction data without checking if the requester is authenticated or owns the account.",
        exemplarComment:
          "Please enforce session auth and account-level authorization before returning transaction data.",
        keywords: [
          "missing auth",
          "authorization",
          "access control",
          "no authentication",
          "ownership check",
        ],
      },
    ],
  },
  {
    key: "weak-tests",
    aiRiskTag: "testing",
    stack: "Vitest + TypeScript",
    difficulty: "foundations",
    summary: (domain) =>
      `Review test quality for an AI-written shipping calculator in ${domain.label}.`,
    snippet: () => `import { describe, expect, it } from "vitest";
import { computeShippingQuote } from "./shipping";

describe("computeShippingQuote", () => {
  it("returns data", () => {
    const result = computeShippingQuote({
      distanceKm: 380,
      fragile: true,
      priority: "express",
    });

    expect(result).toBeDefined();
  });

  it("stays fast", () => {
    const start = Date.now();
    computeShippingQuote({ distanceKm: 5, fragile: false, priority: "standard" });
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
`,
    focus: ["testing", "correctness", "readability"],
    expectedIssues: (domain) => [
      {
        title: "Assertions are too weak",
        category: "testing",
        severity: "high",
        hint: "`toBeDefined()` does not verify correctness of quote totals or fields.",
        explanation:
          `The test suite for ${domain.label} can pass even when pricing logic is wrong, because there are no behavioral assertions.`,
        exemplarComment:
          "Current tests only check that a value exists. Please assert exact totals/fields for representative scenarios.",
        keywords: [
          "weak assertion",
          "toBeDefined",
          "assert exact value",
          "insufficient test",
          "behavioral assertion",
        ],
      },
      {
        title: "No edge-case test coverage",
        category: "testing",
        severity: "medium",
        hint: "Add cases for zero distance, invalid input, and max range.",
        explanation:
          "AI-generated tests often miss boundary and invalid input paths, allowing regressions in production.",
        exemplarComment:
          "Please add edge-case tests for zero/negative distance and unsupported priority values.",
        keywords: [
          "edge case test",
          "boundary",
          "invalid input",
          "missing coverage",
          "zero distance",
        ],
      },
    ],
  },
  {
    key: "perf-regression",
    aiRiskTag: "performance",
    stack: "Node Service",
    difficulty: "advanced",
    summary: (domain) =>
      `Review a ${domain.label} reconciliation worker where AI optimized for readability but not runtime cost.`,
    snippet: () => `type Invoice = { id: string; lineItems: { sku: string; amount: number }[] };

type CatalogItem = { sku: string; taxRate: number };

export async function computeTaxTotals(invoices: Invoice[], catalog: CatalogItem[]) {
  const totals: Record<string, number> = {};

  for (const invoice of invoices) {
    let invoiceTax = 0;

    for (const lineItem of invoice.lineItems) {
      const item = catalog.find((catalogEntry) => catalogEntry.sku === lineItem.sku);
      const rate = item?.taxRate ?? 0;
      invoiceTax += lineItem.amount * rate;
    }

    totals[invoice.id] = invoiceTax;
  }

  return totals;
}
`,
    focus: ["performance", "architecture", "readability"],
    expectedIssues: (domain) => [
      {
        title: "Nested lookup causes avoidable O(n*m) cost",
        category: "performance",
        severity: "high",
        hint: "Pre-index catalog by sku before iterating invoices.",
        explanation:
          `Repeated linear lookups inside loops can spike latency when ${domain.label} invoice volume grows.`,
        exemplarComment:
          "`catalog.find` inside the inner loop creates O(n*m) behavior; build a `Map<sku, taxRate>` once before processing.",
        keywords: [
          "o(n*m)",
          "catalog.find in loop",
          "map lookup",
          "pre-index",
          "performance regression",
        ],
      },
      {
        title: "No large-volume performance test",
        category: "testing",
        severity: "medium",
        hint: "Add benchmark-style test with realistic invoice counts.",
        explanation:
          "Without load-oriented tests, this degradation is likely to escape review.",
        exemplarComment:
          "Please add a performance test for 5k+ invoices to catch algorithmic regressions.",
        keywords: [
          "performance test",
          "benchmark",
          "load test",
          "large dataset",
          "scalability",
        ],
      },
    ],
  },
];

const riskLabelMap: Record<KataScenario["aiRiskTag"], string> = {
  "hallucinated-apis": "Hallucinated APIs",
  "logic-bug": "Subtle Logic Bugs",
  "edge-case": "Missing Edge Cases",
  security: "Security Vulnerabilities",
  testing: "Poor Tests",
  performance: "Performance Regressions",
};

export function aiRiskLabel(tag: KataScenario["aiRiskTag"]): string {
  return riskLabelMap[tag];
}

export const kataScenarios: KataScenario[] = domains.flatMap((domain) =>
  blueprints.map((blueprint) => {
    const baseId = `${blueprint.key}-${domain.slug}`;
    const issues = blueprint
      .expectedIssues(domain)
      .map((issue, issueIndex) => ({ ...issue, id: `${baseId}-issue-${issueIndex + 1}` }));

    return {
      id: baseId,
      slug: baseId,
      title: `${aiRiskLabel(blueprint.aiRiskTag)} - ${domain.label}`,
      stack: blueprint.stack,
      level: "mixed",
      difficulty: blueprint.difficulty,
      aiRiskTag: blueprint.aiRiskTag,
      summary: blueprint.summary(domain),
      focus: blueprint.focus,
      timeboxMinutes: 5,
      snippet: blueprint.snippet(domain).trimEnd(),
      expectedIssues: issues,
    };
  }),
);

export function getScenarioById(id: string): KataScenario {
  const scenario = kataScenarios.find((item) => item.id === id);

  if (!scenario) {
    return kataScenarios[0];
  }

  return scenario;
}

export function getDailyScenario(): KataScenario {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  return kataScenarios[dayOfYear % kataScenarios.length];
}
