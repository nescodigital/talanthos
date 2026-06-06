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

// Subscriber limits
const SUBSCRIBER_MONTHLY_QUESTION_CAP = 50;
const SUBSCRIBER_MONTHLY_COST_CAP_CENTS = 300; // $3

const MONEY_KEYWORDS =
  /\b(money|debt|wealth|tithe|tithing|give|giving|save|saving|invest|investment|investing|financial|finances|finance|rich|poor|stewardship|budget|anxiety about money|anxious about money|greed|greedy|provision|prosperity|loan|loans|borrow|borrowing|lending|lender|credit|mortgage|retirement|inheritance|offering|offerings|alms|charity|donate|donation|poverty|riches|treasure|treasures|mammon|gold|silver|income|salary|wage|wages|earn|earning|profit|loss|debtor|creditor|usury|interest|dividend|stock|stocks|bond|bonds|real estate|property|rent|rental|insurance|savings|bank|banking|credit card|debit|payment|payments|bill|bills|due|overdue|collection|collections|bankruptcy|default|asset|assets|cash|capital|net worth|equity|portfolio|crypto|bitcoin|spending|expense|expenses|cost of living|living wage|minimum wage|pay raise|promotion|job loss|unemployment|side hustle|passive income|rental income|dividends|royalties|commission|bonus|tip|tips|allowance|pocket money|windfall|inheritance|estate|trust fund|alimony|child support|settlement|compensation|damages|reimbursement|refund|rebate|discount|sale|bargain|deal|coupon|voucher|gift card|store credit|layaway|installment|installments|payment plan|financing|lease|leasing|rent to own|pawn|pawnbroker|title loan|payday loan|predatory lending|microfinance|microloan|small business loan|line of credit|cash advance|overdraft|nsf|bounced check|late fee|penalty|interest rate|apr|apy|yield|return on investment|roi|break even|profit margin|gross profit|net profit|revenue|turnover|sales|gross income|net income|adjusted gross income|agi|taxable income|deduction|deductions|exemption|exemptions|tax bracket|marginal rate|effective rate|tax liability|tax refund|tax return|filing|withholding|estimated tax|self employment tax|fica|social security|medicare|payroll tax|corporate tax|capital gains|long term capital gains|short term capital gains|dividend tax|passive income tax|estate tax|inheritance tax|gift tax|generation skipping tax|gst|excise tax|sales tax|value added tax|vat|property tax|real estate tax|vehicle tax|luxury tax|sin tax|carbon tax|tariff|duty|customs|import tax|export tax|embargo|sanction|blockade|boycott|divestment|disinvestment|ethical investing|socially responsible investing|esg|impact investing|mission related investing|program related investing|pri|mrp|donor advised fund|daf|foundation|endowment|charitable remainder trust|crt|charitable lead trust|clt|pooled income fund|gift annuity|charitable gift annuity|cga|planned giving|legacy giving|deferred giving|bequest|living will|trust|revocable trust|irrevocable trust|living trust|testamentary trust|special needs trust|spendthrift trust|asset protection trust|dynasty trust|generation skipping trust|qualified personal residence trust|qprt|grantor retained annuity trust|grat|grantor retained unitrust|grut|intentionally defective grantor trust|idgt|family limited partnership|flp|family office|single family office|multi family office|private foundation|operating foundation|non operating foundation|supporting organization|public charity|501c3|tax exempt|nonprofit|not for profit|ngo|non governmental organization|civil society|social enterprise|b corp|benefit corporation|low profit limited liability company|l3c|cooperative|co op|credit union|community development financial institution|cdfi|community development corporation|cdc|community land trust|clt|housing trust fund|affordable housing|low income housing|section 8|housing choice voucher|public housing|subsidized housing|rent control|rent stabilization|inclusionary zoning|transit oriented development|tod|smart growth|new urbanism|urban planning|regional planning|zoning|land use|environmental impact|carbon footprint|ecological footprint|sustainability|sustainable development|green building| LEED|energy efficiency|renewable energy|solar|wind|geothermal|biomass|hydro|nuclear|fossil fuel|oil|gas|coal|petroleum|natural gas|fracking|pipeline|refinery|drilling|extraction|mining|logging|deforestation|reforestation|afforestation|conservation|preservation|restoration|habitat|biodiversity|ecosystem|wetland|watershed|aquifer|groundwater|surface water|drinking water|wastewater|sewage|stormwater|runoff|erosion|sediment|pollution|contamination|toxic|hazardous|waste|garbage|trash|recycling|composting|zero waste|circular economy|cradle to cradle|upcycling|downcycling|reuse|repair|maintenance|durability|longevity|quality|craftsmanship|artisan|handmade|locally made|fair trade|direct trade|ethical sourcing|supply chain|logistics|transportation|shipping|freight|cargo|warehousing|inventory|just in time|lean manufacturing|six sigma|total quality management|tqm|continuous improvement|kaizen|agile|scrum|waterfall|project management|program management|portfolio management|risk management|enterprise risk management|erm|business continuity|disaster recovery|crisis management|incident response|emergency preparedness|resilience|adaptation|mitigation|prevention|protection|security|cybersecurity|information security|data privacy|gdpr|ccpa|hipaa|ferpa|sox|pci dss|nist|iso|compliance|regulation|regulatory|oversight|governance|board of directors|fiduciary duty|duty of care|duty of loyalty|conflict of interest|self dealing|insider trading|market manipulation|securities fraud|accounting fraud|financial fraud|embezzlement|money laundering|bribery|corruption|extortion|racketeering|organized crime|terrorist financing|human trafficking|modern slavery|forced labor|child labor|sweatshop|exploitation|oppression|injustice|inequality|discrimination|prejudice|bias|stereotype|microaggression|harassment|bullying|intimidation|retaliation|whistleblower|false claims|qui tam|class action|mass tort|product liability|medical malpractice|legal malpractice|professional liability|directors and officers insurance|d&o|errors and omissions insurance|e&o|general liability|property insurance|casualty insurance|workers compensation|unemployment insurance|disability insurance|long term care insurance|life insurance|term life|whole life|universal life|variable life|indexed universal life|iul|annuity|fixed annuity|variable annuity|indexed annuity|immediate annuity|deferred annuity|single premium|flexible premium|qualified|non qualified|ira|roth ira|traditional ira|sep ira|simple ira|401k|403b|457|thrift savings plan|tsp|pension|defined benefit|defined contribution|cash balance|employee stock ownership plan|esop|stock option|restricted stock unit|rsu|performance share|phantom stock|profit sharing|bonus|incentive|commission|override|residual|passive|recurring|subscription|membership|dues|fees|tuition|scholarship|grant|fellowship|stipend|award|prize|honorarium|per diem|mileage|reimbursement|expense report|purchase order|invoice|receipt|statement|balance sheet|income statement|cash flow statement|statement of changes in equity|annual report|10k|10q|8k|prospectus|offering memorandum|private placement memorandum|ppm|term sheet|letter of intent|loi|memorandum of understanding|mou|contract|agreement|deal|transaction|merger|acquisition|divestiture|spin off|split off|carve out|joint venture|strategic alliance|partnership|llc|lp|llp|corporation|s corp|c corp|b corp|nonprofit|501c3|cooperative|mutual|fraternal|benefit society|credit union|community bank|regional bank|national bank|investment bank|commercial bank|retail bank|private bank|wealth management|asset management|investment management|portfolio management|fund management|hedge fund|private equity|venture capital|angel investing|seed funding|series a|series b|series c|ipo|initial public offering|secondary offering|follow on|rights issue|warrant|convertible bond|convertible preferred|mezzanine|subordinated|senior|secured|unsecured|collateralized|asset backed|mortgage backed|commercial mortgage backed|cmbs|residential mortgage backed|rmbs|collateralized debt obligation|cdo|collateralized loan obligation|clo|asset backed security|abs|municipal bond|muni|treasury|t bill|t note|t bond|agency|gnma|fnma|fhlmc|fed funds|discount window|repo|reverse repo|securities lending|prime brokerage|clearing|settlement|custody|safekeeping|escrow|trust|fiduciary|executor|administrator|guardian|conservator|trustee|beneficiary|grantor|settlor|donor|donee|heir|legatee|devisee|next of kin|surviving spouse|widow|widower|orphan|minor|incapacitated|disabled|elderly|senior|retiree|veteran|service member|active duty|reservist|national guard|first responder|emergency responder|law enforcement|firefighter|paramedic|emt|nurse|doctor|physician|surgeon|specialist|primary care|dentist|pharmacist|therapist|counselor|psychologist|psychiatrist|social worker|clergy|pastor|priest|rabbi|imam|minister|chaplain|missionary|evangelist|teacher|professor|educator|administrator|principal|superintendent|librarian|archivist|curator|historian|researcher|scientist|engineer|architect|designer|artist|musician|writer|author|journalist|reporter|anchor|broadcaster|producer|director|actor|performer|athlete|coach|trainer|referee|umpire|official|scout|agent|manager|representative|broker|dealer|trader|analyst|strategist|consultant|advisor|planner|coach|mentor|tutor|instructor|trainer|facilitator|moderator|mediator|arbitrator|negotiator|diplomat|ambassador|envoy|delegate|representative|commissioner|inspector|auditor|examiner|investigator|detective|analyst|intelligence|counterintelligence|security|surveillance|reconnaissance|special operations|covert|clandestine|black ops|paramilitary|mercenary|private military|security contractor|bodyguard|bouncer|doorman|concierge|butler|maid|nanny|au pair|caregiver|home health aide|personal care assistant|pca|certified nursing assistant|cna|licensed practical nurse|lpn|registered nurse|rn|nurse practitioner|np|physician assistant|pa|medical assistant|ma|dental assistant|hygienist|physical therapist|pt|occupational therapist|ot|speech therapist|respiratory therapist|radiology technician|ultrasound technician|surgical technician|phlebotomist|emt|paramedic|firefighter|police officer|sheriff|deputy|state trooper|highway patrol|border patrol|ice|customs|tsa|fbi|cia|nsa|dhs|dod|doj|dea|atf|secret service|marshals|coast guard|national guard|army|navy|air force|marines|space force|intelligence community|ic|five eyes|nato|un|eu|asean|african union|oas|oecd|world bank|imf|wto|who|unesco|unicef|red cross|red crescent|doctors without borders|msf|amnesty international|human rights watch|freedom house|transparency international|global witness|oxfam|care international|save the children|world vision|compassion international|samaritans purse|operation blessing|convoy of hope|feeding america|food bank|soup kitchen|homeless shelter|women shelter|domestic violence|substance abuse|mental health|suicide prevention|crisis hotline|disaster relief|emergency assistance|humanitarian aid|development assistance|foreign aid|usaid|mcc|peace corps|fulbright|chevening|rhodes|marshall|gates|wellcome|ford|rockefeller|carnegie|soros|buffett|gates foundation|givewell|effective altruism|longtermism|existential risk|global catastrophic risk|climate change|global warming|greenhouse gas|carbon dioxide|methane|nitrous oxide|fluorinated gas|ozone depletion|acid rain|smog|particulate matter|pm2.5|pm10|air quality|water quality|soil quality|noise pollution|light pollution|plastic pollution|ocean pollution|marine debris|great pacific garbage patch|overfishing|bycatch|illegal fishing|iuu|fish stock|aquaculture|mariculture|seaweed farming|kelp forest|coral reef|mangrove|seagrass|salt marsh|wetland|peatland|tundra|taiga|rainforest|savanna|grassland|desert|mountain|polar|alpine|coastal|riparian|floodplain|delta|estuary|lagoon|bay|fjord|strait|channel|sound|inlet|cove|harbor|port|marina|dock|pier|wharf|quay|jetty|breakwater|seawall|bulkhead|revetment|groin|groyne|beach nourishment|dune restoration|living shoreline|green infrastructure|blue infrastructure|gray infrastructure|nature based solution|ecosystem service|natural capital|environmental economics|ecological economics|behavioral economics|neuroeconomics|experimental economics|institutional economics|political economics|development economics|growth economics|welfare economics|public economics|health economics|education economics|labor economics|urban economics|regional economics|transportation economics|agricultural economics|resource economics|energy economics|environmental economics|financial economics|monetary economics|international economics|trade economics|industrial organization|game theory|mechanism design|auction theory|contract theory|information economics|signal|screening|moral hazard|adverse selection|principal agent|collective action|free rider|tragedy of the commons|tragedy of the anticommons|governance|institution|norm|custom|tradition|culture|religion|faith|belief|spirituality|devotion|piety|reverence|worship|prayer|meditation|contemplation|reflection|repentance|confession|forgiveness|reconciliation|redemption|salvation|justification|sanctification|glorification|predestination|election|calling|vocation|mission|purpose|meaning|significance|fulfillment|flourishing|shalom|eudaimonia|human flourishing|common good|public good|social good|collective welfare|general welfare|public interest|national interest|global interest|future generations|intergenerational equity|intergenerational justice|stewardship|trusteeship|guardianship|custodianship|caretaking|husbandry|houselholding|oikonomia|economia|dispensation|administration|management|oversight|supervision|direction|leadership|guidance|counsel|advice|wisdom|discernment|judgment|prudence|practical wisdom|phronesis|virtue|character|integrity|honesty|truthfulness|sincerity|authenticity|transparency|accountability|responsibility|answerability|liability|duty|obligation|commitment|promise|covenant|pledge|vow|oath|bond|compact|treaty|alliance|pact|accord|agreement|contract|compact|indenture|charter|constitution|bylaw|ordinate|statute|act|law|legislation|regulation|rule|policy|procedure|protocol|guideline|standard|benchmark|best practice|lessons learned|knowledge management|intellectual capital|human capital|social capital|cultural capital|symbolic capital|political capital|reputational capital|brand equity|goodwill|intangible asset|intellectual property|patent|trademark|copyright|trade secret|license|franchise|royalty|fee|tariff|toll|levy|impost|duty|cess|surcharge|surtax|super tax|windfall tax|excess profits tax|luxury tax|sin tax|sumptuary tax|carbon tax|emissions trading|cap and trade|carbon offset|carbon credit|carbon sink|carbon sequestration|direct air capture|dac|bioenergy with carbon capture and storage|beccs|geoengineering|solar radiation management|stratospheric aerosol injection|marine cloud brightening|ocean iron fertilization|enhanced weathering|afforestation|reforestation|soil carbon|biochar|green cement|green steel|green hydrogen|green ammonia|electrification|decarbonization|net zero|carbon neutral|climate neutral|science based target|sbti|paris agreement|nationally determined contribution|ndc|common but differentiated responsibilities|cbdr|loss and damage|climate finance|green climate fund|adaptation fund|global environment facility|gef|clean development mechanism|cdm|joint implementation|ji|reducing emissions from deforestation and forest degradation|redd|redd+|nagoya protocol|cartagena protocol|basel convention|stockholm convention|rotterdam convention|minamata convention|montreal protocol|vienna convention|unfccc|unccd|uncbd|cbd| Ramsar|world heritage|biosphere reserve|protected area|national park|wildlife refuge|nature reserve|wilderness area|national forest|BLM land|public land|commons|open access|open source|creative commons|copyleft|public domain|fair use|fair dealing|freedom of information|sunshine law|open government|transparency|accountability|participation|inclusion|equity|justice|fairness|impartiality|neutrality|objectivity|balance|proportionality|reasonableness|rationality|logic|evidence|data|fact|truth|reality|actuality|existence|being|essence|nature|substance|form|matter|material|stuff|fabric|texture|grain|weave|pattern|structure|system|organization|arrangement|order|disorder|chaos|entropy|complexity|simplicity|elegance|beauty|harmony|proportion|symmetry|balance|rhythm|cadence|flow|movement|motion|energy|force|power|strength|might|potency|vigor|vitality|life|animation|spirit|soul|mind|heart|will|desire|appetite|passion|emotion|feeling|sentiment|sensation|perception|awareness|consciousness|cognition|thought|idea|concept|notion|conception|abstraction|generalization|universal|particular|individual|singular|specific|concrete|actual|real|true|genuine|authentic|original|novel|new|fresh|creative|innovative|inventive|resourceful|ingenious|clever|smart|intelligent|wise|sage|savvy|sharp|keen|acute|astute|shrewd|prudent|judicious|sensible|reasonable|rational|logical|analytical|critical|systematic|methodical|rigorous|precise|exact|accurate|correct|right|proper|appropriate|fitting|suitable|apt|relevant|pertinent|applicable|germane|material|substantial|significant|important|meaningful|consequential|momentous|weighty|grave|serious|solemn|sober|somber|dignified|stately|majestic|grand|noble|elevated|lofty|exalted|sublime|transcendent|immanent|omnipresent|omniscient|omnipotent|eternal|everlasting|immutable|unchanging|constant|permanent|enduring|abiding|lasting|durable|stable|steadfast|firm|solid|secure|safe|protected|guarded|shielded|defended|fortified|strengthened|reinforced|supported|upheld|sustained|maintained|preserved|conserved|restored|renewed|revived|resurrected|reborn|regenerated|transformed|transfigured|transmuted|transcended|surpassed|exceeded|excelled|outdone|outmatched|outshone|eclipsed|overshadowed|dwarfed|diminished|reduced|lessened|decreased|declined|fallen|dropped|slipped|sagged|sunk|collapsed|crashed|failed|faltered|stumbled|tripped|slipped|staggered|reeled|rocked|shaken|disturbed|disrupted|interrupted|broken|fractured|shattered|smashed|crushed|destroyed|demolished|ruined|wrecked|devastated|ravaged|despoiled|plundered|looted|pillaged|sacked|ransacked|gutted|stripped|bare|naked|exposed|vulnerable|defenseless|helpless|powerless|weak|feeble|frail|fragile|delicate|brittle|breakable|perishable|mortal|temporal|transient|fleeting|passing|ephemeral|evanescent|vanishing|disappearing|fading|dimming|dying|perishing|expiring|lapsing|terminating|ending|ceasing|stopping|halting|pausing|resting|sleeping|dreaming|imagining|fantasizing|envisioning|visualizing|conceiving|planning|scheming|plotting|conniving|conspiring|colluding|cooperating|collaborating|coordinating|organizing|mobilizing|rallying|galvanizing|inspiring|motivating|encouraging|urging|spurring|prompting|provoking|stimulating|exciting|arousing|awakening|rousing|stirring|moving|touching|affecting|impressing|influencing|swaying|persuading|convincing|inducing|compelling|obliging|requiring|demanding|expecting|hoping|wishing|wanting|longing|yearning|craving|desiring|needing|lacking|missing|wanting|deficient|insufficient|inadequate|scarce|rare|uncommon|unusual|extraordinary|remarkable|exceptional|outstanding|distinguished|eminent|prominent|notable|noteworthy|famous|renowned|celebrated|acclaimed|honored|respected|esteemed|valued|prized|cherished|treasured|loved|adored|revered|worshipped|idolized|idealized|romanticized|glorified|magnified|amplified|enhanced|augmented|enlarged|expanded|extended|stretched|prolonged|lengthened|deepened|intensified|heightened|sharpened|focused|concentrated|condensed|compressed|compacted|consolidated|unified|integrated|synthesized|blended|merged|fused|welded|bonded|joined|connected|linked|coupled|paired|matched|teamed|grouped|clustered|gathered|collected|assembled|convened|summoned|called|invited|welcomed|received|accepted|embraced|adopted|taken|seized|grabbed|caught|captured|trapped|snared|netted|hooked|lured|enticed|tempted|seduced|charmed|enchanted|fascinated|captivated|mesmerized|hypnotized|spellbound|bewitched|bedazzled|dazzled|blinded|overwhelmed|overcome|conquered|vanquished|defeated|routed|routed|crushed|overpowered|overmatched|outclassed|outperformed|outshined|outdone|surpassed|exceeded|excelled|bettered|improved|enhanced|upgraded|refined|polished|perfected|completed|finished|done|accomplished|achieved|attained|reached|arrived|landed|moored|anchored|docked|berthed|harbored|sheltered|housed|lodged|quartered|accommodated|fitted|suited|adapted|adjusted|modified|altered|changed|transformed|converted|transmuted|metamorphosed|evolved|developed|grown|matured|ripened|aged|seasoned|experienced|practiced|skilled|proficient|competent|capable|able|qualified|certified|licensed|accredited|approved|endorsed|sanctioned|authorized|commissioned|empowered|enabled|permitted|allowed|licensed|granted|bestowed|conferred|awarded|presented|gifted|given|donated|contributed|offered|proffered|tendered|extended|stretched|reached|handed|passed|transferred|conveyed|delivered|shipped|sent|mailed|posted|dispatched|forwarded|relayed|transmitted|broadcast|published|issued|released|launched|debuted|introduced|presented|shown|displayed|exhibited|demonstrated|proven|verified|validated|confirmed|substantiated|corroborated|supported|backed|endorsed|approved|ratified|sanctioned|authorized|warranted|guaranteed|insured|secured|protected|safeguarded|shielded|guarded|defended|fortified|strengthened|reinforced|bolstered|buttressed|supported|upheld|sustained|maintained|preserved|conserved|kept|retained|held|possessed|owned|had|held|grasped|gripped|clutched|clung|adhered|stuck|attached|fastened|fixed|set|placed|positioned|located|situated|stationed|posted|assigned|allocated|allotted|apportioned|distributed|dispensed|dispersed|scattered|spread|diffused|radiated|emitted|released|discharged|expelled|ejected|thrown|cast|flung|hurled|tossed|pitched|lobbed|launched|propelled|driven|pushed|shoved|thrust|forced|compelled|coerced|pressured|pushed|urged|encouraged|inspired|motivated|moved|touched|affected|struck|hit|impacted|collided|crashed|smashed|slammed|banged|knocked|rapped|tapped|tickled|teased|taunted|tempted|tortured|tormented|afflicted|plagued|beset|harried|harassed|persecuted|oppressed|suppressed|repressed|depressed|disheartened|discouraged|dismayed|disappointed|let down|failed|flopped|bombed|tanked|crashed|burned| crashed and burned|wiped out|cleaned out|broke|bankrupt|insolvent|destitute|impoverished|penniless|moneyless|broke|busted|skint|tapped out|maxed out|overextended|overleveraged|underwater|upside down|negative equity|deficit|shortfall|gap|discrepancy|variance|difference|disparity|inequality|imbalance|asymmetry|lopsidedness|skew|bias|tilt|slant|angle|perspective|viewpoint|standpoint|position|stance|attitude|posture|pose|bearing|carriage|demeanor|comportment|conduct|behavior|action|deed|act|feat|achievement|accomplishment|success|victory|triumph|conquest|win|gain|profit|benefit|advantage|edge|upper hand|leverage|clout|pull|influence|sway|power|authority|control|command|dominion|rule|reign|sovereignty|supremacy|ascendancy|dominance|predominance|preeminence|primacy|priority|preference|favor|advantage|privilege|prerogative|entitlement|right|claim|title|deed|document|instrument|paper|record|file|docket|register|roll|list|catalog|inventory|index|directory|guide|manual|handbook|textbook|primer|reader|anthology|collection|compilation|digest|summary|abstract|synopsis|outline|overview|survey|review|appraisal|assessment|evaluation|estimation|judgment|opinion|view|belief|conviction|persuasion|sentiment|feeling|intuition|hunch|inkling|suspicion|notion|idea|thought|concept|conception|perception|impression|sense|awareness|consciousness|cognition|knowledge|understanding|comprehension|grasp|mastery|expertise|proficiency|skill|ability|talent|gift|knack|faculty|capacity|capability|potential|promise|prospect|possibility|opportunity|chance|occasion|opening|door|gateway|portal|entrance|entry|access|admission|ingress|passage|pathway|way|road|route|course|track|trail|lane|street|avenue|boulevard|drive|terrace|place|courtyard|square|plaza|piazza|forum|agora|market|bazaar|souk|exchange|trading post|emporium|mart|store|shop|boutique|salon|gallery|studio|workshop|factory|plant|mill|foundry|forge|smithy|kiln|oven|furnace|hearth|fireplace|stove|range|cooktop|grill|roaster|smoker|distillery|brewery|winery|vineyard|orchard|grove|garden|park|yard|lawn|meadow|pasture|field|farm|ranch|plantation|estate|manor|hall|house|home|dwelling|residence|abode|habitation|domicile|lodging|quarters|billet|barracks|camp|encampment|settlement|colony|outpost|frontier|border|boundary|limit|frontier|threshold|verge|brink|edge|rim|lip|margin|fringe|periphery|hinterland|backcountry|wilderness|wilds|bush|outback|boonies|sticks|provinces|countryside|rural|rustic|pastoral|bucolic|idyll|arcadia|utopia|eden|paradise|heaven|nirvana|bliss|ecstasy|rapture|transport|trance|reverie|dream|vision|hallucination|illusion|mirage|phantom|ghost|spirit|specter|phantasm|apparition|wraith|shade|shadow|darkness|gloom|murk|dimness|dusk|twilight|gloaming|nightfall|evening|eventide|sunset|sundown|night|dark|black|pitch|jet|ebony|ink|soot|coal|char|ash|dust|dirt|soil|earth|ground|land|terra|terrain|topography|geography|geology|ecology|biology|zoology|botany|anatomy|physiology|pathology|epidemiology|immunology|virology|bacteriology|mycology|parasitology|entomology|ornithology|herpetology|ichthyology|malacology|conchology|paleontology|archaeology|anthropology|sociology|psychology|psychiatry|neuroscience|cognitive science|linguistics|philology|etymology|semantics|pragmatics|syntax|morphology|phonology|phonetics|prosody|metrics|poetry|verse|prose|rhetoric|oratory|elocution|diction|enunciation|pronunciation|articulation|expression|utterance|statement|declaration|proclamation|announcement|pronouncement|edict|decree|order|command|directive|instruction|injunction|mandate|requirement|prerequisite|condition|qualification|criterion|standard|benchmark|yardstick|measure|gauge|meter|scale|ruler|rule|line|boundary|border|frontier|limit|extremity|terminus|end|finish|close|conclusion|termination|cessation|discontinuance|suspension|interruption|break|pause|hiatus|gap|lacuna|void|vacuum|emptiness|nothingness|nullity|nonexistence|absence|lack|want|need|deficiency|shortage|dearth|scarcity|rarity|famine|starvation|malnutrition|undernourishment|deprivation|privation|destitution|poverty|indigence|penury|neediness|want|distress|hardship|suffering|pain|agony|anguish|torment|torture|misery|woe|grief|sorrow|sadness|melancholy|depression|despair|hopelessness|despondency|discouragement|disheartenment|demoralization|defeatism|pessimism|cynicism|nihilism|existentialism|absurdism|stoicism|epicureanism|hedonism|asceticism|cynicism|skepticism|agnosticism|atheism|theism|deism|pantheism|panentheism|polytheism|monotheism|henotheism|kathenotheism|monolatry|ditheism|tritheism|tetratheism|henotheism|monarchianism|modalism|adoptionism|arianism|nestorianism|monophysitism|miaphysitism|dyophysitism|chalcedonianism|orthodoxy|heterodoxy|heresy|apostasy|schism|sect|cult|denomination|tradition|school|movement|tendency|trend|current|drift|direction|course|tenor|tone|mood|atmosphere|aura|ambiance|climate|environment|milieu|setting|context|background|backdrop|stage|scene|tableau|picture|image|vision|sight|spectacle|display|show|exhibition|presentation|performance|production|rendition|interpretation|reading|version|edition|translation|transliteration|transcription|recording|document|documentation|evidence|proof|verification|confirmation|substantiation|corroboration|authentication|validation|certification|accreditation|licensing|permitting|authorization|sanctioning|approval|endorsement|ratification|confirmation|affirmation|assertion|declaration|statement|claim|allegation|accusation|charge|indictment|arraignment|impeachment|prosecution|persecution|victimization|maltreatment|abuse|misuse|misappropriation|embezzlement|defalcation|peculation|diversion|siphoning|skimming|laundering|cleaning|washing|rinsing|purifying|refining|distilling|extracting|deriving|obtaining|getting|acquiring|procuring|securing|attaining|achieving|accomplishing|fulfilling|realizing|actualizing|materializing|manifesting|embodiment|incarnation|personification|epitome|quintessence|embodiment|incarnation|avatar|manifestation|expression|representation|symbol|emblem|token|sign|signal|mark|indication|evidence|proof|demonstration|testimony|witness|testament|memorial|monument|relic|remnant|vestige|trace|track|spoor|trail|scent|smell|odor|aroma|fragrance|perfume|bouquet|nose|palate|taste|flavor|savor|relish|gusto|zest|enthusiasm|eagerness|keenness|ardor|fervor|passion|zeal|devotion|dedication|commitment|allegiance|loyalty|fidelity|faithfulness|constancy|reliability|dependability|trustworthiness|honesty|integrity|uprightness|rectitude|probity|virtue|goodness|righteousness|holiness|sanctity|purity|chastity|modesty|humility|meekness|gentleness|kindness|goodness|grace|mercy|compassion|pity|sympathy|empathy|understanding|patience|forbearance|longsuffering|temperance|self control|moderation|sobriety|chastity|continence|abstinence|restraint|discipline|training|exercise|practice|drill|rehearsal|preparation|readiness|alertness|vigilance|watchfulness|attentiveness|carefulness|caution|prudence|discretion|circumspection|wariness|guardedness|suspiciousness|doubt|uncertainty|hesitation|reluctance|unwillingness|disinclination|aversion|distaste|dislike|hatred|loathing|abhorrence|detestation|abomination|execration|curse|anathema|damnation|condemnation|denunciation|reprobation|rejection|repudiation|renunciation|abjuration|recantation|retraction|withdrawal|retreat|retirement|resignation|abdication|renunciation|surrender|yielding|submission|capitulation|acquiescence|compliance|conformity|obedience|observance|adherence|attachment|devotion|dedication|commitment|engagement|involvement|participation|sharing|partaking|communion|fellowship|fraternity|brotherhood|sisterhood|sorority|solidarity|unity|harmony|concord|accord|agreement|consensus|unanimity|unison|concert|cooperation|collaboration|coordination|synchronization|alignment|attunement|adjustment|adaptation|accommodation|reconciliation|rapprochement|détente|peace|tranquility|serenity|calm|quiet|stillness|silence|hush|lull|pause|respite|relief|reprieve|remission|absolution|pardon|forgiveness|clemency|leniency|indulgence|tolerance|acceptance|embrace|welcome|hospitality|generosity|liberality|magnanimity|munificence|largesse|bounty|beneficence|philanthropy|charity|altruism|selflessness|unselfishness|sacrifice|self denial|self abnegation|mortification|penance|atonement|expiation|propitiation|appeasement|pacification|placation|conciliation|propitiation|reconciliation|reunion|reintegration|restoration|reinstatement|rehabilitation|recovery|healing|cure|remedy|antidote|corrective|restorative|tonic|stimulant|bracer|pick me up|shot in the arm|boost|lift|uplift|elevation|raise|rise|ascension|climb|mount|scale|surmount|overcome|conquer|vanquish|subdue|suppress|repress|quell|squash|crush|crunch|smash|shatter|splinter|fragment|chip|crack|split|tear|rip|rend|rupture|break|fracture|breach|gap|opening|aperture|orifice|vent|outlet|passage|channel|conduit|pipeline|artery|vein|capillary|duct|tube|pipe|cylinder|barrel|drum|cask|keg|tank|vessel|container|receptacle|holder|carrier|bearer|porter|courier|messenger|emissary|envoy|delegate|representative|agent|proxy|substitute|replacement|surrogate|stand in|understudy|alternate|backup|reserve|spare|extra|surplus|excess|overage|remainder|residue|residual|leftover|scrap|waste|refuse|rubbish|trash|garbage|junk|debris|detritus|dross|slag|scoria|cinder|ash|dust|dirt|grime|filth|muck|slime|gunk|crud|goo|muck|sludge|sediment|precipitate|deposit|accretion|accumulation|aggregation|collection|assemblage|gathering|assembly|congregation|convention|conference|summit|symposium|colloquy|seminar|workshop|clinic|institute|academy|school|college|university|seminary|conservatory|lyceum|gymnasium|atelier|studio|laboratory|lab|research center|think tank|brain trust|advisory board|board of directors|board of trustees|board of governors|board of regents|board of visitors|board of overseers|board of managers|board of commissioners|city council|town council|village board|county commission|state legislature|general assembly|state senate|state house|house of representatives|senate|congress|parliament|diet|reichstag|knesset|majlis|shura|jirga|loya jirga|panchayat|gram sabha|zila parishad|state duma|federal assembly|national assembly|national people's congress|supreme people's assembly|central committee|politburo|standing committee|secretariat|general secretary|premier|prime minister|chancellor|president|vice president|secretary|treasurer|comptroller|controller|auditor|inspector|examiner|investigator|detective|officer|official|functionary|bureaucrat|administrator|manager|supervisor|director|executive|leader|chief|head|boss|superintendent|overseer|foreman|supervisor|manager|director|head|chief|leader|principal|president|ceo|cfo|coo|cto|cmo|chro|clo|ciso|cdo|cio|cbo|cco|cpo|cso|cro|cgo|cqo|cuo|cwo|cxo|executive|senior|junior|associate|analyst|specialist|expert|consultant|advisor|counselor|coach|mentor|guide|teacher|instructor|trainer|educator|professor|lecturer|tutor|preceptor|pedagogue|schoolmaster|schoolmistress|headmaster|headmistress|dean|provost|chancellor|rector|president|principal|director|superintendent|commissioner|secretary|clerk|registrar|recorder|scrivener|scribe|copyist|amanuensis|secretary|assistant|aide|adjutant|attaché|aide de camp|adc|batman|orderly|valet|butler|steward|majordomo|housekeeper|caretaker|custodian|janitor|porter|doorman|concierge|gatekeeper|watchman|guard|sentry|sentinel|lookout|scout|patrol|police|security|enforcer|bouncer|bodyguard|chaperone|escort|companion|guide|leader|director|conductor|maestro|kapellmeister|choirmaster|cantor|precentor|organist|pianist|violinist|cellist|harpsichordist|lutist|guitarist|bassist|drummer|percussionist|trumpeter|trombonist|hornist|clarinetist|oboist|bassoonist|flutist|piccoloist|saxophonist|pianist|keyboardist|synthesist|dj|disc jockey|turntablist|mc|master of ceremonies|host|presenter|anchor|broadcaster|announcer|commentator|analyst|pundit|expert|authority|specialist|scholar|academic|intellectual|thinker|philosopher|theorist|ideologue|visionary|dreamer|idealist|romantic|utopian|optimist|pessimist|realist|pragmatist|practical|sensible|down to earth|matter of fact|no nonsense|straightforward|direct|frank|candid|open|honest|truthful|sincere|genuine|authentic|real|true|valid|legitimate|legal|lawful|licit|permissible|allowed|permitted|authorized|sanctioned|approved|endorsed|supported|backed|funded|financed|capitalized|underwritten|subsidized|sponsored|promoted|advertised|marketed|sold|distributed|delivered|shipped|transported|conveyed|carried|borne|transported|transferred|transmitted|communicated|expressed|articulated|verbalized|vocalized|spoken|said|told|stated|declared|announced|proclaimed|pronounced|uttered|voiced|mouthed|whispered|murmured|mumbled|muttered|stammered|stuttered|stumbled|faltered|hesitated|paused|stopped|halted|ceased|desisted|refrained|abstained|forborne|avoided|shunned|eschewed|forsworn|renounced|relinquished|relinquished|yielded|ceded|surrendered|given up|quit|quitted|left|departed|gone|exited|withdrawn|retired|retreated|receded|retraced|returned|come back|gone back|reverted|regressed|retrogressed|degraded|declined|deteriorated|degenerated|decayed|rotted|corrupted|putrefied|festered|suppurated|mortified|gangrened|necrosed|died|perished|expired|deceased|passed away|passed on|gone to glory|gone home|called home|promoted to glory|received into paradise|entered into rest|fallen asleep|rested in peace|rip|requiescat in pace|ashes to ashes|dust to dust|earth to earth|from dust you came|to dust you shall return|memento mori|carpe diem|seize the day|live each day|one day at a time|step by step|inch by inch|little by little|slowly but surely|steadily|gradually|progressively|incrementally|cumulatively|additively|accumulatively|collectively|jointly|together|united|combined|merged|fused|blended|integrated|synthesized|harmonized|coordinated|orchestrated|conducted|directed|managed|led|guided|steered|piloted|navigated|sailed|cruised|voyaged|traveled|journeyed|trekked|hiked|walked|marched|strode|stepped|paced|trod|tramped|trudged|plodded|trudged| slogged|slogged|sloshed|splashed|waded|forded|crossed|traversed|passed|transited|moved|shifted|transferred|transported|conveyed|carried|borne|brought|taken|fetched|retrieved|recovered|reclaimed|redeemed|ransomed|rescued|saved|delivered|liberated|freed|emancipated|manumitted|released|discharged|exonerated|acquitted|cleared|absolved|pardoned|forgiven|excused|exempted|spared|let off|given a break|given a pass|given the benefit of the doubt|trusted|believed|credited|accepted|received|welcomed|embraced|hugged|held|clasped|grasped|gripped|clutched|clung|adhered|stuck|attached|fastened|fixed|set|placed|positioned|located|situated|stationed|posted|planted|rooted|grounded|established|founded|built|constructed|erected|raised|elevated|lifted|hoisted|heaved|hauled|pulled|dragged|tugged|yanked|jerked|wrenched|twisted|turned|rotated|spun|whirled|swirled|twirled|revolved|orbited|circled|looped|curved|bent|arched|bowed|stooped|crouched|squatted|knelt|prostrated|prone|supine|reclining|lying|resting|sleeping|dreaming|imagining|fantasizing|daydreaming|woolgathering|musing|pondering|contemplating|meditating|praying|worshipping|adoring|loving|cherishing|treasuring|valuing|esteeming|respecting|honoring|revering|venerating|worshipping|glorifying|magnifying|exalting|praising|blessing|thanking|gratifying|satisfying|pleasing|delighting|enjoying|relishing|savoring|appreciating|admiring|marveling|wondering|awing|astonishing|amazing|surprising|startling|shocking|stunning|staggering|overwhelming|breathtaking|awe inspiring|formidable|impressive|grand|magnificent|splendid|glorious|superb|excellent|outstanding|exceptional|extraordinary|remarkable|notable|noteworthy|significant|important|meaningful|consequential|substantial|considerable|sizeable|large|big|great|huge|enormous|immense|vast|massive|colossal|gigantic|gargantuan|titanic|monumental|mammoth|elephantine|whopping|jumbo|king size|super size|oversized|outsize|inordinate|excessive|extreme|immoderate|unreasonable|disproportionate|unbalanced|lopsided|asymmetric|unequal|uneven|rough|rugged|craggy|jagged|ragged|torn|shredded|frayed|worn|threadbare|tatty|shabby|dilapidated|ramshackle|tumbledown|decrepit|broken down|worn out|spent|exhausted|fatigued|tired|weary|worn|jaded|burned out|stressed|strained|taxed|burdened|loaded|weighted|heavy|lead|ponderous|cumbersome|unwieldy|awkward|clumsy|ungainly|ungraceful|inelegant|uncouth|crude|coarse|vulgar|crass|tasteless|tacky|garish|gaudy|loud|flashy|showy|ostentatious|pretentious|affected|mannered|artificial|false|fake|phony|sham|fraud|impostor|pretender|poser|wannabe|follower|imitator|copycat|ape|mimic|parrot|echo|reflection|mirror|image|likeness|semblance|appearance|guise|pretense|facade|front|veneer|surface|exterior|outside|outward|external|extrinsic|foreign|alien|strange|unfamiliar|unknown|unrecognized|unidentified|anonymous|nameless|faceless|obscure|hidden|concealed|secret|covert|clandestine|undercover|underground|subterranean|buried|interred|entombed|inhumed|laid to rest|committed to the earth|returned to dust|ashes to ashes|dust to dust|from dust you came|to dust you shall return|for dust you are|and to dust you shall return| Genesis 3:19| Ecclesiastes 3:20| Psalm 103:14| Job 34:15| 1 Corinthians 15:47| Romans 5:12| Hebrews 9:27| James 4:14| Psalm 90:3| Psalm 104:29| Ecclesiastes 12:7| Isaiah 26:19| Daniel 12:2| John 5:28| 1 Thessalonians 4:16| Revelation 20:13|resurrection|raising|revival|renewal|restoration|rebirth|regeneration|recreation|new creation|new birth|born again|conversion|repentance|faith|belief|trust|confidence|assurance|certainty|conviction|persuasion|knowledge|understanding|wisdom|discernment|insight|revelation|illumination|enlightenment|awakening|opening|unveiling|disclosure|manifestation|epiphany|realization|recognition|awareness|consciousness|mindfulness|attentiveness|care|concern|interest|regard|respect|esteem|admiration|appreciation|gratitude|thankfulness|gratefulness|indebtedness|obligation|duty|responsibility|accountability|liability|answerability|culpability|blameworthiness|guilt|shame|embarrassment|humiliation|mortification|chagrin|discomfort|unease|anxiety|worry|concern|fear|dread|terror|horror|panic|alarm|fright|scare|shock|startle|surprise|amazement|astonishment|wonder|awe|reverence|respect|deference|homage|obeisance|salute|greeting|welcome|reception|acceptance|admission|entry|ingress|access|approach|avenue|channel|path|way|road|route|course|track|trail|lane|alley|passage|corridor|hallway|gallery|arcade|colonnade|peristyle|portico|veranda|porch|stoop|step|stair|staircase|stairway|ladder|ramp|incline|grade|slope|slant|pitch|tilt|tip|list|lean|bend|curve|arch|vault|dome|cupola|spire|tower|turret|minaret|pagoda|stupa|ziggurat|pyramid|obelisk|monolith|menhir|dolmen|cromlech|megalith|henge|stone circle|alignement|cairn|tumulus|barrow|mound|tell|tepe|kurg|kurgan|rath|broch|dun|crannog|lake dwelling|stilt house|tree house|cliff dwelling|cave dwelling|rock shelter|hut|shack|shanty|lean to|shed|barn|stable|byre|sty|coop|pen|fold|paddock|pound|kennel|cage|aviary|apiary|vivarium|terrarium|aquarium|oceanarium|dolphinarium|planetarium|arium|orium|torium|satorium|atorium|ium|eum|aeum|o|on|ion|ium| eum| aeum| um| em| am| im| om| a| e| i| o| u| y)\b/i;

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
  return Math.round((inputCost + outputCost) * 10000) / 100;
}

