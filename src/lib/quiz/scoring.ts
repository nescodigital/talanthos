import { QUIZ_QUESTIONS, AnswerLetter, BiblicalType } from './questions';

export interface ScoreResult {
  scores: { builder: number; steward: number; sower: number; visionary: number };
  primaryType: BiblicalType;
  secondaryType: BiblicalType | null;
}

export function calculateScores(answers: { question: number; letter: AnswerLetter }[]): ScoreResult {
  const scores = { builder: 0, steward: 0, sower: 0, visionary: 0 };

  for (const answer of answers) {
    const question = QUIZ_QUESTIONS.find(q => q.number === answer.question);
    if (!question) continue;
    const option = question.options.find(o => o.letter === answer.letter);
    if (!option) continue;
    scores.builder += option.scoring.builder;
    scores.steward += option.scoring.steward;
    scores.sower += option.scoring.sower;
    scores.visionary += option.scoring.visionary;
  }

  // Tie-breaking priority: steward > builder > sower > visionary
  const priorityOrder: BiblicalType[] = ['steward', 'builder', 'sower', 'visionary'];
  const sortedTypes = priorityOrder.sort((a, b) => scores[b] - scores[a]);

  const primaryType = sortedTypes[0];
  const secondaryScore = scores[sortedTypes[1]];
  const primaryScore = scores[primaryType];

  // Secondary only shown if within 2 points of primary
  const secondaryType = (primaryScore - secondaryScore) <= 2 ? sortedTypes[1] : null;

  return { scores, primaryType, secondaryType };
}
