import { BiblicalType } from './types';

export interface ScoreResult {
  scores: { visionary: number; guardian: number; giver: number; builder: number };
  primaryType: BiblicalType;
  secondaryType: BiblicalType | null;
}

export function calculateScores(answers: { type: BiblicalType }[]): ScoreResult {
  const scores = { visionary: 0, guardian: 0, giver: 0, builder: 0 };

  for (const answer of answers) {
    scores[answer.type] = (scores[answer.type] || 0) + 1;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]) as [BiblicalType, number][];
  const primaryType = sorted[0][0];
  const primaryScore = sorted[0][1];
  const secondaryScore = sorted[1][1];

  // Secondary only shown if within 1 point of primary
  const secondaryType = primaryScore - secondaryScore <= 1 ? sorted[1][0] : null;

  return { scores, primaryType, secondaryType };
}
