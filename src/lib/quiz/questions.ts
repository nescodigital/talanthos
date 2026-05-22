export type AnswerLetter = 'A' | 'B' | 'C' | 'D';
export type BiblicalType = 'visionary' | 'guardian' | 'giver' | 'builder';

export interface AnswerOption {
  letter: AnswerLetter;
  text: string;
  type: BiblicalType;
}

export interface SelectOption {
  value: string;
  text: string;
}

export type QuestionType = 'choice' | 'select' | 'text';

export interface BaseQuestion {
  id: string;
  q: string;
  type: QuestionType;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice';
  options: AnswerOption[];
}

export interface SelectQuestion extends BaseQuestion {
  type: 'select';
  options: SelectOption[];
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeholder: string;
  maxLength?: number;
  rows?: number;
}

export type QuizQuestion = ChoiceQuestion | SelectQuestion | TextQuestion;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Demographics (first 3) ──
  {
    id: 'gender',
    type: 'select',
    q: 'You are',
    options: [
      { value: 'male', text: 'A man' },
      { value: 'female', text: 'A woman' },
    ],
  },
  {
    id: 'denomination',
    type: 'select',
    q: 'Your faith tradition',
    options: [
      { value: 'catholic', text: 'Roman Catholic' },
      { value: 'orthodox', text: 'Eastern Orthodox (Greek, Russian, Romanian, Serbian…)' },
      { value: 'protestant-liturgical', text: 'Protestant: Lutheran, Anglican, Presbyterian, Methodist, Reformed' },
      { value: 'protestant-evangelical', text: 'Protestant: Baptist, Evangelical, Non-denominational' },
      { value: 'pentecostal', text: 'Pentecostal / Charismatic' },
      { value: 'other-christian', text: "Another Christian tradition (Adventist, LDS, Jehovah's Witness…)" },
      { value: 'exploring', text: 'Exploring faith / Not Christian' },
    ],
  },
  {
    id: 'age',
    type: 'select',
    q: 'Your age',
    options: [
      { value: '18-24', text: '18–24' },
      { value: '25-34', text: '25–34' },
      { value: '35-44', text: '35–44' },
      { value: '45-54', text: '45–54' },
      { value: '55-64', text: '55–64' },
      { value: '65+', text: '65 or older' },
    ],
  },
  // ── Scoring block 1 (Q4-Q6) — hint after Q6 (q2) ──
  {
    id: 'q1',
    type: 'choice',
    q: "When unexpected money arrives, your first instinct is to",
    options: [
      { letter: 'A', text: "Run the numbers on what it could become", type: 'visionary' },
      { letter: 'B', text: "Set most of it aside before it gets spent", type: 'guardian' },
      { letter: 'C', text: "Think of someone who needs it more than I do", type: 'giver' },
      { letter: 'D', text: "Apply it to the plan I'm already executing", type: 'builder' },
    ],
  },
  {
    id: 'q2',
    type: 'choice',
    q: "Where you feel money is most often quietly working against you",
    options: [
      { letter: 'A', text: "I'm moving faster than my counsel can keep up with", type: 'visionary' },
      { letter: 'B', text: "I'm hoarding what I was meant to deploy", type: 'guardian' },
      { letter: 'C', text: "I'm giving from a place I haven't fully resourced", type: 'giver' },
      { letter: 'D', text: "I'm finishing systems no one asked me to build", type: 'builder' },
    ],
  },
  {
    id: 'q3',
    type: 'choice',
    q: "The scripture that most often steadies your hand",
    options: [
      { letter: 'A', text: '"To whom much is given, much will be required."', type: 'visionary' },
      { letter: 'B', text: '"The prudent see danger and take refuge."', type: 'guardian' },
      { letter: 'C', text: '"It is more blessed to give than to receive."', type: 'giver' },
      { letter: 'D', text: '"Unless the Lord builds the house, the builders labor in vain."', type: 'builder' },
    ],
  },
  // ── Scoring block 2 (Q7-Q9) — hint after Q9 (q5) ──
  {
    id: 'q4',
    type: 'choice',
    q: "In a season of plenty, you tend to",
    options: [
      { letter: 'A', text: "Scout the next thing the abundance is meant to seed", type: 'visionary' },
      { letter: 'B', text: "Quietly extend the runway against future lean", type: 'guardian' },
      { letter: 'C', text: "Open my hand wider than my comfort", type: 'giver' },
      { letter: 'D', text: "Reinforce the structures I've already built", type: 'builder' },
    ],
  },
  {
    id: 'q5',
    type: 'choice',
    q: "The risk you are most likely to under-rate",
    options: [
      { letter: 'A', text: "Outrunning the wisdom that was supposed to govern me", type: 'visionary' },
      { letter: 'B', text: "Mistaking caution for obedience", type: 'guardian' },
      { letter: 'C', text: "Bleeding generosity past where I was sent", type: 'giver' },
      { letter: 'D', text: "Loving the blueprint more than the people in the house", type: 'builder' },
    ],
  },
  {
    id: 'q6',
    type: 'choice',
    q: "When you imagine being faithful with money twenty years from now, you mostly see",
    options: [
      { letter: 'A', text: "Ventures, institutions, things that were not there before", type: 'visionary' },
      { letter: 'B', text: "A household and a community that weathered every storm", type: 'guardian' },
      { letter: 'C', text: "Names of people whose lives were redirected by what I sent", type: 'giver' },
      { letter: 'D', text: "Walls, systems, rhythms that outlast me", type: 'builder' },
    ],
  },
  // ── Scoring block 3 (Q10) — no hint after this one ──
  {
    id: 'q7',
    type: 'choice',
    q: "Finish the sentence. Money, for me, is most truly",
    options: [
      { letter: 'A', text: "A seed waiting to be planted somewhere wiser", type: 'visionary' },
      { letter: 'B', text: "A trust I was handed to keep, not to consume", type: 'guardian' },
      { letter: 'C', text: "A current that runs cold the moment it stops moving", type: 'giver' },
      { letter: 'D', text: "A material, useful only when it's been shaped on purpose", type: 'builder' },
    ],
  },
  // ── Reflection questions (Q11-Q12) — now as selects ──
  {
    id: 'biggest-regret',
    type: 'select',
    q: 'Which of these best describes your biggest financial regret?',
    options: [
      { value: 'missed-opportunity', text: 'Missing an opportunity I saw but did not act on' },
      { value: 'overspending', text: 'Overspending on things that did not matter' },
      { value: 'debt', text: 'Taking on debt I could not manage' },
      { value: 'no-savings', text: 'Not saving or investing when I had the chance' },
      { value: 'helping-others', text: 'Not being able to help someone I cared about' },
      { value: 'trusting-wrong', text: 'Trusting the wrong person or advice with money' },
      { value: 'avoidance', text: 'Avoiding money conversations entirely' },
      { value: 'none', text: 'I do not have a major financial regret' },
    ],
  },
  {
    id: 'emotional-relationship',
    type: 'select',
    q: 'How does money feel to you today?',
    options: [
      { value: 'anxiety', text: 'A source of anxiety and stress' },
      { value: 'tool', text: 'A practical tool — neutral, useful' },
      { value: 'burden', text: 'A burden I carry for others' },
      { value: 'opportunity', text: 'An opportunity waiting to be seized' },
      { value: 'responsibility', text: 'A responsibility I take seriously' },
      { value: 'temptation', text: 'A temptation I must guard against' },
      { value: 'blessing', text: 'A blessing I am grateful for' },
      { value: 'confusion', text: 'Something I do not fully understand' },
    ],
  },
  // ── Final demographics (Q13-Q15) ──
  {
    id: 'marital',
    type: 'select',
    q: 'Your marital status',
    options: [
      { value: 'single', text: 'Single, never married' },
      { value: 'engaged', text: 'Engaged' },
      { value: 'married', text: 'Married' },
      { value: 'divorced', text: 'Divorced' },
      { value: 'widowed', text: 'Widowed' },
    ],
  },
  {
    id: 'children',
    type: 'select',
    q: 'Do you have children?',
    options: [
      { value: 'none', text: 'No children' },
      { value: '1', text: '1 child' },
      { value: '2', text: '2 children' },
      { value: '3+', text: '3 or more children' },
    ],
  },
  {
    id: 'financial-situation',
    type: 'select',
    q: 'How would you describe your current financial situation?',
    options: [
      { value: 'struggling', text: 'Struggling, barely making ends meet' },
      { value: 'stable', text: 'Stable, covering basics with little margin' },
      { value: 'comfortable', text: 'Comfortable, meeting needs with some room' },
      { value: 'abundant', text: 'Abundant, more than enough, navigating blessing' },
    ],
  },
];

export function isChoiceQuestion(q: QuizQuestion): q is ChoiceQuestion {
  return q.type === 'choice';
}
