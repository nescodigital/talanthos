export type BiblicalType = 'visionary' | 'guardian' | 'giver' | 'builder';

export interface QuizUserData {
  firstName: string;
  primaryType: BiblicalType;
  secondaryType: BiblicalType | null;
  scores: { vision: number; guard: number; give: number; build: number };
  ageRange: string;
  maritalStatus: string;
  hasChildren: boolean;
  financialSituation: string;
  biggestRegret: string;
  moneyEmotion: string;
}

export interface ReportContent {
  reading: string;            // Section 1
  fourDimensional: string;    // Section 2
  hiddenGift: string;         // Section 3
  growthRoadmap: string;      // Section 4
  debtStrategy: string;       // Section 5
  investmentPhilosophy: string; // Section 6
  givingStrategy: string;     // Section 7
  actionPlan: string;         // Section 8 (30-day)
  scripturePassages: string;  // Section 9 (30 verses + reflections)
  closingLetter: string;      // Section 10
}

export const BIBLICAL_FIGURES: Record<BiblicalType, string> = {
  visionary: 'Solomon',
  guardian: 'Joseph',
  giver: 'the Macedonian church',
  builder: 'Nehemiah',
};

export const TYPE_LABELS: Record<BiblicalType, string> = {
  visionary: 'Visionary',
  guardian: 'Guardian',
  giver: 'Giver',
  builder: 'Builder',
};

export const TYPE_VERSES: Record<BiblicalType, { text: string; ref: string }> = {
  visionary: {
    text: 'Moreover, I will give you what you have not asked for: both riches and honor, so that in your lifetime you will have no equal among kings.',
    ref: '1 Kings 3:13',
  },
  guardian: {
    text: 'Joseph stored up huge quantities of grain, like the sand of the sea; it was so much that he stopped keeping records because it was beyond measure.',
    ref: 'Genesis 41:49',
  },
  giver: {
    text: 'In the midst of a very severe trial, their overflowing joy and their extreme poverty welled up in rich generosity.',
    ref: '2 Corinthians 8:2',
  },
  builder: {
    text: 'So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart.',
    ref: 'Nehemiah 4:6',
  },
};

export const SECTION_TITLES: Record<keyof ReportContent, { label: string; title: string }> = {
  reading: { label: 'I', title: 'Your Reading' },
  fourDimensional: { label: 'II', title: 'Your Four-Dimensional Score' },
  hiddenGift: { label: 'III', title: 'Your Hidden Gift' },
  growthRoadmap: { label: 'IV', title: 'Your Growth Roadmap' },
  debtStrategy: { label: 'V', title: 'Your Debt Strategy' },
  investmentPhilosophy: { label: 'VI', title: 'Your Investment Philosophy' },
  givingStrategy: { label: 'VII', title: 'Your Giving Strategy' },
  actionPlan: { label: 'VIII', title: 'Your 30-Day Path' },
  scripturePassages: { label: 'IX', title: 'Scripture for Your Journey' },
  closingLetter: { label: 'X', title: 'A Final Word' },
};
