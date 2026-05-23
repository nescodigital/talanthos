/**
 * Email sequences for Talanthos — written in the style of Alex Hormozi.
 * 
 * Principles:
 * - One idea per email
 * - Short paragraphs (1-2 sentences max)
 * - Bold the key points
 * - Single CTA
 * - No fluff. No explanations. Assume intelligence.
 * - Subject lines are promises, not questions.
 */

import { BiblicalType, BIBLICAL_TYPES } from "./quiz/types";

export type SequenceName = "abandoned_quiz" | "non_buyer" | "advocate";

interface EmailTemplate {
  subject: string | ((ctx: EmailContext) => string);
  text: (ctx: EmailContext) => string;
  html: (ctx: EmailContext) => string;
  delayHours: number; // delay from previous step (0 = immediate)
}

export interface EmailContext {
  firstName?: string | null;
  email: string;
  primaryType?: BiblicalType | null;
  scores?: Record<string, number>;
  reportUrl?: string;
  quizUrl?: string;
}

function greeting(ctx: EmailContext): string {
  return ctx.firstName ? `Hi ${ctx.firstName},` : "Hi,";
}

function footer(): string {
  return `\n\n—\nTalanthos · Faith. Finances. Purpose.\nhttps://talanthos.com`;
}

function htmlFooter(): string {
  return `
    <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 32px 0;">
    <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos · Faith. Finances. Purpose.</p>
    <p style="font-size: 11px; color: #9c9689; margin: 4px 0 0;"><a href="https://talanthos.com" style="color: #b88a4a; text-decoration: none;">talanthos.com</a></p>
  `;
}

function htmlWrapper(title: string, content: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" width="40" height="40" style="display: inline-block; margin-bottom: 8px;" />
        <div style="font-family: Georgia, serif; font-size: 18px; letter-spacing: 0.2em; color: #1c1a14; text-transform: uppercase;">Talanthos</div>
        <div style="font-family: monospace; font-size: 9px; letter-spacing: 0.14em; color: #b88a4a; text-transform: uppercase; margin-top: 2px;">Faith · Finances · Purpose</div>
      </div>
      <h1 style="font-weight: 400; font-size: 24px; margin: 0 0 16px; line-height: 1.3;">${title}</h1>
      ${content}
      ${htmlFooter()}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// SEQUENCE 1: ABANDONED QUIZ
// Trigger: session started, not completed
// ─────────────────────────────────────────────────────────────

const ABANDONED_QUIZ_TEMPLATES: EmailTemplate[] = [
  // Email 1: 30 min after start
  {
    delayHours: 0,
    subject: "You started something",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `You started the Biblical Money Type assessment 30 minutes ago.\n\n` +
      `You have 9 questions left. Less time than it takes to drink a coffee.\n\n` +
      `**Most people never get clarity on how God wired them with money.**\n\n` +
      `You were 60 seconds away from it.\n\n` +
      `Finish here: ${ctx.quizUrl || "https://talanthos.com/quiz"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "You started something",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You started the Biblical Money Type assessment 30 minutes ago.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You have 9 questions left. Less time than it takes to drink a coffee.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Most people never get clarity on how God wired them with money.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">You were 60 seconds away from it.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Finish My Assessment</a>
        </div>
        `
      ),
  },
  // Email 2: 24h after start
  {
    delayHours: 24,
    subject: "3 minutes vs. 30 years",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `The assessment takes 3 minutes.\n\n` +
      `The confusion it resolves lasts 30 years.\n\n` +
      `**Most Christians never name their financial wiring.** They just copy what culture tells them. Save 15%. Give 10%. Avoid debt.\n\n` +
      `Generic advice applied to the wrong wiring creates guilt, not growth.\n\n` +
      `Your type — Visionary, Guardian, Giver, or Builder — already has a name. You just haven't met it yet.\n\n` +
      `3 minutes: ${ctx.quizUrl || "https://talanthos.com/quiz"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "3 minutes vs. 30 years",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The assessment takes 3 minutes.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The confusion it resolves lasts 30 years.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Most Christians never name their financial wiring.</strong> They just copy what culture tells them. Save 15%. Give 10%. Avoid debt.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Generic advice applied to the wrong wiring creates guilt, not growth.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Your type — Visionary, Guardian, Giver, or Builder — already has a name. You just haven't met it yet.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Take the 3-Minute Assessment</a>
        </div>
        `
      ),
  },
  // Email 3: 72h after start
  {
    delayHours: 48,
    subject: "The question your pastor won't ask",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `Your pastor preaches on stewardship.\n\n` +
      `He never asks: **"What kind of steward are you?"**\n\n` +
      `Because the Bible presents at least four distinct financial archetypes. Solomon the Visionary. Joseph the Guardian. The Macedonians the Givers. Nehemiah the Builder.\n\n` +
      `Each faithful. None the same.\n\n` +
      `Knowing your type gives you three things:\n` +
      `• Clarity about why you make the money decisions you make\n` +
      `• Language for conversations with your spouse, advisor, or pastor\n` +
      `• A path — specific, actionable, rooted in Scripture\n\n` +
      `The assessment is free. The clarity is permanent.\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "The question your pastor won't ask",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Your pastor preaches on stewardship.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">He never asks: <strong>"What kind of steward are you?"</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Because the Bible presents at least four distinct financial archetypes. Solomon the Visionary. Joseph the Guardian. The Macedonians the Givers. Nehemiah the Builder.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Each faithful. None the same.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Knowing your type gives you three things:</p>
        <ul style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>Clarity about why you make the money decisions you make</li>
          <li>Language for conversations with your spouse, advisor, or pastor</li>
          <li>A path — specific, actionable, rooted in Scripture</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">The assessment is free. The clarity is permanent.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Find My Type (Free)</a>
        </div>
        `
      ),
  },
];