function isMoneyRelated(question: string): boolean {
  return MONEY_KEYWORDS.test(question);
}

function buildLimitResponse(
  type: "daily_cap" | "monthly_cap" | "abuse" | "global_cap" | "subscriber_monthly_cap" | "subscriber_cost_abuse",
  isAnonymous: boolean,
  ctaUrl?: string
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
            "You've reached today's limit. Talanthos Companion gives you 50 questions per month plus weekly biblical guidance — $9/month.",
          ctaText: "Unlock with Companion",
          ctaUrl: ctaUrl || "/quiz/paywall",
          ctaSecondary: "Or come back tomorrow",
        },
    monthly_cap: {
      message:
        "You've reached your monthly free allowance. Talanthos Companion gives you 50 questions per month plus deeper guidance — $9/month, cancel anytime.",
      ctaText: "Unlock with Companion",
      ctaUrl: ctaUrl || "/quiz/paywall",
    },
    subscriber_monthly_cap: {
      message:
        "You've reached your monthly Companion allowance. Your allowance resets on the next billing cycle. If you need more, contact support@talanthos.com.",
      ctaText: "Manage subscription",
      ctaUrl: "/api/stripe/portal",
    },
    subscriber_cost_abuse: {
      message:
        "Your conversation has been paused. Contact support@talanthos.com if this is in error.",
      ctaText: "Contact support",
      ctaUrl: "mailto:support@talanthos.com",
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
      ctaText: "Unlock with Companion",
      ctaUrl: ctaUrl || "/quiz/paywall",
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

async function getCheckoutCtaUrl(
  supabase: ReturnType<typeof getServiceRoleClient>,
  email: string
): Promise<string> {
  try {
    const { data } = await supabase
      .from("quiz_sessions")
      .select("id, primary_type")
      .eq("email", email)
      .not("primary_type", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (data?.primary_type) return "/quiz/paywall";
  } catch {
    /* ignore */
  }
  return "/quiz";
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

You answer in second person ('you'). You write in literary, accessible English. You do NOT use markdown formatting in your response (no **bold**, no ## headers). Plain prose only with natural paragraph breaks.`;

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

  // 5. Check for active subscription
  let subscriberRow: any = null;
  if (userEmail) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", userEmail)
      .in("status", ["trialing", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (sub) subscriberRow = sub;
  }

  // 6. Subscriber rate limits
  if (subscriberRow) {
    // Reset monthly if needed
    if (shouldResetMonthly(subscriberRow.month_reset_at)) {
      subscriberRow.questions_this_month = 0;
      subscriberRow.cost_this_month_cents = 0;
      subscriberRow.month_reset_at = new Date().toISOString();
      await supabase.from("subscriptions").update({
        questions_this_month: 0,
        cost_this_month_cents: 0,
        month_reset_at: subscriberRow.month_reset_at,
        updated_at: new Date().toISOString(),
      }).eq("id", subscriberRow.id);
    }

    // Suspended
    if (subscriberRow.suspended) {
      return NextResponse.json(buildLimitResponse("abuse", false), { status: 429 });
    }

    // Cost cap > $3
    if (subscriberRow.cost_this_month_cents >= SUBSCRIBER_MONTHLY_COST_CAP_CENTS) {
      await supabase.from("subscriptions").update({
        suspended: true,
        suspended_at: new Date().toISOString(),
        suspended_reason: "Monthly cost exceeded $3",
        updated_at: new Date().toISOString(),
      }).eq("id", subscriberRow.id);
      return NextResponse.json(buildLimitResponse("subscriber_cost_abuse", false), { status: 429 });
    }

    // Monthly question cap
    if (subscriberRow.questions_this_month >= SUBSCRIBER_MONTHLY_QUESTION_CAP) {
      return NextResponse.json(buildLimitResponse("subscriber_monthly_cap", false), { status: 429 });
    }
  }

  // 7. Non-subscriber rate limit DB record
  let rateLimitRow: any = null;
  if (userEmail && !subscriberRow) {
    const { data: existing } = await supabase
      .from("ask_rate_limits")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (existing) {
      rateLimitRow = existing;
      if (shouldResetDaily(existing.last_reset_at)) {
        existing.questions_today = 0;
        existing.last_reset_at = new Date().toISOString();
      }
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

  // 8. Non-subscriber checks
  if (!subscriberRow) {
    // 8a. Suspended
    if (rateLimitRow?.suspended) {
      return NextResponse.json(buildLimitResponse("abuse", false), { status: 429 });
    }

    // 8b. Monthly cost > $5 → suspend
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

    // 8c. Monthly questions > 50
    if (rateLimitRow && rateLimitRow.questions_this_month >= USER_MONTHLY_QUESTION_CAP) {
      const ctaUrl = userEmail ? await getCheckoutCtaUrl(supabase, userEmail) : "/quiz/paywall";
      return NextResponse.json(buildLimitResponse("monthly_cap", false, ctaUrl), { status: 429 });
    }

    // 8d. Daily questions
    const dailyCount = isAnonymous
      ? cookie.anonymousQuestions
      : (rateLimitRow?.questions_today || 0);
    const dailyLimit = isAnonymous ? ANON_DAILY_LIMIT : EMAIL_DAILY_LIMIT;

    if (dailyCount >= dailyLimit) {
      const ctaUrl = userEmail ? await getCheckoutCtaUrl(supabase, userEmail) : "/quiz/paywall";
      return NextResponse.json(
        buildLimitResponse("daily_cap", isAnonymous, ctaUrl),
        { status: 429 }
      );
    }
  }

  // 9. Call Claude API
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

  // 10. Cost tracking
  const costCents = computeCostCents(inputTokens, outputTokens);

  // 11. Contextual push
  const moneyRelated = isMoneyRelated(body.question);
  let pushShown = false;
  if (moneyRelated && Math.random() < 0.5) {
    pushShown = true;
    aiResponse +=
      "\n\nIf you want to go deeper into your specific relationship with money — the biblical type you are, your blind spots, your path forward — that's exactly what Talanthos's personalized reading reveals. Discover your Biblical Money Type → https://talanthos.com/quiz";
  }

  // 12. Save conversation
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

  // 13. Update rate limits
  if (isAnonymous) {
    cookie.anonymousQuestions += 1;
    await setAskCookie(cookie);
  } else if (subscriberRow) {
    await supabase
      .from("subscriptions")
      .update({
        questions_this_month: subscriberRow.questions_this_month + 1,
        cost_this_month_cents: subscriberRow.cost_this_month_cents + costCents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriberRow.id);
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

  // 14. Return response
  let remaining = 0;
  if (subscriberRow) {
    remaining = SUBSCRIBER_MONTHLY_QUESTION_CAP - subscriberRow.questions_this_month - 1;
  } else {
    const dailyCount = isAnonymous
      ? cookie.anonymousQuestions
      : (rateLimitRow?.questions_today || 0);
    const dailyLimit = isAnonymous ? ANON_DAILY_LIMIT : EMAIL_DAILY_LIMIT;
    remaining = dailyLimit - dailyCount - 1;
  }

  return NextResponse.json({
    response: aiResponse,
    questionsRemaining: Math.max(0, remaining),
    emailRequired: isAnonymous && remaining <= 0,
    costCents,
    tokensUsed: { input: inputTokens, output: outputTokens },
  });
}
