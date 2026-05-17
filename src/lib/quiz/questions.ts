export type AnswerLetter = 'A' | 'B' | 'C' | 'D';
export type BiblicalType = 'builder' | 'steward' | 'sower' | 'visionary';

export interface AnswerScoring {
  builder: number;
  steward: number;
  sower: number;
  visionary: number;
}

export interface AnswerOption {
  letter: AnswerLetter;
  text: string;
  scoring: AnswerScoring;
}

export interface Question {
  number: number;
  question: string;
  options: AnswerOption[];
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    number: 1,
    question: "When you receive unexpected money (bonus, gift, refund), what's your first instinct?",
    options: [
      { letter: 'A', text: "Put it straight into savings or emergency fund", scoring: { builder: 3, steward: 1, sower: 0, visionary: 0 } },
      { letter: 'B', text: "Tithe first, then split between savings and a need", scoring: { builder: 1, steward: 3, sower: 1, visionary: 0 } },
      { letter: 'C', text: "Share it with someone who needs it more than me", scoring: { builder: 0, steward: 1, sower: 3, visionary: 0 } },
      { letter: 'D', text: "Invest it in something that could grow or create income", scoring: { builder: 0, steward: 0, sower: 0, visionary: 3 } },
    ],
  },
  {
    number: 2,
    question: "Your biggest financial worry right now is...",
    options: [
      { letter: 'A', text: "Not having enough saved for the future", scoring: { builder: 3, steward: 1, sower: 0, visionary: 0 } },
      { letter: 'B', text: "Not managing what I have well enough to honor God", scoring: { builder: 1, steward: 3, sower: 1, visionary: 0 } },
      { letter: 'C', text: "Friends or family who keep needing financial help", scoring: { builder: 0, steward: 1, sower: 3, visionary: 0 } },
      { letter: 'D', text: "Missing opportunities to build something meaningful", scoring: { builder: 0, steward: 0, sower: 0, visionary: 3 } },
    ],
  },
  {
    number: 3,
    question: "How do you typically handle debt?",
    options: [
      { letter: 'A', text: "I avoid it completely. Debt scares me.", scoring: { builder: 3, steward: 1, sower: 0, visionary: -1 } },
      { letter: 'B', text: "I have some, but I have a plan to pay it off", scoring: { builder: 1, steward: 3, sower: 0, visionary: 1 } },
      { letter: 'C', text: "I sometimes go into debt helping others", scoring: { builder: 0, steward: -1, sower: 3, visionary: 0 } },
      { letter: 'D', text: "I use it strategically to grow assets", scoring: { builder: -1, steward: 0, sower: 0, visionary: 3 } },
    ],
  },
  {
    number: 4,
    question: "When it comes to tithing or giving regularly...",
    options: [
      { letter: 'A', text: "I want to give more but worry about my own security", scoring: { builder: 3, steward: 0, sower: 1, visionary: 0 } },
      { letter: 'B', text: "I tithe consistently. 10% off the top, every time.", scoring: { builder: 1, steward: 3, sower: 1, visionary: 1 } },
      { letter: 'C', text: "I give whenever I see a need, often more than 10%", scoring: { builder: 0, steward: 1, sower: 3, visionary: 0 } },
      { letter: 'D', text: "I give big when I have big, small when I have small", scoring: { builder: 0, steward: 0, sower: 1, visionary: 3 } },
    ],
  },
  {
    number: 5,
    question: "Your ideal financial future looks like...",
    options: [
      { letter: 'A', text: "Debt-free, stable, with a strong safety net", scoring: { builder: 3, steward: 1, sower: 0, visionary: 0 } },
      { letter: 'B', text: "Faithfully managing what God gives, growing steadily", scoring: { builder: 1, steward: 3, sower: 1, visionary: 1 } },
      { letter: 'C', text: "Having enough to bless others generously", scoring: { builder: 0, steward: 1, sower: 3, visionary: 1 } },
      { letter: 'D', text: "Building wealth that funds Kingdom impact at scale", scoring: { builder: 0, steward: 1, sower: 0, visionary: 3 } },
    ],
  },
  {
    number: 6,
    question: "Which Bible verse resonates most with how you see money?",
    options: [
      { letter: 'A', text: "\"The wise store up choice food and oil\" (Proverbs 21:20)", scoring: { builder: 3, steward: 1, sower: 0, visionary: 0 } },
      { letter: 'B', text: "\"Well done, good and faithful servant\" (Matthew 25:21)", scoring: { builder: 1, steward: 3, sower: 1, visionary: 1 } },
      { letter: 'C', text: "\"Give, and it will be given to you\" (Luke 6:38)", scoring: { builder: 0, steward: 1, sower: 3, visionary: 0 } },
      { letter: 'D', text: "\"I will give you wisdom and wealth\" (1 Kings 3:13)", scoring: { builder: 0, steward: 1, sower: 0, visionary: 3 } },
    ],
  },
  {
    number: 7,
    question: "What's the most important next step for your finances?",
    options: [
      { letter: 'A', text: "Build a stronger emergency fund", scoring: { builder: 3, steward: 1, sower: 0, visionary: 0 } },
      { letter: 'B', text: "Set up a budget I can actually follow", scoring: { builder: 1, steward: 3, sower: 0, visionary: 0 } },
      { letter: 'C', text: "Learn to give without depleting myself", scoring: { builder: 0, steward: 1, sower: 3, visionary: 0 } },
      { letter: 'D', text: "Start investing or creating new income", scoring: { builder: 0, steward: 0, sower: 0, visionary: 3 } },
    ],
  },
];
