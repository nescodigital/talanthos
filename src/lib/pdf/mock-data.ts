import { QuizUserData } from './types';

export const MOCK_VISIONARY: QuizUserData = {
  firstName: 'Daniel',
  primaryType: 'visionary',
  secondaryType: 'builder',
  scores: { vision: 9, guard: 4, give: 5, build: 7 },
  ageRange: '35-44',
  maritalStatus: 'Married',
  hasChildren: true,
  financialSituation: 'Growing income but inconsistent savings; some business debt',
  biggestRegret: 'I keep starting new ventures before finishing the last one, and it has cost my family stability',
  moneyEmotion: 'ambitious but secretly anxious that I am building on sand',
};

export const MOCK_GUARDIAN: QuizUserData = {
  firstName: 'Sarah',
  primaryType: 'guardian',
  secondaryType: 'builder',
  scores: { vision: 3, guard: 9, give: 4, build: 6 },
  ageRange: '40-49',
  maritalStatus: 'Married',
  hasChildren: true,
  financialSituation: 'Stable income, strong savings, debt-averse',
  biggestRegret: 'I held back from helping my brother when he needed it because I feared losing my security',
  moneyEmotion: 'safe but quietly guilty that I cling too tightly',
};

export const MOCK_GIVER: QuizUserData = {
  firstName: 'Marcus',
  primaryType: 'giver',
  secondaryType: 'visionary',
  scores: { vision: 6, guard: 3, give: 9, build: 4 },
  ageRange: '28-34',
  maritalStatus: 'Single',
  hasChildren: false,
  financialSituation: 'Modest income, little savings, gives generously',
  biggestRegret: 'I gave away money I needed for rent and had to borrow to cover it',
  moneyEmotion: 'joyful when giving but anxious about my own future',
};

export const MOCK_BUILDER: QuizUserData = {
  firstName: 'Ruth',
  primaryType: 'builder',
  secondaryType: 'guardian',
  scores: { vision: 4, guard: 6, give: 3, build: 9 },
  ageRange: '35-44',
  maritalStatus: 'Married',
  hasChildren: true,
  financialSituation: 'Steady income, methodical saver, building slowly',
  biggestRegret: 'I was so focused on the system that I missed chances to be spontaneously generous',
  moneyEmotion: 'in control but wondering if I have made an idol of my plan',
};

export const MOCK_USERS: Record<string, QuizUserData> = {
  visionary: MOCK_VISIONARY,
  guardian: MOCK_GUARDIAN,
  giver: MOCK_GIVER,
  builder: MOCK_BUILDER,
};