// ─────────────────────────────────────────────────────────────
// SEQUENCE 2: NON-BUYER
// Trigger: quiz completed, no purchase
// ─────────────────────────────────────────────────────────────

function getTypeData(type?: BiblicalType | null) {
  if (!type || !BIBLICAL_TYPES[type]) {
    return {
      label: "Your Biblical Money Type",
      reportPitch:
        "The full report maps your financial wiring against Scripture — your strengths, your blind spots, and a 30-day action plan calibrated to how God made you.",
      reportFear: "",
      figure: "",
    };
  }
  const t = BIBLICAL_TYPES[type];
  return {
    label: t.label,
    reportPitch: t.reportPitch,
    reportFear: t.reportFear,
    figure: t.figure,
  };
}

const NON_BUYER_TEMPLATES: EmailTemplate[] = [
  // Email 1: immediately after quiz
  {
    delayHours: 0,
    subject: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return `You are ${td.label}. Here's what's missing.`;
    },
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return (
        `${greeting(ctx)}\n\n` +
        `You are ${td.label}, the ${td.figure} archetype.\n\n` +
        `That's not a label. It's a lens.\n\n` +
        `**But knowing your type without reading the full report is like knowing you're a carpenter and never touching wood.**\n\n` +
        `The free result told you your type. The paid report tells you what to do with it.\n\n` +
        `Specifically:\n` +
        `• Your four-dimensional score breakdown\n` +
        `• The blind spot most likely to derail you\n` +
        `• A 30-day action plan calibrated to your wiring\n` +
        `• Scripture references mapped to your financial decisions\n\n` +
        `${td.reportPitch}\n\n` +
        `$14.99. One-time. No subscription.\n\n` +
        `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return htmlWrapper(
        `You are ${td.label}. Here's what's missing.`,
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You are ${td.label}, the ${td.figure} archetype.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">That's not a label. It's a lens.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>But knowing your type without reading the full report is like knowing you're a carpenter and never touching wood.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The free result told you your type. The paid report tells you what to do with it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Specifically:</p>
        <ul style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>Your four-dimensional score breakdown</li>
          <li>The blind spot most likely to derail you</li>
          <li>A 30-day action plan calibrated to your wiring</li>
          <li>Scripture references mapped to your financial decisions</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">${td.reportPitch}</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;"><strong>$14.99.</strong> One-time. No subscription.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Get My Full Report — $14.99</a>
        </div>
        `
      );
    },
  },
  // Email 2: 24h after quiz
  {
    delayHours: 24,
    subject: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return `Why most ${td.label}s stay stuck`;
    },
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return (
        `${greeting(ctx)}\n\n` +
        `You know your type.\n\n` +
        `Most ${td.label}s stop there.\n\n` +
        `They take the free result, feel the rush of recognition, and go back to the same patterns.\n\n` +
        `**Recognition without action is entertainment.**\n\n` +
        `The report isn't entertainment. It's a 20-page operating manual for how God wired you with money.\n\n` +
        `• The strength that's currently over-functioning\n` +
        `• The blind spot you can't see because it's behind your eye\n` +
        `• The one habit that changes everything in 30 days\n\n` +
        `${td.reportFear || ""}\n\n` +
        `The difference between people who know their type and people who steward it?\n\n` +
        `One bought the report. The other didn't.\n\n` +
        `$14.99: ${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return htmlWrapper(
        `Why most ${td.label}s stay stuck`,
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You know your type.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Most ${td.label}s stop there.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">They take the free result, feel the rush of recognition, and go back to the same patterns.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Recognition without action is entertainment.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The report isn't entertainment. It's a 20-page operating manual for how God wired you with money.</p>
        <ul style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>The strength that's currently over-functioning</li>
          <li>The blind spot you can't see because it's behind your eye</li>
          <li>The one habit that changes everything in 30 days</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">${td.reportFear || ""}</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The difference between people who know their type and people who steward it?</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">One bought the report. The other didn't.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Get My Report — $14.99</a>
        </div>
        `
      );
    },
  },
  // Email 3: 72h after quiz
  {
    delayHours: 48,
    subject: "The $14.99 gap",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `The average Christian spends $47/month on streaming services.\n\n` +
      `$14.99 is a one-time purchase for a report that maps how God wired you with money.\n\n` +
      `**That's not an expense. It's a mirror.**\n\n` +
      `Most people pay hundreds for financial advice that doesn't fit their wiring.\n\n` +
      `Generic budgeting for a Giver creates shame.\n` +
      `Generic investing advice for a Guardian creates paralysis.\n\n` +
      `The report is calibrated. Not generic.\n\n` +
      `One-time. $14.99. PDF to your inbox in 60 seconds.\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "The $14.99 gap",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The average Christian spends $47/month on streaming services.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">$14.99 is a one-time purchase for a report that maps how God wired you with money.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>That's not an expense. It's a mirror.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Most people pay hundreds for financial advice that doesn't fit their wiring.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Generic budgeting for a Giver creates shame.<br>Generic investing advice for a Guardian creates paralysis.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The report is calibrated. Not generic.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">One-time. $14.99. PDF to your inbox in 60 seconds.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Get My Report — $14.99</a>
        </div>
        `
      ),
  },
  // Email 4: 7 days after quiz
  {
    delayHours: 96,
    subject: "This is the last email",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `I'm not going to keep emailing you about the report.\n\n` +
      `**You either want clarity or you don't.**\n\n` +
      `If you do, it's $14.99 and 60 seconds away.\n\n` +
      `If you don't, no hard feelings. The free result is still yours.\n\n` +
      `But if you're the kind of person who finishes what they start, here's the link one last time:\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "This is the last email",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">I'm not going to keep emailing you about the report.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>You either want clarity or you don't.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">If you do, it's $14.99 and 60 seconds away.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">If you don't, no hard feelings. The free result is still yours.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">But if you're the kind of person who finishes what they start, here's the link one last time:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Get My Report — $14.99</a>
        </div>
        `
      ),
  },
];

