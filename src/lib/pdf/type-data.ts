import { BiblicalType } from './types';

export interface TypeData {
  slug: BiblicalType;
  name: string;
  figure: string;
  figureInPrompt: string;
  tagline: string;
  monogram: string;
  coverVerse: string;
  coverVerseRef: string;
  symbolKey: string;
}

export const TYPE_DATA: Record<BiblicalType, TypeData> = {
  visionary: {
    slug: 'visionary',
    name: 'Visionary',
    figure: 'Solomon',
    figureInPrompt: 'Solomon',
    tagline: 'The Wisdom-Wealth Builder',
    monogram: 'I',
    coverVerse: 'Moreover, I will give you what you have not asked for: both riches and honor, so that in your lifetime you will have no equal among kings.',
    coverVerseRef: '1 Kings 3:13',
    symbolKey: 'visionary',
  },
  guardian: {
    slug: 'guardian',
    name: 'Guardian',
    figure: 'Joseph',
    figureInPrompt: 'Joseph',
    tagline: 'The Steward-Protector',
    monogram: 'II',
    coverVerse: 'Joseph stored up huge quantities of grain, like the sand of the sea; it was so much that he stopped keeping records because it was beyond measure.',
    coverVerseRef: 'Genesis 41:49',
    symbolKey: 'guardian',
  },
  giver: {
    slug: 'giver',
    name: 'Giver',
    figure: 'the Macedonian church',
    figureInPrompt: 'the Macedonian church',
    tagline: 'The Generous Heart',
    monogram: 'III',
    coverVerse: 'In the midst of a very severe trial, their overflowing joy and their extreme poverty welled up in rich generosity.',
    coverVerseRef: '2 Corinthians 8:2',
    symbolKey: 'giver',
  },
  builder: {
    slug: 'builder',
    name: 'Builder',
    figure: 'Nehemiah',
    figureInPrompt: 'Nehemiah',
    tagline: 'The Systematic Restorer',
    monogram: 'IV',
    coverVerse: 'So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart.',
    coverVerseRef: 'Nehemiah 4:6',
    symbolKey: 'builder',
  },
};
