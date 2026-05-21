import { QuizUserData } from '../types';
import { TYPE_DATA } from '../type-data';

export interface SectionPrompt {
  section: string;
  prompt: string;
}

function baseContext(user: QuizUserData): string {
  const td = TYPE_DATA[user.primaryType];
  const maxScore = Math.max(user.scores.vision, user.scores.guard, user.scores.give, user.scores.build);
  return `
Name: ${user.firstName}
Primary Type: ${td.name} (${td.figureInPrompt})
Secondary Type: ${user.secondaryType ? TYPE_DATA[user.secondaryType].name : 'none'}
Scores (out of ${maxScore} each): Vision ${user.scores.vision}, Guard ${user.scores.guard}, Give ${user.scores.give}, Build ${user.scores.build}
Age: ${user.ageRange}
Marital Status: ${user.maritalStatus}
Children: ${user.hasChildren ? 'yes' : 'no'}
Financial Situation: ${user.financialSituation}
Biggest Financial Regret: ${user.biggestRegret}
How they feel about money: ${user.moneyEmotion}
`.trim();
}

export function buildSectionPrompts(user: QuizUserData): SectionPrompt[] {
  const ctx = baseContext(user);
  const td = TYPE_DATA[user.primaryType];
  const figure = td.figureInPrompt;

  return [
    {
      section: 'reading',
      prompt: `${ctx}

Write the opening 'Reading' for ${user.firstName}, whose primary Biblical Money Type is The ${td.name} (${figure}). This is the emotional heart of their report.

Structure:
1. Open by naming who they are as a ${td.name} — the gift and the weight of it.
2. Connect them to ${figure}'s story, both the triumph and the fall.
3. Name the hard truth their answers reveal — speak to '${user.moneyEmotion}' and '${user.biggestRegret}' directly. This is tough love: tell them what they are avoiding, what is costing them peace.
4. Turn toward hope: what God is inviting them into.
End with a single sentence that lands with weight.
Target 1400-1700 words. No section title.`,
    },
    {
      section: 'fourDimensional',
      prompt: `${ctx}

Write the 'Your Four-Dimensional Score' section for ${user.firstName}. Their scores: Vision ${user.scores.vision}, Guard ${user.scores.guard}, Give ${user.scores.give}, Build ${user.scores.build} (each out of ${Math.max(user.scores.vision, user.scores.guard, user.scores.give, user.scores.build)}). Primary: ${td.name}. Secondary: ${user.secondaryType ? TYPE_DATA[user.secondaryType].name : 'none'}.

Use ## sub-headers for each of the four dimensions. For each dimension:
- What it measures spiritually
- What their specific score reveals about them
- The gift and the risk at that score level
Then a closing paragraph on how their combination (especially primary + secondary) shapes the way they steward.
Target 1100-1400 words.`,
    },
    {
      section: 'hiddenGift',
      prompt: `${ctx}

Write 'Your Hidden Gift' for ${user.firstName}, a ${td.name}. Reveal the unique, often-unrecognized way God has wired this type to handle money — the gift beneath the obvious traits. Make it feel like a revelation. Connect it to their context ('${user.financialSituation}', '${user.moneyEmotion}'). End with how to begin using this gift on purpose.
Target 700-900 words.`,
    },
    {
      section: 'growthRoadmap',
      prompt: `${ctx}

Write 'Your Growth Roadmap' for ${user.firstName}, a ${td.name}. Address the 5 blind spots of this type, but make each one concrete using their situation ('${user.financialSituation}', '${user.biggestRegret}', '${user.moneyEmotion}'). For each blind spot use a ## sub-header, then: name it, show how it likely shows up for them specifically, give one concrete step to address it. This is the 'step by step' the reader paid for. End with a short paragraph on sequence — what to work on first.
Target 1100-1400 words.`,
    },
    {
      section: 'debtStrategy',
      prompt: `${ctx}

Write 'Your Debt Strategy' for a ${td.name}, tailored to ${user.firstName} whose situation is '${user.financialSituation}'. Explain the debt approach that fits how this type is wired (e.g., a Guardian's caution vs a Visionary's leverage instinct), and why generic approaches may fail them. Reference biblical principles on debt (Proverbs 22:7, Romans 13:8) without being preachy. Give a clear posture and first step. Include a one-line reminder that this is spiritual guidance, not professional financial advice.
Target 700-900 words.`,
    },
    {
      section: 'investmentPhilosophy',
      prompt: `${ctx}

Write 'Your Investment Philosophy' for a ${td.name}, for ${user.firstName}. Explain how this type should think about growing wealth biblically — the posture, the temptations, the guardrails specific to this type. Principles only, no specific securities or licensed advice. Reference the parable of the talents and stewardship of increase. Include the spiritual-guidance disclaimer line.
Target 700-900 words.`,
    },
    {
      section: 'givingStrategy',
      prompt: `${ctx}

Write 'Your Giving Strategy' for a ${td.name}, for ${user.firstName}. Calibrate tithing and generosity to this type's strengths and blind spots (e.g., a Giver needs boundaries, a Guardian needs to release). Reference 2 Corinthians 9:7, Malachi 3:10. Give a concrete giving posture and first step for them.
Target 700-900 words.`,
    },
    {
      section: 'actionPlan',
      prompt: `${ctx}

Write 'Your 30-Day Path' for ${user.firstName}, a ${td.name}. Structure as 4 weeks, each with a ## sub-header and a theme, then daily micro-actions (day 1 through day 30) — each a single concrete sentence, achievable in under 15 minutes, tailored to a ${td.name} in situation '${user.financialSituation}'. Weeks should build on each other (awareness -> ordering -> action -> consecration). Keep daily actions specific and doable.
Target 1600-2000 words.`,
    },
    {
      section: 'scripturePassages',
      prompt: `${ctx}

Write 'Scripture for Your Journey' for ${user.firstName}, a ${td.name}. Curate 30 Bible verses especially relevant to this type's growth. Group them under 5 ## themed sub-headers (6 verses each), themes chosen for this type. For each verse: the reference, the verse text (ESV/NIV), and a 1-2 sentence personal reflection connecting it to a ${td.name}'s journey. This doubles as a 30-day reading plan (one verse per day).
Target 1400-1800 words.`,
    },
    {
      section: 'closingLetter',
      prompt: `${ctx}

Write a closing letter to ${user.firstName} from Talanthos. Warm but not sentimental. Summarize the journey ahead for a ${td.name}, return to the hope named in the opening Reading, and send them out with a benediction-style closing rooted in Scripture (e.g., a stewardship blessing). Sign off as 'Talanthos'.
Target 500-700 words.`,
    },
  ];
}
