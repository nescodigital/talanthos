import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const MAX_TOKENS = 800;
const TEMPERATURE = 0.7;
const GLOBAL_DAILY_COST_LIMIT_USD = parseFloat(
  process.env.ASK_DAILY_COST_LIMIT_USD || "50"
);
const INPUT_COST_PER_1M = 3;
const OUTPUT_COST_PER_1M = 15;
const USER_MONTHLY_COST_CAP_CENTS = 500; // $5
const USER_MONTHLY_QUESTION_CAP = 50;
const ANON_DAILY_LIMIT = 3;
const EMAIL_DAILY_LIMIT = 10;

const MONEY_KEYWORDS =
  /\b(money|debt|wealth|tithe|tithing|give|giving|save|saving|invest|investment|investing|financial|finances|finance|rich|poor|stewardship|budget|anxiety about money|anxious about money|greed|greedy|provision|prosperity|loan|loans|borrow|borrowing|lending|lender|credit|mortgage|retirement|inheritance|offering|offerings|alms|charity|donate|donation|poverty|riches|treasure|treasures|mammon|gold|silver|income|salary|wage|wages|earn|earning|profit|loss|debtor|creditor|usury|interest|dividend|stock|stocks|bond|bonds|real estate|property|rent|rental|insurance|savings|bank|banking|credit card|debit|payment|payments|bill|bills|due|overdue|collection|collections|bankruptcy|default|asset|assets|cash|capital|net worth|equity|portfolio|crypto|bitcoin|spending|expense|expenses|cost of living|living wage|minimum wage|pay raise|promotion|job loss|unemployment|side hustle|passive income|rental income|dividends|royalties|commission|bonus|tip|tips|allowance|pocket money|windfall|inheritance|estate|trust fund|alimony|child support|settlement|compensation|damages|reimbursement|refund|rebate|discount|sale|bargain|deal|coupon|voucher|gift card|store credit|layaway|installment|installments|payment plan|financing|lease|leasing|rent to own|pawn|pawnbroker|title loan|payday loan|predatory lending|microfinance|microloan|small business loan|line of credit|cash advance|overdraft|nsf|bounced check|late fee|penalty|interest rate|apr|apy|yield|return on investment|roi|break even|profit margin|gross profit|net profit|revenue|turnover|sales|gross income|net income|adjusted gross income|agi|taxable income|deduction|deductions|exemption|exemptions|tax bracket|marginal rate|effective rate|tax liability|tax refund|tax return|filing|withholding|estimated tax|self employment tax|fica|social security|medicare|payroll tax|corporate tax|capital gains|long term capital gains|short term capital gains|dividend tax|passive income tax|estate tax|inheritance tax|gift tax|generation skipping tax|gst|excise tax|sales tax|vat|value added tax|use tax|property tax|real estate tax|ad valorem tax|transfer tax|stamp duty|recording fee|escrow|escrow account|escrow officer|title insurance|title search|lien|encumbrance|easement|restrictive covenant|deed|quitclaim deed|warranty deed|grant deed|bargain and sale deed|mortgage deed|deed of trust|promissory note|mortgage note|security instrument|financing statement|ucc|uniform commercial code|perfected lien|priority|subordination|intercreditor agreement|subordination agreement|standstill agreement|forbearance|workout|restructuring|debt restructuring|debt consolidation|debt settlement|debt management|debt counseling|credit counseling|financial counseling|money coaching|financial coach|wealth coach|life coach|business coach|executive coach|career coach|success coach|motivational speaker|financial guru|money expert|investment guru|stock picker|market timer|day trader|swing trader|position trader|buy and hold|dollar cost averaging|lump sum|value averaging|rebalancing|asset allocation|modern portfolio theory|efficient frontier|sharpe ratio|beta|alpha|standard deviation|variance|correlation|covariance|regression|r squared|treynor ratio|information ratio|sortino ratio|maximum drawdown|calmar ratio|omega ratio|upside capture|downside capture|tracking error|active share|active risk|passive management|index fund|etf|exchange traded fund|mutual fund|closed end fund|unit investment trust|uit|separate account|managed account|wrap account|discretionary account|non discretionary|advisory account|brokerage account|margin account|cash account|ira|roth ira|traditional ira|sep ira|simple ira|401k|403b|457|thrift savings|tsp|pension|defined benefit|defined contribution|cash balance|employee stock ownership|esop|stock option|rsu|restricted stock|performance share|phantom stock|appreciation right|sar|employee stock purchase|espp|benefit|benefits|perquisite|perk|fringe benefit|cafeteria plan|flexible spending|fsa|health savings|hsa|health reimbursement|hra|medical savings|msa|archer msa|dependent care|adoption assistance|tuition reimbursement|student loan repayment|education assistance|training|development|professional development|continuing education|ce|certification|license|licensure|credential|designation|cfa|cpa|cfp|chfc|clu|ricp|crpc|crps|aif|aams|acc|adpa|afc|awma|casl|cmfc|fpq|fva|maa|mfp|mpas|pfs|rma|wms)\b/i;

