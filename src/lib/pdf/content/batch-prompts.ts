import { QuizUserData } from '../types';
import { TYPE_DATA } from '../type-data';

function baseContext(user: QuizUserData): string {
  const td = TYPE_DATA[user.primaryType];
  const maxScore = Math.max(user.scores.vision, user.scores.guard, user.scores.give, user.scores.build);
  return `Name: ${user.firstName}
Primary Type: ${td.name} (${td.figureInPrompt})
Secondary Type: ${user.secondaryType ? TYPE_DATA[user.secondaryType].name : 'none'}
Scores (out of ${maxScore} each): Vision ${user.scores.vision}, Guard ${user.scores.guard}, Give ${user.scores.give}, Build ${user.scores.build}
Age: ${user.ageRange}
Marital Status: ${user.maritalStatus}
Children: ${user.hasChildren ? 'yes' : 'no'}
Financial Situation: ${user.financialSituation}
Biggest Financial Regret: ${user.biggestRegret}
How they feel about money: ${user.moneyEmotion}`;
}

export interface BatchPrompt {
  batchName: string;
  section: keyof ReportSectionKeys;
  prompt: string;
}

type ReportSectionKeys = {
  reading: string;
  fourDimensional: string;
  hiddenGift: string;
  growthRoadmap: string;
  debtStrategy: string;
  investmentPhilosophy: string;
  givingStrategy: string;
  actionPlan: string;
  scripturePassages: string;
  closingLetter: string;
};

export function buildBatchPrompts(user: QuizUserData): BatchPrompt[] {
  const ctx = baseContext(user);
  const td = TYPE_DATA[user.primaryType];
  const figure = td.figureInPrompt;

  return [
    {
      batchName: 'reading',
      section: 'reading',
      prompt: `${ctx}

Write the opening emotional reading for ${user.firstName}, whose primary Biblical Money Type is The ${td.name} (${figure}). This is the emotional heart of their report.

Structure:
1. Open by naming who they are as a ${td.name} — the gift and the weight of it.
2. Connect them to ${figure}'s story, both the triumph and the fall.
3. Name the hard truth their answers reveal — speak to '${user.moneyEmotion}' and '${user.biggestRegret}' directly.
4. Turn toward hope: what God is inviting them into.
End with a single sentence that lands with weight.
Target 400-500 words. No section title inside the content.`,
    },
    {
      batchName: 'fourDimensional',
      section: 'fourDimensional',
      prompt: `${ctx}

Write the 'Your Four-Dimensional Score' section for ${user.firstName}. Scores: Vision ${user.scores.vision}, Guard ${user.scores.guard}, Give ${user.scores.give}, Build ${user.scores.build} (each out of ${Math.max(user.scores.vision, user.scores.guard, user.scores.give, user.scores.build)}). Primary: ${td.name}. Secondary: ${user.secondaryType ? TYPE_DATA[user.secondaryType].name : 'none'}.

Use ## sub-headers for each of the four dimensions. For each:
- What it measures spiritually
- What their score reveals about them
- The gift and the risk at that score level
Then a closing paragraph on how their combination shapes the way they steward.
Target 400-500 words.`,
    },
    {
      batchName: 'hiddenGift',
      section: 'hiddenGift',
      prompt: `${ctx}

Write 'Your Hidden Gift' for ${user.firstName}, a ${td.name}. Reveal the unique, often-unrecognized way God has wired this type to handle money. Connect it to their context ('${user.financialSituation}', '${user.moneyEmotion}'). End with how to begin using this gift on purpose.
Target 300-400 words.`,
    },
    {
      batchName: 'growthRoadmap',
      section: 'growthRoadmap',
      prompt: `${ctx}

Write 'Your Growth Roadmap' for ${user.firstName}, a ${td.name}. Address 3-4 blind spots of this type, using their situation ('${user.financialSituation}', '${user.biggestRegret}', '${user.moneyEmotion}'). For each blind spot use a ## sub-header: name it, show how it shows up for them, give one concrete step. End with what to work on first.
Target 400-500 words.`,
    },
    {
      batchName: 'debtStrategy',
      section: 'debtStrategy',
      prompt: `${ctx}

Write 'Your Debt Strategy' for a ${td.name}, tailored to ${user.firstName} whose situation is '${user.financialSituation}'. Explain the debt approach that fits how this type is wired. Reference biblical principles (Proverbs 22:7, Romans 13:8) without being preachy. Give a clear posture and first step. Include: "This is spiritual guidance, not professional financial advice."
Target 300-400 words.`,
    },
    {
      batchName: 'investmentPhilosophy',
      section: 'investmentPhilosophy',
      prompt: `${ctx}

Write 'Your Investment Philosophy' for a ${td.name}. Explain how this type should think about growing wealth biblically — posture, temptations, guardrails. Principles only, no specific securities. Reference the parable of the talents. Include the spiritual-guidance disclaimer.
Target 300-400 words.`,
    },
    {
      batchName: 'givingStrategy',
      section: 'givingStrategy',
      prompt: `${ctx}

Write 'Your Giving Strategy' for a ${td.name}. Calibrate tithing and generosity to this type's strengths and blind spots. Reference 2 Corinthians 9:7, Malachi 3:10. Give a concrete giving posture and first step.
Target 300-400 words.`,
    },
    {
      batchName: 'actionPlan',
      section: 'actionPlan',
      prompt: `${ctx}

Write 'Your 30-Day Path' for ${user.firstName}, a ${td.name}. Structure as 4 weeks with ## sub-headers and themes, then daily micro-actions (day 1-30) — each a single concrete sentence, achievable in under 15 minutes, tailored to a ${td.name} in situation '${user.financialSituation}'. Weeks build: awareness → ordering → action → consecration.
Target 800-1000 words.`,
    },
    {
      batchName: 'scripturePassages',
      section: 'scripturePassages',
      prompt: `${ctx}

Write 'Scripture for Your Journey' for ${user.firstName}, a ${td.name}. Curate 20 Bible verses relevant to this type's growth. Group under 5 ## themed sub-headers (4 verses each). For each: reference, verse text (ESV/NIV), and a 1-sentence personal reflection.
Target 600-800 words.`,
    },
    {
      batchName: 'closingLetter',
      section: 'closingLetter',
      prompt: `${ctx}

Write a closing letter to ${user.firstName} from Talanthos. Warm but not sentimental. Summarize the journey ahead for a ${td.name}, return to the hope from the opening, and send them out with a benediction-style closing rooted in Scripture. Sign off as 'Talanthos'.
Target 300-400 words.`,
    },
  ];
}
