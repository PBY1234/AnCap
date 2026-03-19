import {
  lawTemplates,
  ministryTemplates,
  agentTemplates,
  innovationTemplates,
  temptationDeck,
  headlines,
  moodNarratives,
  type AgentTemplate,
  type InnovationTemplate,
} from './content';

/* ═══ TYPES ════════════════════════════════════════════ */

export type Phase = 'Trustee' | 'Liquidator' | 'Architect' | 'Sovereign';

export interface Asset {
  id: string;
  label: string;
  baseValue: number;
  dividendYield: number;
  remainingShare: number;
}

export interface Region {
  id: string;
  label: string;
  openness: number;
}

export interface MinistryUnit {
  id: string;
  label: string;
  headcountImpact: number;
  cohesionCost: number;
  closed: boolean;
}

export interface LawEntry {
  id: string;
  label: string;
  pages: number;
  growthBoost: number;
  shredded: boolean;
}

export interface DoctrineMomentum {
  rothbard: number;
  bastos: number;
  prudence: number;
}

export interface ScenarioOption {
  id: 'A' | 'B';
  label: string;
}

export interface ScenarioEvent {
  id: string;
  title: string;
  summary: string;
  options: [ScenarioOption, ScenarioOption];
  severity?: 'minor' | 'major' | 'catastrophic';
  icon?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AgentInstance {
  id: string;
  name: string;
  role: string;
  icon: string;
  bio: string;
  active: boolean;
  arrivedTurn: number;
  reputation: number;
  currentProposal: string | null;
}

export interface InnovationInstance {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  adopted: boolean;
  adoptedTurn: number | null;
}

/* ═══ ACHIEVEMENT DEFINITIONS ══════════════════════════ */

export const achievementDefinitions: Achievement[] = [
  { id: 'first-blood', title: 'First Blood', icon: '🗡️', description: 'Close your first ministry', rarity: 'common' },
  { id: 'paper-tiger', title: 'Paper Tiger', icon: '📄', description: 'Shred your first law', rarity: 'common' },
  { id: 'debt-free', title: 'Debt Crusher', icon: '💥', description: 'Eliminate all sovereign debt', rarity: 'rare' },
  { id: 'gold-vault', title: 'Gold Standard', icon: '🏦', description: 'Lock 100+ tonnes of gold', rarity: 'rare' },
  { id: 'liberator', title: 'Liberator', icon: '🗽', description: 'Reach Liberty Index 65%', rarity: 'epic' },
  { id: 'charter-master', title: 'Charter Master', icon: '🏙️', description: 'Launch 4+ charter cities', rarity: 'epic' },
  { id: 'arbiter', title: 'Grand Arbiter', icon: '⚖️', description: 'Arbitration coverage 60%+', rarity: 'rare' },
  { id: 'tax-zero', title: 'Tax Slayer', icon: '🪓', description: 'Reduce tax rate to 0%', rarity: 'epic' },
  { id: 'pension-fortress', title: 'Pension Fortress', icon: '🏰', description: 'Pension coverage 120%+', rarity: 'epic' },
  { id: 'speedrun', title: 'Speedrunner', icon: '⚡', description: 'Win in under 15 turns', rarity: 'legendary' },
  { id: 'full-shred', title: 'Total Shredder', icon: '🔥', description: 'Shred every law in the book', rarity: 'rare' },
  { id: 'all-ministries', title: 'State Eraser', icon: '🧹', description: 'Close every ministry', rarity: 'epic' },
  { id: 'diplomat', title: 'Silver Tongue', icon: '🕊️', description: 'Use veto-lock with EU > 60%', rarity: 'common' },
  { id: 'doctrine-master', title: 'Ideologue', icon: '📖', description: 'Max any doctrine to 80+', rarity: 'rare' },
  { id: 'sovereign', title: 'Sovereign', icon: '👑', description: 'Achieve the Sovereign phase', rarity: 'legendary' },
  // New expanded achievements
  { id: 'food-savior', title: 'Food Savior', icon: '🌾', description: 'Food security above 90%', rarity: 'rare' },
  { id: 'energy-baron', title: 'Energy Baron', icon: '⚡', description: 'Energy stability above 90%', rarity: 'rare' },
  { id: 'innovation-engine', title: 'Innovation Engine', icon: '🚀', description: 'Adopt 8+ innovations', rarity: 'epic' },
  { id: 'network-builder', title: 'Network Builder', icon: '🕸️', description: 'Recruit 6+ agents', rarity: 'rare' },
  { id: 'inflation-tamer', title: 'Inflation Tamer', icon: '📉', description: 'Reduce inflation below 3%', rarity: 'epic' },
  { id: 'population-magnet', title: 'Population Magnet', icon: '🧲', description: 'Population above 49M', rarity: 'legendary' },
  { id: 'crisis-veteran', title: 'Crisis Veteran', icon: '🎖️', description: 'Survive 8+ crises', rarity: 'rare' },
  { id: 'corruption-slayer', title: 'Corruption Slayer', icon: '🗡️', description: 'Corruption below 10%', rarity: 'epic' },
  { id: 'military-trust', title: 'Military Trust', icon: '🎖️', description: 'Military loyalty 90%+', rarity: 'rare' },
  { id: 'utopia', title: 'Utopia', icon: '🌅', description: 'Food, energy, safety all > 85%', rarity: 'legendary' },
];

/* ═══ STATE ════════════════════════════════════════════ */

export interface SimulationState {
  initialDebt: number;
  debt: number;
  annualPensionBurden: number;
  trustValue: number;
  pensionCoverage: number;
  goldTonnes: number;
  goldLockedTonnes: number;
  annuityPool: number;
  cohesion: number;
  gdpGrowth: number;
  taxRate: number;
  euThreat: number;
  publicEmployees: number;
  assetMultiplier: number;
  turns: number;
  phase: Phase;
  debtConverted: boolean;
  vetoLock: boolean;
  libertyIndex: number;
  arbitrationCoverage: number;
  lawPagesRemaining: number;
  ministriesClosed: number;
  charterCities: number;
  doctrine: DoctrineMomentum;
  charterCityRegions: string[];
  wire: string;
  decayLog: string[];
  lastAction: string;
  assets: Asset[];
  regions: Region[];
  ministries: MinistryUnit[];
  lawBook: LawEntry[];
  eventsSeen: string[];
  currentEvent: ScenarioEvent | null;
  history: string[];
  score: number;
  achievements: string[];
  newAchievement: Achievement | null;
  // Expanded variables
  foodSecurity: number;
  energyStability: number;
  publicSafety: number;
  inflation: number;
  unemployment: number;
  emigrationRate: number;
  blackMarketSize: number;
  corruption: number;
  internationalReputation: number;
  militaryLoyalty: number;
  populationMillions: number;
  privateCurrencyAdoption: number;
  mutualAidNetworks: number;
  innovationsAdopted: string[];
  activeAgents: AgentInstance[];
  agentProposals: { agentId: string; innovationId: string }[];
  crisesSurvived: number;
  seasonIndex: number;
  turnsWithoutCrisis: number;
  lossReason: string | null;
  // Narrative / progression systems
  prologueDone: boolean;
  prologueStep: number;
  pressureMeter: number;
  interventionCount: number;
  publicMoodNarrative: string;
  currentTemptation: TemptationCard | null;
  temptationsSeen: string[];
  unlockedActionTier: number;
  headlineText: string;
  pressureWarningActive: boolean;
}

export type SimulationAction =
  | { type: 'run-command'; command: string }
  | { type: 'event-choice'; choice: 'A' | 'B' }
  | { type: 'adopt-doctrine'; doctrineId: string }
  | { type: 'close-ministry'; ministryId: string }
  | { type: 'shred-law'; lawId: string }
  | { type: 'charter-city'; regionId: string }
  | { type: 'expand-arbitration' }
  | { type: 'issue-gold-bond' }
  | { type: 'adopt-innovation'; innovationId: string }
  | { type: 'temptation-choice'; temptationId: string; accept: boolean }
  | { type: 'dismiss-temptation' }
  | { type: 'advance-prologue' };

export interface TemptationCard {
  id: string;
  title: string;
  source: string;           // who is offering
  sourceIcon: string;
  flavour: string;          // narrative hook
  offer: string;            // what you get
  poison: string;           // what it actually costs
  acceptLabel: string;
  refuseLabel: string;
  minPhase: string;
  requiredStat?: { key: string; below?: number; above?: number };
}

export interface PrologueCard {
  id: string;
  title: string;
  body: string;
  icon: string;
  stat?: string;
}

export interface SimulationBreakdown {
  goldValue: number;
  retainedAssetValue: number;
  annualDividendFlow: number;
  securedCapital: number;
  unlockedGoldTonnes: number;
  debtProgress: number;
  regulatoryPagesRemaining: number;
  libertyIndex: number;
  arbitrationCoverage: number;
}

/* ═══ CONSTANTS ════════════════════════════════════════ */

const GOLD_VALUE_PER_TONNE = 88_000_000;
const INITIAL_DEBT = 1_650_000_000_000;
const ANNUAL_PENSION_BURDEN = 158_000_000_000;
const HISTORY_LIMIT = 12;
const BILLION = 1_000_000_000;

/* ═══ BASE DATA ════════════════════════════════════════ */

const baseAssets: Asset[] = [
  { id: 'aena', label: 'AENA stake', baseValue: 22_000_000_000, dividendYield: 0.052, remainingShare: 1 },
  { id: 'sepi', label: 'SEPI industrial basket', baseValue: 38_000_000_000, dividendYield: 0.041, remainingShare: 1 },
  { id: 'real-estate', label: 'State real estate portfolio', baseValue: 132_000_000_000, dividendYield: 0.014, remainingShare: 1 },
  { id: 'adif-renfe', label: 'Adif / Renfe corridor package', baseValue: 41_000_000_000, dividendYield: 0.031, remainingShare: 1 },
  { id: 'concessions', label: 'Spectrum and concession rights', baseValue: 19_000_000_000, dividendYield: 0.057, remainingShare: 1 },
];

const baseRegions: Region[] = [
  { id: 'galicia', label: 'Galicia', openness: 28 },
  { id: 'madrid', label: 'Madrid', openness: 42 },
  { id: 'andalusia', label: 'Andalusia', openness: 24 },
  { id: 'catalonia', label: 'Catalonia', openness: 37 },
  { id: 'valencia', label: 'Valencia', openness: 31 },
  { id: 'basque', label: 'Basque Coast', openness: 40 },
  { id: 'aragon', label: 'Aragon', openness: 27 },
  { id: 'canaries', label: 'Canaries', openness: 34 },
];

const baseMinistries: MinistryUnit[] = ministryTemplates.map((entry) => ({ ...entry, closed: false }));
const baseLawBook: LawEntry[] = lawTemplates.map((entry) => ({ ...entry, shredded: false }));

/* ═══ EVENT DECK (24 events) ═══════════════════════════ */

const eventDeck: ScenarioEvent[] = [
  // Original events
  {
    id: 'ecb-target2',
    title: 'ECB Threat',
    summary: 'Frankfurt hints that TARGET2 access becomes negotiable the moment debt instruments stop behaving like orthodox sovereign paper.',
    options: [
      { id: 'A', label: 'Issue a gold-backed digital peso with explicit convertibility windows.' },
      { id: 'B', label: 'Threaten to default on ECB-linked obligations only.' },
    ],
  },
  {
    id: 'pension-march',
    title: 'Pensioner March in Madrid',
    summary: 'Retirees do not hate the math. They hate the feeling that the math can move without them.',
    options: [
      { id: 'A', label: 'Reserve seats for pensioners on the trust board.' },
      { id: 'B', label: 'Abolish VAT on food to raise purchasing power immediately.' },
    ],
  },
  {
    id: 'civil-service-walkout',
    title: 'Civil Service Walkout',
    summary: 'Mid-level ministries discovered that worker-owned transition sounds worse once translated into payroll uncertainty.',
    options: [
      { id: 'A', label: 'Tender ministry buyouts as voucherized co-ops.' },
      { id: 'B', label: 'Offer one-time severance funded from the annuity pool.' },
    ],
  },
  {
    id: 'regional-port-auction',
    title: 'Port Auction Bidding War',
    summary: 'Foreign capital wants the logistics spine. Regions want cash. Brussels wants leverage disguised as standards.',
    options: [
      { id: 'A', label: 'Split the port package into competing regional concessions.' },
      { id: 'B', label: 'Hold it back and use it as collateral in diplomacy.' },
    ],
  },
  // New crisis events
  {
    id: 'drought-famine',
    title: 'Andalusian Drought',
    summary: 'Three months without rain collapse the Guadalquivir basin. Irrigated agriculture drops 40%. Food prices spike overnight.',
    severity: 'catastrophic',
    icon: '🌵',
    options: [
      { id: 'A', label: 'Emergency import corridor: spend annuity reserves for food shipments.' },
      { id: 'B', label: 'Invoke agricultural cooperatives and ration via mutual aid networks.' },
    ],
  },
  {
    id: 'bank-run',
    title: 'Bank Run on Santander',
    summary: 'Depositors panic as transition uncertainty hits banking confidence. €40B in withdrawal requests queue overnight.',
    severity: 'major',
    icon: '🏃',
    options: [
      { id: 'A', label: 'Guarantee deposits with gold-backed certificates, locking more reserves.' },
      { id: 'B', label: 'Let the bank restructure — depositors become equity holders.' },
    ],
  },
  {
    id: 'military-coup',
    title: 'Garrison Revolt',
    summary: 'Officers in the Zaragoza and Córdoba garrisons declare the transition unconstitutional. Tanks idle at barracks gates.',
    severity: 'catastrophic',
    icon: '🪖',
    options: [
      { id: 'A', label: 'Negotiate: offer officers equity in privatized defense contracts.' },
      { id: 'B', label: 'Call their bluff: broadcast live footage and let citizens decide.' },
    ],
  },
  {
    id: 'brain-drain',
    title: 'Brain Drain Accelerates',
    summary: 'Top engineers, doctors, and entrepreneurs flee to Portugal and France. 180,000 workers left in 3 months.',
    severity: 'major',
    icon: '✈️',
    options: [
      { id: 'A', label: 'Announce zero income tax for returnees and new residents.' },
      { id: 'B', label: 'Launch charter city talent zones with guaranteed contract law.' },
    ],
  },
  {
    id: 'cyber-attack',
    title: 'Infrastructure Cyberattack',
    summary: 'A sophisticated state-level attack cripples electrical grid control systems in Catalonia. 8M without power.',
    severity: 'catastrophic',
    icon: '💻',
    options: [
      { id: 'A', label: 'Fast-track decentralized community energy grids as resilience.' },
      { id: 'B', label: 'Contract private cybersecurity firms with bounty-based pay.' },
    ],
  },
  {
    id: 'power-grid-failure',
    title: 'Grid Cascade Failure',
    summary: 'Aging infrastructure without state maintenance triggers a 72-hour blackout across central Spain.',
    severity: 'major',
    icon: '🔌',
    options: [
      { id: 'A', label: 'Issue emergency energy bonds to crowdfund grid repair.' },
      { id: 'B', label: 'Accelerate solar microgrid deployment in charter cities.' },
    ],
  },
  {
    id: 'media-campaign',
    title: 'International Media Blitz',
    summary: 'CNN, BBC, and Le Monde run coordinated coverage framing Spain as a "failed state experiment." Investment sentiment plummets.',
    severity: 'major',
    icon: '📺',
    options: [
      { id: 'A', label: 'Host international press tour of charter cities and innovations.' },
      { id: 'B', label: 'Ignore media, double down on GDP. Let results speak.' },
    ],
  },
  {
    id: 'china-bri',
    title: 'Chinese Belt & Road Offer',
    summary: 'Beijing offers €50B in infrastructure investment for 30-year port concessions and 5G network control.',
    severity: 'major',
    icon: '🇨🇳',
    options: [
      { id: 'A', label: 'Accept limited port investment with sunset clauses and open audit.' },
      { id: 'B', label: 'Reject entirely and auction infrastructure to competing private firms.' },
    ],
  },
  {
    id: 'inflation-spike',
    title: 'Inflationary Spiral',
    summary: 'Supply chain disruption and currency uncertainty push consumer prices up 18% in one quarter.',
    severity: 'major',
    icon: '📈',
    options: [
      { id: 'A', label: 'Expand gold-backed currency adoption to anchor price expectations.' },
      { id: 'B', label: 'Deregulate imports completely and flood markets with competing goods.' },
    ],
  },
  {
    id: 'nato-pressure',
    title: 'NATO Article Concerns',
    summary: "The Alliance questions Spain's defense commitments. Withdrawal from command structure is threatened.",
    severity: 'major',
    icon: '🛡️',
    options: [
      { id: 'A', label: 'Propose private defense contractors meeting NATO standards independently.' },
      { id: 'B', label: 'Offer base access guarantees in exchange for non-interference.' },
    ],
  },
  {
    id: 'french-border',
    title: 'French Border Friction',
    summary: 'Paris closes Pyrenean crossings citing "regulatory divergence." Trade with Europe drops 30%.',
    severity: 'major',
    icon: '🇫🇷',
    options: [
      { id: 'A', label: 'Redirect trade through Atlantic ports and North African corridors.' },
      { id: 'B', label: 'Negotiate bilateral free trade agreement outside EU framework.' },
    ],
  },
  {
    id: 'capital-flight',
    title: 'Capital Flight',
    summary: 'Wealthy families and corporate HQs relocate €120B in assets to Luxembourg and Singapore.',
    severity: 'major',
    icon: '💸',
    options: [
      { id: 'A', label: 'Announce zero capital gains tax and blockchain property rights.' },
      { id: 'B', label: 'Let them leave — new entrants arrive when deregulation works.' },
    ],
  },
  {
    id: 'food-riot',
    title: 'Food Riots in Barcelona',
    summary: 'Supermarket shelves empty in working-class neighborhoods. Windows break. 50,000 march.',
    severity: 'catastrophic',
    icon: '🔥',
    options: [
      { id: 'A', label: 'Deploy mutual aid networks with emergency food distribution.' },
      { id: 'B', label: 'Open military food reserves and fast-track agricultural deregulation.' },
    ],
  },
  {
    id: 'pandemic',
    title: 'Respiratory Pandemic',
    summary: 'A novel pathogen overwhelms private clinics. 15,000 hospitalizations in two weeks. Trust in transition wavers.',
    severity: 'catastrophic',
    icon: '🦠',
    options: [
      { id: 'A', label: 'Health cooperatives coordinate triage; crowdfund emergency hospital.' },
      { id: 'B', label: 'Contract foreign private hospitals for overflow capacity.' },
    ],
  },
  {
    id: 'constitutional-challenge',
    title: 'Constitutional Court Ruling',
    summary: 'Surviving judges declare the liquidation "unconstitutional." Protests erupt on both sides.',
    severity: 'major',
    icon: '⚖️',
    options: [
      { id: 'A', label: 'Abolish the court and replace it with elected arbitration panels.' },
      { id: 'B', label: 'Negotiate: incorporate transition into a new constitutional framework.' },
    ],
  },
  {
    id: 'catalonia-push',
    title: 'Catalonia Independence Push',
    summary: 'Barcelona declares full sovereignty, citing the transition as precedent. The Mossos seal borders.',
    severity: 'catastrophic',
    icon: '🏴',
    options: [
      { id: 'A', label: 'Embrace it: offer charter-city framework with interoperability.' },
      { id: 'B', label: 'Negotiate: grant enhanced autonomy within the trust framework.' },
    ],
  },
  {
    id: 'russian-ops',
    title: 'Russian Intelligence Operations',
    summary: 'FSB-linked actors fund both radical and reactionary groups to destabilize the transition.',
    severity: 'major',
    icon: '🕵️',
    options: [
      { id: 'A', label: 'Hire private counter-intelligence and publish all findings.' },
      { id: 'B', label: 'Strengthen community surveillance through mutual aid networks.' },
    ],
  },
  {
    id: 'imf-rescue',
    title: 'IMF Rescue Package',
    summary: 'The IMF offers €200B structural adjustment requiring re-establishment of tax authority and pension centralization.',
    severity: 'major',
    icon: '🏛️',
    options: [
      { id: 'A', label: 'Reject outright — the transition is non-negotiable.' },
      { id: 'B', label: 'Accept partial terms: take liquidity, block the tax mandates.' },
    ],
  },
  {
    id: 'water-crisis',
    title: 'Water Infrastructure Collapse',
    summary: "Valencia's aging water treatment plants fail. 1.5M without clean water for a week.",
    severity: 'catastrophic',
    icon: '💧',
    options: [
      { id: 'A', label: 'Crowdfund emergency desalination via community bonds.' },
      { id: 'B', label: 'Fast-track private water utility contracts with quality guarantees.' },
    ],
  },
  {
    id: 'basque-separatism',
    title: 'Basque Autonomy Demand',
    summary: 'The Basque Country demands full fiscal control and separate trust arrangement. Lenders watch nervously.',
    severity: 'major',
    icon: '🗳️',
    options: [
      { id: 'A', label: 'Grant it: each region becomes a competing governance franchise.' },
      { id: 'B', label: 'Counter-offer: enhanced charter-city framework with shared defense.' },
    ],
  },
];

/* ═══ HELPERS ══════════════════════════════════════════ */

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const roundTo = (value: number, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

// Seeded-ish deterministic random based on turn+seed
const pseudoRandom = (turn: number, seed: number): number => {
  const x = Math.sin(turn * 9301 + seed * 49297) * 49297;
  return x - Math.floor(x);
};

const computePhase = (state: SimulationState, coverage: number): Phase => {
  if (state.debt === 0 && state.taxRate === 0 && coverage >= 100 && state.libertyIndex >= 85) {
    return 'Sovereign';
  }
  if (state.debt === 0 || (state.debtConverted && coverage >= 85) || state.taxRate <= 8 || state.libertyIndex >= 65) {
    return 'Architect';
  }
  if (state.debtConverted || state.turns >= 2) {
    return 'Liquidator';
  }
  return 'Trustee';
};

const deriveWire = (state: SimulationState): string => {
  if (state.euThreat <= 20) return 'Brussels is irritated, procedural, and buying time. They suspect your legal mesh is becoming exportable.';
  if (state.euThreat <= 45) return 'Formal warning stage. Committees are writing stern adjectives while funds benchmark your charter cities.';
  if (state.euThreat <= 70) return 'Escalation stage. Sanctions are discussed in passive voice, which means they are being drafted in active voice.';
  return 'Acute threat stage. Brussels reads your transition as contagion and is mapping intervention levers.';
};

const getNextEvent = (state: SimulationState) =>
  eventDeck.find((event) => !state.eventsSeen.includes(event.id)) ?? null;

const withHistory = (state: SimulationState, entry: string) => ({
  ...state,
  history: [entry, ...state.history].slice(0, HISTORY_LIMIT),
});

const nudgeRegions = (regions: Region[], amount: number) =>
  regions.map((region, index) => ({
    ...region,
    openness: clamp(region.openness + amount + (index % 2 === 0 ? 1 : 0), 0, 100),
  }));

/* ═══ DERIVED COMPUTATIONS ═════════════════════════════ */

const refreshDerived = (state: SimulationState): SimulationState => {
  const retainedAssetValue =
    state.assets.reduce((sum, asset) => sum + asset.baseValue * asset.remainingShare, 0) *
    state.assetMultiplier;
  const goldValue = state.goldTonnes * GOLD_VALUE_PER_TONNE;
  const annualDividendFlow =
    state.assets.reduce(
      (sum, asset) => sum + asset.baseValue * asset.remainingShare * asset.dividendYield,
      0,
    ) * state.assetMultiplier;
  const securedCapital =
    state.annuityPool +
    annualDividendFlow * 6 +
    state.goldLockedTonnes * GOLD_VALUE_PER_TONNE * 0.65;
  const pensionCoverage = clamp((securedCapital / state.annualPensionBurden) * 100, 0, 180);
  const lawPagesRemaining = state.lawBook.reduce(
    (sum, law) => sum + (law.shredded ? 0 : law.pages),
    0,
  );
  const doctrinePower =
    (state.doctrine.rothbard + state.doctrine.bastos + state.doctrine.prudence) / 3;

  // Liberty index now also affected by new variables
  const stabilityBonus =
    (state.foodSecurity > 70 ? 3 : 0) +
    (state.energyStability > 70 ? 2 : 0) +
    (state.publicSafety > 60 ? 3 : 0) +
    (state.corruption < 30 ? 4 : 0) +
    state.innovationsAdopted.length * 1.5;

  const libertyIndex = clamp(
    12 +
      state.arbitrationCoverage * 0.28 +
      state.ministriesClosed * 7 +
      state.charterCities * 5 +
      (100 - state.taxRate) * 0.34 +
      doctrinePower * 0.22 -
      state.euThreat * 0.12 +
      stabilityBonus -
      (state.inflation > 15 ? 5 : 0) -
      (state.unemployment > 20 ? 4 : 0),
    0,
    100,
  );

  const phase = computePhase({ ...state, libertyIndex }, pensionCoverage);

  // Cohesion is now influenced by vitals
  const vitalsPressure =
    (state.foodSecurity < 40 ? -3 : 0) +
    (state.energyStability < 35 ? -2 : 0) +
    (state.publicSafety < 30 ? -4 : 0) +
    (state.inflation > 20 ? -3 : 0) +
    (state.unemployment > 25 ? -3 : 0) +
    (state.mutualAidNetworks > 0 ? 2 : 0);

  return {
    ...state,
    trustValue: retainedAssetValue + goldValue + state.annuityPool,
    pensionCoverage: roundTo(pensionCoverage),
    lawPagesRemaining,
    libertyIndex: roundTo(libertyIndex),
    phase,
    wire: deriveWire(state),
    cohesion: clamp(state.cohesion + vitalsPressure * 0.3, 0, 100),
  };
};

/* ═══ AGENT SPAWNING ═══════════════════════════════════ */

const trySpawnAgents = (state: SimulationState): SimulationState => {
  const alreadyActive = state.activeAgents.map((a) => a.id);
  const eligible = agentTemplates.filter(
    (t) => !alreadyActive.includes(t.id) && state.turns >= t.minTurn,
  );

  if (eligible.length === 0) return state;

  // Spawn probability: 35% per turn per eligible agent, max 1 per turn
  const roll = pseudoRandom(state.turns, 7919);
  if (roll > 0.35) return state;

  const idx = Math.floor(pseudoRandom(state.turns, 1301) * eligible.length);
  const template = eligible[idx];

  // Pick an innovation they can propose (not already adopted)
  const availableInnovations = template.innovationIds.filter(
    (iid) => !state.innovationsAdopted.includes(iid),
  );
  const proposal =
    availableInnovations.length > 0
      ? availableInnovations[
          Math.floor(pseudoRandom(state.turns, 4217) * availableInnovations.length)
        ]
      : null;

  const agent: AgentInstance = {
    id: template.id,
    name: template.name,
    role: template.role,
    icon: template.icon,
    bio: template.bio,
    active: true,
    arrivedTurn: state.turns,
    reputation: 50,
    currentProposal: proposal,
  };

  const newProposals = proposal
    ? [...state.agentProposals, { agentId: template.id, innovationId: proposal }]
    : state.agentProposals;

  return withHistory(
    {
      ...state,
      activeAgents: [...state.activeAgents, agent],
      agentProposals: newProposals,
    },
    `${template.icon} ${template.name} (${template.role}) has arrived and joined the transition.`,
  );
};

// Agents leave if conditions are very bad
const checkAgentDepartures = (state: SimulationState): SimulationState => {
  if (state.activeAgents.length === 0) return state;

  const leaveThreshold =
    state.cohesion < 25 || state.publicSafety < 20 || state.foodSecurity < 25;
  if (!leaveThreshold) return state;

  const roll = pseudoRandom(state.turns, 6173);
  if (roll > 0.25) return state;

  // One random agent leaves
  const idx = Math.floor(roll * state.activeAgents.length);
  const leaving = state.activeAgents[idx];
  if (!leaving) return state;

  return withHistory(
    {
      ...state,
      activeAgents: state.activeAgents.filter((a) => a.id !== leaving.id),
      agentProposals: state.agentProposals.filter((p) => p.agentId !== leaving.id),
    },
    `${leaving.icon} ${leaving.name} has departed due to deteriorating conditions.`,
  );
};

/* ═══ TURN ADVANCE (HARDER) ════════════════════════════ */

const advanceTurn = (state: SimulationState): SimulationState => {
  const t = state.turns + 1;
  const season = t % 4; // 0=spring, 1=summer, 2=autumn, 3=winter
  const r1 = pseudoRandom(t, 3571);
  const r2 = pseudoRandom(t, 8093);
  const r3 = pseudoRandom(t, 2657);

  // Interest on debt
  const interestRate = state.debt === 0 ? 0 : 0.006 + state.euThreat / 8000 + (state.inflation * 0.0002);
  const interestShock = state.debt * interestRate;

  // Seasonal effects
  const winterFoodDrain = season === 3 ? 4 : 0;
  const summerEnergyDrain = season === 1 ? 3 : 0;
  const hasAgriCoops = state.innovationsAdopted.includes('agri-coops');
  const hasEnergyGrid = state.innovationsAdopted.includes('energy-grid');
  const hasMutualAid = state.innovationsAdopted.includes('mutual-aid');
  const hasSecurity = state.innovationsAdopted.includes('voluntary-security');
  const hasPrivateCurrency = state.innovationsAdopted.includes('private-currency');

  // Food security drains without agricultural innovations
  const foodDelta =
    -2 -
    winterFoodDrain +
    (hasAgriCoops ? 4 : 0) +
    (state.innovationsAdopted.includes('food-markets') ? 3 : 0) +
    (hasMutualAid ? 1 : 0) +
    (state.gdpGrowth > 5 ? 2 : 0);

  // Energy stability drains without grid innovations
  const energyDelta =
    -1.5 -
    summerEnergyDrain +
    (hasEnergyGrid ? 5 : 0) +
    (state.charterCities > 2 ? 1 : 0);

  // Public safety degrades during transition
  const safetyDelta =
    -1.5 +
    (hasSecurity ? 4 : 0) +
    (state.innovationsAdopted.includes('private-fire') ? 2 : 0) +
    (state.arbitrationCoverage > 50 ? 1 : 0) +
    (hasMutualAid ? 1 : 0) -
    (state.unemployment > 20 ? 2 : 0);

  // Inflation rises from instability, drops from innovations
  const inflationDelta =
    0.8 +
    (state.debt > 0 ? 0.5 : 0) +
    (r1 > 0.7 ? 1.5 : 0) -
    (hasPrivateCurrency ? 2 : 0) -
    (state.innovationsAdopted.includes('clearing-house') ? 1 : 0) -
    (state.debtConverted ? 0.5 : 0) -
    (state.innovationsAdopted.includes('food-markets') ? 0.5 : 0);

  // Unemployment rises from ministry closures, drops from innovation
  const unemploymentDelta =
    0.4 +
    (state.ministriesClosed > 0 ? 0.8 : 0) -
    state.innovationsAdopted.length * 0.25 -
    (state.gdpGrowth > 3 ? 0.6 : 0) -
    state.charterCities * 0.15;

  // Emigration based on quality of life
  const emigrationPressure =
    (state.foodSecurity < 50 ? 0.5 : 0) +
    (state.publicSafety < 40 ? 0.4 : 0) +
    (state.inflation > 15 ? 0.3 : 0) +
    (state.unemployment > 20 ? 0.4 : 0) -
    (state.gdpGrowth > 5 ? 0.5 : 0) -
    (state.innovationsAdopted.length > 5 ? 0.3 : 0);

  // Black market grows with remaining regulation
  const bmDelta =
    (state.lawPagesRemaining > 15000 ? 1.5 : 0.3) -
    (state.arbitrationCoverage > 40 ? 1 : 0) -
    (hasSecurity ? 0.5 : 0);

  // Corruption slowly drops from reforms but rises from black market
  const corruptionDelta =
    -state.ministriesClosed * 0.3 -
    state.charterCities * 0.2 -
    state.innovationsAdopted.length * 0.15 -
    (state.innovationsAdopted.includes('title-blockchain') ? 2 : 0) -
    (state.innovationsAdopted.includes('dao-governance') ? 2 : 0) +
    state.blackMarketSize * 0.03;

  // Military loyalty
  const milDelta =
    -0.8 +
    (state.publicSafety > 60 ? 1 : 0) +
    (state.cohesion > 60 ? 0.5 : 0) -
    (state.foodSecurity < 35 ? 2 : 0) -
    (state.euThreat > 70 ? 1 : 0);

  // International reputation
  const repDelta =
    (state.gdpGrowth > 4 ? 1.5 : 0) +
    state.charterCities * 0.3 +
    (state.innovationsAdopted.includes('fdi-corridor') ? 2 : 0) -
    (state.cohesion < 40 ? 2 : 0) -
    (state.foodSecurity < 40 ? 1.5 : 0) -
    (state.inflation > 20 ? 1 : 0);

  // Population change from emigration
  const popDelta = -state.emigrationRate * 0.02;

  let next: SimulationState = {
    ...state,
    turns: t,
    seasonIndex: season,
    debt: state.debt + interestShock,
    gdpGrowth: clamp(
      state.gdpGrowth +
        (state.assetMultiplier - 1) * 0.35 +
        state.arbitrationCoverage * 0.004 +
        state.charterCities * 0.06 -
        (state.euThreat > 72 ? 0.6 : 0) -
        (state.inflation > 15 ? 0.4 : 0) -
        (state.foodSecurity < 40 ? 0.5 : 0),
      -8,
      16,
    ),
    cohesion: clamp(
      state.cohesion +
        (state.gdpGrowth >= 5 ? 1.5 : 0) +
        (state.pensionCoverage >= 100 ? 1 : 0) -
        (interestShock > 0 ? 1.2 : 0) -
        (state.euThreat > 80 ? 2 : 0) -
        (state.foodSecurity < 40 ? 2 : 0) -
        (state.unemployment > 22 ? 1.5 : 0) -
        (state.inflation > 18 ? 1.5 : 0) +
        (hasMutualAid ? 1 : 0),
      0,
      100,
    ),
    taxRate: clamp(
      state.taxRate -
        (state.debtConverted ? 1.8 : 0.3) -
        state.ministriesClosed * 0.04,
      0,
      40,
    ),
    foodSecurity: clamp(state.foodSecurity + foodDelta, 0, 100),
    energyStability: clamp(state.energyStability + energyDelta, 0, 100),
    publicSafety: clamp(state.publicSafety + safetyDelta, 0, 100),
    inflation: clamp(state.inflation + inflationDelta, 0, 50),
    unemployment: clamp(state.unemployment + unemploymentDelta, 0, 40),
    emigrationRate: clamp(state.emigrationRate + emigrationPressure * 0.3, 0, 20),
    blackMarketSize: clamp(state.blackMarketSize + bmDelta, 0, 100),
    corruption: clamp(state.corruption + corruptionDelta, 0, 100),
    internationalReputation: clamp(state.internationalReputation + repDelta, 0, 100),
    militaryLoyalty: clamp(state.militaryLoyalty + milDelta, 0, 100),
    populationMillions: clamp(state.populationMillions + popDelta, 20, 60),
    turnsWithoutCrisis: state.currentEvent ? 0 : state.turnsWithoutCrisis + 1,
  };

  // Private currency adoption growth
  if (hasPrivateCurrency) {
    next.privateCurrencyAdoption = clamp(next.privateCurrencyAdoption + 3 + r2 * 2, 0, 100);
  }

  // Check loss conditions
  if (next.militaryLoyalty <= 0) {
    next.lossReason = 'Military coup: the armed forces seized control of the transition.';
    next.cohesion = 0;
  }
  if (next.foodSecurity <= 0) {
    next.lossReason = 'Famine: food systems collapsed and the population revolted.';
    next.cohesion = 0;
  }
  if (next.publicSafety <= 0) {
    next.lossReason = 'Anarchy: public safety collapsed into chaos.';
    next.cohesion = 0;
  }
  if (next.inflation >= 50) {
    next.lossReason = 'Hyperinflation: the currency collapsed and trust evaporated.';
    next.cohesion = 0;
  }
  if (next.populationMillions < 30) {
    next.lossReason = 'Mass exodus: Spain depopulated below viable threshold.';
    next.cohesion = 0;
  }

  // Crisis probability increases over time
  const crisisProbability = 0.12 + next.turnsWithoutCrisis * 0.08 + (next.euThreat > 60 ? 0.1 : 0);
  if (!next.currentEvent && r3 < crisisProbability) {
    const nextEvent = getNextEvent(next);
    if (nextEvent) {
      next = {
        ...next,
        currentEvent: nextEvent,
        eventsSeen: [...next.eventsSeen, nextEvent.id],
        turnsWithoutCrisis: 0,
      };
    }
  }

  // Agent spawning and departures
  next = trySpawnAgents(next);
  next = checkAgentDepartures(next);

  // Temptation spawning
  next = trySpawnTemptation(next);

  // Pressure meter and mood
  next = updatePressureAndMood(next);

  return refreshDerived(next);
};

/* ═══ FIND HELPERS ═════════════════════════════════════ */

const findAsset = (assets: Asset[], query?: string) => {
  if (!query) return assets.find((a) => a.remainingShare > 0.05) ?? assets[0];
  const n = query.trim().toLowerCase();
  return assets.find((a) => a.id.includes(n) || a.label.toLowerCase().includes(n)) ?? assets.find((a) => a.remainingShare > 0.05) ?? assets[0];
};

const findRegion = (regions: Region[], query?: string) => {
  if (!query) return regions.reduce((s, c) => (c.openness < s.openness ? c : s), regions[0]);
  const n = query.trim().toLowerCase();
  return regions.find((r) => r.id.includes(n) || r.label.toLowerCase().includes(n)) ?? regions[0];
};

const findMinistry = (ministries: MinistryUnit[], query?: string) => {
  const open = ministries.filter((e) => !e.closed);
  if (!open.length) return null;
  if (!query) return open[0];
  const n = query.trim().toLowerCase();
  return open.find((e) => e.id.includes(n) || e.label.toLowerCase().includes(n)) ?? open[0];
};

const findLaw = (lawBook: LawEntry[], query?: string) => {
  const active = lawBook.filter((e) => !e.shredded);
  if (!active.length) return null;
  if (!query) return active[0];
  const n = query.trim().toLowerCase();
  return active.find((e) => e.id.includes(n) || e.label.toLowerCase().includes(n)) ?? active[0];
};

/* ═══ COMMAND HANDLERS ═════════════════════════════════ */

const applyStatus = (state: SimulationState) =>
  withHistory(refreshDerived(state), 'Dashboard refreshed. The debt-clock is still louder than podium speeches.');

const applySwapDebt = (state: SimulationState) => {
  if (state.debtConverted)
    return withHistory(refreshDerived(state), 'Debt already converted. The shock has passed.');

  let s: SimulationState = {
    ...state,
    debt: 0,
    debtConverted: true,
    assetMultiplier: state.assetMultiplier + 0.08,
    cohesion: clamp(state.cohesion - 9, 0, 100),
    euThreat: clamp(state.euThreat + 18, 0, 100),
    annuityPool: state.annuityPool + 18 * BILLION,
    inflation: clamp(state.inflation + 3, 0, 50),
    internationalReputation: clamp(state.internationalReputation - 5, 0, 100),
    militaryLoyalty: clamp(state.militaryLoyalty - 4, 0, 100),
    doctrine: { ...state.doctrine, bastos: clamp(state.doctrine.bastos + 5, 0, 100) },
    lastAction: 'The equity swap fired. Bondholders now hold trust paper instead of sovereign promises.',
    decayLog: [
      'The debt ministry has been demoted from priesthood to transfer desk.',
      'Bond lawyers discovered equity has moods, unlike coupons.',
      'The old state still exists on paper, which is exactly where its leverage now lives.',
    ],
  };
  s = withHistory(s, 'Equity swap executed. Debt nominal zero; political temperature rose sharply.');
  return advanceTurn(s);
};

const applyLiquidation = (state: SimulationState, query?: string, percent = 10) => {
  const asset = findAsset(state.assets, query);
  const requestedShare = clamp(percent / 100, 0.05, 0.4);
  const saleShare = Math.min(asset.remainingShare, requestedShare);
  if (saleShare <= 0)
    return withHistory(state, `${asset.label} has already been sold down.`);

  const proceeds = asset.baseValue * saleShare * (0.9 + state.assetMultiplier * 0.08);
  const nextAssets = state.assets.map((c) =>
    c.id === asset.id ? { ...c, remainingShare: roundTo(c.remainingShare - saleShare, 3) } : c,
  );

  let s: SimulationState = {
    ...state,
    assets: nextAssets,
    annuityPool: state.annuityPool + proceeds * 0.84,
    cohesion: clamp(state.cohesion + (saleShare <= 0.1 ? 1 : -2), 0, 100),
    euThreat: clamp(state.euThreat + 3, 0, 100),
    regions: nudgeRegions(state.regions, 3),
    internationalReputation: clamp(state.internationalReputation + 2, 0, 100),
    doctrine: { ...state.doctrine, prudence: clamp(state.doctrine.prudence + 2, 0, 100) },
    lastAction: `${asset.label} sold down by ${Math.round(saleShare * 100)}%.`,
    decayLog: [
      `${asset.label} stopped pretending to be a sacred relic of sovereignty.`,
      'Three consultants fainted learning auction pricing is not a public ceremony.',
      'The pension vault grew heavier while the ministry building grew less important.',
    ],
  };
  s = withHistory(s, `${asset.label} auctioned. Proceeds reinforced pension collateral.`);
  return advanceTurn(s);
};

const applyPrivatization = (state: SimulationState, department?: string) => {
  const target = department?.trim() || 'Administrative Services';
  let s: SimulationState = {
    ...state,
    publicEmployees: Math.max(0, state.publicEmployees - 140_000),
    taxRate: clamp(state.taxRate - 4.4, 0, 40),
    gdpGrowth: clamp(state.gdpGrowth + 1.0, -8, 16),
    cohesion: clamp(state.cohesion - 3 + (state.pensionCoverage >= 80 ? 2 : 0), 0, 100),
    assetMultiplier: state.assetMultiplier + 0.04,
    unemployment: clamp(state.unemployment + 2, 0, 40),
    regions: nudgeRegions(state.regions, 4),
    doctrine: { ...state.doctrine, bastos: clamp(state.doctrine.bastos + 4, 0, 100) },
    lastAction: `${target} moved into cooperative exit lane.`,
    decayLog: [
      `${target} discovered the private sector, which is to say accountability with invoices.`,
      'Middle management is learning memos are not productive assets.',
      'The payroll burden shrank, and with it a corner of compliance religion.',
    ],
  };
  s = withHistory(s, `${target} privatized. Payroll fell but unemployment temporarily rose.`);
  return advanceTurn(s);
};

const applyVetoLock = (state: SimulationState) => {
  let s: SimulationState = {
    ...state,
    vetoLock: true,
    euThreat: clamp(state.euThreat - 16, 0, 100),
    cohesion: clamp(state.cohesion + 3, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.03,
    internationalReputation: clamp(state.internationalReputation + 4, 0, 100),
    doctrine: { ...state.doctrine, prudence: clamp(state.doctrine.prudence + 3, 0, 100) },
    lastAction: 'Veto-lock engaged. Diplomacy bought breathing room.',
    decayLog: [
      'The foreign ministry briefly became useful — should not be treated as precedent.',
      'Brussels received legal objections thick enough to qualify as architecture.',
      'Time was purchased, not peace. In insolvency that still counts as profit.',
    ],
  };
  s = withHistory(s, 'Veto-lock engaged. External pressure eased temporarily.');
  return advanceTurn(s);
};

const applyDeregulation = (state: SimulationState, sector?: string) => {
  const target = sector?.trim() || 'General Commerce';
  let s: SimulationState = {
    ...state,
    gdpGrowth: clamp(state.gdpGrowth + 1.5, -8, 16),
    cohesion: clamp(state.cohesion + 2, 0, 100),
    taxRate: clamp(state.taxRate - 2.5, 0, 40),
    assetMultiplier: state.assetMultiplier + 0.06,
    unemployment: clamp(state.unemployment - 0.5, 0, 40),
    blackMarketSize: clamp(state.blackMarketSize - 3, 0, 100),
    regions: nudgeRegions(state.regions, 5),
    doctrine: { ...state.doctrine, rothbard: clamp(state.doctrine.rothbard + 3, 0, 100) },
    lastAction: `${target} deregulated. Compliance tax caught fire.`,
    decayLog: [
      `${target} no longer requires permission slips from people who do not build.`,
      'Startup formation accelerated the moment filing cabinets lost protection.',
      'The trust got richer because the economy remembered how to move.',
    ],
  };
  s = withHistory(s, `${target} deregulated. Growth and asset multiples stepped higher.`);
  return advanceTurn(s);
};

const applyArbitrationExpand = (state: SimulationState) => {
  let s: SimulationState = {
    ...state,
    arbitrationCoverage: clamp(state.arbitrationCoverage + 10, 0, 100),
    gdpGrowth: clamp(state.gdpGrowth + 0.6, -8, 16),
    cohesion: clamp(state.cohesion + 2, 0, 100),
    euThreat: clamp(state.euThreat + 1, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.02,
    corruption: clamp(state.corruption - 2, 0, 100),
    doctrine: { ...state.doctrine, prudence: clamp(state.doctrine.prudence + 6, 0, 100) },
    lastAction: 'Private arbitration mesh expanded.',
    decayLog: [
      'Court dockets got thinner the moment parties could choose adjudicators.',
      'Contract enforcement now competes on speed and reputation.',
      'The old monopoly on judgment noticed, loudly.',
    ],
  };
  s = withHistory(s, 'Arbitration increased. Disputes clear faster.');
  return advanceTurn(s);
};

const applyGoldBond = (state: SimulationState) => {
  const available = Math.max(0, state.goldTonnes - state.goldLockedTonnes);
  if (available < 1)
    return withHistory(state, 'No maneuverable gold remains for additional collateral.');

  const lock = Math.min(12, available);
  const proceeds = lock * GOLD_VALUE_PER_TONNE * 0.28;
  let s: SimulationState = {
    ...state,
    goldLockedTonnes: state.goldLockedTonnes + lock,
    annuityPool: state.annuityPool + proceeds,
    cohesion: clamp(state.cohesion + 2, 0, 100),
    euThreat: clamp(state.euThreat + 2, 0, 100),
    doctrine: { ...state.doctrine, prudence: clamp(state.doctrine.prudence + 4, 0, 100) },
    lastAction: `Gold bond ladder expanded. ${lock.toFixed(1)} tonnes ring-fenced.`,
    decayLog: [
      'Retirees trust collateral schedules more than speeches.',
      'Vault inventory moved from symbolism to liability backing.',
      'Every locked bar reduces political optionality and raises social credibility.',
    ],
  };
  s = withHistory(s, 'Gold-backed annuity ladder issued. Pension confidence improved.');
  return advanceTurn(s);
};

const applyCloseMinistryById = (state: SimulationState, ministryId: string) => {
  const ministry = state.ministries.find((e) => e.id === ministryId && !e.closed);
  if (!ministry) return withHistory(state, 'That ministry is already closed or unavailable.');

  const nextMinistries = state.ministries.map((e) =>
    e.id === ministry.id ? { ...e, closed: true } : e,
  );
  let s: SimulationState = {
    ...state,
    ministries: nextMinistries,
    ministriesClosed: state.ministriesClosed + 1,
    publicEmployees: Math.max(0, state.publicEmployees - ministry.headcountImpact),
    taxRate: clamp(state.taxRate - 1.5, 0, 40),
    gdpGrowth: clamp(state.gdpGrowth + 0.8, -8, 16),
    cohesion: clamp(
      state.cohesion - ministry.cohesionCost - 1 + (state.pensionCoverage >= 90 ? 1 : 0),
      0,
      100,
    ),
    unemployment: clamp(state.unemployment + 1.5, 0, 40),
    assetMultiplier: state.assetMultiplier + 0.03,
    publicSafety: clamp(state.publicSafety - 2, 0, 100),
    regions: nudgeRegions(state.regions, 3),
    doctrine: { ...state.doctrine, bastos: clamp(state.doctrine.bastos + 5, 0, 100) },
    lastAction: `${ministry.label} exited state hierarchy.`,
    decayLog: [
      `${ministry.label} liquidated as a command unit, reborn as service contracts.`,
      'Payroll gravity weakened while local ownership incentives grew.',
      'A filing empire was replaced by invoices and competitive bids.',
    ],
  };
  s = withHistory(s, `${ministry.label} closed. Unemployment temporarily spiked.`);
  return advanceTurn(s);
};

const applyCloseMinistry = (state: SimulationState, query?: string) => {
  const ministry = findMinistry(state.ministries, query);
  if (!ministry) return withHistory(state, 'No open ministries remain.');
  return applyCloseMinistryById(state, ministry.id);
};

const applyShredLawById = (state: SimulationState, lawId: string) => {
  const law = state.lawBook.find((e) => e.id === lawId && !e.shredded);
  if (!law) return withHistory(state, 'That law is already shredded or unavailable.');

  const nextLawBook = state.lawBook.map((e) =>
    e.id === law.id ? { ...e, shredded: true } : e,
  );
  let s: SimulationState = {
    ...state,
    lawBook: nextLawBook,
    gdpGrowth: clamp(state.gdpGrowth + law.growthBoost * 0.8, -8, 16),
    cohesion: clamp(state.cohesion + 1.0, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.02 + law.growthBoost * 0.008,
    blackMarketSize: clamp(state.blackMarketSize - 2, 0, 100),
    doctrine: { ...state.doctrine, rothbard: clamp(state.doctrine.rothbard + 4, 0, 100) },
    lastAction: `${law.label} shredded. ${law.pages.toLocaleString('en-IE')} pages gone.`,
    decayLog: [
      `Shredder report: ${law.label} is now particulate matter.`,
      'Compliance consultants have entered a reflective phase.',
      'Hiring velocity increased before the repeal ink dried.',
    ],
  };
  s = withHistory(s, `${law.label} shredded. Regulatory burden collapsed.`);
  return advanceTurn(s);
};

const applyShredder = (state: SimulationState, law?: string) => {
  const target = findLaw(state.lawBook, law);
  if (!target) return withHistory(state, 'Every tracked law has been shredded.');
  return applyShredLawById(state, target.id);
};

const applyCharterCityByRegionId = (state: SimulationState, regionId: string) => {
  const region = state.regions.find((e) => e.id === regionId);
  if (!region) return withHistory(state, 'That charter city target is not available.');
  if (state.charterCityRegions.includes(region.id))
    return withHistory(state, `${region.label} already runs an active charter framework.`);

  const nextRegions = state.regions.map((e) =>
    e.id === region.id ? { ...e, openness: clamp(e.openness + 16, 0, 100) } : e,
  );
  let s: SimulationState = {
    ...state,
    regions: nextRegions,
    charterCities: state.charterCities + 1,
    charterCityRegions: [...state.charterCityRegions, region.id],
    gdpGrowth: clamp(state.gdpGrowth + 1.2, -8, 16),
    cohesion: clamp(state.cohesion + 1, 0, 100),
    euThreat: clamp(state.euThreat + 5, 0, 100),
    arbitrationCoverage: clamp(state.arbitrationCoverage + 3, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.025,
    unemployment: clamp(state.unemployment - 0.5, 0, 40),
    internationalReputation: clamp(state.internationalReputation + 3, 0, 100),
    doctrine: {
      ...state.doctrine,
      bastos: clamp(state.doctrine.bastos + 4, 0, 100),
      prudence: clamp(state.doctrine.prudence + 2, 0, 100),
    },
    lastAction: `${region.label} launched as charter-city pilot.`,
    decayLog: [
      `${region.label} now competes for talent under opt-in rules.`,
      'Local governance moved from decree volume to contract quality.',
      'Other regions noticed their tax base could migrate.',
    ],
  };
  s = withHistory(s, `${region.label} charter city launched.`);
  return advanceTurn(s);
};

const applyCharterCity = (state: SimulationState, query?: string) => {
  const region = findRegion(state.regions, query);
  return applyCharterCityByRegionId(state, region.id);
};

const applyDoctrine = (state: SimulationState, doctrineId: string) => {
  let s: SimulationState = { ...state };

  if (doctrineId === 'property-rights-hardline') {
    s = {
      ...s,
      doctrine: { ...s.doctrine, rothbard: clamp(s.doctrine.rothbard + 12, 0, 100) },
      gdpGrowth: clamp(s.gdpGrowth + 0.7, -8, 16),
      cohesion: clamp(s.cohesion - 2, 0, 100),
      assetMultiplier: s.assetMultiplier + 0.03,
      corruption: clamp(s.corruption - 3, 0, 100),
      lastAction: 'Doctrine enacted: Property Rights Hardline.',
      decayLog: [
        'Title certainty widened while discretionary bureaucracy narrowed.',
        'Investors stopped asking if contracts were rhetorical.',
        'Local officials discovered limits are not optional.',
      ],
    };
  } else if (doctrineId === 'hard-money-corridor') {
    s = {
      ...s,
      doctrine: { ...s.doctrine, prudence: clamp(s.doctrine.prudence + 11, 0, 100) },
      goldLockedTonnes: clamp(s.goldLockedTonnes + 8, 0, s.goldTonnes),
      cohesion: clamp(s.cohesion + 1, 0, 100),
      euThreat: clamp(s.euThreat + 4, 0, 100),
      inflation: clamp(s.inflation - 2, 0, 50),
      lastAction: 'Doctrine enacted: Hard Money Corridor.',
      decayLog: [
        'Collateral density increased, panic probability decreased.',
        'Monetary discretion took another step backward.',
        'Brussels called it destabilizing, then priced it as credible.',
      ],
    };
  } else if (doctrineId === 'polycentric-law') {
    s = {
      ...s,
      doctrine: {
        ...s.doctrine,
        prudence: clamp(s.doctrine.prudence + 8, 0, 100),
        rothbard: clamp(s.doctrine.rothbard + 4, 0, 100),
      },
      arbitrationCoverage: clamp(s.arbitrationCoverage + 8, 0, 100),
      cohesion: clamp(s.cohesion + 2, 0, 100),
      gdpGrowth: clamp(s.gdpGrowth + 0.5, -8, 16),
      publicSafety: clamp(s.publicSafety + 3, 0, 100),
      lastAction: 'Doctrine enacted: Polycentric Law.',
      decayLog: [
        'Multiple legal venues now compete to enforce contracts reliably.',
        'Monopoly jurisprudence lost pricing power.',
        'Dispute resolution became a service market.',
      ],
    };
  } else if (doctrineId === 'municipal-exit-rails') {
    s = {
      ...s,
      doctrine: { ...s.doctrine, bastos: clamp(s.doctrine.bastos + 10, 0, 100) },
      gdpGrowth: clamp(s.gdpGrowth + 0.6, -8, 16),
      cohesion: clamp(s.cohesion + 1, 0, 100),
      assetMultiplier: s.assetMultiplier + 0.02,
      corruption: clamp(s.corruption - 2, 0, 100),
      lastAction: 'Doctrine enacted: Municipal Exit Rails.',
      decayLog: [
        'Exit rights became policy discipline with real consequences.',
        'Local governance got measurable competition overnight.',
        'Citizens gained leverage simply by having a nearby alternative.',
      ],
    };
  } else {
    return withHistory(state, 'Unknown doctrine card.');
  }

  s = withHistory(s, `Doctrine momentum increased through ${doctrineId}.`);
  return advanceTurn(s);
};

/* ═══ INNOVATION ADOPTION ══════════════════════════════ */

const innovationEffects: Record<
  string,
  (s: SimulationState) => Partial<SimulationState>
> = {
  'private-logistics': (s) => ({
    gdpGrowth: clamp(s.gdpGrowth + 0.8, -8, 16),
    unemployment: clamp(s.unemployment - 1, 0, 40),
    cohesion: clamp(s.cohesion + 2, 0, 100),
  }),
  'insurance-markets': (s) => ({
    annuityPool: s.annuityPool + 4 * BILLION,
    unemployment: clamp(s.unemployment - 0.5, 0, 40),
    publicSafety: clamp(s.publicSafety + 3, 0, 100),
  }),
  'private-currency': (s) => ({
    inflation: clamp(s.inflation - 5, 0, 50),
    internationalReputation: clamp(s.internationalReputation + 8, 0, 100),
    euThreat: clamp(s.euThreat + 5, 0, 100),
    privateCurrencyAdoption: clamp(s.privateCurrencyAdoption + 20, 0, 100),
  }),
  'clearing-house': (s) => ({
    gdpGrowth: clamp(s.gdpGrowth + 0.6, -8, 16),
    corruption: clamp(s.corruption - 5, 0, 100),
    assetMultiplier: s.assetMultiplier + 0.03,
  }),
  'mutual-aid': (s) => ({
    cohesion: clamp(s.cohesion + 4, 0, 100),
    foodSecurity: clamp(s.foodSecurity + 8, 0, 100),
    publicSafety: clamp(s.publicSafety + 5, 0, 100),
    mutualAidNetworks: s.mutualAidNetworks + 1,
  }),
  'health-coops': (s) => ({
    cohesion: clamp(s.cohesion + 5, 0, 100),
    publicSafety: clamp(s.publicSafety + 4, 0, 100),
    unemployment: clamp(s.unemployment - 1, 0, 40),
  }),
  'title-blockchain': (s) => ({
    assetMultiplier: s.assetMultiplier + 0.05,
    corruption: clamp(s.corruption - 8, 0, 100),
    internationalReputation: clamp(s.internationalReputation + 6, 0, 100),
  }),
  'dao-governance': (s) => ({
    corruption: clamp(s.corruption - 10, 0, 100),
    cohesion: clamp(s.cohesion + 3, 0, 100),
  }),
  'fdi-corridor': (s) => ({
    gdpGrowth: clamp(s.gdpGrowth + 1.0, -8, 16),
    internationalReputation: clamp(s.internationalReputation + 10, 0, 100),
    annuityPool: s.annuityPool + 5 * BILLION,
  }),
  'special-economic-zone': (s) => ({
    gdpGrowth: clamp(s.gdpGrowth + 1.5, -8, 16),
    unemployment: clamp(s.unemployment - 2, 0, 40),
    euThreat: clamp(s.euThreat + 3, 0, 100),
  }),
  'dispute-protocol': (s) => ({
    arbitrationCoverage: clamp(s.arbitrationCoverage + 8, 0, 100),
    cohesion: clamp(s.cohesion + 3, 0, 100),
    internationalReputation: clamp(s.internationalReputation + 5, 0, 100),
  }),
  'contract-standard': (s) => ({
    assetMultiplier: s.assetMultiplier + 0.04,
    arbitrationCoverage: clamp(s.arbitrationCoverage + 5, 0, 100),
    corruption: clamp(s.corruption - 4, 0, 100),
  }),
  'voluntary-security': (s) => ({
    publicSafety: clamp(s.publicSafety + 15, 0, 100),
    corruption: clamp(s.corruption - 5, 0, 100),
    cohesion: clamp(s.cohesion + 3, 0, 100),
  }),
  'private-fire': (s) => ({
    publicSafety: clamp(s.publicSafety + 8, 0, 100),
    cohesion: clamp(s.cohesion + 2, 0, 100),
  }),
  'agri-coops': (s) => ({
    foodSecurity: clamp(s.foodSecurity + 12, 0, 100),
    unemployment: clamp(s.unemployment - 1.5, 0, 40),
    gdpGrowth: clamp(s.gdpGrowth + 0.5, -8, 16),
  }),
  'food-markets': (s) => ({
    foodSecurity: clamp(s.foodSecurity + 10, 0, 100),
    inflation: clamp(s.inflation - 3, 0, 50),
    gdpGrowth: clamp(s.gdpGrowth + 0.4, -8, 16),
  }),
  'energy-grid': (s) => ({
    energyStability: clamp(s.energyStability + 15, 0, 100),
    inflation: clamp(s.inflation - 2, 0, 50),
    cohesion: clamp(s.cohesion + 3, 0, 100),
  }),
  'education-market': (s) => ({
    gdpGrowth: clamp(s.gdpGrowth + 0.5, -8, 16),
    cohesion: clamp(s.cohesion + 3, 0, 100),
    unemployment: clamp(s.unemployment - 1, 0, 40),
  }),
};

const applyInnovation = (state: SimulationState, innovationId: string): SimulationState => {
  if (state.innovationsAdopted.includes(innovationId))
    return withHistory(state, 'That innovation is already adopted.');

  const template = innovationTemplates.find((t) => t.id === innovationId);
  if (!template)
    return withHistory(state, 'Unknown innovation.');

  const cost = template.costBillions * BILLION;
  if (state.annuityPool < cost)
    return withHistory(state, `Insufficient funds. Need ${template.costBillions}B but only have ${(state.annuityPool / BILLION).toFixed(1)}B available.`);

  const effectFn = innovationEffects[innovationId];
  const effects = effectFn ? effectFn(state) : {};

  // Boost proposing agent's reputation
  const proposal = state.agentProposals.find((p) => p.innovationId === innovationId);
  const updatedAgents = proposal
    ? state.activeAgents.map((a) =>
        a.id === proposal.agentId
          ? { ...a, reputation: clamp(a.reputation + 15, 0, 100), currentProposal: null }
          : a,
      )
    : state.activeAgents;

  // Remove the proposal
  const updatedProposals = state.agentProposals.filter(
    (p) => p.innovationId !== innovationId,
  );

  let s: SimulationState = {
    ...state,
    ...effects,
    annuityPool: state.annuityPool - cost,
    innovationsAdopted: [...state.innovationsAdopted, innovationId],
    activeAgents: updatedAgents,
    agentProposals: updatedProposals,
    lastAction: `Innovation adopted: ${template.title}`,
    decayLog: [
      `${template.title} is now live. Market infrastructure deepened.`,
      'Another layer of state dependency was replaced by voluntary exchange.',
      `${template.description}`,
    ],
  };

  s = withHistory(s, `${template.icon} ${template.title} adopted. (Cost: ${template.costBillions}B)`);
  return advanceTurn(s);
};

/* ═══ COMMAND ROUTER ═══════════════════════════════════ */

const runCommand = (state: SimulationState, rawCommand: string): SimulationState => {
  const trimmed = rawCommand.trim();
  if (!trimmed) return withHistory(state, 'No decree entered. The debt-clock interprets silence as consent.');

  const [command, ...rest] = trimmed.split(/\s+/);
  const tail = rest.join(' ').trim();

  switch (command.toLowerCase()) {
    case '/status':
      return applyStatus(state);
    case '/swap-debt':
      return applySwapDebt(state);
    case '/liquidate': {
      const amountMatch = tail.match(/(\d{1,2})$/);
      const percent = amountMatch ? Number(amountMatch[1]) : 10;
      const query = amountMatch ? tail.replace(/(\d{1,2})$/, '').trim() : tail;
      return applyLiquidation(state, query, percent);
    }
    case '/privatize':
      return applyPrivatization(state, tail);
    case '/veto-lock':
      return applyVetoLock(state);
    case '/deregulate':
      return applyDeregulation(state, tail);
    case '/arbitrate':
      return applyArbitrationExpand(state);
    case '/charter-city':
    case '/charter':
      return applyCharterCity(state, tail);
    case '/close-ministry':
      return applyCloseMinistry(state, tail);
    case '/gold-bond':
      return applyGoldBond(state);
    case '/doctrine':
      return applyDoctrine(state, tail);
    case '/shred':
      return applyShredder(state, tail);
    default:
      return withHistory(state, `Unknown decree: ${command}. Try /status, /swap-debt, /liquidate, /privatize, /deregulate, /arbitrate, /charter-city, /close-ministry, /gold-bond, /shred.`);
  }
};

/* ═══ CRISIS RESOLUTION ════════════════════════════════ */

const resolveEventChoice = (state: SimulationState, choice: 'A' | 'B'): SimulationState => {
  const event = state.currentEvent;
  if (!event) return withHistory(state, 'No active crisis.');

  let s: SimulationState = { ...state, currentEvent: null, crisesSurvived: state.crisesSurvived + 1 };

  // Original events
  if (event.id === 'ecb-target2') {
    s = choice === 'A'
      ? { ...s, goldLockedTonnes: clamp(s.goldLockedTonnes + 28, 0, s.goldTonnes), cohesion: clamp(s.cohesion + 3, 0, 100), euThreat: clamp(s.euThreat + 6, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.7, -8, 16), assetMultiplier: s.assetMultiplier + 0.04, privateCurrencyAdoption: clamp(s.privateCurrencyAdoption + 10, 0, 100), doctrine: { ...s.doctrine, prudence: clamp(s.doctrine.prudence + 5, 0, 100) }, lastAction: 'Gold-backed digital peso announced.', decayLog: ['A digital peso with metal underneath—heresy markets sometimes respect.','Central bankers called it irresponsible right before checking its collateral.','Citizens prefer redeemability to rhetoric.'] }
      : { ...s, euThreat: clamp(s.euThreat + 20, 0, 100), cohesion: clamp(s.cohesion - 7, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.3, -8, 16), militaryLoyalty: clamp(s.militaryLoyalty - 5, 0, 100), lastAction: 'Threatened selective ECB default.', decayLog: ['The ECB default threat landed as calmly as a chair through a window.','Brussels upgraded language from concern to legal escalation.','Some traders loved audacity. Most loved the spreads.'] };
  } else if (event.id === 'pension-march') {
    s = choice === 'A'
      ? { ...s, cohesion: clamp(s.cohesion + 7, 0, 100), annuityPool: Math.max(0, s.annuityPool - 2 * BILLION), euThreat: clamp(s.euThreat - 2, 0, 100), lastAction: 'Pensioners received trust board seats.', decayLog: ['A board seat costs less than a riot.','Representation got attached to collateral instead of slogans.','Madrid calmed because retirees got governance rights.'] }
      : { ...s, taxRate: clamp(s.taxRate - 2, 0, 40), cohesion: clamp(s.cohesion + 4, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.4, -8, 16), foodSecurity: clamp(s.foodSecurity + 5, 0, 100), lastAction: 'VAT on food abolished.', decayLog: ['Food VAT disappeared and so did performative compassion bureaucracy.','Pensioners trust cheaper groceries more than white papers.','Treasury groaned. Households did not.'] };
  } else if (event.id === 'civil-service-walkout') {
    s = choice === 'A'
      ? { ...s, publicEmployees: Math.max(0, s.publicEmployees - 250_000), gdpGrowth: clamp(s.gdpGrowth + 1.0, -8, 16), cohesion: clamp(s.cohesion + 1, 0, 100), assetMultiplier: s.assetMultiplier + 0.03, unemployment: clamp(s.unemployment + 2, 0, 40), regions: nudgeRegions(s.regions, 4), ministriesClosed: s.ministriesClosed + 1, lastAction: 'Civil service tendered into cooperatives.', decayLog: ['Walkout became a buyout—harder to chant against.','Departments turned into co-ops via invoices.','Bureaucracy lost payroll mass, economy gained owners.'] }
      : { ...s, annuityPool: Math.max(0, s.annuityPool - 9 * BILLION), cohesion: clamp(s.cohesion + 3, 0, 100), lastAction: 'Severance packages dispersed.', decayLog: ['Severance buys quiet, which is not noble but efficient.','The annuity pool took a hit so streets did not.','Public order survived because the trust paid cash.'] };
  } else if (event.id === 'regional-port-auction') {
    s = choice === 'A'
      ? { ...s, annuityPool: s.annuityPool + 11 * BILLION, gdpGrowth: clamp(s.gdpGrowth + 0.7, -8, 16), regions: nudgeRegions(s.regions, 6), charterCities: s.charterCities + 1, lastAction: 'Port package split into regional concessions.', decayLog: ['Concession bidding discovered prices central planning never could.','Port politics gave way to margins.','Cash hit the trust while patronage networks found resale was low.'] }
      : { ...s, goldLockedTonnes: clamp(s.goldLockedTonnes + 10, 0, s.goldTonnes), euThreat: clamp(s.euThreat - 6, 0, 100), cohesion: clamp(s.cohesion - 2, 0, 100), lastAction: 'Port assets held as diplomatic collateral.', decayLog: ['Ports stayed in reserve for diplomacy—optionality is a real asset.','Brussels relaxed because leverage postponed is leverage preserved.','Regional leaders complained, confirming the chip\'s value.'] };
  }
  // New crisis events
  else if (event.id === 'drought-famine') {
    s = choice === 'A'
      ? { ...s, annuityPool: Math.max(0, s.annuityPool - 8 * BILLION), foodSecurity: clamp(s.foodSecurity + 18, 0, 100), cohesion: clamp(s.cohesion + 3, 0, 100), lastAction: 'Emergency food imports funded.', decayLog: ['Cash turned into calories before panic turned into violence.','The annuity pool bled but bellies filled.','International logistics firms discovered Spain pays promptly now.'] }
      : { ...s, foodSecurity: clamp(s.foodSecurity + (s.mutualAidNetworks > 0 ? 22 : 6), 0, 100), cohesion: clamp(s.cohesion + (s.mutualAidNetworks > 0 ? 5 : -4), 0, 100), lastAction: 'Mutual aid networks mobilized for food crisis.', decayLog: s.mutualAidNetworks > 0 ? ['Cooperative supply chains held where central distribution would have failed.','Neighbors fed neighbors. The state was not missed.','Agricultural coops proved their thesis under fire.'] : ['Without mutual aid networks, rationing was chaotic.','Queues formed. Tempers broke. Some neighborhoods starved.','The transition\'s legitimacy took a direct hit.'] };
  } else if (event.id === 'bank-run') {
    s = choice === 'A'
      ? { ...s, goldLockedTonnes: clamp(s.goldLockedTonnes + 20, 0, s.goldTonnes), cohesion: clamp(s.cohesion + 3, 0, 100), inflation: clamp(s.inflation - 2, 0, 50), lastAction: 'Deposits guaranteed with gold certificates.', decayLog: ['Gold certificates proved more convincing than press conferences.','Deposit queues shortened when collateral became visible.','The vault lost optionality but gained systemic stability.'] }
      : { ...s, cohesion: clamp(s.cohesion - 6, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.8, -8, 16), assetMultiplier: s.assetMultiplier + 0.04, internationalReputation: clamp(s.internationalReputation - 5, 0, 100), lastAction: 'Bank allowed to restructure into equity.', decayLog: ['Depositors became shareholders overnight—unwillingly, mostly.','The pure market solution: brave, principled, and politically expensive.','Some called it theft. Austrians called it capitalism.'] };
  } else if (event.id === 'military-coup') {
    s = choice === 'A'
      ? { ...s, militaryLoyalty: clamp(s.militaryLoyalty + 20, 0, 100), annuityPool: Math.max(0, s.annuityPool - 5 * BILLION), cohesion: clamp(s.cohesion + 4, 0, 100), publicSafety: clamp(s.publicSafety + 5, 0, 100), lastAction: 'Officers bought into defense privatization.', decayLog: ['Equity in private defense contracts outbid nostalgia for command.','Generals discovered profit margins. Ideology retreated.','The barracks went quiet when balance sheets arrived.'] }
      : { ...s, militaryLoyalty: clamp(s.militaryLoyalty + (s.cohesion > 50 ? 15 : -10), 0, 100), cohesion: clamp(s.cohesion + (s.cohesion > 50 ? 8 : -12), 0, 100), publicSafety: clamp(s.publicSafety - 8, 0, 100), internationalReputation: clamp(s.internationalReputation + 5, 0, 100), lastAction: 'Coup broadcast live—citizens decided.', decayLog: s.cohesion > 50 ? ['Cameras neutralized tanks. Citizens chose markets.','International media showed democracy working in real-time.','The officers returned to barracks with a new respect for public opinion.'] : ['The live broadcast backfired. Crowds split.','Some cheered the officers. Others fled.','Constitutional crisis deepened into street-level instability.'] };
  } else if (event.id === 'brain-drain') {
    s = choice === 'A'
      ? { ...s, taxRate: clamp(s.taxRate - 3, 0, 40), populationMillions: clamp(s.populationMillions + 0.3, 20, 60), unemployment: clamp(s.unemployment - 1, 0, 40), euThreat: clamp(s.euThreat + 4, 0, 100), lastAction: 'Zero tax for returnees announced.', decayLog: ['Tax freedom beat nostalgia as a recruitment tool.','Engineers returned when the math changed.','Brussels noted the tax competition with visible irritation.'] }
      : { ...s, charterCities: s.charterCities + 1, gdpGrowth: clamp(s.gdpGrowth + 0.6, -8, 16), populationMillions: clamp(s.populationMillions + 0.1, 20, 60), lastAction: 'Talent zones with guaranteed contract law launched.', decayLog: ['Charter city talent zones attracted the first movers.','Contract law certainty proved more magnetic than salary alone.','The brain drain slowed but did not stop.'] };
  } else if (event.id === 'cyber-attack') {
    s = choice === 'A'
      ? { ...s, energyStability: clamp(s.energyStability + (s.innovationsAdopted.includes('energy-grid') ? 15 : 3), 0, 100), annuityPool: Math.max(0, s.annuityPool - 4 * BILLION), cohesion: clamp(s.cohesion - 3, 0, 100), lastAction: 'Decentralized energy grids fast-tracked.', decayLog: ['Microgrids proved resilient where centralized systems failed.','The attack became an argument for decentralization.','Energy independence moved from theory to survival strategy.'] }
      : { ...s, energyStability: clamp(s.energyStability + 8, 0, 100), publicSafety: clamp(s.publicSafety + 5, 0, 100), annuityPool: Math.max(0, s.annuityPool - 3 * BILLION), lastAction: 'Private cybersecurity contracted.', decayLog: ['Bounty-based security firms responded faster than any ministry could.','The grid came back online with better defenses than before.','Private incentives outperformed public duty schedules.'] };
  } else if (event.id === 'power-grid-failure') {
    s = choice === 'A'
      ? { ...s, energyStability: clamp(s.energyStability + 12, 0, 100), annuityPool: Math.max(0, s.annuityPool - 6 * BILLION), cohesion: clamp(s.cohesion + 2, 0, 100), lastAction: 'Emergency energy bonds issued.', decayLog: ['Crowdfunded infrastructure worked because citizens could see the returns.','The grid repair happened faster than any procurement process.','Bond buyers became stakeholders in energy stability.'] }
      : { ...s, energyStability: clamp(s.energyStability + 8, 0, 100), charterCities: s.charterCities + 1, gdpGrowth: clamp(s.gdpGrowth + 0.4, -8, 16), lastAction: 'Solar microgrids deployed.', decayLog: ['Charter cities got their own power before the grid was fixed.','Decentralized energy proved faster than repair procurement.','Central Spain remained dark longer while charter cities glowed.'] };
  } else if (event.id === 'media-campaign') {
    s = choice === 'A'
      ? { ...s, internationalReputation: clamp(s.internationalReputation + 12, 0, 100), euThreat: clamp(s.euThreat - 4, 0, 100), annuityPool: Math.max(0, s.annuityPool - 1 * BILLION), lastAction: 'International press tour conducted.', decayLog: ['Journalists arrived expecting failure, found innovation.','Charter city footage went viral. The narrative shifted.','Media discovered markets make better stories than committees.'] }
      : { ...s, internationalReputation: clamp(s.internationalReputation - 6, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.5, -8, 16), cohesion: clamp(s.cohesion - 3, 0, 100), lastAction: 'Media ignored. Market fundamentals prioritized.', decayLog: ['Ignoring media is a strategy only GDP can validate.','Investment took a short-term hit while headlines raged.','Patience became ideology. Growth would be the rebuttal.'] };
  } else if (event.id === 'china-bri') {
    s = choice === 'A'
      ? { ...s, annuityPool: s.annuityPool + 15 * BILLION, euThreat: clamp(s.euThreat + 8, 0, 100), internationalReputation: clamp(s.internationalReputation - 5, 0, 100), corruption: clamp(s.corruption + 4, 0, 100), lastAction: 'Chinese investment accepted with sunset clauses.', decayLog: ['Beijing money arrived with strings attached—sunset clauses cut most.','Brussels interpreted the deal as provocation.','Infrastructure improved, sovereignty concerns intensified.'] }
      : { ...s, gdpGrowth: clamp(s.gdpGrowth + 0.6, -8, 16), internationalReputation: clamp(s.internationalReputation + 8, 0, 100), euThreat: clamp(s.euThreat - 3, 0, 100), lastAction: 'Chinese offer rejected.', decayLog: ['Rejecting China pleased Brussels and Silicon Valley simultaneously.','Infrastructure auctions went to competing private firms.','Sovereignty remained unentangled.'] };
  } else if (event.id === 'inflation-spike') {
    s = choice === 'A'
      ? { ...s, inflation: clamp(s.inflation - 8, 0, 50), privateCurrencyAdoption: clamp(s.privateCurrencyAdoption + 15, 0, 100), euThreat: clamp(s.euThreat + 3, 0, 100), lastAction: 'Gold-backed currency expanded.', decayLog: ['Hard money anchored expectations where soft promises failed.','Prices stabilized when the currency got a floor.','The ECB noticed—and did not enjoy the comparison.'] }
      : { ...s, inflation: clamp(s.inflation - 6, 0, 50), gdpGrowth: clamp(s.gdpGrowth + 0.8, -8, 16), foodSecurity: clamp(s.foodSecurity + 5, 0, 100), lastAction: 'Imports deregulated completely.', decayLog: ['Competition from imports crushed domestic price inflation.','Consumers loved it. Protectionists did not.','Supply abundance is the cure inflation bureaucracy cannot provide.'] };
  } else if (event.id === 'nato-pressure') {
    s = choice === 'A'
      ? { ...s, internationalReputation: clamp(s.internationalReputation + 6, 0, 100), militaryLoyalty: clamp(s.militaryLoyalty + 5, 0, 100), euThreat: clamp(s.euThreat - 3, 0, 100), annuityPool: Math.max(0, s.annuityPool - 3 * BILLION), lastAction: 'Private defense contractors proposed.', decayLog: ['NATO standards met by private operators—faster and cheaper.','Military integration continued without state dependency.','Officers discovered their skills had market value.'] }
      : { ...s, euThreat: clamp(s.euThreat - 8, 0, 100), militaryLoyalty: clamp(s.militaryLoyalty + 8, 0, 100), cohesion: clamp(s.cohesion + 2, 0, 100), lastAction: 'Base access guaranteed.', decayLog: ['NATO kept its bases, Spain kept its sovereignty experiment.','Strategic geography is a negotiation asset, not a burden.','Alliance concerns eased without costing a single reform.'] };
  } else if (event.id === 'french-border') {
    s = choice === 'A'
      ? { ...s, gdpGrowth: clamp(s.gdpGrowth + 0.4, -8, 16), annuityPool: Math.max(0, s.annuityPool - 3 * BILLION), internationalReputation: clamp(s.internationalReputation + 4, 0, 100), lastAction: 'Trade redirected south and west.', decayLog: ['Atlantic ports boomed. Pyrenean crossings became irrelevant.','North African trade corridors opened faster than Paris expected.','Dependence on France was a habit, not a necessity.'] }
      : { ...s, euThreat: clamp(s.euThreat - 5, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.6, -8, 16), internationalReputation: clamp(s.internationalReputation + 6, 0, 100), lastAction: 'Bilateral trade agreement negotiated.', decayLog: ['A bilateral FTA outside EU framework—precedent-setting.','France got market access, Spain got regulatory autonomy.','Brussels seethed. Trade flows did not care.'] };
  } else if (event.id === 'capital-flight') {
    s = choice === 'A'
      ? { ...s, taxRate: clamp(s.taxRate - 3, 0, 40), assetMultiplier: s.assetMultiplier + 0.04, internationalReputation: clamp(s.internationalReputation + 8, 0, 100), populationMillions: clamp(s.populationMillions + 0.2, 20, 60), lastAction: 'Zero capital gains tax announced.', decayLog: ['Capital returned when the penalty for staying disappeared.','Blockchain property rights made flight less attractive than arrival.','Money goes where it is treated well. Spain started treating it well.'] }
      : { ...s, cohesion: clamp(s.cohesion - 3, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.3, -8, 16), internationalReputation: clamp(s.internationalReputation - 3, 0, 100), lastAction: 'Capital flight accepted as natural selection.', decayLog: ['Old money left. New money was already forming.','The exit of rentiers created opportunities for builders.','Market Darwinism: not comfortable, but efficient.'] };
  } else if (event.id === 'food-riot') {
    s = choice === 'A'
      ? { ...s, foodSecurity: clamp(s.foodSecurity + (s.mutualAidNetworks > 0 ? 20 : 8), 0, 100), cohesion: clamp(s.cohesion + (s.mutualAidNetworks > 0 ? 6 : -2), 0, 100), publicSafety: clamp(s.publicSafety - 5, 0, 100), lastAction: 'Mutual aid food distribution deployed.', decayLog: s.mutualAidNetworks > 0 ? ['Neighbor-to-neighbor networks fed Barcelona faster than any ministry.','The riots cooled when food appeared without bureaucratic delay.','Voluntary order outperformed command-and-control.'] : ['Without strong mutual aid, distribution was patchy.','Some neighborhoods ate. Others did not.','The transition\'s promise of voluntary order was tested and found wanting.'] }
      : { ...s, foodSecurity: clamp(s.foodSecurity + 15, 0, 100), militaryLoyalty: clamp(s.militaryLoyalty - 5, 0, 100), cohesion: clamp(s.cohesion + 3, 0, 100), publicSafety: clamp(s.publicSafety - 3, 0, 100), lastAction: 'Military food reserves opened.', decayLog: ['Army warehouses opened—effective, but optically contradictory.','Deregulating agriculture while deploying military food stocks is a paradox.','Order was restored, but ideological purity took a hit.'] };
  } else if (event.id === 'pandemic') {
    s = choice === 'A'
      ? { ...s, cohesion: clamp(s.cohesion + (s.innovationsAdopted.includes('health-coops') ? 5 : -4), 0, 100), publicSafety: clamp(s.publicSafety - 5, 0, 100), annuityPool: Math.max(0, s.annuityPool - 6 * BILLION), populationMillions: clamp(s.populationMillions - 0.1, 20, 60), lastAction: 'Health coops coordinated pandemic response.', decayLog: s.innovationsAdopted.includes('health-coops') ? ['Health cooperatives triaged efficiently—no ministry required.','Crowdfunded hospitals arrived before WHO recommendations.','Voluntary health infrastructure proved pandemic-ready.'] : ['Without health cooperatives, the response was chaotic.','Private clinics were overwhelmed. Emergency crowdfunding was slow.','The transition revealed its gap: health was the Achilles heel.'] }
      : { ...s, annuityPool: Math.max(0, s.annuityPool - 10 * BILLION), cohesion: clamp(s.cohesion + 2, 0, 100), publicSafety: clamp(s.publicSafety - 3, 0, 100), internationalReputation: clamp(s.internationalReputation + 3, 0, 100), lastAction: 'Foreign private hospitals contracted.', decayLog: ['International medical firms delivered quality care at market rates.','The response was professional, expensive, and fast.','Health tourism inverted: foreign doctors came to Spain.'] };
  } else if (event.id === 'constitutional-challenge') {
    s = choice === 'A'
      ? { ...s, cohesion: clamp(s.cohesion - 5, 0, 100), arbitrationCoverage: clamp(s.arbitrationCoverage + 12, 0, 100), euThreat: clamp(s.euThreat + 6, 0, 100), militaryLoyalty: clamp(s.militaryLoyalty - 5, 0, 100), lastAction: 'Court abolished, arbitration panels elected.', decayLog: ['The most radical act: replacing judges with elected arbitrators.','Constitutional lawyers had a collective existential crisis.','Legal monopoly died. Justice became competitive.'] }
      : { ...s, cohesion: clamp(s.cohesion + 4, 0, 100), euThreat: clamp(s.euThreat - 3, 0, 100), internationalReputation: clamp(s.internationalReputation + 5, 0, 100), lastAction: 'Transition incorporated into new framework.', decayLog: ['A new constitutional framework legitimized the transition.','Incremental reform satisfied moderates and irritated purists.','International observers exhaled briefly.'] };
  } else if (event.id === 'catalonia-push') {
    s = choice === 'A'
      ? { ...s, charterCities: s.charterCities + 2, cohesion: clamp(s.cohesion - 4, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.8, -8, 16), euThreat: clamp(s.euThreat + 8, 0, 100), regions: s.regions.map((r) => r.id === 'catalonia' ? { ...r, openness: clamp(r.openness + 25, 0, 100) } : r), lastAction: 'Catalonia embraced as charter experiment.', decayLog: ['Barcelona became the proof-of-concept for exit-as-competition.','Two charter cities emerged from one independence push.','Brussels panicked: if Catalonia succeeds, Flanders is next.'] }
      : { ...s, cohesion: clamp(s.cohesion + 3, 0, 100), regions: s.regions.map((r) => r.id === 'catalonia' ? { ...r, openness: clamp(r.openness + 12, 0, 100) } : r), euThreat: clamp(s.euThreat + 3, 0, 100), lastAction: 'Enhanced Catalan autonomy within trust framework.', decayLog: ['Catalonia got autonomy, Spain kept coherence.','Neither side fully satisfied—which meant it was balanced.','The Mossos reopened borders when the deal went through.'] };
  } else if (event.id === 'russian-ops') {
    s = choice === 'A'
      ? { ...s, publicSafety: clamp(s.publicSafety + 6, 0, 100), internationalReputation: clamp(s.internationalReputation + 8, 0, 100), annuityPool: Math.max(0, s.annuityPool - 2 * BILLION), corruption: clamp(s.corruption - 5, 0, 100), lastAction: 'Private counter-intelligence published findings.', decayLog: ['Transparency neutralized disinformation faster than censorship ever could.','Private firms outdetected state intelligence agencies.','Published findings embarrassed Moscow and reassured markets.'] }
      : { ...s, publicSafety: clamp(s.publicSafety + 4, 0, 100), cohesion: clamp(s.cohesion + 3, 0, 100), corruption: clamp(s.corruption - 3, 0, 100), lastAction: 'Community surveillance via mutual aid.', decayLog: ['Neighbors reported suspicious activity without waiting for a hotline.','Mutual aid networks doubled as community watch.','Organic self-defense proved more pervasive than police patrols.'] };
  } else if (event.id === 'imf-rescue') {
    s = choice === 'A'
      ? { ...s, euThreat: clamp(s.euThreat + 8, 0, 100), cohesion: clamp(s.cohesion - 2, 0, 100), internationalReputation: clamp(s.internationalReputation - 6, 0, 100), doctrine: { ...s.doctrine, rothbard: clamp(s.doctrine.rothbard + 10, 0, 100) }, lastAction: 'IMF package rejected outright.', decayLog: ['Rejecting the IMF was ideologically pure and politically expensive.','International markets respect conviction—eventually.','The transition burned its safety net to prove it didn\'t need one.'] }
      : { ...s, annuityPool: s.annuityPool + 50 * BILLION, euThreat: clamp(s.euThreat - 5, 0, 100), taxRate: clamp(s.taxRate + 3, 0, 40), cohesion: clamp(s.cohesion + 3, 0, 100), internationalReputation: clamp(s.internationalReputation + 5, 0, 100), lastAction: 'Partial IMF terms accepted.', decayLog: ['IMF liquidity arrived; tax mandate was lawyered into irrelevance.','Brussels relaxed. Washington got involved. Complexity increased.','The annuity pool grew but so did external surveillance.'] };
  } else if (event.id === 'water-crisis') {
    s = choice === 'A'
      ? { ...s, annuityPool: Math.max(0, s.annuityPool - 4 * BILLION), foodSecurity: clamp(s.foodSecurity + 5, 0, 100), energyStability: clamp(s.energyStability + 3, 0, 100), cohesion: clamp(s.cohesion + 4, 0, 100), lastAction: 'Desalination crowdfunded.', decayLog: ['Community bonds funded desalination in 72 hours.','Citizens became shareholders in their own water supply.','Crowdfunding beat procurement by an order of magnitude.'] }
      : { ...s, annuityPool: Math.max(0, s.annuityPool - 3 * BILLION), foodSecurity: clamp(s.foodSecurity + 3, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.4, -8, 16), corruption: clamp(s.corruption - 2, 0, 100), lastAction: 'Private water utilities contracted.', decayLog: ['Private water companies arrived with better infrastructure plans.','Quality guarantees replaced bureaucratic inspections.','Water became a market—and markets respond to shortage faster than committees.'] };
  } else if (event.id === 'basque-separatism') {
    s = choice === 'A'
      ? { ...s, charterCities: s.charterCities + 1, cohesion: clamp(s.cohesion - 3, 0, 100), euThreat: clamp(s.euThreat + 5, 0, 100), gdpGrowth: clamp(s.gdpGrowth + 0.6, -8, 16), regions: s.regions.map((r) => r.id === 'basque' ? { ...r, openness: clamp(r.openness + 20, 0, 100) } : r), lastAction: 'Basque Country became competing franchise.', decayLog: ['Each region is now a governance franchise competing for residents.','The Basque model attracted immediate foreign investment interest.','Other regions demanded equal terms within hours.'] }
      : { ...s, cohesion: clamp(s.cohesion + 2, 0, 100), regions: s.regions.map((r) => r.id === 'basque' ? { ...r, openness: clamp(r.openness + 10, 0, 100) } : r), militaryLoyalty: clamp(s.militaryLoyalty + 3, 0, 100), lastAction: 'Enhanced charter framework for Basque Country.', decayLog: ['The Basque Country got its charter with shared defense.','Compromise preserved unity without crushing autonomy.','A federal-ish outcome from an anarcho-capitalist experiment.'] };
  }

  s = withHistory(s, `Crisis resolved: ${event.title} via Option ${choice}.`);
  return advanceTurn(s);
};

/* ═══ CREATE INITIAL STATE ═════════════════════════════ */

export const createInitialState = (): SimulationState =>
  refreshDerived({
    initialDebt: INITIAL_DEBT,
    debt: INITIAL_DEBT,
    annualPensionBurden: ANNUAL_PENSION_BURDEN,
    trustValue: 0,
    pensionCoverage: 0,
    goldTonnes: 281.6,
    goldLockedTonnes: 118,
    annuityPool: 42 * BILLION,
    cohesion: 62,
    gdpGrowth: 1.4,
    taxRate: 37,
    euThreat: 48,
    publicEmployees: 2_700_000,
    assetMultiplier: 1,
    turns: 0,
    phase: 'Trustee',
    debtConverted: false,
    vetoLock: false,
    libertyIndex: 0,
    arbitrationCoverage: 14,
    lawPagesRemaining: 0,
    ministriesClosed: 0,
    charterCities: 0,
    doctrine: { rothbard: 14, bastos: 12, prudence: 18 },
    charterCityRegions: [],
    wire: '',
    decayLog: [
      'The state still has letterhead, which is not the same thing as solvency.',
      'The pension promise remains sacred right up to the point where math asks to see it.',
      'Brussels is watching the bond desk and pretending this is only about process.',
    ],
    lastAction: 'Awaiting first decree.',
    assets: baseAssets.map((a) => ({ ...a })),
    regions: baseRegions.map((r) => ({ ...r })),
    ministries: baseMinistries.map((e) => ({ ...e })),
    lawBook: baseLawBook.map((e) => ({ ...e })),
    eventsSeen: [],
    currentEvent: null,
    history: ['Simulation initialized. The debt clock starts heavy.'],
    score: 0,
    achievements: [],
    newAchievement: null,
    // Expanded fields
    foodSecurity: 68,
    energyStability: 60,
    publicSafety: 55,
    inflation: 9,
    unemployment: 14.8,
    emigrationRate: 2.2,
    blackMarketSize: 14,
    corruption: 44,
    internationalReputation: 35,
    militaryLoyalty: 52,
    populationMillions: 47.8,
    privateCurrencyAdoption: 0,
    mutualAidNetworks: 0,
    innovationsAdopted: [],
    activeAgents: [],
    agentProposals: [],
    crisesSurvived: 0,
    seasonIndex: 0,
    turnsWithoutCrisis: 0,
    lossReason: null,
    // Narrative systems
    prologueDone: false,
    prologueStep: 0,
    pressureMeter: 0,
    interventionCount: 0,
    publicMoodNarrative: moodNarratives['high_cohesion_early'],
    currentTemptation: null,
    temptationsSeen: [],
    unlockedActionTier: 1,
    headlineText: headlines['Trustee'][0],
    pressureWarningActive: false,
  });

/* ═══ ACHIEVEMENT CHECKS ═══════════════════════════════ */

const checkAchievements = (state: SimulationState): SimulationState => {
  let s = { ...state, newAchievement: null as Achievement | null };
  const grant = (id: string) => {
    if (s.achievements.includes(id)) return;
    const def = achievementDefinitions.find((a) => a.id === id);
    if (!def) return;
    const pts =
      def.rarity === 'legendary' ? 500 : def.rarity === 'epic' ? 300 : def.rarity === 'rare' ? 150 : 50;
    s = { ...s, achievements: [...s.achievements, id], score: s.score + pts, newAchievement: def };
  };

  // Original achievements
  if (s.ministriesClosed >= 1) grant('first-blood');
  if (s.lawBook.some((l) => l.shredded)) grant('paper-tiger');
  if (s.debt === 0 && s.debtConverted) grant('debt-free');
  if (s.goldLockedTonnes >= 100) grant('gold-vault');
  if (s.libertyIndex >= 65) grant('liberator');
  if (s.charterCities >= 4) grant('charter-master');
  if (s.arbitrationCoverage >= 60) grant('arbiter');
  if (s.taxRate <= 0) grant('tax-zero');
  if (s.pensionCoverage >= 120) grant('pension-fortress');
  if (s.phase === 'Sovereign') grant('sovereign');
  if (s.phase === 'Sovereign' && s.turns <= 15) grant('speedrun');
  if (s.lawBook.every((l) => l.shredded)) grant('full-shred');
  if (s.ministries.every((m) => m.closed)) grant('all-ministries');
  if (s.vetoLock && s.euThreat >= 60) grant('diplomat');
  if (s.doctrine.rothbard >= 80 || s.doctrine.bastos >= 80 || s.doctrine.prudence >= 80) grant('doctrine-master');

  // New expanded achievements
  if (s.foodSecurity >= 90) grant('food-savior');
  if (s.energyStability >= 90) grant('energy-baron');
  if (s.innovationsAdopted.length >= 8) grant('innovation-engine');
  if (s.activeAgents.length >= 6) grant('network-builder');
  if (s.inflation <= 3 && s.turns > 3) grant('inflation-tamer');
  if (s.populationMillions >= 49) grant('population-magnet');
  if (s.crisesSurvived >= 8) grant('crisis-veteran');
  if (s.corruption <= 10) grant('corruption-slayer');
  if (s.militaryLoyalty >= 90) grant('military-trust');
  if (s.foodSecurity >= 85 && s.energyStability >= 85 && s.publicSafety >= 85) grant('utopia');

  // Score from general progress
  const baseScore = Math.round(
    s.libertyIndex * 5 +
      s.arbitrationCoverage * 3 +
      s.ministriesClosed * 40 +
      s.charterCities * 35 +
      (100 - s.taxRate) * 2 +
      s.pensionCoverage * 2 +
      (s.debtConverted ? 200 : 0) +
      s.gdpGrowth * 10 +
      s.foodSecurity * 1.5 +
      s.energyStability * 1.5 +
      s.publicSafety * 1.5 +
      (50 - s.inflation) * 2 +
      s.internationalReputation * 2 +
      s.innovationsAdopted.length * 25 +
      s.activeAgents.length * 15 +
      s.crisesSurvived * 20 +
      (100 - s.corruption) * 1 +
      s.militaryLoyalty * 0.5 -
      s.unemployment * 3 -
      s.emigrationRate * 5 -
      s.blackMarketSize * 1,
  );
  const achieveScore = s.achievements.reduce((sum, id) => {
    const def = achievementDefinitions.find((a) => a.id === id);
    if (!def) return sum;
    return sum + (def.rarity === 'legendary' ? 500 : def.rarity === 'epic' ? 300 : def.rarity === 'rare' ? 150 : 50);
  }, 0);
  s.score = Math.max(0, baseScore + achieveScore);

  return s;
};


/* ═══ TEMPTATION SYSTEM ════════════════════════════════ */

const phaseOrder: Record<Phase, number> = { Trustee: 0, Liquidator: 1, Architect: 2, Sovereign: 3 };

const trySpawnTemptation = (state: SimulationState): SimulationState => {
  if (state.currentTemptation) return state;
  if (!state.prologueDone) return state;
  const roll = pseudoRandom(state.turns, 5381);
  if (roll > 0.28) return state; // 28% chance per turn

  const eligible = temptationDeck.filter(t => {
    if (state.temptationsSeen.includes(t.id)) return false;
    if (phaseOrder[t.minPhase as Phase] > phaseOrder[state.phase]) return false;
    if (t.requiredStat) {
      const val = (state as unknown as Record<string, number>)[t.requiredStat.key];
      if (t.requiredStat.below !== undefined && val >= t.requiredStat.below) return false;
      if (t.requiredStat.above !== undefined && val <= t.requiredStat.above) return false;
    }
    return true;
  });

  if (eligible.length === 0) return state;
  const idx = Math.floor(pseudoRandom(state.turns, 2741) * eligible.length);
  const temptation = eligible[idx];
  return withHistory(
    { ...state, currentTemptation: temptation, temptationsSeen: [...state.temptationsSeen, temptation.id] },
    `⚠️ Temptation incoming: ${temptation.source} is making an offer.`
  );
};

const applyTemptationChoice = (state: SimulationState, temptationId: string, accept: boolean): SimulationState => {
  const t = state.currentTemptation;
  if (!t || t.id !== temptationId) return state;

  let s: SimulationState = { ...state, currentTemptation: null };

  if (!accept) {
    // Refuse — virtue points, minor positive effects
    s = {
      ...s,
      libertyIndex: clamp(s.libertyIndex + 3, 0, 100),
      internationalReputation: clamp(s.internationalReputation + 4, 0, 100),
      doctrine: { ...s.doctrine, rothbard: clamp(s.doctrine.rothbard + 6, 0, 100) },
      pressureMeter: clamp(s.pressureMeter - 5, 0, 100),
      lastAction: `Temptation refused: ${t.title}. The principled path held.`,
      decayLog: [
        `The ${t.source} offer was declined. This will be remembered.`,
        'Refusing the shortcut is the hardest move in a transition.',
        'International libertarian networks took notice.',
      ],
    };
    s = withHistory(s, `Temptation refused: ${t.title}.`);
  } else {
    // Accept — apply the poison
    s = { ...s, interventionCount: s.interventionCount + 1 };

    if (t.id === 'tempt-eu-bridge') {
      s = { ...s, annuityPool: s.annuityPool + 80 * BILLION, euThreat: clamp(s.euThreat - 20, 0, 100), cohesion: clamp(s.cohesion + 8, 0, 100), libertyIndex: clamp(s.libertyIndex - 12, 0, 100), lastAction: 'EU bridge loan accepted. Privatisation paused.', decayLog: ['Brussels wired the cash. The hook is in.','The transition paused because someone blinked first.','Short-term relief. Long-term dependency.'] };
    } else if (t.id === 'tempt-price-controls') {
      s = { ...s, cohesion: clamp(s.cohesion + 12, 0, 100), inflation: clamp(s.inflation - 4, 0, 50), foodSecurity: clamp(s.foodSecurity - 15, 0, 100), blackMarketSize: clamp(s.blackMarketSize + 25, 0, 100), gdpGrowth: clamp(s.gdpGrowth - 1.2, -8, 16), libertyIndex: clamp(s.libertyIndex - 10, 0, 100), lastAction: 'Price controls issued. Markets immediately distorted.', decayLog: ['Prices stopped at decree; supply did not get the memo.','Black markets expanded at the speed of the overnight queue.','Short-term calm. Long-term scarcity.'] };
    } else if (t.id === 'tempt-imf-conditionality') {
      s = { ...s, annuityPool: s.annuityPool + 50 * BILLION, euThreat: clamp(s.euThreat - 10, 0, 100), internationalReputation: clamp(s.internationalReputation + 10, 0, 100), taxRate: clamp(s.taxRate, 20, 40), libertyIndex: clamp(s.libertyIndex - 8, 0, 100), lastAction: 'IMF standby accepted. Tax floor locked at 20%.', decayLog: ['Washington wired the SDRs. The conditionality clause is legible.','Tax rate cannot drop below 20% while the IMF watches.','Liquidity in exchange for sovereignty.'] };
    } else if (t.id === 'tempt-renationalise') {
      s = { ...s, cohesion: clamp(s.cohesion + 10, 0, 100), energyStability: clamp(s.energyStability + 8, 0, 100), militaryLoyalty: clamp(s.militaryLoyalty + 5, 0, 100), libertyIndex: clamp(s.libertyIndex - 12, 0, 100), assetMultiplier: Math.max(0.1, s.assetMultiplier - 0.08), euThreat: clamp(s.euThreat + 10, 0, 100), lastAction: 'Energy grid re-nationalised. Market order compromised.', decayLog: ['The grid returned to state hands. Workers cheered.','Investors updated their risk models. Asset multiples fell.','The transition contradicted itself. History noticed.'] };
    } else if (t.id === 'tempt-wealth-tax') {
      s = { ...s, annuityPool: s.annuityPool + 35 * BILLION, cohesion: clamp(s.cohesion + 6, 0, 100), internationalReputation: clamp(s.internationalReputation - 15, 0, 100), assetMultiplier: Math.max(0.1, s.assetMultiplier - 0.06), libertyIndex: clamp(s.libertyIndex - 8, 0, 100), emigrationRate: clamp(s.emigrationRate + 3, 0, 20), lastAction: 'Wealth tax levied. Capital began moving overnight.', decayLog: ['The tax raised €35B and €120B in capital flight started packing.','Entrepreneurs remembered Portugal exists.','The trust got fatter while the economy got thinner.'] };
    } else if (t.id === 'tempt-media-blackout') {
      s = { ...s, cohesion: clamp(s.cohesion + 8, 0, 100), euThreat: clamp(s.euThreat - 6, 0, 100), internationalReputation: clamp(s.internationalReputation - 20, 0, 100), libertyIndex: clamp(s.libertyIndex - 10, 0, 100), corruption: clamp(s.corruption + 8, 0, 100), lastAction: 'Press restrictions issued. International reaction immediate.', decayLog: ['The broadcast decree silenced dissent and international credibility.','Reporters Without Borders downgraded Spain eight places by Tuesday.','The story you suppress becomes the story.'] };
    } else if (t.id === 'tempt-army-order') {
      s = { ...s, publicSafety: clamp(s.publicSafety + 15, 0, 100), cohesion: clamp(s.cohesion + 10, 0, 100), blackMarketSize: clamp(s.blackMarketSize - 20, 0, 100), libertyIndex: clamp(s.libertyIndex - 20, 0, 100), internationalReputation: clamp(s.internationalReputation - 15, 0, 100), militaryLoyalty: clamp(s.militaryLoyalty + 15, 0, 100), euThreat: clamp(s.euThreat + 15, 0, 100), lastAction: 'Military administration granted. Six provinces under army control.', decayLog: ['Order arrived in armoured vehicles. The market order retreated.','Brussels called it a coup by consent.','The anarchy was replaced by something worse: uniformed bureaucracy.'] };
    } else if (t.id === 'tempt-sovereign-fund') {
      s = { ...s, annuityPool: s.annuityPool + 80 * BILLION, pensionCoverage: clamp(s.pensionCoverage + 40, 0, 180), euThreat: clamp(s.euThreat - 10, 0, 100), libertyIndex: clamp(s.libertyIndex - 8, 0, 100), assetMultiplier: Math.max(0.1, s.assetMultiplier - 0.04), lastAction: 'Sovereign wealth fund created. Goldman/BlackRock managing assets.', decayLog: ['€200B under management. Fifteen-year lock-in signed.','The pensions are safe. The assets are not yours for a decade.','Wall Street solved the pension problem. The price was control.'] };
    } else if (t.id === 'tempt-bitcoin-mandate') {
      s = { ...s, privateCurrencyAdoption: clamp(s.privateCurrencyAdoption + 30, 0, 100), inflation: clamp(s.inflation - 6, 0, 50), euThreat: clamp(s.euThreat + 18, 0, 100), cohesion: clamp(s.cohesion - 8, 0, 100), internationalReputation: clamp(s.internationalReputation + 10, 0, 100), lastAction: 'Bitcoin legal tender by decree. EU furious.', decayLog: ['Bitcoin is legal tender. This is either genius or catastrophic.','Brussels invoked Article 7.','Volatility spiked. Half the country loves it. Half panics.'] };
    }

    s = withHistory(s, `Temptation accepted: ${t.title}. Consequences incoming.`);
    // Update mood
    s = { ...s, publicMoodNarrative: moodNarratives['temptation_accepted'] };
  }

  return advanceTurn(s);
};

/* ═══ PRESSURE METER + MOOD UPDATE ════════════════════ */

const updatePressureAndMood = (state: SimulationState): SimulationState => {
  // Pressure builds if player is passive (no big reforms)
  const reformed = state.ministriesClosed + state.lawBook.filter(l => l.shredded).length + state.charterCities + state.innovationsAdopted.length;
  const expectedReform = state.turns * 0.8;
  const lagging = reformed < expectedReform;

  const pressureDelta = lagging ? 6 : -3;
  const newPressure = clamp(state.pressureMeter + pressureDelta + (state.euThreat > 70 ? 3 : 0) + (state.cohesion < 35 ? 4 : 0), 0, 100);

  // Determine mood narrative
  let mood = moodNarratives['great'];
  if (state.inflation > 15) mood = moodNarratives['inflation_bad'];
  else if (state.foodSecurity < 45) mood = moodNarratives['low_food'];
  else if (state.publicSafety < 35) mood = moodNarratives['low_safety'];
  else if (state.cohesion < 40) mood = moodNarratives['low_cohesion_early'];
  else if (state.gdpGrowth > 5) mood = moodNarratives['high_gdp'];
  else if (state.libertyIndex > 55) mood = moodNarratives['high_liberty'];
  else if (state.foodSecurity > 80) mood = moodNarratives['high_food'];
  else if (state.cohesion > 70) mood = moodNarratives['high_cohesion_early'];

  // Headline rotation
  const phaseHeads = headlines[state.phase] ?? headlines['Trustee'];
  const headIdx = state.turns % phaseHeads.length;

  // Tier unlock
  const tier = phaseOrder[state.phase] + 1;

  return {
    ...state,
    pressureMeter: newPressure,
    pressureWarningActive: newPressure >= 70,
    publicMoodNarrative: mood,
    headlineText: phaseHeads[headIdx],
    unlockedActionTier: tier,
  };
};

/* ═══ PROLOGUE ADVANCE ══════════════════════════════════ */
const advancePrologue = (state: SimulationState): SimulationState => {
  const nextStep = state.prologueStep + 1;
  if (nextStep >= 3) {
    return { ...state, prologueDone: true, prologueStep: 3 };
  }
  return { ...state, prologueStep: nextStep };
};

/* ═══ REDUCER ══════════════════════════════════════════ */

export const simulationReducer = (
  state: SimulationState,
  action: SimulationAction,
): SimulationState => {
  let next: SimulationState;
  switch (action.type) {
    case 'run-command':
      next = runCommand(state, action.command);
      break;
    case 'event-choice':
      next = resolveEventChoice(state, action.choice);
      break;
    case 'adopt-doctrine':
      next = applyDoctrine(state, action.doctrineId);
      break;
    case 'close-ministry':
      next = applyCloseMinistryById(state, action.ministryId);
      break;
    case 'shred-law':
      next = applyShredLawById(state, action.lawId);
      break;
    case 'charter-city':
      next = applyCharterCityByRegionId(state, action.regionId);
      break;
    case 'expand-arbitration':
      next = applyArbitrationExpand(state);
      break;
    case 'issue-gold-bond':
      next = applyGoldBond(state);
      break;
    case 'adopt-innovation':
      next = applyInnovation(state, action.innovationId);
      break;
    case 'temptation-choice':
      next = applyTemptationChoice(state, action.temptationId, action.accept);
      break;
    case 'dismiss-temptation':
      next = { ...state, currentTemptation: null };
      return checkAchievements(next);
    case 'advance-prologue':
      return advancePrologue(state);
    default:
      return state;
  }
  return checkAchievements(next);
};

/* ═══ BREAKDOWN ════════════════════════════════════════ */

export const getBreakdown = (state: SimulationState): SimulationBreakdown => {
  const retainedAssetValue =
    state.assets.reduce((sum, a) => sum + a.baseValue * a.remainingShare, 0) *
    state.assetMultiplier;
  const goldValue = state.goldTonnes * GOLD_VALUE_PER_TONNE;
  const annualDividendFlow =
    state.assets.reduce(
      (sum, a) => sum + a.baseValue * a.remainingShare * a.dividendYield,
      0,
    ) * state.assetMultiplier;
  const securedCapital =
    state.annuityPool +
    annualDividendFlow * 6 +
    state.goldLockedTonnes * GOLD_VALUE_PER_TONNE * 0.65;

  return {
    goldValue,
    retainedAssetValue,
    annualDividendFlow,
    securedCapital,
    unlockedGoldTonnes: roundTo(state.goldTonnes - state.goldLockedTonnes),
    debtProgress: clamp(((state.initialDebt - state.debt) / state.initialDebt) * 100, 0, 100),
    regulatoryPagesRemaining: state.lawPagesRemaining,
    libertyIndex: state.libertyIndex,
    arbitrationCoverage: state.arbitrationCoverage,
  };
};