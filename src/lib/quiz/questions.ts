export type AnswerLetter = 'A' | 'B' | 'C' | 'D';
export type BiblicalType = 'visionary' | 'guardian' | 'giver' | 'builder';

export interface AnswerOption {
  letter: AnswerLetter;
  text: string;
  type: BiblicalType;
}

export interface Question {
  q: string;
  options: AnswerOption[];
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    q: "When unexpected money arrives, your first instinct is to —",
    options: [
      { letter: 'A', text: "Run the numbers on what it could become", type: 'visionary' },
      { letter: 'B', text: "Set most of it aside before it gets spent", type: 'guardian' },
      { letter: 'C', text: "Think of someone who needs it more than I do", type: 'giver' },
      { letter: 'D', text: "Apply it to the plan I'm already executing", type: 'builder' },
    ],
  },
  {
    q: "Where you feel money is most often quietly working against you —",
    options: [
      { letter: 'A', text: "I'm moving faster than my counsel can keep up with", type: 'visionary' },
      { letter: 'B', text: "I'm hoarding what I was meant to deploy", type: 'guardian' },
      { letter: 'C', text: "I'm giving from a place I haven't fully resourced", type: 'giver' },
      { letter: 'D', text: "I'm finishing systems no one asked me to build", type: 'builder' },
    ],
  },
  {
    q: "The scripture that most often steadies your hand —",
    options: [
      { letter: 'A', text: '"To whom much is given, much will be required."', type: 'visionary' },
      { letter: 'B', text: '"The prudent see danger and take refuge."', type: 'guardian' },
      { letter: 'C', text: '"It is more blessed to give than to receive."', type: 'giver' },
      { letter: 'D', text: '"Unless the Lord builds the house, the builders labor in vain."', type: 'builder' },
    ],
  },
  {
    q: "In a season of plenty, you tend to —",
    options: [
      { letter: 'A', text: "Scout the next thing the abundance is meant to seed", type: 'visionary' },
      { letter: 'B', text: "Quietly extend the runway against future lean", type: 'guardian' },
      { letter: 'C', text: "Open my hand wider than my comfort", type: 'giver' },
      { letter: 'D', text: "Reinforce the structures I've already built", type: 'builder' },
    ],
  },
  {
    q: "The risk you are most likely to under-rate —",
    options: [
      { letter: 'A', text: "Outrunning the wisdom that was supposed to govern me", type: 'visionary' },
      { letter: 'B', text: "Mistaking caution for obedience", type: 'guardian' },
      { letter: 'C', text: "Bleeding generosity past where I was sent", type: 'giver' },
      { letter: 'D', text: "Loving the blueprint more than the people in the house", type: 'builder' },
    ],
  },
  {
    q: "When you imagine being faithful with money twenty years from now, you mostly see —",
    options: [
      { letter: 'A', text: "Ventures, institutions, things that were not there before", type: 'visionary' },
      { letter: 'B', text: "A household and a community that weathered every storm", type: 'guardian' },
      { letter: 'C', text: "Names of people whose lives were redirected by what I sent", type: 'giver' },
      { letter: 'D', text: "Walls, systems, rhythms that outlast me", type: 'builder' },
    ],
  },
  {
    q: "Finish the sentence. Money, for me, is most truly —",
    options: [
      { letter: 'A', text: "A seed waiting to be planted somewhere wiser", type: 'visionary' },
      { letter: 'B', text: "A trust I was handed to keep, not to consume", type: 'guardian' },
      { letter: 'C', text: "A current that runs cold the moment it stops moving", type: 'giver' },
      { letter: 'D', text: "A material — useful only when it's been shaped on purpose", type: 'builder' },
    ],
  },
];
