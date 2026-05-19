import { ReportData } from "@/lib/pdf/data-builder";

export function renderReportHtml(data: ReportData): string {
  const t = data.primaryTypeData;
  const s = data.secondaryTypeData;

  const scoreBars = [
    { key: "visionary" as const, label: "Vision", color: "#8b6bb1" },
    { key: "guardian" as const, label: "Guard", color: "#b88a4a" },
    { key: "giver" as const, label: "Give", color: "#5a9a6e" },
    { key: "builder" as const, label: "Build", color: "#6b7b8c" },
  ];

  const scoreHtml = scoreBars.map((bar) => {
    const value = data.scores[bar.key];
    const pct = Math.max(12, (value / data.maxScore) * 100);
    const isHi = bar.key === data.primaryType;
    return `
      <div class="score-bar">
        <div class="score-bar-label">
          <span class="score-bar-name">${bar.label}</span>
          <span class="score-bar-value">${value}/7</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width: ${pct}%; background: ${isHi ? "var(--accent)" : bar.color};"></div>
        </div>
      </div>
    `;
  }).join("");

  const strengthsHtml = t.strengths.map((strength, i) => `
    <div class="strength-item">
      <span class="strength-num">${String(i + 1).padStart(2, "0")}</span>
      <p class="strength-text">${strength}</p>
    </div>
  `).join("");

  const blindSpotsHtml = t.blindSpots.map((spot, i) => `
    <div class="blind-item">
      <span class="blind-num">${String(i + 1).padStart(2, "0")}</span>
      <p class="blind-text">${spot}</p>
    </div>
  `).join("");

  const scriptures = getScripturesForType(data.primaryType);
  const scriptureWeeks = [
    { title: "Week 1: Truth & Identity", verses: scriptures.slice(0, 8) },
    { title: "Week 2: Calling & Resources", verses: scriptures.slice(8, 16) },
    { title: "Week 3: Risk & Trust", verses: scriptures.slice(16, 23) },
    { title: "Week 4: Legacy & Sending", verses: scriptures.slice(23, 30) },
  ];

  const scriptureHtml = scriptureWeeks.map((week) => `
    <div class="scripture-week">
      <h4 class="scripture-week-title">${week.title}</h4>
      ${week.verses.map((v) => `
        <div class="scripture-verse">
          <p class="scripture-text">"${v.text}"</p>
          <cite class="scripture-ref">${v.ref}</cite>
          <p class="scripture-reflection">${v.reflection}</p>
        </div>
      `).join("")}
    </div>
  `).join("");

  const actionPlan = get30DayPlan(data.primaryType);
  const actionPlanHtml = actionPlan.map((day, i) => `
    <div class="action-day">
      <span class="action-day-num">Day ${i + 1}</span>
      <p class="action-day-text">${day}</p>
    </div>
  `).join("");

  const debtStrategy = getDebtStrategy(data.primaryType);
  const investStrategy = getInvestmentStrategy(data.primaryType);
  const givingStrategy = getGivingStrategy(data.primaryType);
  const hiddenGift = getHiddenGift(data.primaryType);
  const personalLetter = buildPersonalLetter(data);
  const demographicContext = buildDemographicContext(data);
  const closingPrayer = buildClosingPrayer(data);

  const secondarySection = s ? `
    <div class="page-break"></div>
    <section class="section">
      <p class="section-eyebrow">Layered Profile</p>
      <h2 class="section-title">Your Secondary Influence: ${s.label}</h2>
      <p class="body-text">While ${t.label} is your primary wiring, ${s.label} runs close behind. This means you don't just ${primaryVerb(data.primaryType)} — you also ${secondaryVerb(data.secondaryType!)}. The ${s.figure} archetype adds a dimension of ${s.tagline.toLowerCase()} to your financial life.</p>
      <p class="body-text">Where ${t.label} might ${t.blindSpots[0].toLowerCase()}, ${s.label} brings a counterweight: ${s.strengths[0].toLowerCase()}. This combination is rare. It means you have both the ${t.label.toLowerCase().replace("the ", "")}'s ${t.strengths[0].toLowerCase().split(" ").slice(0, 3).join(" ")} and the ${s.label.toLowerCase().replace("the ", "")}'s ${s.strengths[0].toLowerCase().split(" ").slice(0, 3).join(" ")}.</p>
      <p class="body-text">The risk? You may feel pulled between two instincts. When they conflict, return to your primary type as the anchor, and let your secondary type be the seasoning.</p>
    </section>
  ` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Biblical Money Type Report — ${t.label}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 70px 55px 60px 55px; }
    @page :first { margin: 0; }

    :root {
      --bg: #f3ece0;
      --bg-2: #ede4d3;
      --ink: #1c1a14;
      --ink-2: #46412f;
      --muted: #7a7359;
      --accent: #b88a4a;
      --accent-soft: #b88a4a22;
      --rule: rgba(28,26,20,0.12);
      --rule-strong: rgba(28,26,20,0.22);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 12pt;
      line-height: 1.65;
      color: var(--ink);
      background: var(--bg);
    }

    .page-break { page-break-after: always; }
    section.section { page-break-before: always; }
    section.section:first-of-type { page-break-before: auto; }

    /* Cover */
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 100px 60px;
      background: var(--bg);
      position: relative;
    }
    .cover::before {
      content: "";
      position: absolute; inset: 40px;
      border: 1px solid var(--accent);
      opacity: 0.3;
      pointer-events: none;
    }
    .cover-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 60px;
    }
    .cover-type {
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 48pt;
      font-weight: 400;
      color: var(--ink);
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .cover-figure {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10pt;
      color: var(--muted);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 40px;
    }
    .cover-name {
      font-size: 15pt;
      color: var(--ink-2);
      margin-bottom: 12px;
      margin-top: 24px;
    }
    .cover-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      color: var(--muted);
      letter-spacing: 0.1em;
    }
    .cover-seal {
      margin-top: 60px;
      width: 60px; height: 60px;
      border: 1px solid var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 18pt;
      color: var(--accent);
    }

    /* Sections */
    .section { padding: 0; }
    .section-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
    }
    .section-title {
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 24pt;
      font-weight: 400;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 24px;
    }
    .section-subtitle {
      font-size: 13pt;
      font-style: italic;
      color: var(--ink-2);
      margin-bottom: 20px;
    }

    .body-text {
      font-size: 12pt;
      line-height: 1.7;
      color: var(--ink);
      margin-bottom: 16px;
      text-align: justify;
    }
    .body-text em {
      font-style: italic;
      color: var(--accent);
    }
    .pull-quote {
      border-left: 2px solid var(--accent);
      padding-left: 18px;
      margin: 24px 0;
      font-style: italic;
      font-size: 12pt;
      color: var(--ink-2);
      line-height: 1.55;
    }
    .verse-block {
      margin: 28px 0;
      padding: 24px 28px;
      background: var(--bg-2);
      border-radius: 8px;
    }
    .verse-block p {
      font-style: italic;
      font-size: 12pt;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .verse-block cite {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: var(--muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-style: normal;
    }

    /* Scores */
    .scores-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 28px 0;
    }
    .score-bar {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .score-bar-label {
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
    }
    .score-bar-track {
      height: 6px;
      background: var(--rule);
      border-radius: 3px;
      overflow: hidden;
    }
    .score-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.6s ease;
    }

    /* Strengths / Blind spots */
    .strength-item, .blind-item {
      display: flex;
      gap: 14px;
      margin-bottom: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--rule);
    }
    .strength-item:last-child, .blind-item:last-child {
      border-bottom: 0;
    }
    .strength-num, .blind-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      color: var(--accent);
      letter-spacing: 0.15em;
      min-width: 28px;
    }
    .strength-text, .blind-text {
      font-size: 12pt;
      line-height: 1.6;
    }

    /* Scriptures */
    .scripture-week {
      margin-bottom: 20px;
    }
    .scripture-week-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--rule);
    }
    .scripture-verse {
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px dashed var(--rule);
    }
    .scripture-verse:last-child {
      border-bottom: 0;
    }
    .scripture-text {
      font-style: italic;
      font-size: 11pt;
      line-height: 1.55;
      margin-bottom: 6px;
    }
    .scripture-ref {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: var(--muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .scripture-reflection {
      font-size: 10pt;
      color: var(--ink-2);
      margin-top: 6px;
      line-height: 1.5;
    }

    /* Action plan */
    .action-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 24px;
    }
    .action-day {
      display: flex;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--rule);
    }
    .action-day-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: var(--accent);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      min-width: 50px;
      white-space: nowrap;
    }
    .action-day-text {
      font-size: 9.5pt;
      line-height: 1.45;
      color: var(--ink);
    }

    /* Lists */
    .strategy-list {
      list-style: none;
      padding: 0;
      margin: 12px 0;
    }
    .strategy-list li {
      padding-left: 20px;
      position: relative;
      margin-bottom: 10px;
      font-size: 10.5pt;
      line-height: 1.5;
    }
    .strategy-list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 10px;
      width: 10px;
      height: 1px;
      background: var(--accent);
    }

    /* Prayer */
    .prayer {
      font-style: italic;
      font-size: 12.5pt;
      line-height: 1.7;
      color: var(--ink-2);
      padding: 28px;
      background: var(--bg-2);
      border-radius: 8px;
      margin: 24px 0;
    }

    /* Footer note */
    .fine-print {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      color: var(--muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--rule);
    }

    /* Two column */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    /* Header / Footer */
    .report-header {
      position: running(header);
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
      border-bottom: 1px solid var(--rule);
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    @media print {
      .report-header { display: block; }
    }
  </style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-logo">Talanthos</div>
  <div class="cover-type">${t.label}</div>
  <div class="cover-figure">${t.figure} &middot; ${t.tagline}</div>
  <div class="cover-name">Prepared for ${data.firstName || data.email || "you"}</div>
  <div class="cover-date">${data.generatedAt}</div>
  <div class="cover-seal">${t.monogram}</div>
</div>

<!-- PERSONAL LETTER -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">A Word Before You Begin</p>
  <h2 class="section-title">Dear ${data.firstName || "friend"},</h2>
  ${personalLetter}
</section>

<!-- TYPE PROFILE -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Your Profile</p>
  <h2 class="section-title">You are ${t.label}</h2>
  <p class="section-subtitle">${t.figure} &middot; ${t.tagline}</p>
  <p class="body-text">${t.blurb}</p>
  <p class="body-text">The ${t.label} is not a label. It is a pattern. It is the way God has wired you to relate to resources, to risk, to rest, and to responsibility. This report is not about fixing you. It is about naming what is already true, so you can steward it more faithfully.</p>
  <div class="verse-block">
    <p>"${t.verse.text}"</p>
    <cite>${t.verse.ref}</cite>
  </div>
  <p class="body-text">Over the next twenty pages, you will see your strengths named, your blind spots illuminated, and a path forward that honors both. Read slowly. Underline what stings. Return to what comforts.</p>
</section>

<!-- 4-DIMENSIONAL SCORE -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Assessment Results</p>
  <h2 class="section-title">Your 4-Dimensional Score</h2>
  <p class="body-text">Every believer carries all four dimensions — Vision, Guard, Give, and Build — but in different proportions. Your scores reveal not just your dominant instinct, but the full landscape of your stewardship wiring.</p>
  <div class="scores-grid">
    ${scoreHtml}
  </div>
  <p class="body-text" style="margin-top: 20px;"><strong>Vision (${data.scores.visionary}/7):</strong> ${scoreInterpretation("visionary", data.scores.visionary, data.primaryType)}</p>
  <p class="body-text"><strong>Guard (${data.scores.guardian}/7):</strong> ${scoreInterpretation("guardian", data.scores.guardian, data.primaryType)}</p>
  <p class="body-text"><strong>Give (${data.scores.giver}/7):</strong> ${scoreInterpretation("giver", data.scores.giver, data.primaryType)}</p>
  <p class="body-text"><strong>Build (${data.scores.builder}/7):</strong> ${scoreInterpretation("builder", data.scores.builder, data.primaryType)}</p>
</section>

<!-- STRENGTHS -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">What You Carry</p>
  <h2 class="section-title">Your Five Strengths</h2>
  <p class="body-text">These are not aspirational traits. They are what people who know you well would name if asked, "How does this person handle money?" Each strength is a gift. Each is also a responsibility.</p>
  ${strengthsHtml}
</section>

<!-- BLIND SPOTS -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Where the Light Does Not Reach</p>
  <h2 class="section-title">Your Five Blind Spots</h2>
  <p class="body-text">Blind spots are not sins. They are patterns so familiar that you no longer notice them. The people closest to you may see them clearly. This section names them so you can bring them into the light.</p>
  ${blindSpotsHtml}
  <div class="pull-quote">${t.reportFear}</div>
</section>

<!-- HIDDEN GIFT -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">What God Wired Into You</p>
  <h2 class="section-title">Your Hidden Gift</h2>
  ${hiddenGift}
</section>

${secondarySection}

<!-- SCRIPTURE FOUNDATIONS -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Four Weeks of Scripture</p>
  <h2 class="section-title">Scripture Foundations</h2>
  <p class="body-text">Thirty verses, sequenced over four weeks. Each week has a theme. Each verse has a micro-reflection. Read one per day. Let the Word do what the Word does: realign, steady, and send.</p>
  ${scriptureHtml}
</section>

<!-- DEBT STRATEGY -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Financial Strategy</p>
  <h2 class="section-title">Debt Strategy for ${t.label}</h2>
  ${debtStrategy}
</section>

<!-- INVESTMENT PHILOSOPHY -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Financial Strategy</p>
  <h2 class="section-title">Investment Philosophy</h2>
  ${investStrategy}
</section>

<!-- GIVING STRATEGY -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Financial Strategy</p>
  <h2 class="section-title">Giving Strategy</h2>
  ${givingStrategy}
</section>

<!-- DEMOGRAPHIC CONTEXT -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Your Context</p>
  <h2 class="section-title">How Your Type Meets Your Life</h2>
  ${demographicContext}
</section>

<!-- 30-DAY ACTION PLAN -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">Movement</p>
  <h2 class="section-title">30-Day Action Plan</h2>
  <p class="body-text">One action per day. None takes more than ten minutes. The goal is not to transform your finances in a month. It is to transform your posture — from reactive to intentional, from anxious to faithful.</p>
  <div class="action-grid">
    ${actionPlanHtml}
  </div>
</section>

<!-- KEY VERSE & PRAYER -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">The Anchor</p>
  <h2 class="section-title">Your Key Verse</h2>
  <div class="verse-block">
    <p>"${t.verse.text}"</p>
    <cite>${t.verse.ref}</cite>
  </div>
  <h2 class="section-title" style="margin-top: 32px;">A Prayer for the ${t.label}</h2>
  ${closingPrayer}
</section>

<!-- NEXT STEPS -->
<div class="page-break"></div>
<section class="section">
  <p class="section-eyebrow">What Comes Next</p>
  <h2 class="section-title">After the 30 Days</h2>
  <p class="body-text">This report is a beginning, not a destination. When the thirty days end, you will not be finished. You will be oriented. Here is what to do next:</p>
  <ul class="strategy-list">
    <li><strong>Review your scores monthly.</strong> Watch how they shift as you practice new rhythms. The numbers are not destiny; they are diagnostics.</li>
    <li><strong>Find one accountability partner.</strong> Someone who knows your type and will ask the hard questions your blind spots need.</li>
    <li><strong>Re-take the assessment in six months.</strong> Growth changes your scores. That is the point.</li>
    <li><strong>Share your type with your spouse or financial advisor.</strong> The language in this report gives them a lens into how you think about money.</li>
  </ul>
  <p class="body-text" style="margin-top: 20px;">If this report served you, consider sharing the assessment with someone who needs the same clarity. The mission of Talanthos is to help every believer steward money faithfully — one type, one report, one transformed life at a time.</p>
  <div class="fine-print">Talanthos &middot; Faith. Finances. Purpose. &middot; talanthos.com</div>
</section>

</body>
</html>`;
}

// ── Helpers ──

function scoreInterpretation(key: string, score: number, primary: string): string {
  const isPrimary = key === primary;
  const levels: Record<string, Record<string, string>> = {
    visionary: {
      high: "You see opportunity where others see obstacles. Your mind naturally moves toward multiplication and legacy.",
      mid: "You have vision, but it competes with other instincts. Practice naming the future you see before acting on it.",
      low: "Vision is not your native language. That is not a deficit. It means you steward what is in front of you with rare focus.",
    },
    guardian: {
      high: "Protection is your reflex. You see risk before it arrives and prepare with a discipline others admire.",
      mid: "You can protect, but you are not defined by it. You have room to grow in both saving and deploying.",
      low: "Guardianship does not come naturally. You may need external structures — budgets, advisors, automatic savings — to build the runway others create instinctively.",
    },
    giver: {
      high: "Generosity is your lens. You read need before it is spoken and respond before being asked.",
      mid: "You give, but not reflexively. You have space to grow in both the instinct and the structure of generosity.",
      low: "Giving may feel like a discipline rather than a joy. Start small, start scheduled, and let the habit shape the heart.",
    },
    builder: {
      high: "Systems are your native tongue. You translate vision into plans, and plans into finished work.",
      mid: "You can build, but you are not consumed by it. You have balance — use it to finish what you start.",
      low: "Systems feel foreign. You may prefer fluidity. Find one simple structure — a weekly budget review, an automatic investment — and let it carry you.",
    },
  };
  const level = isPrimary ? "high" : score >= 3 ? "mid" : "low";
  return levels[key][level];
}

function primaryVerb(type: string): string {
  const map: Record<string, string> = {
    visionary: "multiply",
    guardian: "protect",
    giver: "give",
    builder: "build",
  };
  return map[type] || "steward";
}

function secondaryVerb(type: string): string {
  return primaryVerb(type);
}

function getScripturesForType(type: string) {
  // 30 verses per type — generic Christian stewardship, lightly themed
  const base = [
    { text: "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms.", ref: "1 Peter 4:10", reflection: "Your gift is not for you. It is for the body." },
    { text: "Now it is required that those who have been given a trust must prove faithful.", ref: "1 Corinthians 4:2", reflection: "Faithfulness, not size, is the measure." },
    { text: "The earth is the Lord's, and everything in it, the world, and all who live in it.", ref: "Psalm 24:1", reflection: "Nothing you hold is ultimately yours." },
    { text: "Honor the Lord with your wealth, with the firstfruits of all your crops.", ref: "Proverbs 3:9", reflection: "First, not last. Firstfruits, not leftovers." },
    { text: "Whoever can be trusted with very little can also be trusted with much.", ref: "Luke 16:10", reflection: "The test is not the amount. It is the posture." },
    { text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", ref: "Philippians 4:19", reflection: "His supply is not tied to your anxiety." },
    { text: "For where your treasure is, there your heart will be also.", ref: "Matthew 6:21", reflection: "Treasure follows heart, not the reverse." },
    { text: "A good person leaves an inheritance for their children's children.", ref: "Proverbs 13:22", reflection: "Legacy is not an accident. It is built." },
    { text: "The plans of the diligent lead to profit as surely as haste leads to poverty.", ref: "Proverbs 21:5", reflection: "Speed is not the same as progress." },
    { text: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over.", ref: "Luke 6:38", reflection: "Generosity creates capacity." },
    { text: "The rich rule over the poor, and the borrower is slave to the lender.", ref: "Proverbs 22:7", reflection: "Debt is not sin, but it is bondage. Freedom matters." },
    { text: "But remember the Lord your God, for it is he who gives you the ability to produce wealth.", ref: "Deuteronomy 8:18", reflection: "Ability comes from him. The credit is his." },
    { text: "Whoever loves money never has enough; whoever loves wealth is never satisfied with their income.", ref: "Ecclesiastes 5:10", reflection: "Enough is a moving target until love is redirected." },
    { text: "And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.", ref: "2 Corinthians 9:8", reflection: "Abundance is for doing good, not for self-storage." },
    { text: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow.", ref: "Proverbs 13:11", reflection: "Slow growth is still growth." },
    { text: "Command those who are rich in this present world not to be arrogant nor to put their hope in wealth, which is so uncertain, but to put their hope in God.", ref: "1 Timothy 6:17", reflection: "Wealth is a tool, not a foundation." },
    { text: "They are to do good, to be rich in good deeds, and to be generous and willing to share.", ref: "1 Timothy 6:18", reflection: "Riches are measured in deeds, not digits." },
    { text: "In this way they will lay up treasure for themselves as a firm foundation for the coming age.", ref: "1 Timothy 6:19", reflection: "Eternal storage has better returns." },
    { text: "The wise store up choice food and olive oil, but fools gulp theirs down.", ref: "Proverbs 21:20", reflection: "Wisdom includes delay." },
    { text: "Do not wear yourself out to get rich; do not trust your own cleverness.", ref: "Proverbs 23:4", reflection: "Your cleverness has limits. His wisdom does not." },
    { text: "Cast but a glance at riches, and they are gone, for they will surely sprout wings and fly off to the sky like an eagle.", ref: "Proverbs 23:5", reflection: "Hold loosely what you cannot keep." },
    { text: "Better a little with righteousness than much gain with injustice.", ref: "Proverbs 16:8", reflection: "How you gain matters as much as what you gain." },
    { text: "The blessing of the Lord brings wealth, without painful toil for it.", ref: "Proverbs 10:22", reflection: "His blessing is not earned by exhaustion." },
    { text: "All hard work brings a profit, but mere talk leads only to poverty.", ref: "Proverbs 14:23", reflection: "Work is worship when directed well." },
    { text: "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?", ref: "Luke 14:28", reflection: "Jesus endorsed counting the cost." },
    { text: "The wicked borrow and do not repay, but the righteous give generously.", ref: "Psalm 37:21", reflection: "Repayment is righteousness. Generosity is identity." },
    { text: "I know what it is to be in need, and I know what it is to have plenty. I have learned the secret of being content in any and every situation.", ref: "Philippians 4:12", reflection: "Contentment is learned, not inherited." },
    { text: "Keep your lives free from the love of money and be content with what you have, because God has said, 'Never will I leave you; never will I forsake you.'", ref: "Hebrews 13:5", reflection: "His presence is the ultimate asset." },
    { text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", ref: "Isaiah 41:10", reflection: "Fear and finance are often intertwined. He addresses both." },
    { text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", ref: "Matthew 6:33", reflection: "Priority is not a feeling. It is a practice." },
  ];

  // Type-specific retheming of reflections
  const typeTweaks: Record<string, string[]> = {
    visionary: [
      "Your gift is not for you. It is for the body — but the body needs your vision to expand.",
      "Faithfulness, not size, is the measure — but size often follows faithfulness.",
      "Nothing you hold is ultimately yours — but what you steward can outlast you.",
    ],
    guardian: [
      "Your gift is not for you. It is for the body — and the body needs your protection.",
      "Faithfulness, not size, is the measure — especially in the lean years.",
      "Nothing you hold is ultimately yours — but you are trusted to keep it safe.",
    ],
    giver: [
      "Your gift is not for you. It is for the body — and you feel this in your bones.",
      "Faithfulness, not size, is the measure — but you often measure in impact, not amount.",
      "Nothing you hold is ultimately yours — which is why letting go comes naturally.",
    ],
    builder: [
      "Your gift is not for you. It is for the body — and the body needs what you finish.",
      "Faithfulness, not size, is the measure — but completion is its own reward.",
      "Nothing you hold is ultimately yours — but what you build can serve generations.",
    ],
  };

  const tweaks = typeTweaks[type] || [];
  return base.map((v, i) => ({
    ...v,
    reflection: i < tweaks.length ? tweaks[i] : v.reflection,
  }));
}

function get30DayPlan(type: string): string[] {
  const plans: Record<string, string[]> = {
    visionary: [
      "Write down one financial decision you are considering this week. Do not act. Just name it.",
      "Read Proverbs 3:9–10. What would 'firstfruits' look like in your current income?",
      "Schedule a 30-minute call with someone wiser than you about money. Ask one question.",
      "Review your last three impulse purchases. Which one was vision, and which was restlessness?",
      "Set an automatic transfer to savings, even if it is small. Let the system outrun your mood.",
      "Write a one-sentence mission statement for your money this year.",
      "Ask your spouse or a close friend: 'Do my financial decisions ever feel fast to you?'",
      "Read one chapter of a biography of a faithful steward. Note one habit.",
      "Calculate your net worth. Not to celebrate or mourn. Just to know.",
      "Identify one subscription or recurring expense you have not reviewed in six months. Cancel or keep with intention.",
      "Give anonymously today. No receipt, no tax benefit, no story.",
      "Write down the last time you felt anxious about money. What was the trigger?",
      "Set a 'pause rule': for any purchase over $200, wait 48 hours.",
      "Review your investment allocation. Does it match your time horizon and values?",
      "Pray specifically about one financial fear. Name it before God.",
      "Create a 'vision fund' — a separate account for the next thing God might be seeding.",
      "Read your bank statement from last month. Highlight every transaction that aligned with your values.",
      "Ask yourself: 'If I lost 50% of my income tomorrow, what would I keep doing?'",
      "Write a letter to your future self about money. Seal it. Open in one year.",
      "Identify one person you have resourced who is now thriving. Celebrate that.",
      "Review your insurance coverage. Is your family protected adequately?",
      "Calculate your giving percentage last year. No judgment. Just a number.",
      "Read Ecclesiastes 5:10–12. What is 'enough' for you? Write it down.",
      "Eliminate one financial complexity. One account, one subscription, one commitment.",
      "Schedule a quarterly financial review with yourself. Put it on the calendar.",
      "Give to a cause you have never supported before. Stretch your circle.",
      "Write down three things you own that you no longer use. Sell or donate them this week.",
      "Review your will or estate plan. If you do not have one, schedule the first step.",
      "Read Psalm 24:1 out loud. Then list three things you are stewarding that are not money.",
      "Sit in silence for ten minutes with your financial mission statement. Let it settle.",
    ],
    guardian: [
      "Write down your current emergency fund balance and the target. Calculate the gap.",
      "Read Genesis 41:46–49. Joseph stored for seven years. What is your 'seven-year' plan?",
      "Ask your spouse or a close friend: 'Do I ever hold back when I should give?'",
      "Review your last three 'no' decisions about money. Were they caution or wisdom?",
      "Set an automatic transfer to a giving account, even if it is small. Let generosity become reflex.",
      "Calculate your monthly essential expenses. Multiply by six. That is your minimum runway.",
      "Write a one-page 'deployment plan': when will you open your storehouses?",
      "Identify one person who needs what you have stored. Make a plan to release it.",
      "Review your investment strategy. Are you avoiding risk you should be taking?",
      "Read Proverbs 21:26. The righteous give without sparing. Where can you give more freely?",
      "Pray specifically about one financial fear. Ask God if it is caution or cowardice.",
      "Create a 'blessing budget' — money set aside specifically for spontaneous generosity.",
      "Write down the last time you felt peace about a financial decision. What made it peaceful?",
      "Review your debt. Is any of it holding you back from deploying capital?",
      "Schedule a conversation with a financial advisor about long-term growth, not just preservation.",
      "Give to a cause that makes you slightly uncomfortable. Stretch the storehouse door.",
      "Calculate your net worth. Not to hoard, but to steward with clarity.",
      "Ask yourself: 'What am I saving for that I am not trusting God with?'",
      "Write a letter to your children or mentees about stewardship. What do you want them to know?",
      "Review your insurance. Are you over-insured (fear) or under-insured (neglect)?",
      "Identify one area where your caution has cost someone else an opportunity. Make it right.",
      "Read Luke 12:16–21. The rich fool built bigger barns. What barn are you building?",
      "Calculate your giving percentage. Set a target to increase it by 1% this year.",
      "Eliminate one financial anxiety. Get the information you need, then decide.",
      "Schedule a 'deployment review' quarterly. When will you open the storehouses?",
      "Give anonymously. No recognition, no return. Just obedience.",
      "Write down three ways God has provided for you in the past. Read them when fear rises.",
      "Review your estate plan. Who will steward what you leave behind?",
      "Read Psalm 37:25–26. 'I have never seen the righteous forsaken.' Let that sink in.",
      "Sit in silence for ten minutes and ask: 'What storehouse am I being asked to open today?'",
    ],
    giver: [
      "Write down your monthly income and your monthly giving. Calculate the percentage.",
      "Read 2 Corinthians 8:1–5. The Macedonians gave out of extreme poverty. What is your floor?",
      "Ask your spouse or a close friend: 'Do I ever give past what we can afford?'",
      "Review your last three gifts. Which were impulse, and which were planned?",
      "Set up a budget. Not to restrict your generosity, but to protect it.",
      "Calculate your essential monthly expenses. This is your floor. Everything above is giving space.",
      "Write a 'giving policy': what you give to, how much, and how often.",
      "Identify one cause you have said yes to that you should say no to. Practice the no.",
      "Read Proverbs 21:20. The wise store up choice food. Do you have a storehouse?",
      "Create an emergency fund. Not to hoard, but to protect your future generosity.",
      "Pray specifically about one financial boundary you need to set.",
      "Review your debt. Is any of it from giving you could not afford?",
      "Write down the last time you felt guilty about money. What was the trigger?",
      "Schedule a conversation with a financial advisor. Not to become rich, but to become sustainable.",
      "Give to your local church first, before any other cause. For one month.",
      "Calculate your net worth. Not to accumulate, but to steward with clarity.",
      "Ask yourself: 'If I could not give for six months, who would suffer most?'",
      "Write a letter to your future self about generosity. What do you want to still be true?",
      "Identify one area where your giving has enabled dependence. Shift to empowerment.",
      "Review your subscriptions and discretionary spending. Redirect 10% to giving.",
      "Read Matthew 6:2–4. Give in secret today. No one knows but God.",
      "Calculate your runway: how many months could you survive with no income?",
      "Set a 'generosity ceiling' — the maximum you will give without consulting your household.",
      "Eliminate one financial stress. Get the information, make the decision, move on.",
      "Schedule a monthly 'giving review'. Where did your money go, and did it align with your values?",
      "Give to a cause that does not pull your heartstrings. Practice rational generosity.",
      "Write down three things you are grateful for that money cannot buy.",
      "Review your estate plan. Who will carry your generosity forward?",
      "Read Luke 6:38. 'Give, and it will be given to you.' Believe it.",
      "Sit in silence for ten minutes and ask: 'What does sustainable generosity look like for me?'",
    ],
    builder: [
      "Write down three systems you have built that are working. Celebrate them.",
      "Read Nehemiah 4:6. The people worked with all their heart. Do your systems have heart?",
      "Ask your spouse or a close friend: 'Do my plans ever feel rigid to you?'",
      "Review your last three financial goals. Which did you finish, and which did you abandon?",
      "Set one 'soft goal' — something with no deadline, no metric, just presence.",
      "Calculate your net worth. Systems need data. Data needs honesty.",
      "Write a 'stop doing' list. Three things you will not build this year.",
      "Identify one system you built for yourself that someone else needs. Share it.",
      "Read Proverbs 21:5. The plans of the diligent lead to profit. Are your plans diligent or just busy?",
      "Create a 'celebration ritual' for when you finish something. Plan it before you start.",
      "Pray specifically about one plan you are holding too tightly.",
      "Review your debt. Is any of it from building before counting the cost?",
      "Write down the last time you rested without guilt. What made it possible?",
      "Schedule a 'pause day' — no productivity, no plans, just presence.",
      "Give to a cause that interrupts your system. Let grace leak in.",
      "Calculate your giving percentage. Build it into your budget as a line item, not an afterthought.",
      "Ask yourself: 'Who am I building for, and do they know it?'",
      "Write a letter to your children or mentees about finishing. What do you want them to learn?",
      "Identify one wall you built that keeps people out. Add a door.",
      "Review your estate plan. Systems outlast builders only if they are passed on.",
      "Read Ecclesiastes 3:1–8. There is a time to build and a time to tear down. Which season are you in?",
      "Calculate your runway. A builder without margin is a builder without options.",
      "Set a 'flexibility budget' — money and time set aside for the unplanned.",
      "Eliminate one system that no longer serves its purpose. Tear it down with gratitude.",
      "Schedule a quarterly 'builder's retreat' — review, rest, then resume.",
      "Give anonymously. Let go of the credit your systems crave.",
      "Write down three things you built that outlasted their original purpose.",
      "Review your investment strategy. Is it building wealth or just building accounts?",
      "Read Psalm 127:1. 'Unless the Lord builds the house, the builders labor in vain.' Let that reorder your week.",
      "Sit in silence for ten minutes with no agenda, no list, no plan. Just be.",
    ],
  };
  return plans[type] || plans.visionary;
}

function getDebtStrategy(type: string): string {
  const strategies: Record<string, string> = {
    visionary: `
      <p class="body-text">As a Visionary, you see debt as leverage — a way to multiply what you have been given. This instinct is not wrong, but it is dangerous without guardrails. Solomon multiplied wealth, but he also multiplied wives and idols when wisdom stepped aside.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Debt Mindset</h3>
      <p class="body-text">You are comfortable with risk. You can model scenarios in your head. But your optimism can outrun reality. Before taking on any debt, you need a "wisdom checkpoint" — a person or process that slows you down.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Steps Forward</h3>
      <ul class="strategy-list">
        <li><strong>Pause before leverage.</strong> For any debt over 10% of your annual income, require a 30-day waiting period and a conversation with a wise voice.</li>
        <li><strong>Name the exit.</strong> Before borrowing, write down exactly how and when you will repay. Not "when revenue comes in." A specific date.</li>
        <li><strong>Separate vision from vanity.</strong> Ask: "Would I still do this if no one knew?" If the answer is no, it is not vision. It is image.</li>
      </ul>
      <div class="verse-block">
        <p>"The rich rule over the poor, and the borrower is slave to the lender."</p>
        <cite>Proverbs 22:7</cite>
      </div>
    `,
    guardian: `
      <p class="body-text">As a Guardian, debt feels like a crack in the wall. Your instinct is to avoid it entirely, to pay everything off immediately, to sleep with zero obligations. This is a gift — but it can also paralyze you from opportunities God is sending.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Debt Mindset</h3>
      <p class="body-text">You see debt as danger, and danger as something to eliminate. But not all debt is equal. A mortgage on a home for your family is not the same as credit card debt for a vacation. You need a framework, not a reflex.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Steps Forward</h3>
      <ul class="strategy-list">
        <li><strong>Classify, don't eliminate.</strong> Separate "productive debt" (mortgage, education, business equipment) from "destructive debt" (consumer, impulse, emotional). Attack the second. Manage the first.</li>
        <li><strong>Set a debt-free date.</strong> For each obligation, calculate the exact month and year it will be gone. The Guardian needs a finish line.</li>
        <li><strong>Leave margin.</strong> Do not throw every dollar at debt. Keep a three-month emergency fund even while paying down obligations. Scarcity is not holiness.</li>
      </ul>
      <div class="verse-block">
        <p>"The wicked borrow and do not repay, but the righteous give generously."</p>
        <cite>Psalm 37:21</cite>
      </div>
    `,
    giver: `
      <p class="body-text">As a Giver, debt is the enemy of generosity. Every dollar you owe is a dollar you cannot send. You may have taken on debt to help someone else — a family member, a friend, a cause — and now you carry it alone.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Debt Mindset</h3>
      <p class="body-text">You do not think about debt until it blocks your giving. Then it becomes urgent, emotional, and overwhelming. You need a plan that protects your generosity without burning you out.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Steps Forward</h3>
      <ul class="strategy-list">
        <li><strong>Protect the floor first.</strong> Before giving, ensure your essentials are covered: housing, food, health, transportation. Giving from beneath the floor is not generosity. It is self-harm.</li>
        <li><strong>Consolidate and automate.</strong> If you have multiple debts, consolidate where possible. Set automatic payments so you never have to think about them. Free your mind for giving.</li>
        <li><strong>Giving while in debt.</strong> You do not have to stop giving. But cap it at a percentage (5% or 10%) until you are free. Then expand. Sustained generosity beats heroic giving that collapses.</li>
      </ul>
      <div class="verse-block">
        <p>"Give, and it will be given to you. A good measure, pressed down, shaken together and running over."</p>
        <cite>Luke 6:38</cite>
      </div>
    `,
    builder: `
      <p class="body-text">As a Builder, debt is a material — like brick or lumber. It can be used well or poorly. Your instinct is to build a system that eliminates debt methodically, brick by brick, month by month. This is your strength.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Debt Mindset</h3>
      <p class="body-text">You see debt as a problem to be solved, not a shame to be hidden. You will build a spreadsheet, set a timeline, and execute. But beware: your system can become your identity. If the plan fails, you may feel like a failure.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Steps Forward</h3>
      <ul class="strategy-list">
        <li><strong>Avalanche or snowball.</strong> Choose one method and commit. Avalanche (highest interest first) saves money. Snowball (smallest balance first) wins momentum. As a Builder, you may prefer avalanche. But if you need early wins, choose snowball.</li>
        <li><strong>Build a "debt-free milestone."</strong> For every 25% paid off, celebrate. Not with spending, but with presence. A meal, a walk, a prayer of gratitude.</li>
        <li><strong>Plan the "after."</strong> What will you do with the cash flow once debt is gone? If you do not plan it, lifestyle inflation will eat it. Redirect it to giving, investing, or the next build.</li>
      </ul>
      <div class="verse-block">
        <p>"Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?"</p>
        <cite>Luke 14:28</cite>
      </div>
    `,
  };
  return strategies[type] || strategies.visionary;
}

function getInvestmentStrategy(type: string): string {
  const strategies: Record<string, string> = {
    visionary: `
      <p class="body-text">The Visionary sees investing as planting seeds in fertile ground. You are drawn to new opportunities, emerging markets, and ventures that others overlook. Your risk tolerance is high — sometimes too high.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Five Principles</h3>
      <ul class="strategy-list">
        <li><strong>Diversify your visions.</strong> Do not put everything in the next big thing. Balance high-growth bets with stable, boring assets.</li>
        <li><strong>Time horizon is your friend.</strong> You naturally think long-term. Use it. Compound interest rewards patience, not just brilliance.</li>
        <li><strong>Advisors are not adversaries.</strong> Find one who understands your instinct but challenges your speed. Their caution is your guardrail.</li>
        <li><strong>Avoid FOMO investing.</strong> Just because you can see the opportunity does not mean you must take it. Saying no is also wisdom.</li>
        <li><strong>Measure in decades.</strong> Check your portfolio quarterly, not daily. Daily checks breed anxiety. Quarterly checks breed perspective.</li>
      </ul>
      <p class="body-text" style="margin-top: 16px;"><strong>What to avoid:</strong> Leveraged bets, crypto speculation beyond 5% of portfolio, investing without an emergency fund.</p>
      <p class="body-text"><strong>What to pursue:</strong> Index funds as a base, real estate, angel investing in areas you understand, ESG funds aligned with your values.</p>
    `,
    guardian: `
      <p class="body-text">The Guardian sees investing as building a fortress. You want safety, predictability, and sleep-at-night security. Your risk tolerance is low — sometimes so low that inflation erodes your purchasing power while you watch.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Five Principles</h3>
      <ul class="strategy-list">
        <li><strong>Inflation is also a risk.</strong> Cash loses 2–3% per year to inflation. Some growth is not greed. It is stewardship.</li>
        <li><strong>Start with bonds and dividend stocks.</strong> These provide income and lower volatility than pure growth stocks. They honor your need for stability.</li>
        <li><strong>Dollar-cost averaging is your friend.</strong> Invest the same amount monthly, regardless of market conditions. It removes timing anxiety.</li>
        <li><strong>Keep a "sleep-well" allocation.</strong> Decide what percentage of your portfolio you are willing to see drop 20% in a bad year. Invest the rest conservatively.</li>
        <li><strong>Review annually, not monthly.</strong> Your tendency to check often creates unnecessary stress. Set a calendar reminder for one review per year.</li>
      </ul>
      <p class="body-text" style="margin-top: 16px;"><strong>What to avoid:</strong> Keeping more than 20% in cash, avoiding all equities, reacting to market downturns by selling.</p>
      <p class="body-text"><strong>What to pursue:</strong> Treasury bonds, dividend aristocrats, real estate investment trusts (REITs), target-date funds.</p>
    `,
    giver: `
      <p class="body-text">The Giver sees investing as a way to create more to give. You are not primarily motivated by personal wealth, but by the impact that wealth can have. Your risk tolerance is moderate — you want growth, but not at the cost of your peace.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Five Principles</h3>
      <ul class="strategy-list">
        <li><strong>Invest for impact, not just return.</strong> Consider ESG funds, community development financial institutions, and biblically responsible investing. Let your money align with your values.</li>
        <li><strong>Growth enables generosity.</strong> A 7% annual return doubles your money in ten years. That means twice as much to give. Growth is not greed when the goal is sending.</li>
        <li><strong>Automate the giving.</strong> Set automatic transfers from your investment account to your giving account. Remove the friction.</li>
        <li><strong>Protect the giver.</strong> Do not invest money you might need for basic needs in volatile assets. A burned-out giver helps no one.</li>
        <li><strong>Measure impact, not just returns.</strong> Once a year, calculate how much your portfolio growth enabled in giving. Celebrate that number.</li>
      </ul>
      <p class="body-text" style="margin-top: 16px;"><strong>What to avoid:</strong> Investing without an emergency fund, chasing high returns to fund unsustainable giving, ignoring fees that erode impact.</p>
      <p class="body-text"><strong>What to pursue:</strong> Broad-market index funds, impact investing, donor-advised funds, automatic rebalancing.</p>
    `,
    builder: `
      <p class="body-text">The Builder sees investing as constructing a machine that produces over time. You want systems, schedules, and predictable outcomes. Your risk tolerance is moderate — you will take calculated risks, but only after thorough analysis.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Five Principles</h3>
      <ul class="strategy-list">
        <li><strong>Build the foundation first.</strong> Emergency fund, debt elimination, then investing. The order matters. A tower with no foundation collapses.</li>
        <li><strong>Use index funds as your base.</strong> They are the bricks of investing: boring, reliable, and proven over decades. Build 80% of your portfolio here.</li>
        <li><strong>Rebalance on a schedule.</strong> Set a calendar reminder (quarterly or annually) to rebalance. Do not react to markets. React to your calendar.</li>
        <li><strong>Keep a "speculation bucket."</strong> Limit individual stock picks or alternative investments to 10–20% of your portfolio. Build the rest with discipline.</li>
        <li><strong>Document your strategy.</strong> Write down your investment policy: asset allocation, rebalancing rules, and what you will not do. Read it when emotions rise.</li>
      </ul>
      <p class="body-text" style="margin-top: 16px;"><strong>What to avoid:</strong> Constant portfolio tweaking, chasing past performance, investing without a written plan.</p>
      <p class="body-text"><strong>What to pursue:</strong> Three-fund portfolio (total stock, total international, total bond), target-date funds, automatic 401(k) increases.</p>
    `,
  };
  return strategies[type] || strategies.visionary;
}

function getGivingStrategy(type: string): string {
  const strategies: Record<string, string> = {
    visionary: `
      <p class="body-text">The Visionary gives to seed the future. You are drawn to big initiatives, new ministries, and ventures that multiply. Your giving is strategic — you want to see a return, not in dollars, but in transformed lives and institutions.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">The Floor and Ceiling Framework</h3>
      <p class="body-text"><strong>Floor:</strong> The minimum you give regardless of circumstances. For most believers, this is the tithe — 10% of income. It is not a law; it is a training wheel for trust.</p>
      <p class="body-text"><strong>Ceiling:</strong> The maximum you give without compromising your family's stability, your debt obligations, or your long-term capacity. This number is personal and should be reviewed annually.</p>
      <p class="body-text"><strong>The space between:</strong> This is where generosity lives. Below the floor is disobedience. Above the ceiling is unsustainable heroism. In between, you give freely, strategically, and joyfully.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Giving Calendar</h3>
      <ul class="strategy-list">
        <li><strong>Monthly:</strong> Tithe or regular percentage to your local church.</li>
        <li><strong>Quarterly:</strong> One strategic gift to a new initiative or missionary.</li>
        <li><strong>Annually:</strong> A major gift to a cause that aligns with your long-term vision.</li>
        <li><strong>Spontaneously:</strong> Keep a "blessing fund" for needs you encounter unexpectedly.</li>
      </ul>
    `,
    guardian: `
      <p class="body-text">The Guardian gives cautiously but faithfully. You want to ensure the cause is legitimate, the money is used well, and your family is still protected. Your giving is steady, predictable, and deeply valued by the recipients.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">The Floor and Ceiling Framework</h3>
      <p class="body-text"><strong>Floor:</strong> The minimum you give regardless of circumstances. Set this at a level that does not trigger anxiety. For some Guardians, 5% is the starting floor. Grow it over time.</p>
      <p class="body-text"><strong>Ceiling:</strong> The maximum you give without dipping below your emergency fund or derailing your debt plan. Write this number down. Review it quarterly.</p>
      <p class="body-text"><strong>The space between:</strong> This is where generosity lives. Start small, increase by 1% per year, and watch your confidence grow alongside your giving.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Giving Calendar</h3>
      <ul class="strategy-list">
        <li><strong>Monthly:</strong> Automatic transfer to your church. Set it and forget it.</li>
        <li><strong>Quarterly:</strong> Review one charity's financials. Give if they meet your standards.</li>
        <li><strong>Annually:</strong> A planned gift, researched and budgeted in advance.</li>
        <li><strong>Spontaneously:</strong> A small cash reserve ($100–$500) for immediate needs.</li>
      </ul>
    `,
    giver: `
      <p class="body-text">The Giver gives reflexively, joyfully, and sometimes past wisdom. You do not need a framework — you need guardrails. The goal is not to stop your generosity. It is to make it sustainable so you can keep giving for decades.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">The Floor and Ceiling Framework</h3>
      <p class="body-text"><strong>Floor:</strong> The minimum you give regardless of circumstances. For you, this might already be high. But define it precisely. If it is 15%, then 15% it is — even in lean months.</p>
      <p class="body-text"><strong>Ceiling:</strong> The maximum you give without jeopardizing your emergency fund, debt payments, or retirement savings. This is the hard one for Givers. But it is essential.</p>
      <p class="body-text"><strong>The space between:</strong> This is where generosity lives. For you, the ceiling may feel like a cage. Reframe it: the ceiling protects your capacity to give next year, and the year after.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Giving Calendar</h3>
      <ul class="strategy-list">
        <li><strong>Monthly:</strong> Automatic giving to your church and one other cause. Automate it so you do not have to decide every month.</li>
        <li><strong>Quarterly:</strong> A "no" practice. Choose one request to decline, graciously. Protect your ceiling.</li>
        <li><strong>Annually:</strong> A major gift, planned and celebrated. Make it an event.</li>
        <li><strong>Spontaneously:</strong> Keep a small envelope of cash for immediate, unplanned generosity. But when it is gone, it is gone.</li>
      </ul>
    `,
    builder: `
      <p class="body-text">The Builder gives systematically. You want a plan, a percentage, and a schedule. Your giving is reliable, tracked, and optimized. You may even have a spreadsheet for it — and that is not a bad thing.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">The Floor and Ceiling Framework</h3>
      <p class="body-text"><strong>Floor:</strong> The minimum you give regardless of circumstances. Set this as a percentage of gross income, not net. Automate it. Treat it like a bill.</p>
      <p class="body-text"><strong>Ceiling:</strong> The maximum you give without compromising your financial systems. You have plans — emergency fund, retirement, children's education. The ceiling respects those plans.</p>
      <p class="body-text"><strong>The space between:</strong> This is where generosity lives. For you, the framework IS the generosity. Do not let anyone shame your system. A systematic giver blesses more people over time than a spontaneous one.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Your Giving Calendar</h3>
      <ul class="strategy-list">
        <li><strong>Monthly:</strong> Automatic transfers to church and two other causes. Track them.</li>
        <li><strong>Quarterly:</strong> Review your giving against your budget. Adjust if income changed.</li>
        <li><strong>Annually:</strong> A strategic gift to a cause you have researched thoroughly.</li>
        <li><strong>Spontaneously:</strong> A small "grace fund" for unexpected needs. When empty, refill on schedule.</li>
      </ul>
    `,
  };
  return strategies[type] || strategies.visionary;
}

function getHiddenGift(type: string): string {
  const gifts: Record<string, string> = {
    visionary: `
      <p class="body-text">Your hidden gift is <em>multiplication through foresight</em>. You do not just see what is. You see what could be. This is not imagination. It is a form of faith — the ability to trust that God is doing something next, and to align your resources with it.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Ways to Use It</h3>
      <ul class="strategy-list">
        <li><strong>Seed ventures that outlast you.</strong> Not just businesses, but ministries, scholarships, and institutions that will serve after you are gone.</li>
        <li><strong>Invest in people with potential.</strong> Your foresight lets you see greatness before it is visible. Fund the student, the artist, the founder before they are famous.</li>
        <li><strong>Model long-term thinking.</strong> In a culture of quarterly results, your decades-long perspective is a prophetic witness.</li>
      </ul>
      <div class="two-col" style="margin-top: 20px;">
        <div class="verse-block">
          <p>"Moreover, I will give you what you have not asked for: both riches and honor, so that in your lifetime you will have no equal among kings."</p>
          <cite>1 Kings 3:13</cite>
        </div>
        <div class="verse-block">
          <p>"The master replied, 'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things.'"</p>
          <cite>Matthew 25:23</cite>
        </div>
      </div>
    `,
    guardian: `
      <p class="body-text">Your hidden gift is <em>provision through preparation</em>. You see what others miss — the lean year, the unexpected expense, the market downturn. Your gift is not fear. It is foresight that protects.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Ways to Use It</h3>
      <ul class="strategy-list">
        <li><strong>Be the calm in the crisis.</strong> When others panic, you have already modeled the scenario. Your presence steadies households and organizations.</li>
        <li><strong>Store for the community, not just yourself.</strong> Joseph stored for Egypt, not for Joseph. Your preparation can feed more than your family.</li>
        <li><strong>Teach others to prepare.</strong> Most people do not know how to build an emergency fund or think long-term. Your systems are a curriculum.</li>
      </ul>
      <div class="two-col" style="margin-top: 20px;">
        <div class="verse-block">
          <p>"Joseph stored up huge quantities of grain, like the sand of the sea; it was so much that he stopped keeping records because it was beyond measure."</p>
          <cite>Genesis 41:49</cite>
        </div>
        <div class="verse-block">
          <p>"The prudent see danger and take refuge, but the simple keep going and pay the penalty."</p>
          <cite>Proverbs 22:3</cite>
        </div>
      </div>
    `,
    giver: `
      <p class="body-text">Your hidden gift is <em>redemption through generosity</em>. You do not just give money. You give dignity. You give hope. You give people the feeling that they are seen and valued. This is a supernatural gift.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Ways to Use It</h3>
      <ul class="strategy-list">
        <li><strong>Give strategically, not just emotionally.</strong> Your instinct is to respond to need. Add a layer of strategy: give in ways that empower, not just relieve.</li>
        <li><strong>Build a legacy of generosity.</strong> Teach your children, your mentees, your friends to give. Your gift multiplies when it is passed on.</li>
        <li><strong>Use your network.</strong> You know people. Connect donors to causes. Your generosity is not just financial — it is relational.</li>
      </ul>
      <div class="two-col" style="margin-top: 20px;">
        <div class="verse-block">
          <p>"In the midst of a very severe trial, their overflowing joy and their extreme poverty welled up in rich generosity."</p>
          <cite>2 Corinthians 8:2</cite>
        </div>
        <div class="verse-block">
          <p>"Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms."</p>
          <cite>1 Peter 4:10</cite>
        </div>
      </div>
    `,
    builder: `
      <p class="body-text">Your hidden gift is <em>permanence through systems</em>. You do not just do good work. You build things that keep doing good work without you. This is rare. Most people create outputs. You create infrastructure.</p>
      <h3 class="section-subtitle" style="font-size: 13pt; margin-top: 20px;">Three Ways to Use It</h3>
      <ul class="strategy-list">
        <li><strong>Build what others can inherit.</strong> A budget template, an investment policy, a family stewardship plan. Your systems outlast your energy.</li>
        <li><strong>Finish before you start the next thing.</strong> Your greatest gift is completion. Resist the urge to abandon 90% projects. The last 10% is where legacy lives.</li>
        <li><strong>Create rhythms, not just results.</strong> A weekly giving habit, a monthly review, an annual rebalancing. Rhythms are the skeleton of faithfulness.</li>
      </ul>
      <div class="two-col" style="margin-top: 20px;">
        <div class="verse-block">
          <p>"So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart."</p>
          <cite>Nehemiah 4:6</cite>
        </div>
        <div class="verse-block">
          <p>"Unless the Lord builds the house, the builders labor in vain."</p>
          <cite>Psalm 127:1</cite>
        </div>
      </div>
    `,
  };
  return gifts[type] || gifts.visionary;
}

function buildPersonalLetter(data: ReportData): string {
  const t = data.primaryTypeData;
  const d = data.demographics;

  let letter = `<p class="body-text">You took a fifteen-question assessment because something in you knew your financial life could be more aligned, more intentional, more faithful. That instinct was right. This report is the bridge between knowing your type and living it.</p>`;

  if (d.biggestRegret) {
    letter += `<p class="body-text">You wrote that your biggest financial regret is: <em>"${d.biggestRegret}"</em>. We hear you. Regret is not a prison. It is a compass. It points to the place where you now have a chance to choose differently.</p>`;
  }

  if (d.emotionalRelationship) {
    letter += `<p class="body-text">You also said that money feels like: <em>"${d.emotionalRelationship}"</em>. That sentence matters more than any score. This report will not change how you feel overnight. But it will give you language for what you feel, and a path toward what you want to feel.</p>`;
  }

  letter += `<p class="body-text">You are ${t.label}. ${t.blurb} This is not a label. It is a calling. Over the next twenty pages, we will name your strengths, illuminate your blind spots, and give you a thirty-day plan to move from knowing to living.</p>`;

  if (d.financialSituation) {
    const situationMap: Record<string, string> = {
      struggling: "You are in a season of struggle. That is not a moral failing. Joseph was in prison before he was in the palace. Steward what you have, however small.",
      stable: "You are stable, with little margin. This report will help you build margin without building anxiety.",
      comfortable: "You are comfortable, with some room. The question is no longer survival. It is stewardship. What will you do with the room?",
      abundant: "You are navigating abundance. This is the hardest season for many believers. The report will help you steward blessing without losing your soul.",
    };
    letter += `<p class="body-text">${situationMap[d.financialSituation] || ""}</p>`;
  }

  letter += `<p class="body-text">Read slowly. Underline what stings. Return to what comforts. And know this: God already wired you for this. This report is just the map.</p>`;

  return letter;
}

function buildDemographicContext(data: ReportData): string {
  const t = data.primaryTypeData;
  const d = data.demographics;
  let html = "";

  // Age context
  if (d.age) {
    const ageAdvice: Record<string, string> = {
      "18-24": "You are early in your stewardship journey. The habits you build now will compound for decades. Do not despise small beginnings.",
      "25-34": "You are in the building phase. Career, family, and financial systems are all under construction. This is the decade where intention matters most.",
      "35-44": "You are in the peak earning years for many. The temptation is to accelerate everything. Resist. Build margin, not just momentum.",
      "45-54": "You are in the stewardship sweet spot. Experience, income, and clarity are all high. Use them wisely. Mentor someone younger.",
      "55-64": "You are approaching a transition. Retirement is not an ending. It is a redeployment. What will you build, protect, or give in the next chapter?",
      "65+": "You are in the legacy season. The question is no longer accumulation. It is distribution. Who will inherit what you have built, and what values will travel with the assets?",
    };
    html += `<p class="body-text"><strong>At ${d.age}:</strong> ${ageAdvice[d.age] || ""}</p>`;
  }

  // Marital context
  if (d.marital) {
    const maritalAdvice: Record<string, string> = {
      single: "As a single person, you have autonomy that married people do not. Use it. Give boldly, save aggressively, and build systems that do not require a partner's approval.",
      engaged: "You are about to merge two financial stories. Talk about money before you talk about flowers. This report can be a shared language.",
      married: "Marriage is a stewardship partnership. Share this report with your spouse. Ask: 'Which of my blind spots do you see most clearly?' Then listen.",
      divorced: "You have weathered a financial and relational storm. Rebuilding is not failure. It is faithfulness. Start with one system, one account, one habit.",
      widowed: "You carry both grief and responsibility. You do not have to make big decisions alone. Find a trusted advisor. Give yourself permission to grieve and to plan.",
    };
    html += `<p class="body-text"><strong>As ${d.marital === "married" ? "someone married" : d.marital === "single" ? "someone single" : `someone ${d.marital}`}:</strong> ${maritalAdvice[d.marital] || ""}</p>`;
  }

  // Children context
  if (d.children) {
    const childAdvice: Record<string, string> = {
      none: "Without children, your margin is higher. Use it. Give more, save more, or invest in causes that outlast you. Your flexibility is a gift.",
      "1": "With one child, you are building a legacy for one. Teach them early. Include them in giving decisions. Let them see your type in action.",
      "2": "With two children, your financial picture is more complex. Build systems that serve the family, not just the individual. A family budget is a form of love.",
      "3+": "With three or more children, your resources are stretched. That is not failure. It is discipleship. Teach them stewardship by including them in it.",
    };
    html += `<p class="body-text"><strong>With ${d.children === "none" ? "no children" : d.children === "1" ? "1 child" : d.children === "2" ? "2 children" : "3+ children"}:</strong> ${childAdvice[d.children] || ""}</p>`;
  }

  // Denomination context
  if (d.denomination) {
    html += `<p class="body-text"><strong>In your faith tradition:</strong> Stewardship is universal, but its expression varies. Whether your tradition emphasizes tithing, almsgiving, or voluntary generosity, the principle is the same: everything you have is entrusted. This report is not a replacement for your tradition's teaching. It is a companion to it.</p>`;
  }

  return html || `<p class="body-text">Your context is unique. Whether you are single or married, young or old, with children or without, the principles in this report apply. Stewardship is not about your circumstances. It is about your posture.</p>`;
}

