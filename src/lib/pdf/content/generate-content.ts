import Anthropic from "@anthropic-ai/sdk";
import { QuizUserData, ReportContent } from "../types";
import { SYSTEM_PROMPT } from "./system-prompt";
import { buildBatchPrompts } from "./batch-prompts";

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4096;

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
  batchName: string,
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
      throw new Error(`Unexpected response type for ${batchName}`);
    } catch (err) {
      lastError = err as Error;
      if (attempt === 1) {
        console.log(`   ⚠️  ${batchName} failed (attempt 1), retrying...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  throw new Error(
    `Section "${batchName}" failed after 2 attempts: ${lastError?.message}`
  );
}

export async function generateReportContent(
  user: QuizUserData
): Promise<ReportContent> {
  const client = getClient();
  const batches = buildBatchPrompts(user);

  const results: Partial<ReportContent> = {};
  const startTotal = Date.now();

  for (let i = 0; i < batches.length; i++) {
    const { batchName, section, prompt } = batches[i];
    console.log(`\n🔄 Section ${i + 1} / ${batches.length} (${batchName})`);

    const t0 = Date.now();
    const text = await callClaude(client, batchName, prompt);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    (results as Record<string, string>)[section] = text.trim();
    console.log(`   ✅ ${batchName} — ${text.length} chars — ${elapsed}s`);

    // Small delay between calls to avoid rate limits
    if (i < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  const totalElapsed = ((Date.now() - startTotal) / 1000).toFixed(1);
  console.log(`\n⏱️  Total generation time: ${totalElapsed}s`);

  return results as ReportContent;
}
