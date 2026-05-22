import Anthropic from "@anthropic-ai/sdk";
import { QuizUserData, ReportContent } from "../types";
import { SYSTEM_PROMPT } from "./system-prompt";
import { buildSectionPrompts } from "./section-prompts";

const MODEL = "claude-3-5-sonnet-20240620";
const MAX_TOKENS = 4000;
const BATCH_SIZE = 5;

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.trim() === "") {
    throw new Error(
      "ANTHROPIC_API_KEY is missing. Add it to .env.local and re-run."
    );
  }
  return new Anthropic({ apiKey: key });
}

async function callClaude(
  client: Anthropic,
  section: string,
  prompt: string
): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0];
      if (content.type === "text") {
        return content.text;
      }
      throw new Error(`Unexpected response type for ${section}`);
    } catch (err) {
      lastError = err as Error;
      if (attempt === 1) {
        console.log(`   ⚠️  ${section} failed (attempt 1), retrying...`);
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  throw new Error(
    `Section "${section}" failed after 2 attempts: ${lastError?.message}`
  );
}

export async function generateReportContent(
  user: QuizUserData
): Promise<ReportContent> {
  const client = getClient();
  const prompts = buildSectionPrompts(user);

  const results: Partial<ReportContent> = {};
  const startTotal = Date.now();

  // Process in batches to avoid rate limits
  for (let i = 0; i < prompts.length; i += BATCH_SIZE) {
    const batch = prompts.slice(i, i + BATCH_SIZE);
    console.log(
      `\n🔄 Batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(prompts.length / BATCH_SIZE)} (${batch.length} sections)`
    );

    const batchPromises = batch.map(async ({ section, prompt }) => {
      const t0 = Date.now();
      const text = await callClaude(client, section, prompt);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`   ✅ ${section} — ${elapsed}s`);
      return { section, text };
    });

    const batchResults = await Promise.all(batchPromises);

    for (const { section, text } of batchResults) {
      (results as Record<string, string>)[section] = text;
    }

    // Small delay between batches
    if (i + BATCH_SIZE < prompts.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const totalElapsed = ((Date.now() - startTotal) / 1000).toFixed(1);
  console.log(`\n⏱️  Total generation time: ${totalElapsed}s`);

  return results as ReportContent;
}
