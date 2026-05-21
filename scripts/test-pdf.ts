import { MOCK_USERS } from "../src/lib/pdf/mock-data";
import { BiblicalType } from "../src/lib/pdf/types";
import { generateReportContent } from "../src/lib/pdf/content/generate-content";
import { buildReportHtml } from "../src/lib/pdf/template/report.html";
import { renderPdf } from "../src/lib/pdf/render";

const VALID_TYPES: BiblicalType[] = ["visionary", "guardian", "giver", "builder"];

function parseArgs(): BiblicalType[] | "all" {
  const args = process.argv.slice(2);
  const typeArg = args.find((a) => !a.startsWith("-"));
  if (!typeArg || typeArg === "all") return "all";
  if (VALID_TYPES.includes(typeArg as BiblicalType)) return [typeArg as BiblicalType];
  console.error(`Unknown type: ${typeArg}. Use: visionary | guardian | giver | builder | all`);
  process.exit(1);
}

async function generateType(type: BiblicalType) {
  const user = MOCK_USERS[type];
  console.log(`\n📄 ${type.toUpperCase()} — ${user.firstName}`);

  const content = await generateReportContent(user);
  const totalWords = Object.values(content).join(" ").split(/\s+/).length;
  console.log(`   Total words: ${totalWords}`);

  const html = buildReportHtml(user, content);
  await renderPdf({
    html,
    outputPath: `/tmp/talanthos-test-${type}.pdf`,
    saveHtml: true,
  });
}

async function main() {
  const target = parseArgs();
  const types = target === "all" ? VALID_TYPES : target;

  console.log("🤖 Test PDF — FULL PIPELINE (Claude API calls)");
  console.log(`   Mode: ${target === "all" ? "all 4 types" : types[0]}`);
  console.log(`   Model: claude-3-5-sonnet-20241022`);

  for (const type of types) {
    await generateType(type);
  }

  console.log("\n✅ Done. Generated files:");
  for (const type of types) {
    console.log(`   /tmp/talanthos-test-${type}.pdf`);
    console.log(`   /tmp/talanthos-test-${type}.html`);
  }
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message || err);
  process.exit(1);
});
