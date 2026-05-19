import { renderReportHtml } from "@/lib/pdf/templates/report-template";
import { ReportData } from "@/lib/pdf/data-builder";
import { generatePdf } from "@/lib/pdf/generator";
import * as fs from "fs";

const mockData: ReportData = {
  firstName: "Alex",
  email: "alex@example.com",
  generatedAt: "May 17, 2026",
  primaryType: "guardian",
  secondaryType: null,
  primaryTypeData: {
    id: "guardian",
    label: "The Guardian",
    figure: "Joseph",
    tagline: "The Steward-Protector",
    monogram: "II",
    glyph: "shield",
    blurb: "You see the lean years coming. While others spend the harvest, you store it: quietly, faithfully, with a discipline that protects families, businesses, and futures from the famine no one else is preparing for.",
    strengths: [
      "Disciplined saver; runway is your love language",
      "Long-memory; learns from past scarcity",
      "Calm in volatility; you've already modeled it",
      "Protective instinct for dependents and team",
      "Trusted with other people's resources",
    ],
    blindSpots: [
      "Stewardship can quietly harden into hoarding",
      "Fear of loss may eclipse calling to give",
      "Slow to deploy capital even when it's time",
      "May read God's provision as your own caution",
      "Can withhold from generosity in plenty",
    ],
    verse: {
      text: "Joseph stored up huge quantities of grain, like the sand of the sea; it was so much that he stopped keeping records because it was beyond measure.",
      ref: "Genesis 41:49",
    },
    nextStep: "Joseph stored for seven years, then he opened the storehouses. This week, identify one storehouse in your life God may be asking you to open. Set a date. Move it from posture to plan.",
    reportPitch: "You know how to save. But do you know when to deploy? Joseph stored grain for seven years, then he opened the storehouses. The Guardian's greatest risk isn't scarcity; it's the paralysis of never opening the door.",
    reportFear: "The Guardian who never reads the full report keeps storing, while the famine outside their door was the very reason God asked them to gather in the first place.",
    shareMessage: "I just took a 3-minute assessment that explained why I handle money the way I do. Turns out I'm a Guardian, the Joseph archetype.",
  },
  secondaryTypeData: null,
  scores: { visionary: 2, guardian: 6, giver: 3, builder: 1 },
  maxScore: 6,
  demographics: {
    gender: "male",
    denomination: "protestant-evangelical",
    age: "35-44",
    marital: "married",
    children: "2",
    financialSituation: "comfortable",
    biggestRegret: "Not starting to save earlier in my twenties.",
    emotionalRelationship: "Money feels like a responsibility I can never fully discharge.",
  },
  answers: [],
};

async function main() {
  console.log("Generating HTML...");
  const html = renderReportHtml(mockData);
  fs.writeFileSync("/tmp/test-report.html", html);
  console.log("HTML saved to /tmp/test-report.html");

  console.log("Generating PDF...");
  const pdf = await generatePdf({ html, sessionId: "test-session" });
  fs.writeFileSync("/tmp/test-report.pdf", pdf);
  console.log(`PDF saved to /tmp/test-report.pdf (${pdf.length} bytes)`);
}

main().catch(console.error);
