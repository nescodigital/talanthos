export interface BiblicalTypeData {
  slug: 'builder' | 'steward' | 'sower' | 'visionary';
  name: string;
  archetype: string;
  shortDescription: string;
  fullDescription: string;
  strengths: string[];
  blindSpots: string[];
  keyVerse: { reference: string; text: string };
  primaryFreeInsight: string;
  iconName: string;
}

export const BIBLICAL_TYPES: Record<string, BiblicalTypeData> = {
  builder: {
    slug: 'builder',
    name: 'The Builder',
    archetype: 'Joseph - The Strategic Provider',
    shortDescription: "You see money as a tool for security and long-term provision. Like Joseph in Egypt, you save in seasons of plenty to protect against seasons of need.",
    fullDescription: "The Builder is the archetype of Joseph. When God gave Joseph the dream of seven years of plenty followed by seven years of famine, he didn't panic. He built. He saved. He stored. Builders are wired by God to think long-term, to see what others don't see, and to prepare. Your mind naturally runs scenarios. You read about retirement accounts when others read about vacations. You feel deep peace when your emergency fund is full and deep anxiety when it isn't.",
    strengths: [
      "Long-term strategic thinking",
      "Discipline in saving and budgeting",
      "Ability to delay gratification",
      "Wisdom in avoiding unnecessary debt",
      "Foresight to prepare for hard seasons",
    ],
    blindSpots: [
      "Can become paralyzed by over-planning",
      "Tendency toward scarcity mindset disguised as wisdom",
      "May miss God-given opportunities out of fear of risk",
      "Can struggle to give generously when 'the numbers' say no",
      "Sometimes mistake security for trust in God",
    ],
    keyVerse: {
      reference: "Proverbs 21:20",
      text: "The wise store up choice food and olive oil, but fools gulp theirs down.",
    },
    primaryFreeInsight: "Your next growth edge: learn to distinguish between Spirit-led saving (peace) and fear-driven hoarding (anxiety). The first produces freedom. The second produces idolatry of security.",
    iconName: "Shield",
  },
  steward: {
    slug: 'steward',
    name: 'The Steward',
    archetype: 'The Faithful Servant - Manager of Entrusted Resources',
    shortDescription: "You see money as a sacred trust from God. Like the faithful servant in Matthew 25, you take what's given and multiply it through wise, ordered management.",
    fullDescription: "The Steward is the archetype of the faithful servant from Matthew 25. When the master returned, those who managed his money well heard: 'Well done, good and faithful servant.' Stewards don't ask 'how much of my money should I give to God?' They ask 'how much of God's money should I keep for myself?' This fundamental orientation changes everything. You feel deep responsibility about every dollar. You tithe automatically. You hate waste. You want to handle finances in a way that would honor God if He audited your books today.",
    strengths: [
      "High integrity in financial decisions",
      "Consistent tithing and giving habits",
      "Strong sense of accountability to God",
      "Ordered approach to money management",
      "Decisions aligned with biblical values",
    ],
    blindSpots: [
      "Can drift into legalism (focused on exact percentages, not heart)",
      "May refuse legitimate growth opportunities out of fear of 'loving money'",
      "Can become rigid and miss the Spirit's leading",
      "Tendency to judge others' financial choices",
      "May miss joy in money by treating every cent as ministry",
    ],
    keyVerse: {
      reference: "Matthew 25:21",
      text: "His master replied, 'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things.'",
    },
    primaryFreeInsight: "Your next growth edge: faithfulness isn't just about percentages. It's about whether your money flows from a heart of love or a sense of duty. God wants both your obedience AND your joy.",
    iconName: "Scale",
  },
  sower: {
    slug: 'sower',
    name: 'The Sower',
    archetype: 'The Generous Giver - Open-Handed Provider',
    shortDescription: "You see money as seed to be scattered. Like the widow with two coins, your hand opens easily and your heart connects deeply with those in need.",
    fullDescription: "The Sower is the archetype of the widow who gave two small coins (Mark 12), and the principle of 'whatever you sow, you will also reap' (Galatians 6:7). Sowers don't grip money. Money flows through them. You see a need and your hand moves before your head finishes calculating. Family members, friends, your church, missionaries, strangers in difficulty - they all benefit from your generosity. You trust God to provide. And He often does in surprising ways. But Sowers also carry a hidden burden: sometimes you give what you don't have. Sometimes you go into debt for others. Sometimes you neglect your own foundation because someone else's roof is leaking.",
    strengths: [
      "Deep generosity and open-handedness",
      "Strong network of relationships",
      "Faith that God will provide",
      "Quick response to genuine needs",
      "Heart connected to Kingdom purposes",
    ],
    blindSpots: [
      "Tendency to give beyond your capacity",
      "Can accumulate debt from generosity",
      "Often lack a solid personal financial foundation",
      "Co-dependency in financial relationships",
      "Difficulty saying no to family or friends in 'need'",
    ],
    keyVerse: {
      reference: "Luke 6:38",
      text: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.",
    },
    primaryFreeInsight: "Your next growth edge: you can't pour from an empty cup. The most generous sowers also have the strongest foundations. Building your own house isn't selfish. It's stewardship.",
    iconName: "Sprout",
  },
  visionary: {
    slug: 'visionary',
    name: 'The Visionary',
    archetype: 'Solomon - The Wisdom-Wealth Builder',
    shortDescription: "You see money as the fuel for Kingdom impact at scale. Like Solomon, you sense that God has wired you to build, multiply, and steward influence.",
    fullDescription: "The Visionary is the archetype of Solomon. When God offered Solomon anything, he asked for wisdom. God gave him wealth as a bonus - because wisdom and wealth in the same hands can change a kingdom. Visionaries see possibilities. You think in systems, in scale, in multiplication. You can't just earn a salary - you need to build something. You believe that God has called you not just to be faithful with little, but to be faithful with much. And much is often what comes to those wired this way. But Solomon's story has a second half. With great wealth came great temptation. With influence came the slow drift from wisdom to indulgence. The Visionary's blessing carries the highest risk profile of all four types.",
    strengths: [
      "High risk tolerance balanced with insight",
      "Ability to see opportunities others miss",
      "Capacity to multiply resources at scale",
      "Entrepreneurial energy and creativity",
      "Vision for Kingdom impact through finances",
    ],
    blindSpots: [
      "Can mistake greed for vision",
      "Tendency to over-leverage and take on too much debt",
      "May neglect family, rest, and relationships",
      "'Solomon ending' - wealth without ultimate purpose",
      "Risk of building empire instead of Kingdom",
    ],
    keyVerse: {
      reference: "1 Kings 3:13",
      text: "Moreover, I will give you what you have not asked for - both wealth and honor - so that in your lifetime you will have no equal among kings.",
    },
    primaryFreeInsight: "Your next growth edge: Solomon had wisdom AND wealth. He lost his way when he stopped letting wisdom govern the wealth. Your moat is a weekly financial Sabbath - one full day with no money decisions, no business strategy. Pure reset.",
    iconName: "Crown",
  },
};