// ─────────────────────────────────────────────────────────────
// SEQUENCE 3: ADVOCATE
// Trigger: purchased
// ─────────────────────────────────────────────────────────────

const ADVOCATE_TEMPLATES: EmailTemplate[] = [
  // Email 1: immediately after purchase
  {
    delayHours: 0,
    subject: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return `Your ${td.label} Report is ready. Read this first.`;
    },
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return (
        `${greeting(ctx)}\n\n` +
        `Your ${td.label} Report is attached.\n\n` +
        `**Don't just read it. Use it.**\n\n` +
        `Here's how:\n` +
        `1. Print it.\n` +
        `2. Read the blind spot section twice.\n` +
        `3. Pick ONE action from the 30-day plan. Do it today.\n\n` +
        `The report tells you what God has already wired into you. The action plan tells you what to do with it.\n\n` +
        `Information without application is just entertainment.\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return htmlWrapper(
        `Your ${td.label} Report is ready. Read this first.`,
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Your ${td.label} Report is attached.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Don't just read it. Use it.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Here's how:</p>
        <ol style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>Print it.</li>
          <li>Read the blind spot section twice.</li>
          <li>Pick <strong>ONE</strong> action from the 30-day plan. Do it today.</li>
        </ol>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The report tells you what God has already wired into you. The action plan tells you what to do with it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Information without application is just entertainment.</strong></p>
        `
      );
    },
  },
  // Email 2: 3 days after purchase
  {
    delayHours: 72,
    subject: "One favor",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `You've had the report for 3 days.\n\n` +
      `If it gave you clarity, I have one favor:\n\n` +
      `**Forward this email to one person who needs it.**\n\n` +
      `Not a group chat. Not social media. One person.\n\n` +
      `The person who came to mind when you read that? That's the one.\n\n` +
      `Here's a message you can copy and paste:\n\n` +
      `———\n` +
      `Hey — I just took a 3-minute assessment that named something about money I could never articulate. It might do the same for you.\n\n` +
      `https://talanthos.com/quiz\n` +
      `———\n\n` +
      `That's it.\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "One favor",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You've had the report for 3 days.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">If it gave you clarity, I have one favor:</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Forward this email to one person who needs it.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Not a group chat. Not social media. One person.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The person who came to mind when you read that? That's the one.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Here's a message you can copy and paste:</p>
        <div style="background: #efe6d4; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #46412f;">
          <p style="margin: 0 0 8px;">Hey — I just took a 3-minute assessment that named something about money I could never articulate. It might do the same for you.</p>
          <p style="margin: 0;"><a href="https://talanthos.com/quiz" style="color: #b88a4a; text-decoration: none;">https://talanthos.com/quiz</a></p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">That's it.</p>
        `
      ),
  },
  // Email 3: 7 days after purchase
  {
    delayHours: 96,
    subject: "Who else needs this?",
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      const shareMsg = BIBLICAL_TYPES[ctx.primaryType!]?.shareMessage ||
        `I just took a 3-minute assessment that named something about money I could never articulate. What is your Biblical Money Type?`;
      return (
        `${greeting(ctx)}\n\n` +
        `7 days ago you bought the ${td.label} Report.\n\n` +
        `Here's what I know about you: **you finish things.**\n\n` +
        `Most people start assessments and never complete them. Most people read reports and never apply them.\n\n` +
        `You did both.\n\n` +
        `Now — who else in your life needs the same clarity?\n\n` +
        `Your spouse? Your business partner? Your small group?\n\n` +
        `Here's exactly what to send them:\n\n` +
        `———\n` +
        `${shareMsg}\n\n` +
        `https://talanthos.com/quiz\n` +
        `———\n\n` +
        `One conversation. One forward. One person who finally understands how God wired them.\n\n` +
        `That's the whole mission.\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      const shareMsg = BIBLICAL_TYPES[ctx.primaryType!]?.shareMessage ||
        `I just took a 3-minute assessment that named something about money I could never articulate. What is your Biblical Money Type?`;
      return htmlWrapper(
        "Who else needs this?",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">7 days ago you bought the ${td.label} Report.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Here's what I know about you: <strong>you finish things.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Most people start assessments and never complete them. Most people read reports and never apply them.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You did both.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Now — who else in your life needs the same clarity?</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Your spouse? Your business partner? Your small group?</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Here's exactly what to send them:</p>
        <div style="background: #efe6d4; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #46412f;">
          <p style="margin: 0 0 8px;">${shareMsg}</p>
          <p style="margin: 0;"><a href="https://talanthos.com/quiz" style="color: #b88a4a; text-decoration: none;">https://talanthos.com/quiz</a></p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">One conversation. One forward. One person who finally understands how God wired them.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>That's the whole mission.</strong></p>
        `
      );
    },
  },
];

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

export const EMAIL_SEQUENCES: Record<SequenceName, EmailTemplate[]> = {
  abandoned_quiz: ABANDONED_QUIZ_TEMPLATES,
  non_buyer: NON_BUYER_TEMPLATES,
  advocate: ADVOCATE_TEMPLATES,
};

export function getSequenceStepCount(name: SequenceName): number {
  return EMAIL_SEQUENCES[name].length;
}

export function getTemplate(name: SequenceName, step: number): EmailTemplate | null {
  const seq = EMAIL_SEQUENCES[name];
  if (!seq || step < 0 || step >= seq.length) return null;
  return seq[step];
}

export function getSubject(template: EmailTemplate, ctx: EmailContext): string {
  return typeof template.subject === "function" ? template.subject(ctx) : template.subject;
}