function buildClosingPrayer(data: ReportData): string {
  const t = data.primaryTypeData;
  const d = data.demographics;

  const name = data.firstName || "friend";
  const regret = d.biggestRegret ? "the regret you carry" : "the uncertainty you feel";
  const emotion = d.emotionalRelationship ? "the way money stirs your heart" : "your relationship with money";

  return `<div class="prayer">
    <p>Lord, you have entrusted ${name} with resources, relationships, and a unique way of seeing the world. As a ${t.label}, they are wired to ${primaryVerb(t.id)}. But wiring without wisdom becomes wandering.</p>
    <p style="margin-top: 12px;">For ${regret}, we ask for redemption. Not erasure — transformation. Let what was lost become the seed of what is learned.</p>
    <p style="margin-top: 12px;">For ${emotion}, we ask for peace. Not the peace of abundance, but the peace of trust. You are the provider. They are the steward.</p>
    <p style="margin-top: 12px;">For the next thirty days, give ${name} clarity, courage, and consistency. Let the strengths named in this report become tools. Let the blind spots become invitations to grow.</p>
    <p style="margin-top: 12px;">Above all, let ${name} remember: they are not defined by their type. They are defined by their identity in you. The ${t.label} is a gift. You are the Giver.</p>
    <p style="margin-top: 12px;">In the name of Jesus, who stewarded everything perfectly, even to the cross. Amen.</p>
  </div>`;
}
