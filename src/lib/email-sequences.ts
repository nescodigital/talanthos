/**
 * Email sequences for Talanthos — Hormozi-style copy framed through
 * the biblical mirror of James 1:23-25.
 *
 * Core theme: "Anyone who listens to the word but does not do what it says
 * is like someone who looks at his face in a mirror and, after looking at
 * himself, goes away and immediately forgets what he looks like."
 *
 * Principles:
 * - One idea per email
 * - Short paragraphs (1-2 sentences max)
 * - Bold the key points
 * - Single CTA
 * - No fluff. No explanations. Assume intelligence.
 * - Pain first. Pleasure second. Identity always.
 * - Every email asks: "What does it cost you to do nothing?"
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
// Theme: You looked in the mirror. Then you walked away.
// ─────────────────────────────────────────────────────────────

const ABANDONED_QUIZ_TEMPLATES: EmailTemplate[] = [
  // Email 1: immediately after abandonment
  {
    delayHours: 0,
    subject: "You looked in the mirror. Then you walked away.",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `You started the Biblical Money Type assessment.\n\n` +
      `You saw your reflection starting to form.\n\n` +
      `**Then you walked away.**\n\n` +
      `James 1:23 says the man who hears the word but does not do it is like someone who looks in a mirror, then goes away and forgets what he looks like.\n\n` +
      `You were 9 questions from clarity.\n\n` +
      `Not generic financial advice.\nNot another budget template.\n\n` +
      `The answer to why you make the money decisions you make.\n\n` +
      `**Most people never look.**\n\n` +
      `You looked. Don't be the one who forgets.\n\n` +
      `Finish here: ${ctx.quizUrl || "https://talanthos.com/quiz"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "You looked in the mirror. Then you walked away.",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You started the Biblical Money Type assessment.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You saw your reflection starting to form.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Then you walked away.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">James 1:23 says the man who hears the word but does not do it is like someone who looks in a mirror, then goes away and forgets what he looks like.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You were 9 questions from clarity.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Not generic financial advice.<br>Not another budget template.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The answer to why you make the money decisions you make.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Most people never look.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">You looked. Don't be the one who forgets.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Finish My Assessment</a>
        </div>
        `
      ),
  },
  // Email 2: 24h after start
  {
    delayHours: 24,
    subject: "In one year, you'll be the same person. Unless...",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `Yesterday you started something.\n\n` +
      `You didn't finish it.\n\n` +
      `Here's what I know about tomorrow, next month, and next year:\n\n` +
      `**If you don't change what you know about yourself, you won't change what you do with money.**\n\n` +
      `Same anxiety before opening the bank app.\nSame guilt about giving — or not giving.\nSame conversations with your spouse that go nowhere.\n\n` +
      `The assessment is 3 minutes.\n\n` +
      `The clarity it creates rewires decades.\n\n` +
      `But only if you finish.\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "In one year, you'll be the same person. Unless...",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Yesterday you started something.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You didn't finish it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Here's what I know about tomorrow, next month, and next year:</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>If you don't change what you know about yourself, you won't change what you do with money.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Same anxiety before opening the bank app.<br>Same guilt about giving — or not giving.<br>Same conversations with your spouse that go nowhere.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The assessment is 3 minutes.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The clarity it creates rewires decades.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">But only if you finish.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Finish What I Started</a>
        </div>
        `
      ),
  },
  // Email 3: 72h after start
  {
    delayHours: 48,
    subject: "This is your last chance to look",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `Three days ago you almost met yourself.\n\n` +
      `Not the you that shows up on Instagram.\nNot the you that answers "fine" when someone asks how you're doing.\n\n` +
      `The real you.\n\n` +
      `**The you that God wired with a specific relationship to money.**\n\n` +
      `You were 3 minutes away from naming it.\n\n` +
      `Most people live their entire lives without that name.\nThey copy what culture tells them. Save 15%. Give 10%. Don't talk about it.\n\n` +
      `And they wonder why they feel lost.\n\n` +
      `You have one more chance to look in the mirror.\n\n` +
      `Don't walk away again.\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "This is your last chance to look",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Three days ago you almost met yourself.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Not the you that shows up on Instagram.<br>Not the you that answers "fine" when someone asks how you're doing.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The real you.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>The you that God wired with a specific relationship to money.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You were 3 minutes away from naming it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Most people live their entire lives without that name.<br>They copy what culture tells them. Save 15%. Give 10%. Don't talk about it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">And they wonder why they feel lost.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You have one more chance to look in the mirror.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Don't walk away again.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Look in the Mirror (Free)</a>
        </div>
        `
      ),
  },
];

// ─────────────────────────────────────────────────────────────
// SEQUENCE 2: NON-BUYER
// Trigger: quiz completed, no purchase
// Theme: You looked. You saw. You walked away and forgot.
// This is the hardest sequence. No mercy. Only truth.
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
  // Email 1: immediately after quiz — the mirror verse, raw
  {
    delayHours: 0,
    subject: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return `You are ${td.label}. And you're already forgetting.`;
    },
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return (
        `${greeting(ctx)}\n\n` +
        `You are ${td.label}, the ${td.figure} archetype.\n\n` +
        `You read your result. You felt the rush of recognition.\n\n` +
        `**Then you closed the tab.**\n\n` +
        `James 1:24 calls that man a fool. He looks in the mirror, sees himself clearly, then walks away and forgets what he looks like.\n\n` +
        `That's you right now.\n\n` +
        `You know your type. But you don't know what to do with it.\n\n` +
        `The free result is a label.\nThe paid report is a roadmap.\n\n` +
        `Specifically:\n` +
        `• Your four-dimensional score breakdown\n` +
        `• The blind spot that's costing you right now\n` +
        `• A 30-day action plan calibrated to your wiring\n` +
        `• Scripture references mapped to your financial decisions\n\n` +
        `${td.reportPitch}\n\n` +
        `$14.99. One-time. Less than you spent on coffee this week.\n\n` +
        `**The question isn't whether you can afford it.**\n\n` +
        `The question is whether you can afford to stay the same.\n\n` +
        `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return htmlWrapper(
        `You are ${td.label}. And you're already forgetting.`,
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You are ${td.label}, the ${td.figure} archetype.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You read your result. You felt the rush of recognition.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Then you closed the tab.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">James 1:24 calls that man a fool. He looks in the mirror, sees himself clearly, then walks away and forgets what he looks like.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">That's you right now.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You know your type. But you don't know what to do with it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The free result is a label.<br>The paid report is a roadmap.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Specifically:</p>
        <ul style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>Your four-dimensional score breakdown</li>
          <li>The blind spot that's costing you right now</li>
          <li>A 30-day action plan calibrated to your wiring</li>
          <li>Scripture references mapped to your financial decisions</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">${td.reportPitch}</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>$14.99.</strong> One-time. Less than you spent on coffee this week.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>The question isn't whether you can afford it.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">The question is whether you can afford to stay the same.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Get My Roadmap — $14.99</a>
        </div>
        `
      );
    },
  },
  // Email 2: 24h after quiz — cost of inaction, future self
  {
    delayHours: 24,
    subject: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return `The ${td.label} who never changes`;
    },
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return (
        `${greeting(ctx)}\n\n` +
        `Yesterday you learned you're a ${td.label}.\n\n` +
        `Today you're making the same money decisions you made last week.\n\n` +
        `**That's not a personality type. That's a prison.**\n\n` +
        `Here's what I know about you, ${ctx.firstName || "friend"}:\n\n` +
        `You don't need more information.\nYou need a system.\n\n` +
        `The report isn't information. It's a 20-page operating manual for how God wired you with money.\n\n` +
        `• The strength that's currently over-functioning and hurting you\n` +
        `• The blind spot you can't see because it's behind your eye\n` +
        `• The one habit that changes everything in 30 days\n\n` +
        `${td.reportFear || ""}\n\n` +
        `A year from now, there are two versions of you.\n\n` +
        `One read the free result and moved on.\nSame patterns. Same frustration. Same prayers that go nowhere.\n\n` +
        `The other bought the report.\nApplied it.\nBecame someone who stewards instead of survives.\n\n` +
        `**The difference? $14.99 and a decision.**\n\n` +
        `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return htmlWrapper(
        `The ${td.label} who never changes`,
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Yesterday you learned you're a ${td.label}.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Today you're making the same money decisions you made last week.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>That's not a personality type. That's a prison.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Here's what I know about you, ${ctx.firstName || "friend"}:</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You don't need more information.<br>You need a system.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The report isn't information. It's a 20-page operating manual for how God wired you with money.</p>
        <ul style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>The strength that's currently over-functioning and hurting you</li>
          <li>The blind spot you can't see because it's behind your eye</li>
          <li>The one habit that changes everything in 30 days</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">${td.reportFear || ""}</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">A year from now, there are two versions of you.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">One read the free result and moved on.<br>Same patterns. Same frustration. Same prayers that go nowhere.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The other bought the report.<br>Applied it.<br>Became someone who stewards instead of survives.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;"><strong>The difference? $14.99 and a decision.</strong></p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Choose the Better Version — $14.99</a>
        </div>
        `
      );
    },
  },
  // Email 3: 72h after quiz — the real cost
  {
    delayHours: 48,
    subject: "$14.99 vs. the price of staying blind",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `Let's talk about what $14.99 actually buys.\n\n` +
      `Not a PDF.\nNot another personality test.\n\n` +
      `**It buys you sight.**\n\n` +
      `Right now you're flying blind. You know your type, but you don't know your blind spot. You don't know why you keep making the same money mistakes. You don't know what Scripture says specifically about how God wired you.\n\n` +
      `Here's what staying blind costs:\n\n` +
      `• The wrong financial advice, applied to the wrong wiring, creating guilt instead of growth\n` +
      `• The same argument with your spouse, every month, because you don't have language for how you're wired\n` +
      `• The opportunity you miss because you can't see your own strength\n\n` +
      `Generic budgeting for a Giver creates shame.\nGeneric investing advice for a Guardian creates paralysis.\n\n` +
      `**The report is calibrated. Not generic. It's a mirror you can't walk away from.**\n\n` +
      `One-time. $14.99. PDF to your inbox in 60 seconds.\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "$14.99 vs. the price of staying blind",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Let's talk about what $14.99 actually buys.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Not a PDF.<br>Not another personality test.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>It buys you sight.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Right now you're flying blind. You know your type, but you don't know your blind spot. You don't know why you keep making the same money mistakes. You don't know what Scripture says specifically about how God wired you.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Here's what staying blind costs:</p>
        <ul style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>The wrong financial advice, applied to the wrong wiring, creating guilt instead of growth</li>
          <li>The same argument with your spouse, every month, because you don't have language for how you're wired</li>
          <li>The opportunity you miss because you can't see your own strength</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Generic budgeting for a Giver creates shame.<br>Generic investing advice for a Guardian creates paralysis.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>The report is calibrated. Not generic. It's a mirror you can't walk away from.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">One-time. $14.99. PDF to your inbox in 60 seconds.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Buy the Mirror — $14.99</a>
        </div>
        `
      ),
  },
  // Email 4: 7 days after quiz — final, no apology
  {
    delayHours: 96,
    subject: "I'm done emailing you about this",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `This is the last email about the report.\n\n` +
      `**Not because I don't care. Because I do.**\n\n` +
      `You know your type. You've known it for a week.\n\n` +
      `And nothing has changed.\n\n` +
      `James 1:25 says the man who looks intently into the perfect law and continues in it — not forgetting what he has heard, but doing it — will be blessed in what he does.\n\n` +
      `You looked.\nYou forgot.\n\n` +
      `**Will you do it?**\n\n` +
      `If yes: $14.99. 60 seconds. The mirror you can't walk away from.\n\n` +
      `If no: no hard feelings. The free result is still yours.\n\n` +
      `But know this: a year from now, you'll be the same person making the same decisions with the same frustration.\n\n` +
      `Unless you choose otherwise.\n\n` +
      `${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "I'm done emailing you about this",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">This is the last email about the report.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Not because I don't care. Because I do.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You know your type. You've known it for a week.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">And nothing has changed.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">James 1:25 says the man who looks intently into the perfect law and continues in it — not forgetting what he has heard, but doing it — will be blessed in what he does.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You looked.<br>You forgot.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Will you do it?</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">If yes: $14.99. 60 seconds. The mirror you can't walk away from.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">If no: no hard feelings. The free result is still yours.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">But know this: a year from now, you'll be the same person making the same decisions with the same frustration.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Unless you choose otherwise.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${ctx.quizUrl || "https://talanthos.com/quiz/paywall"}" style="display: inline-block; background: #1c1a14; color: #f3ece0; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">Choose Otherwise — $14.99</a>
        </div>
        `
      ),
  },
];

// ─────────────────────────────────────────────────────────────
// SEQUENCE 3: ADVOCATE
// Trigger: purchased
// Theme: You have the mirror. Now use it. Then share it.
// ─────────────────────────────────────────────────────────────

const ADVOCATE_TEMPLATES: EmailTemplate[] = [
  // Email 1: immediately after purchase
  {
    delayHours: 0,
    subject: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return `Your ${td.label} Report is ready. Don't just read it.`;
    },
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return (
        `${greeting(ctx)}\n\n` +
        `Your ${td.label} Report is attached.\n\n` +
        `**This is not a book to finish. This is a mirror to use.**\n\n` +
        `James 1:25 says the man who looks intently into the perfect law and continues in it — not forgetting, but doing — will be blessed in what he does.\n\n` +
        `Here's how to not forget:\n\n` +
        `1. Print it. Don't read it on a screen.\n` +
        `2. Read the blind spot section twice. Highlight what hurts.\n` +
        `3. Pick ONE action from the 30-day plan. Do it today. Not tomorrow. Today.\n\n` +
        `The report tells you what God wired into you.\nThe action plan tells you what to do with it.\n\n` +
        `**Information without application is just entertainment. And you're not here to be entertained.**\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      return htmlWrapper(
        `Your ${td.label} Report is ready. Don't just read it.`,
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Your ${td.label} Report is attached.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>This is not a book to finish. This is a mirror to use.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-style: italic; color: #46412f;">James 1:25 says the man who looks intently into the perfect law and continues in it — not forgetting, but doing — will be blessed in what he does.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Here's how to not forget:</p>
        <ol style="font-size: 16px; line-height: 1.7; margin: 0 0 16px; padding-left: 20px;">
          <li>Print it. Don't read it on a screen.</li>
          <li>Read the blind spot section twice. Highlight what hurts.</li>
          <li>Pick <strong>ONE</strong> action from the 30-day plan. Do it today. Not tomorrow. Today.</li>
        </ol>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The report tells you what God wired into you.<br>The action plan tells you what to do with it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Information without application is just entertainment. And you're not here to be entertained.</strong></p>
        `
      );
    },
  },
  // Email 2: 3 days after purchase
  {
    delayHours: 72,
    subject: "One person. That's the mission.",
    text: (ctx) =>
      `${greeting(ctx)}\n\n` +
      `You've had the report for 3 days.\n\n` +
      `If it showed you something true about yourself, I have one question:\n\n` +
      `**Who else needs to look in this mirror?**\n\n` +
      `Not a group chat.\nNot a Facebook post.\n\n` +
      `One person.\n\n` +
      `The person who came to mind when you read that? That's the one.\n\n` +
      `Here's exactly what to send them:\n\n` +
      `———\n` +
      `Hey — I just took a 3-minute assessment that named something about money I could never articulate. It was uncomfortable. It was true. It might do the same for you.\n\n` +
      `https://talanthos.com/quiz\n` +
      `———\n\n` +
      `One conversation. One forward. One person who finally sees themselves clearly.\n\n` +
      `**That's the whole mission.**\n\n` +
      `— Talanthos`,
    html: (ctx) =>
      htmlWrapper(
        "One person. That's the mission.",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You've had the report for 3 days.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">If it showed you something true about yourself, I have one question:</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>Who else needs to look in this mirror?</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Not a group chat.<br>Not a Facebook post.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">One person.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">The person who came to mind when you read that? That's the one.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Here's exactly what to send them:</p>
        <div style="background: #efe6d4; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #46412f;">
          <p style="margin: 0 0 8px;">Hey — I just took a 3-minute assessment that named something about money I could never articulate. It was uncomfortable. It was true. It might do the same for you.</p>
          <p style="margin: 0;"><a href="https://talanthos.com/quiz" style="color: #b88a4a; text-decoration: none;">https://talanthos.com/quiz</a></p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">One conversation. One forward. One person who finally sees themselves clearly.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>That's the whole mission.</strong></p>
        `
      ),
  },
  // Email 3: 7 days after purchase
  {
    delayHours: 96,
    subject: "You finished. Most people don't. Now help someone else.",
    text: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      const shareMsg = BIBLICAL_TYPES[ctx.primaryType!]?.shareMessage ||
        `I just took a 3-minute assessment that named something about money I could never articulate. What is your Biblical Money Type?`;
      return (
        `${greeting(ctx)}\n\n` +
        `7 days ago you bought the ${td.label} Report.\n\n` +
        `Here's what that tells me about you:\n\n` +
        `**You don't just look in the mirror. You do something about what you see.**\n\n` +
        `Most people start assessments and never complete them.\nMost people read reports and never apply them.\n\n` +
        `You did both.\n\n` +
        `Now — who else in your life is flying blind?\n\n` +
        `Your spouse? Your business partner? Your small group? That friend who always talks about money but never changes?\n\n` +
        `Send them this:\n\n` +
        `———\n` +
        `${shareMsg}\n\n` +
        `https://talanthos.com/quiz\n` +
        `———\n\n` +
        `One person who finally sees themselves.\nOne conversation that changes a marriage, a business, a life.\n\n` +
        `**You looked in the mirror. Don't let them stay blind.**\n\n` +
        `— Talanthos`
      );
    },
    html: (ctx) => {
      const td = getTypeData(ctx.primaryType);
      const shareMsg = BIBLICAL_TYPES[ctx.primaryType!]?.shareMessage ||
        `I just took a 3-minute assessment that named something about money I could never articulate. What is your Biblical Money Type?`;
      return htmlWrapper(
        "You finished. Most people don't. Now help someone else.",
        `
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">7 days ago you bought the ${td.label} Report.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Here's what that tells me about you:</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>You don't just look in the mirror. You do something about what you see.</strong></p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Most people start assessments and never complete them.<br>Most people read reports and never apply them.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You did both.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Now — who else in your life is flying blind?</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Your spouse? Your business partner? Your small group? That friend who always talks about money but never changes?</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Send them this:</p>
        <div style="background: #efe6d4; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #46412f;">
          <p style="margin: 0 0 8px;">${shareMsg}</p>
          <p style="margin: 0;"><a href="https://talanthos.com/quiz" style="color: #b88a4a; text-decoration: none;">https://talanthos.com/quiz</a></p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">One person who finally sees themselves.<br>One conversation that changes a marriage, a business, a life.</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;"><strong>You looked in the mirror. Don't let them stay blind.</strong></p>
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
