import { BiblicalType, countTypes } from './scoring';

export interface HintResult {
  headline: string;
  body: string;
}

const HINTS: Record<BiblicalType, { early: string; mid: string }> = {
  visionary: {
    early: "You instinctively see money as forward energy — something meant to seed what's next.",
    mid: "A forward instinct keeps appearing: you evaluate resources by what they could become, not just what they are.",
  },
  guardian: {
    early: "Your first reflex leans toward protection and preparation. That discipline is uncommon.",
    mid: "Protection and foresight keep surfacing. You don't treat money as accidental — you treat it as trust.",
  },
  giver: {
    early: "An outward orientation shows early — thinking of others before comfort or gain.",
    mid: "Your answers consistently orient outward. You evaluate money by where it can be sent, not just where it lands.",
  },
  builder: {
    early: "Structure and purpose appear in your first choices. You look for the system behind the surface.",
    mid: "A pattern of order and intention keeps emerging. You don't follow money; you shape it into something lasting.",
  },
};

const BALANCED_HINT: HintResult = {
  headline: "A complex pattern is emerging.",
  body: "No single instinct dominates your answers so far. The next questions will reveal which force deepens — and which one competes with it.",
};

function buildHint(dominant: BiblicalType, count: number, total: number): HintResult {
  const intensity = count / total;
  const phase = total <= 2 ? 'early' : 'mid';
  return {
    headline: intensity >= 0.75
      ? "A clear pattern is forming."
      : "Something is emerging.",
    body: HINTS[dominant][phase],
  };
}

export function getIdentityHint(scoringAnswers: { type: BiblicalType }[]): HintResult | null {
  if (scoringAnswers.length < 2) return null;

  const counts = countTypes(scoringAnswers);
  const sorted = (Object.entries(counts) as [BiblicalType, number][])
    .sort((a, b) => b[1] - a[1]);

  const [primary, primaryCount] = sorted[0];
  const [, secondaryCount] = sorted[1];

  // If split evenly (e.g., 1-1 after 2 answers, or 2-2 after 4), return balanced
  if (primaryCount === secondaryCount) return BALANCED_HINT;

  return buildHint(primary, primaryCount, scoringAnswers.length);
}
