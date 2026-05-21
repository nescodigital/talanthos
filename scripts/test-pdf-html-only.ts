import { MOCK_USERS } from "../src/lib/pdf/mock-data";
import { BiblicalType, ReportContent } from "../src/lib/pdf/types";
import { TYPE_DATA } from "../src/lib/pdf/type-data";
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

// Canned placeholder text for fast visual iteration — type-agnostic
function getCannedContent(type: BiblicalType): ReportContent {
  const td = TYPE_DATA[type];
  const figure = td.figure;
  const name = type === "visionary" ? "Daniel" : type === "guardian" ? "Sarah" : type === "giver" ? "Marcus" : "Ruth";

  return {
    reading: `You are a ${td.name}. You see what others do not yet see. You trace patterns in the dark, and where others see risk, you see the shimmer of what might be. But this gift is also a weight. You carry the burden of futures that do not yet exist, and the cost is often paid in the present tense.

${figure} stands as your mirror. This is the emotional heart of your report — a long reading that connects your type to Scripture, names your blind spots, and turns toward hope. In the real PDF this section runs 1,400–1,700 words and speaks directly to your regret and your fear.

What God is inviting you into is not smaller vision, but deeper roots. The field you have already planted needs tending.`,

    fourDimensional: `## Vision — 5 out of 10

Vision measures your capacity to see future possibility and to allocate resources toward what does not yet exist. At this score level, you have capacity but it is not your dominant instinct.

## Guard — 7 out of 10

Guard measures your instinct to protect, preserve, and prepare for lean seasons. At 7, you have real strength here. The gift is unmistakable: you create runway where others create chaos.

## Give — 4 out of 10

Give measures your orientation toward generosity and outward flow. At 4, you are balanced but not driven. You give when the cause aligns with your deeper values.

## Build — 8 out of 10

Build measures your capacity to create systems, finish structures, and establish lasting order. At 8, you are operating near the upper register of this dimension.`,

    hiddenGift: `Beneath the obvious traits of the ${td.name} lies a gift that is rarely named: the capacity to endure ambiguity. Most people collapse under uncertainty. You do not merely tolerate it; you draw energy from it. The not-yet is your native country.

Your hidden gift is the ability to hold multiple possible futures in tension without collapsing into anxiety. You see branching paths where others see a single road.`,

    growthRoadmap: `## Blind Spot 1: The Pattern You Repeat

You make decisions faster than the wise voices around you can process. This is not speed for speed's sake; it is your type's impatience with deliberation.

## Blind Spot 2: The Cost of Your Strength

You can fall in love with the plan and lose interest in the execution. The vision is intoxicating; the maintenance is mundane.

## Blind Spot 3: The Subtle Drift

When your strength works, it is easy to believe it was your insight rather than God's provision.

## Blind Spot 4: The Relational Price

You are drawn to people who can advance your mission. This is not malicious; it is efficient. But efficiency is not love.

## Blind Spot 5: Deferred Rest

You believe you will rest when the mission is complete. But the horizon always recedes.`,

    debtStrategy: `Your type approaches debt with a specific instinct. Where others see danger or opportunity, you see something particular to how you are wired. The biblical posture on debt is clear: "The rich rules over the poor, and the borrower is the slave of the lender" (Proverbs 22:7).

Your strategy is not total avoidance. It is bounded ambition. Set a debt-to-income ceiling that you will not cross without reflection and counsel.`,

    investmentPhilosophy: `Your relationship with increase is complicated. You believe in multiplication — it is your native language. But you may also believe that increase is primarily a function of your own discernment, rather than God's provision.

The parable of the talents (Matthew 25:14-30) is your corrective. The master does not praise the servants for their returns; he praises them for their faithfulness.`,

    givingStrategy: `Your type gives in a particular way. You fund what you believe will multiply, or you give cautiously, or you give reflexively. The biblical call is both freedom and faithfulness.

Your posture: establish a baseline percentage that is non-negotiable, given before any strategic or spontaneous gifts. This is your tithe, your storehouse.`,

    actionPlan: `## Week 1: Seeing Clearly

Day 1: Write one paragraph describing your current financial situation without using the word "potential."
Day 2: List every unfinished financial commitment from the past 12 months.
Day 3: Choose one commitment and schedule 30 minutes to assess its status.
Day 4: Read one verse about stewardship. Write one sentence about what it means for you.
Day 5: Calculate your current debt-to-income ratio.
Day 6: Identify one person whose financial counsel you trust.
Day 7: Sabbath. No financial work today.

## Week 2: Ordering What You Have

Day 8–14: Build systems, review giving, set baselines, open emergency fund if needed.

## Week 3: One Faithful Step

Day 15–21: Choose one debt or unfinished commitment and bring it toward completion.

## Week 4: Consecration

Day 22–30: Review progress, write a prayer of consecration, set next 30-day commitment.`,

    scripturePassages: `## The Call to See

> "Where there is no vision, the people perish."
**Proverbs 29:18**

> "Trust in the Lord with all your heart, and do not lean on your own understanding."
**Proverbs 3:5**

> "For we walk by faith, not by sight."
**2 Corinthians 5:7**

> "Commit your work to the Lord, and your plans will be established."
**Proverbs 16:3**

> "The plans of the diligent lead surely to abundance."
**Proverbs 21:5**

> "Unless the Lord builds the house, those who build it labor in vain."
**Psalm 127:1**

## The Weight of Wisdom

> "To give prudence to the simple, knowledge and discretion to the youth."
**Proverbs 1:4**

> "The heart of man plans his way, but the Lord establishes his steps."
**Proverbs 16:9**

> "Be not wise in your own eyes; fear the Lord, and turn away from evil."
**Proverbs 3:7**

> "A wise man will hear and increase in learning."
**Proverbs 1:5**

> "Do you see a man skillful in his work? He will stand before kings."
**Proverbs 22:29**

> "By wisdom a house is built, and by understanding it is established."
**Proverbs 24:3**

## The Discipline of Presence

> "But seek first the kingdom of God and his righteousness, and all these things will be added to you."
**Matthew 6:33**

> "Do not be anxious about tomorrow, for tomorrow will be anxious for itself."
**Matthew 6:34**

> "This is the day that the Lord has made; let us rejoice and be glad in it."
**Psalm 118:24**

> "Be still, and know that I am God."
**Psalm 46:10**

> "But I have calmed and quieted my soul."
**Psalm 131:2**

> "And he awoke and rebuked the wind and said to the sea, 'Peace! Be still!'"
**Mark 4:39**

## The Stewardship of Increase

> "Well done, good and faithful servant. You have been faithful over a little."
**Matthew 25:21**

> "Moreover, it is required of stewards that they be found faithful."
**1 Corinthians 4:2**

> "Honor the Lord with your wealth and with the firstfruits of all your produce."
**Proverbs 3:9**

> "Bring the full tithe into the storehouse."
**Malachi 3:10**

> "The point is this: whoever sows sparingly will also reap sparingly."
**2 Corinthians 9:6**

> "Each one must give as he has decided in his heart, not reluctantly or under compulsion."
**2 Corinthians 9:7**

## The Long Obedience

> "Let us not grow weary of doing good, for in due season we will reap, if we do not give up."
**Galatians 6:9**

> "For still the vision awaits its appointed time; it hastens to the end."
**Habakkuk 2:3**

> "But they who wait for the Lord shall renew their strength."
**Isaiah 40:31**

> "The Lord is my shepherd; I shall not want."
**Psalm 23:1**

> "I have learned in whatever situation I am to be content."
**Philippians 4:11**

> "Now to him who is able to do far more abundantly than all that we ask or think."
**Ephesians 3:20**`,

    closingLetter: `Dear ${name},

You began this report with a question you could not quite name: am I building something that will last, or am I merely building fast?

The answer is not either-or. You are building. That is your gift. But the speed at which you build may be outpacing the depth at which you root. And roots take time.

Go forward as a ${td.name} who has learned to wait. Not because waiting is virtuous, but because waiting is where roots find water. And the tree with the deepest roots is the one that bears fruit in every season.

May the God who sees the end from the beginning grant you the patience to stay where you are until He moves you.

Talanthos`,
  };
}

async function generateType(type: BiblicalType) {
  const user = MOCK_USERS[type];
  const content = getCannedContent(type);
  const totalWords = Object.values(content).join(" ").split(/\s+/).length;

  console.log(`\n📄 ${type.toUpperCase()} — ${user.firstName}`);
  console.log(`   Words: ${totalWords}`);

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

  console.log("🎨 Test PDF — HTML ONLY (no API calls)");
  console.log(`   Mode: ${target === "all" ? "all 4 types" : types[0]}`);

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
  console.error("❌ Error:", err);
  process.exit(1);
});