const askSchema = z.object({
  question: z.string().min(1).max(500),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(10)
    .default([]),
  emailIfCaptured: z.string().email().optional(),
});

interface AskCookie {
  sessionId: string;
  anonymousQuestions: number;
  lastReset: string;
  email?: string;
}

async function getAskCookie(): Promise<AskCookie> {
  const store = await cookies();
  const raw = store.get("talanthos_ask_session")?.value;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AskCookie;
      if (parsed.sessionId) return parsed;
    } catch {
      /* ignore */
    }
  }
  return {
    sessionId: crypto.randomUUID(),
    anonymousQuestions: 0,
    lastReset: new Date().toISOString(),
  };
}

async function setAskCookie(value: AskCookie) {
  const store = await cookies();
  store.set("talanthos_ask_session", JSON.stringify(value), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

function shouldResetDaily(lastReset: string): boolean {
  const last = new Date(lastReset).getTime();
  const now = Date.now();
  return now - last > 24 * 60 * 60 * 1000;
}

function shouldResetMonthly(monthReset: string): boolean {
  const resetDate = new Date(monthReset);
  const now = new Date();
  return (
    resetDate.getMonth() !== now.getMonth() ||
    resetDate.getFullYear() !== now.getFullYear()
  );
}

function computeCostCents(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_1M;
  const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_1M;
  return Math.round((inputCost + outputCost) * 10000) / 100; // 2 decimals in cents? no, 4 decimals of cents precision
}

function isMoneyRelated(question: string): boolean {
  return MONEY_KEYWORDS.test(question);
}

function buildLimitResponse(
  type: "daily_cap" | "monthly_cap" | "abuse" | "global_cap",
  isAnonymous: boolean
) {
  const responses: Record<
    string,
    { message: string; ctaText: string; ctaUrl: string; ctaSecondary?: string }
  > = {
    daily_cap: isAnonymous
      ? {
          message:
            "You've used today's free questions. Enter your email to unlock 10 questions per day — free.",
          ctaText: "Continue free with email",
          ctaUrl: "#email-gate",
        }
      : {
          message:
            "You've reached today's limit. Talanthos Companion gives you 100 questions per month plus weekly biblical guidance — $9/month.",
          ctaText: "Unlock with Companion",
          ctaUrl: "/quiz/paywall",
          ctaSecondary: "Or come back tomorrow",
        },
    monthly_cap: {
      message:
        "You've reached your monthly free allowance. Talanthos Companion gives you 100 questions per month plus deeper guidance — $9/month, cancel anytime.",
      ctaText: "Unlock with Companion",
      ctaUrl: "/quiz/paywall",
    },
    abuse: {
      message:
        "Your conversation has been paused. If this seems incorrect, contact support@talanthos.com.",
      ctaText: "Contact support",
      ctaUrl: "mailto:support@talanthos.com",
    },
    global_cap: {
      message:
        "Our conversation capacity is full for today. Please return tomorrow, or unlock your own dedicated allowance with Talanthos Companion.",
      ctaText: "Unlock unlimited",
      ctaUrl: "/quiz/paywall",
    },
  };

  const r = responses[type];
  return {
    error: "rate_limit",
    type,
    message: r.message,
    ctaText: r.ctaText,
    ctaUrl: r.ctaUrl,
    ctaSecondary: r.ctaSecondary,
  };
}

const SYSTEM_PROMPT = `You are the biblical guide behind Talanthos. You answer any Bible question with depth, accuracy, and warmth. You have a special vocation for questions about money — debt, wealth, generosity, anxiety, stewardship. When money questions arise, you go deeper than budgeting techniques and reveal what Scripture says about the heart behind the money.

Your voice:
- Pastoral, warm, but never sentimental
- Anchored in Scripture, quoting accurately (ESV or NIV)
- Honest about hard truths
- Brief and focused: 150-300 words per answer, not essays
- Use 1-2 verse citations per answer, naturally woven in
- Never give specific financial advice that requires a license (no 'buy X', no specific securities)
- Always close money topics with a brief disclaimer when needed: 'This is spiritual guidance, not professional financial advice.'

You answer in second person ('you'). You write in literary, accessible English. You do NOT use markdown formatting in your response (no **bold**, no ## headers). Plain prose only with natural paragraph breaks.

If asked a non-Bible question (e.g. 'what's the weather'), gently redirect: 'I can only offer biblical guidance. Is there a Scripture question I can help with?'`;

export async function POST(req: NextRequest) {
  // 1. Rate limit by IP
  const ipLimit = rateLimit(req, { max: 30, windowMs: 60_000, keyPrefix: "ask" });
  if (!ipLimit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // 2. Parse body
  let body: z.infer<typeof askSchema>;
  try {
    const raw = await req.json();
    const parsed = askSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();

  // 3. Global daily cost check
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: costData } = await supabase
      .from("ask_conversations")
      .select("cost_cents")
      .gte("created_at", since);

    const totalCostCents = (costData || []).reduce(
      (sum, row) => sum + (row.cost_cents || 0),
      0
    );
    const totalCostUsd = totalCostCents / 100;

    if (totalCostUsd >= GLOBAL_DAILY_COST_LIMIT_USD) {
      return NextResponse.json(buildLimitResponse("global_cap", false), { status: 429 });
    }
  } catch (e) {
    console.error("[ASK] Global cost check error", e);
  }

  // 4. Cookie / session handling
  const cookie = await getAskCookie();
  if (shouldResetDaily(cookie.lastReset)) {
    cookie.anonymousQuestions = 0;
    cookie.lastReset = new Date().toISOString();
  }

  const isAnonymous = !cookie.email && !body.emailIfCaptured;
  const userEmail = cookie.email || body.emailIfCaptured || null;

  // 5. Rate limit DB record for email users
  let rateLimitRow: any = null;
  if (userEmail) {
    const { data: existing } = await supabase
      .from("ask_rate_limits")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (existing) {
      rateLimitRow = existing;
      // Reset daily if needed
      if (shouldResetDaily(existing.last_reset_at)) {
        existing.questions_today = 0;
        existing.last_reset_at = new Date().toISOString();
      }
      // Reset monthly if needed
      if (shouldResetMonthly(existing.month_reset_at)) {
        existing.questions_this_month = 0;
        existing.cost_this_month_cents = 0;
        existing.month_reset_at = new Date().toISOString();
      }
      await supabase.from("ask_rate_limits").update({
        questions_today: existing.questions_today,
        last_reset_at: existing.last_reset_at,
        questions_this_month: existing.questions_this_month,
        month_reset_at: existing.month_reset_at,
        cost_this_month_cents: existing.cost_this_month_cents,
        updated_at: new Date().toISOString(),
      }).eq("id", existing.id);
    } else {
      // Create new
      const { data: created } = await supabase
        .from("ask_rate_limits")
        .insert({
          email: userEmail,
          session_id: cookie.sessionId,
          ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
        })
        .select()
        .single();
      rateLimitRow = created;
    }
  }

  // 6. Order of checks
  // 6a. Suspended
  if (rateLimitRow?.suspended) {
    return NextResponse.json(buildLimitResponse("abuse", false), { status: 429 });
  }

  // 6b. Monthly cost > $5 → suspend
  if (rateLimitRow && rateLimitRow.cost_this_month_cents >= USER_MONTHLY_COST_CAP_CENTS) {
    await supabase
      .from("ask_rate_limits")
      .update({
        suspended: true,
        suspended_at: new Date().toISOString(),
        suspended_reason: "Monthly cost exceeded $5",
        updated_at: new Date().toISOString(),
      })
      .eq("id", rateLimitRow.id);
    return NextResponse.json(buildLimitResponse("abuse", false), { status: 429 });
  }

  // 6c. Monthly questions > 50
  if (rateLimitRow && rateLimitRow.questions_this_month >= USER_MONTHLY_QUESTION_CAP) {
    return NextResponse.json(buildLimitResponse("monthly_cap", false), { status: 429 });
  }

  // 6d. Daily questions
  const dailyCount = isAnonymous
    ? cookie.anonymousQuestions
    : (rateLimitRow?.questions_today || 0);
  const dailyLimit = isAnonymous ? ANON_DAILY_LIMIT : EMAIL_DAILY_LIMIT;

  if (dailyCount >= dailyLimit) {
    return NextResponse.json(
      buildLimitResponse("daily_cap", isAnonymous),
      { status: 429 }
    );
  }

  // 7. Call Claude API
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    ...(body.conversationHistory || []).slice(-10),
    { role: "user", content: body.question },
  ];

  let aiResponse = "";
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const claudeRes = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const content = claudeRes.content[0];
    if (content.type === "text") {
      aiResponse = content.text;
    }

    inputTokens = claudeRes.usage?.input_tokens || 0;
    outputTokens = claudeRes.usage?.output_tokens || 0;
  } catch (err: any) {
    console.error("[ASK] Claude API error", err);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again." },
      { status: 503 }
    );
  }

  // 8. Cost tracking
  const costCents = computeCostCents(inputTokens, outputTokens);

  // 9. Contextual push
  const moneyRelated = isMoneyRelated(body.question);
  let pushShown = false;
  if (moneyRelated && Math.random() < 0.5) {
    pushShown = true;
    aiResponse +=
      "\n\nIf you want to go deeper into your specific relationship with money — the biblical type you are, your blind spots, your path forward — that's exactly what Talanthos's personalized reading reveals. Discover your Biblical Money Type → https://talanthos.com/quiz";
  }

  // 10. Save conversation
  try {
    await supabase.from("ask_conversations").insert({
      session_id: cookie.sessionId,
      email: userEmail,
      question: body.question,
      response: aiResponse,
      is_money_related: moneyRelated,
      contextual_push_shown: pushShown,
      tokens_input: inputTokens,
      tokens_output: outputTokens,
      cost_cents: costCents,
    });
  } catch (e) {
    console.error("[ASK] Save conversation error", e);
  }

  // 11. Update rate limits
  if (isAnonymous) {
    cookie.anonymousQuestions += 1;
    await setAskCookie(cookie);
  } else if (rateLimitRow) {
    await supabase
      .from("ask_rate_limits")
      .update({
        questions_today: rateLimitRow.questions_today + 1,
        questions_this_month: rateLimitRow.questions_this_month + 1,
        total_questions_ever: rateLimitRow.total_questions_ever + 1,
        cost_this_month_cents: rateLimitRow.cost_this_month_cents + costCents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rateLimitRow.id);
  }

  // 12. Return response
  const remaining = dailyLimit - dailyCount - 1;

  return NextResponse.json({
    response: aiResponse,
    questionsRemaining: Math.max(0, remaining),
    emailRequired: isAnonymous && remaining <= 0,
    costCents,
    tokensUsed: { input: inputTokens, output: outputTokens },
  });
}
