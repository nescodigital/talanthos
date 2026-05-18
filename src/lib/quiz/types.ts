export interface BiblicalTypeData {
  id: BiblicalType;
  label: string;
  figure: string;
  tagline: string;
  monogram: string;
  glyph: string;
  blurb: string;
  strengths: string[];
  blindSpots: string[];
  verse: { text: string; ref: string };
  nextStep: string;
}

export type BiblicalType = 'visionary' | 'guardian' | 'giver' | 'builder';

export const BIBLICAL_TYPES: Record<string, BiblicalTypeData> = {
  visionary: {
    id: "visionary",
    label: "The Visionary",
    figure: "Solomon",
    tagline: "The Wisdom-Wealth Builder",
    monogram: "I",
    glyph: "crown",
    blurb:
      "You see what others miss. Resources, in your hand, become engines for what's next — a business, a movement, a legacy. You don't fear wealth; you steward its multiplication.",
    strengths: [
      "Reads opportunity where others read risk",
      "Multiplies what's been entrusted to you",
      "Naturally long-horizon — thinks in decades",
      "Connects wisdom to capital allocation",
      "Inspires others to dream practically",
    ],
    blindSpots: [
      "Can let the vision outrun the people around you",
      "Wisdom without governance becomes ambition",
      "Tendency to defer rest in pursuit of the build",
      "May confuse God's blessing with personal genius",
      "Risk of treating relationships as resources",
    ],
    verse: {
      text: "Moreover, I will give you what you have not asked for — both riches and honor — so that in your lifetime you will have no equal among kings.",
      ref: "1 Kings 3:13",
    },
    nextStep:
      "Solomon had wisdom AND wealth. He lost his way when he stopped letting wisdom govern the wealth. This week, name the one decision where your vision is currently moving faster than your counsel. Bring it to a wise voice before you bring it to the market.",
  },
  guardian: {
    id: "guardian",
    label: "The Guardian",
    figure: "Joseph",
    tagline: "The Steward-Protector",
    monogram: "II",
    glyph: "shield",
    blurb:
      "You see the lean years coming. While others spend the harvest, you store it — quietly, faithfully, with a discipline that protects families, businesses, and futures from the famine no one else is preparing for.",
    strengths: [
      "Disciplined saver; runway is your love language",
      "Long-memory — learns from past scarcity",
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
    nextStep:
      "Joseph stored for seven years — then he opened the storehouses. This week, identify one storehouse in your life God may be asking you to open. Set a date. Move it from posture to plan.",
  },
  giver: {
    id: "giver",
    label: "The Giver",
    figure: "The Macedonians",
    tagline: "The Generous Heart",
    monogram: "III",
    glyph: "open-hand",
    blurb:
      "Generosity isn't a line item for you — it's the lens. You give early, you give first, you give past comfort. People feel seen because you make a way for them with what's in your hand.",
    strengths: [
      "Generous beyond your own balance sheet",
      "Reads the unspoken need in a room",
      "Frees money from idolatry by sending it out",
      "Builds trust through unconditional giving",
      "Anchors your identity outside accumulation",
    ],
    blindSpots: [
      "Giving can outrun your own household's needs",
      "May enable rather than empower",
      "Hides from budgeting under the cover of grace",
      "Says yes to good causes and no to better ones",
      "Risk of using giving to manage guilt",
    ],
    verse: {
      text: "In the midst of a very severe trial, their overflowing joy and their extreme poverty welled up in rich generosity.",
      ref: "2 Corinthians 8:2",
    },
    nextStep:
      "Generosity without structure burns the giver. This week, write down your floor — the non-negotiable provision for those entrusted to you — and your ceiling — the limit beyond which giving becomes evasion. Then give freely in between.",
  },
  builder: {
    id: "builder",
    label: "The Builder",
    figure: "Nehemiah",
    tagline: "The Systematic Restorer",
    monogram: "IV",
    glyph: "wall",
    blurb:
      "You don't chase the new — you restore what's broken and finish what others abandoned. Brick by brick, system by system, your money builds walls that protect what matters for a generation.",
    strengths: [
      "Patient compounder; you finish what you start",
      "Translates conviction into systems and plans",
      "Resilient against opposition and delay",
      "Builds for the city, not just the self",
      "Money obeys the blueprint, not the mood",
    ],
    blindSpots: [
      "Systems can crowd out spontaneity and gift",
      "Plans become identity; deviation feels like loss",
      "Slow to celebrate; quick to start the next phase",
      "May undervalue rest in the rhythm of the work",
      "Builds walls others were never asked to scale",
    ],
    verse: {
      text: "So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart.",
      ref: "Nehemiah 4:6",
    },
    nextStep:
      "Nehemiah built with a trowel in one hand and a sword in the other — but he also stopped to read the law aloud. This week, schedule the pause before the next phase. Read. Receive. Then keep building.",
  },
};
