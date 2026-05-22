import { QuizUserData } from '../types';
import { TYPE_DATA } from '../type-data';

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

export interface BatchPrompt {
  batchName: string;
  sections: string[];
  prompt: string;
}

export function buildBatchPrompts(user: QuizUserData): BatchPrompt[] {
  const ctx = baseContext(user);
  const td = TYPE_DATA[user.primaryType];
  const figure = td.figureInPrompt;

  return [
    {
      batchName: 'batch1',
      sections: ['reading', 'fourDimensional'],
      prompt: `${ctx}

You are writing a personalized Biblical Money Type report for ${user.firstName}. Generate TWO sections below. Respond using this exact format — each section starts with ===SECTION: name=== on its own line, followed by the content.

===SECTION: reading===
Write the opening 'Reading' for ${user.firstName}, whose primary Biblical Money Type is The ${td.name} (${figure}). This is the emotional heart of their report.

Structure:
1. Open by naming who they are as a ${td.name} — the gift and the weight of it.
2. Connect them to ${figure}'s story, both the triumph and the fall.
3. Name the hard truth their answers reveal — speak to '${user.moneyEmotion}' and '${user.biggestRegret}' directly.
4. Turn toward hope: what God is inviting them into.
End with a single sentence that lands with weight.
Target 900-1100 words. No section title inside the content.

===SECTION: fourDimensional===
Write the 'Your Four-Dimensional Score' section for ${user.firstName}. Their scores: Vision ${user.scores.vision}, Guard ${user.scores.guard}, Give ${user.scores.give}, Build ${user.scores.build} (each out of ${Math.max(user.scores.vision, user.scores.guard, user.scores.give, user.scores.build)}). Primary: ${td.name}. Secondary: ${user.secondaryType ? TYPE_DATA[user.secondaryType].name : 'none'}.

Use ## sub-headers for each of the four dimensions. For each dimension:
- What it measures spiritually
- What their specific score reveals about them
- The gift and the risk at that score level
Then a closing paragraph on how their combination shapes the way they steward.
Target 700-900 words.
`,
    },
    {
      batchName: 'batch2',
      sections: ['hiddenGift', 'growthRoadmap'],
      prompt: `${ctx}

Generate TWO sections below. Respond using this exact format.

===SECTION: hiddenGift===
Write 'Your Hidden Gift' for ${user.firstName}, a ${td.name}. Reveal the unique, often-unrecognized way God has wired this type to handle money. Connect it to their context ('${user.financialSituation}', '${user.moneyEmotion}'). End with how to begin using this gift on purpose.
Target 500-700 words.

===SECTION: growthRoadmap===
Write 'Your Growth Roadmap' for ${user.firstName}, a ${td.name}. Address 4-5 blind spots of this type, using their situation ('${user.financialSituation}', '${user.biggestRegret}', '${user.moneyEmotion}'). For each blind spot use a ## sub-header: name it, show how it shows up for them, give one concrete step. End with what to work on first.
Target 700-900 words.
`,
    },
    {
      batchName: 'batch3',
      sections: ['debtStrategy', 'investmentPhilosophy'],
      prompt: `${ctx}

Generate TWO sections below. Respond using this exact format.

===SECTION: debtStrategy===
Write 'Your Debt Strategy' for a ${td.name}, tailored to ${user.firstName} whose situation is '${user.financialSituation}'. Explain the debt approach that fits how this type is wired. Reference biblical principles (Proverbs 22:7, Romans 13:8) without being preachy. Give a clear posture and first step. Include: "This is spiritual guidance, not professional financial advice."
Target 500-700 words.

===SECTION: investmentPhilosophy===
Write 'Your Investment Philosophy' for a ${td.name}. Explain how this type should think about growing wealth biblically — posture, temptations, guardrails. Principles only, no specific securities. Reference the parable of the talents. Include the spiritual-guidance disclaimer.
Target 500-700 words.
`,
    },
    {
      batchName: 'batch4',
      sections: ['givingStrategy', 'actionPlan'],
      prompt: `${ctx}

Generate TWO sections below. Respond using this exact format.

===SECTION: givingStrategy===
Write 'Your Giving Strategy' for a ${td.name}. Calibrate tithing and generosity to this type's strengths and blind spots. Reference 2 Corinthians 9:7, Malachi 3:10. Give a concrete giving posture and first step.
Target 500-700 words.

===SECTION: actionPlan===
Write 'Your 30-Day Path' for ${user.firstName}, a ${td.name}. Structure as 4 weeks with ## sub-headers and themes, then daily micro-actions (day 1-30) — each a single concrete sentence, achievable in under 15 minutes, tailored to a ${td.name} in situation '${user.financialSituation}'. Weeks build: awareness → ordering → action → consecration.
Target 1200-1500 words.
`,
    },
    {
      batchName: 'batch5',
      sections: ['scripturePassages', 'closingLetter'],
      prompt: `${ctx}

Generate TWO sections below. Respond using this exact format.

===SECTION: scripturePassages===
Write 'Scripture for Your Journey' for ${user.firstName}, a ${td.name}. Curate 30 Bible verses relevant to this type's growth. Group under 5 ## themed sub-headers (6 verses each). For each: reference, verse text (ESV/NIV), and a 1-2 sentence personal reflection. This doubles as a 30-day reading plan.
Target 1000-1300 words.

===SECTION: closingLetter===
Write a closing letter to ${user.firstName} from Talanthos. Warm but not sentimental. Summarize the journey ahead for a ${td.name}, return to the hope from the opening, and send them out with a benediction-style closing rooted in Scripture. Sign off as 'Talanthos'.
Target 400-600 words.
`,
    },
  ];
}

export function parseBatchResponse(text: string, sections: string[]): Record<string, string> {
  const results: Record<string, string> = {};
  for (const section of sections) {
    const regex = new RegExp(`===SECTION:\\s*${section}===\\s*([\\s\\S]*?)(?=\\s*===SECTION:|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      results[section] = match[1].trim();
    }
  }
  return results;
}
