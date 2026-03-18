import { lawTemplates, ministryTemplates } from './content';

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
}

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
}

export type SimulationAction =
  | { type: 'run-command'; command: string }
  | { type: 'event-choice'; choice: 'A' | 'B' }
  | { type: 'adopt-doctrine'; doctrineId: string }
  | { type: 'close-ministry'; ministryId: string }
  | { type: 'shred-law'; lawId: string }
  | { type: 'charter-city'; regionId: string }
  | { type: 'expand-arbitration' }
  | { type: 'issue-gold-bond' };

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

const GOLD_VALUE_PER_TONNE = 88_000_000;
const INITIAL_DEBT = 1_650_000_000_000;
const ANNUAL_PENSION_BURDEN = 158_000_000_000;
const HISTORY_LIMIT = 10;

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

const baseMinistries: MinistryUnit[] = ministryTemplates.map((entry) => ({
  ...entry,
  closed: false,
}));

const baseLawBook: LawEntry[] = lawTemplates.map((entry) => ({
  ...entry,
  shredded: false,
}));

const eventDeck: ScenarioEvent[] = [
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
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const roundTo = (value: number, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
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
  if (state.euThreat <= 20) {
    return 'Brussels is irritated, procedural, and buying time. They suspect your legal mesh is becoming exportable.';
  }

  if (state.euThreat <= 45) {
    return 'Formal warning stage. Committees are writing stern adjectives while funds benchmark your charter cities.';
  }

  if (state.euThreat <= 70) {
    return 'Escalation stage. Sanctions are discussed in passive voice, which means they are being drafted in active voice.';
  }

  return 'Acute threat stage. Brussels reads your transition as contagion and is mapping intervention levers.';
};

const getNextEvent = (state: SimulationState) => eventDeck.find((event) => !state.eventsSeen.includes(event.id)) ?? null;

const withHistory = (state: SimulationState, entry: string) => ({
  ...state,
  history: [entry, ...state.history].slice(0, HISTORY_LIMIT),
});

const nudgeRegions = (regions: Region[], amount: number) =>
  regions.map((region, index) => ({
    ...region,
    openness: clamp(region.openness + amount + (index % 2 === 0 ? 1 : 0), 0, 100),
  }));

const refreshDerived = (state: SimulationState): SimulationState => {
  const retainedAssetValue = state.assets.reduce(
    (sum, asset) => sum + asset.baseValue * asset.remainingShare,
    0,
  ) * state.assetMultiplier;

  const goldValue = state.goldTonnes * GOLD_VALUE_PER_TONNE;
  const annualDividendFlow = state.assets.reduce(
    (sum, asset) => sum + asset.baseValue * asset.remainingShare * asset.dividendYield,
    0,
  ) * state.assetMultiplier;

  const securedCapital =
    state.annuityPool +
    annualDividendFlow * 6 +
    state.goldLockedTonnes * GOLD_VALUE_PER_TONNE * 0.65;

  const pensionCoverage = clamp((securedCapital / state.annualPensionBurden) * 100, 0, 180);
  const lawPagesRemaining = state.lawBook.reduce((sum, law) => sum + (law.shredded ? 0 : law.pages), 0);
  const doctrinePower = (state.doctrine.rothbard + state.doctrine.bastos + state.doctrine.prudence) / 3;

  const libertyIndex = clamp(
    12 +
      state.arbitrationCoverage * 0.28 +
      state.ministriesClosed * 7 +
      state.charterCities * 5 +
      (100 - state.taxRate) * 0.34 +
      doctrinePower * 0.22 -
      state.euThreat * 0.12,
    0,
    100,
  );

  const phase = computePhase({ ...state, libertyIndex }, pensionCoverage);

  return {
    ...state,
    trustValue: retainedAssetValue + goldValue + state.annuityPool,
    pensionCoverage: roundTo(pensionCoverage),
    lawPagesRemaining,
    libertyIndex: roundTo(libertyIndex),
    phase,
    wire: deriveWire(state),
  };
};

const advanceTurn = (state: SimulationState): SimulationState => {
  const nextTurns = state.turns + 1;
  const interestRate = state.debt === 0 ? 0 : 0.004 + state.euThreat / 10_000;
  const interestShock = state.debt * interestRate;

  let nextState: SimulationState = {
    ...state,
    turns: nextTurns,
    debt: state.debt + interestShock,
    gdpGrowth: clamp(
      state.gdpGrowth +
        (state.assetMultiplier - 1) * 0.45 +
        state.arbitrationCoverage * 0.006 +
        state.charterCities * 0.08 -
        (state.euThreat > 72 ? 0.6 : 0),
      -5,
      16,
    ),
    cohesion: clamp(
      state.cohesion +
        (state.gdpGrowth >= 5 ? 2 : 0) +
        (state.pensionCoverage >= 100 ? 1 : 0) -
        (interestShock > 0 ? 1 : 0) -
        (state.euThreat > 80 ? 2 : 0),
      0,
      100,
    ),
    taxRate: clamp(state.taxRate - (state.debtConverted ? 2.2 : 0.5) - state.ministriesClosed * 0.05, 0, 40),
  };

  if (nextTurns % 3 === 0 && !nextState.currentEvent) {
    const nextEvent = getNextEvent(nextState);
    nextState = {
      ...nextState,
      currentEvent: nextEvent,
      eventsSeen: nextEvent ? [...nextState.eventsSeen, nextEvent.id] : nextState.eventsSeen,
    };
  }

  return refreshDerived(nextState);
};

const findAsset = (assets: Asset[], query?: string) => {
  if (!query) {
    return assets.find((asset) => asset.remainingShare > 0.05) ?? assets[0];
  }

  const normalized = query.trim().toLowerCase();
  return (
    assets.find((asset) => asset.id.includes(normalized) || asset.label.toLowerCase().includes(normalized)) ??
    assets.find((asset) => asset.remainingShare > 0.05) ??
    assets[0]
  );
};

const findRegion = (regions: Region[], query?: string) => {
  if (!query) {
    return regions.reduce((selected, current) => (current.openness < selected.openness ? current : selected), regions[0]);
  }

  const normalized = query.trim().toLowerCase();
  return (
    regions.find((region) => region.id.includes(normalized) || region.label.toLowerCase().includes(normalized)) ??
    regions[0]
  );
};

const findMinistry = (ministries: MinistryUnit[], query?: string) => {
  const openMinistries = ministries.filter((entry) => !entry.closed);
  if (!openMinistries.length) {
    return null;
  }

  if (!query) {
    return openMinistries[0];
  }

  const normalized = query.trim().toLowerCase();
  return (
    openMinistries.find(
      (entry) => entry.id.includes(normalized) || entry.label.toLowerCase().includes(normalized),
    ) ?? openMinistries[0]
  );
};

const findLaw = (lawBook: LawEntry[], query?: string) => {
  const activeLaws = lawBook.filter((entry) => !entry.shredded);
  if (!activeLaws.length) {
    return null;
  }

  if (!query) {
    return activeLaws[0];
  }

  const normalized = query.trim().toLowerCase();
  return (
    activeLaws.find((entry) => entry.id.includes(normalized) || entry.label.toLowerCase().includes(normalized)) ??
    activeLaws[0]
  );
};

const applyStatus = (state: SimulationState) =>
  withHistory(refreshDerived(state), 'Dashboard refreshed. The debt-clock is still louder than podium speeches.');

const applySwapDebt = (state: SimulationState) => {
  if (state.debtConverted) {
    return withHistory(refreshDerived(state), 'Debt is already sitting inside the trust cap table. The conversion shock has passed.');
  }

  let nextState: SimulationState = {
    ...state,
    debt: 0,
    debtConverted: true,
    assetMultiplier: state.assetMultiplier + 0.08,
    cohesion: clamp(state.cohesion - 7, 0, 100),
    euThreat: clamp(state.euThreat + 16, 0, 100),
    annuityPool: state.annuityPool + 18_000_000_000,
    doctrine: {
      ...state.doctrine,
      bastos: clamp(state.doctrine.bastos + 5, 0, 100),
    },
    lastAction: 'The equity swap fired. Bondholders now hold trust paper instead of sovereign promises.',
    decayLog: [
      'The debt ministry has been demoted from priesthood to transfer desk.',
      'A room full of bond lawyers discovered that equity has moods, unlike coupons.',
      'The old state still exists on paper, which is exactly where its leverage now lives.',
    ],
  };

  nextState = withHistory(nextState, 'Equity swap executed. Debt nominal went to zero while political temperature went the other way.');
  return advanceTurn(nextState);
};

const applyLiquidation = (state: SimulationState, query?: string, percent = 10) => {
  const asset = findAsset(state.assets, query);
  const requestedShare = clamp(percent / 100, 0.05, 0.4);
  const saleShare = Math.min(asset.remainingShare, requestedShare);

  if (saleShare <= 0) {
    return withHistory(state, `${asset.label} has already been sold down as far as this model allows.`);
  }

  const proceeds = asset.baseValue * saleShare * (0.9 + state.assetMultiplier * 0.08);
  const nextAssets = state.assets.map((current) =>
    current.id === asset.id
      ? { ...current, remainingShare: roundTo(current.remainingShare - saleShare, 3) }
      : current,
  );

  let nextState: SimulationState = {
    ...state,
    assets: nextAssets,
    annuityPool: state.annuityPool + proceeds * 0.84,
    cohesion: clamp(state.cohesion + (saleShare <= 0.1 ? 1 : -2), 0, 100),
    euThreat: clamp(state.euThreat + 3, 0, 100),
    regions: nudgeRegions(state.regions, 3),
    doctrine: {
      ...state.doctrine,
      prudence: clamp(state.doctrine.prudence + 2, 0, 100),
    },
    lastAction: `${asset.label} sold down by ${Math.round(saleShare * 100)}%. Cash redirected into the annuity stack.`,
    decayLog: [
      `${asset.label} stopped pretending to be a sacred relic of sovereignty.`,
      'Three consultants fainted when they learned auction pricing is not a public ceremony.',
      'The pension vault grew heavier while the ministry building grew less important.',
    ],
  };

  nextState = withHistory(nextState, `${asset.label} auctioned. Proceeds reinforced pension collateral and market discipline.`);
  return advanceTurn(nextState);
};

const applyPrivatization = (state: SimulationState, department?: string) => {
  const target = department?.trim() || 'Administrative Services';

  let nextState: SimulationState = {
    ...state,
    publicEmployees: Math.max(0, state.publicEmployees - 140_000),
    taxRate: clamp(state.taxRate - 4.4, 0, 40),
    gdpGrowth: clamp(state.gdpGrowth + 1.2, -5, 16),
    cohesion: clamp(state.cohesion - 2 + (state.pensionCoverage >= 80 ? 2 : 0), 0, 100),
    assetMultiplier: state.assetMultiplier + 0.04,
    regions: nudgeRegions(state.regions, 5),
    doctrine: {
      ...state.doctrine,
      bastos: clamp(state.doctrine.bastos + 4, 0, 100),
    },
    lastAction: `${target} moved into a voucher-led cooperative exit lane.`,
    decayLog: [
      `${target} discovered the private sector, which is to say accountability with invoices.`,
      'Middle management is learning that memos are not productive assets.',
      'The payroll burden shrank, and with it a corner of compliance religion.',
    ],
  };

  nextState = withHistory(nextState, `${target} privatized into worker-owned vehicles. Payroll drag fell and growth improved.`);
  return advanceTurn(nextState);
};

const applyVetoLock = (state: SimulationState) => {
  let nextState: SimulationState = {
    ...state,
    vetoLock: true,
    euThreat: clamp(state.euThreat - 18, 0, 100),
    cohesion: clamp(state.cohesion + 3, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.03,
    doctrine: {
      ...state.doctrine,
      prudence: clamp(state.doctrine.prudence + 3, 0, 100),
    },
    lastAction: 'Veto-lock engaged. Diplomacy bought breathing room without pretending friendship.',
    decayLog: [
      'The foreign ministry briefly became useful, which should not be treated as a precedent.',
      'Brussels received legal objections thick enough to qualify as architecture.',
      'Time was purchased, not peace. In insolvency that still counts as profit.',
    ],
  };

  nextState = withHistory(nextState, 'Veto-lock engaged. External pressure eased long enough for trust mechanics to harden.');
  return advanceTurn(nextState);
};

const applyDeregulation = (state: SimulationState, sector?: string) => {
  const target = sector?.trim() || 'General Commerce';

  let nextState: SimulationState = {
    ...state,
    gdpGrowth: clamp(state.gdpGrowth + 1.8, -5, 16),
    cohesion: clamp(state.cohesion + 3, 0, 100),
    taxRate: clamp(state.taxRate - 2.5, 0, 40),
    assetMultiplier: state.assetMultiplier + 0.07,
    regions: nudgeRegions(state.regions, 6),
    doctrine: {
      ...state.doctrine,
      rothbard: clamp(state.doctrine.rothbard + 3, 0, 100),
    },
    lastAction: `${target} deregulated. The compliance tax caught fire and nobody called emergency services.`,
    decayLog: [
      `${target} no longer requires permission slips written by people who do not build anything.`,
      'Startup formation accelerated the moment filing cabinets lost political protection.',
      'The trust got richer because the economy remembered how to move.',
    ],
  };

  nextState = withHistory(nextState, `${target} deregulated. Growth and asset multiples both stepped higher.`);
  return advanceTurn(nextState);
};

const applyArbitrationExpand = (state: SimulationState) => {
  let nextState: SimulationState = {
    ...state,
    arbitrationCoverage: clamp(state.arbitrationCoverage + 12, 0, 100),
    gdpGrowth: clamp(state.gdpGrowth + 0.7, -5, 16),
    cohesion: clamp(state.cohesion + 2, 0, 100),
    euThreat: clamp(state.euThreat + 1, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.02,
    doctrine: {
      ...state.doctrine,
      prudence: clamp(state.doctrine.prudence + 6, 0, 100),
    },
    lastAction: 'Private arbitration mesh expanded across commercial disputes.',
    decayLog: [
      'Court dockets got thinner the moment parties could choose adjudicators.',
      'Contract enforcement now competes on speed and reputation.',
      'The old monopoly on judgment noticed, loudly.',
    ],
  };

  nextState = withHistory(nextState, 'Arbitration adoption increased. Contract certainty improved and disputes cleared faster.');
  return advanceTurn(nextState);
};

const applyGoldBond = (state: SimulationState) => {
  const availableTonnes = Math.max(0, state.goldTonnes - state.goldLockedTonnes);
  if (availableTonnes < 1) {
    return withHistory(state, 'No maneuverable gold remains for additional collateral ladders.');
  }

  const lockTonnes = Math.min(12, availableTonnes);
  const proceeds = lockTonnes * GOLD_VALUE_PER_TONNE * 0.28;

  let nextState: SimulationState = {
    ...state,
    goldLockedTonnes: state.goldLockedTonnes + lockTonnes,
    annuityPool: state.annuityPool + proceeds,
    cohesion: clamp(state.cohesion + 2, 0, 100),
    euThreat: clamp(state.euThreat + 2, 0, 100),
    doctrine: {
      ...state.doctrine,
      prudence: clamp(state.doctrine.prudence + 4, 0, 100),
    },
    lastAction: `Gold bond ladder expanded. ${lockTonnes.toFixed(1)} tonnes were ring-fenced for annuity confidence.`,
    decayLog: [
      'Retirees trust collateral schedules more than speeches. The spread data agrees.',
      'Vault inventory moved from symbolism to explicit liability backing.',
      'Every locked bar reduces political optionality and raises social credibility.',
    ],
  };

  nextState = withHistory(nextState, 'Gold-backed annuity ladder issued. Pension confidence and collateral depth improved.');
  return advanceTurn(nextState);
};

const applyCloseMinistryById = (state: SimulationState, ministryId: string) => {
  const ministry = state.ministries.find((entry) => entry.id === ministryId && !entry.closed);
  if (!ministry) {
    return withHistory(state, 'That ministry is already closed or unavailable.');
  }

  const nextMinistries = state.ministries.map((entry) =>
    entry.id === ministry.id ? { ...entry, closed: true } : entry,
  );

  let nextState: SimulationState = {
    ...state,
    ministries: nextMinistries,
    ministriesClosed: state.ministriesClosed + 1,
    publicEmployees: Math.max(0, state.publicEmployees - ministry.headcountImpact),
    taxRate: clamp(state.taxRate - 1.8, 0, 40),
    gdpGrowth: clamp(state.gdpGrowth + 1.0, -5, 16),
    cohesion: clamp(state.cohesion - ministry.cohesionCost + (state.pensionCoverage >= 90 ? 1 : 0), 0, 100),
    assetMultiplier: state.assetMultiplier + 0.035,
    regions: nudgeRegions(state.regions, 4),
    doctrine: {
      ...state.doctrine,
      bastos: clamp(state.doctrine.bastos + 5, 0, 100),
    },
    lastAction: `${ministry.label} exited state hierarchy into market and cooperative structures.`,
    decayLog: [
      `${ministry.label} has been liquidated as a command unit and reborn as service contracts.`,
      'Payroll gravity weakened while local ownership incentives strengthened.',
      'A filing empire was replaced by invoices and competitive bids.',
    ],
  };

  nextState = withHistory(nextState, `${ministry.label} closed. Payroll drag shrank and decentralization accelerated.`);
  return advanceTurn(nextState);
};

const applyCloseMinistry = (state: SimulationState, query?: string) => {
  const ministry = findMinistry(state.ministries, query);
  if (!ministry) {
    return withHistory(state, 'No open ministries remain in the closure queue.');
  }

  return applyCloseMinistryById(state, ministry.id);
};

const applyShredLawById = (state: SimulationState, lawId: string) => {
  const law = state.lawBook.find((entry) => entry.id === lawId && !entry.shredded);
  if (!law) {
    return withHistory(state, 'That law is already shredded or unavailable.');
  }

  const nextLawBook = state.lawBook.map((entry) =>
    entry.id === law.id ? { ...entry, shredded: true } : entry,
  );

  let nextState: SimulationState = {
    ...state,
    lawBook: nextLawBook,
    gdpGrowth: clamp(state.gdpGrowth + law.growthBoost, -5, 16),
    cohesion: clamp(state.cohesion + 1.4, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.02 + law.growthBoost * 0.01,
    doctrine: {
      ...state.doctrine,
      rothbard: clamp(state.doctrine.rothbard + 5, 0, 100),
    },
    lastAction: `${law.label} shredded. ${law.pages.toLocaleString('en-IE')} pages of compliance burden were deleted.`,
    decayLog: [
      `Shredder report: ${law.label} is now particulate matter.`,
      'Compliance consultants have entered a reflective phase.',
      'Hiring velocity increased before the ink in the repeal notice dried.',
    ],
  };

  nextState = withHistory(nextState, `${law.label} shredded. Regulatory pages collapsed and productivity jumped.`);
  return advanceTurn(nextState);
};

const applyShredder = (state: SimulationState, law?: string) => {
  const targetLaw = findLaw(state.lawBook, law);
  if (!targetLaw) {
    return withHistory(state, 'Every tracked law in the current BOE stack has already been shredded.');
  }

  return applyShredLawById(state, targetLaw.id);
};

const applyCharterCityByRegionId = (state: SimulationState, regionId: string) => {
  const region = state.regions.find((entry) => entry.id === regionId);
  if (!region) {
    return withHistory(state, 'That charter city target is not available.');
  }

  if (state.charterCityRegions.includes(region.id)) {
    return withHistory(state, `${region.label} already runs an active charter framework.`);
  }

  const nextRegions = state.regions.map((entry) =>
    entry.id === region.id ? { ...entry, openness: clamp(entry.openness + 18, 0, 100) } : entry,
  );

  let nextState: SimulationState = {
    ...state,
    regions: nextRegions,
    charterCities: state.charterCities + 1,
    charterCityRegions: [...state.charterCityRegions, region.id],
    gdpGrowth: clamp(state.gdpGrowth + 1.4, -5, 16),
    cohesion: clamp(state.cohesion + 2, 0, 100),
    euThreat: clamp(state.euThreat + 4, 0, 100),
    arbitrationCoverage: clamp(state.arbitrationCoverage + 4, 0, 100),
    assetMultiplier: state.assetMultiplier + 0.03,
    doctrine: {
      ...state.doctrine,
      bastos: clamp(state.doctrine.bastos + 4, 0, 100),
      prudence: clamp(state.doctrine.prudence + 2, 0, 100),
    },
    lastAction: `${region.label} launched as a charter-city pilot with hard property and contract rails.`,
    decayLog: [
      `${region.label} now competes for talent under opt-in institutional rules.`,
      'Local governance moved from decree volume to contract quality.',
      'Other regions noticed their tax base could migrate.',
    ],
  };

  nextState = withHistory(nextState, `${region.label} charter city launched. Regional openness and growth trajectory improved.`);
  return advanceTurn(nextState);
};

const applyCharterCity = (state: SimulationState, query?: string) => {
  const region = findRegion(state.regions, query);
  return applyCharterCityByRegionId(state, region.id);
};

const applyDoctrine = (state: SimulationState, doctrineId: string) => {
  let nextState: SimulationState = { ...state };

  if (doctrineId === 'property-rights-hardline') {
    nextState = {
      ...nextState,
      doctrine: {
        ...nextState.doctrine,
        rothbard: clamp(nextState.doctrine.rothbard + 14, 0, 100),
      },
      gdpGrowth: clamp(nextState.gdpGrowth + 0.9, -5, 16),
      cohesion: clamp(nextState.cohesion - 1, 0, 100),
      assetMultiplier: nextState.assetMultiplier + 0.03,
      lastAction: 'Doctrine enacted: Property Rights Hardline.',
      decayLog: [
        'Title certainty widened while discretionary bureaucracy narrowed.',
        'Investors stopped asking if contracts were rhetorical.',
        'Local officials discovered limits are not optional.',
      ],
    };
  } else if (doctrineId === 'hard-money-corridor') {
    nextState = {
      ...nextState,
      doctrine: {
        ...nextState.doctrine,
        prudence: clamp(nextState.doctrine.prudence + 11, 0, 100),
      },
      goldLockedTonnes: clamp(nextState.goldLockedTonnes + 8, 0, nextState.goldTonnes),
      cohesion: clamp(nextState.cohesion + 2, 0, 100),
      euThreat: clamp(nextState.euThreat + 3, 0, 100),
      lastAction: 'Doctrine enacted: Hard Money Corridor.',
      decayLog: [
        'Collateral density increased, so panic probability decreased.',
        'Monetary discretion took another step backward.',
        'Brussels called it destabilizing, then priced it as credible.',
      ],
    };
  } else if (doctrineId === 'polycentric-law') {
    nextState = {
      ...nextState,
      doctrine: {
        ...nextState.doctrine,
        prudence: clamp(nextState.doctrine.prudence + 9, 0, 100),
        rothbard: clamp(nextState.doctrine.rothbard + 5, 0, 100),
      },
      arbitrationCoverage: clamp(nextState.arbitrationCoverage + 10, 0, 100),
      cohesion: clamp(nextState.cohesion + 3, 0, 100),
      gdpGrowth: clamp(nextState.gdpGrowth + 0.6, -5, 16),
      lastAction: 'Doctrine enacted: Polycentric Law.',
      decayLog: [
        'Multiple legal venues now compete to enforce contracts reliably.',
        'Monopoly jurisprudence lost pricing power over uncertainty.',
        'Dispute resolution became a service market instead of a waiting room.',
      ],
    };
  } else if (doctrineId === 'municipal-exit-rails') {
    nextState = {
      ...nextState,
      doctrine: {
        ...nextState.doctrine,
        bastos: clamp(nextState.doctrine.bastos + 12, 0, 100),
      },
      gdpGrowth: clamp(nextState.gdpGrowth + 0.8, -5, 16),
      cohesion: clamp(nextState.cohesion + 2, 0, 100),
      assetMultiplier: nextState.assetMultiplier + 0.02,
      lastAction: 'Doctrine enacted: Municipal Exit Rails.',
      decayLog: [
        'Exit rights became policy discipline with real consequences.',
        'Local governance got measurable competition overnight.',
        'Citizens gained leverage simply by having a nearby alternative.',
      ],
    };
  } else {
    return withHistory(state, 'Unknown doctrine card. Choose from the visible doctrine deck.');
  }

  nextState = withHistory(nextState, `Doctrine momentum increased through ${doctrineId}.`);
  return advanceTurn(nextState);
};

const runCommand = (state: SimulationState, rawCommand: string): SimulationState => {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return withHistory(state, 'No decree entered. The debt-clock interprets silence as consent.');
  }

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
      return withHistory(
        state,
        `Unknown decree: ${command}. Try /status, /swap-debt, /liquidate, /privatize, /deregulate, /arbitrate, /charter-city, /close-ministry, /gold-bond, /shred.`,
      );
  }
};

const resolveEventChoice = (state: SimulationState, choice: 'A' | 'B'): SimulationState => {
  const event = state.currentEvent;
  if (!event) {
    return withHistory(state, 'No black swan is active. The machinery is merely grinding, not surprising.');
  }

  let nextState: SimulationState = { ...state, currentEvent: null };

  if (event.id === 'ecb-target2') {
    nextState =
      choice === 'A'
        ? {
            ...nextState,
            goldLockedTonnes: clamp(nextState.goldLockedTonnes + 28, 0, nextState.goldTonnes),
            cohesion: clamp(nextState.cohesion + 4, 0, 100),
            euThreat: clamp(nextState.euThreat + 6, 0, 100),
            gdpGrowth: clamp(nextState.gdpGrowth + 0.9, -5, 16),
            assetMultiplier: nextState.assetMultiplier + 0.04,
            doctrine: {
              ...nextState.doctrine,
              prudence: clamp(nextState.doctrine.prudence + 5, 0, 100),
            },
            decayLog: [
              'A digital peso with metal underneath is the sort of heresy markets sometimes respect.',
              'Central bankers called it irresponsible right before checking collateral schedules.',
              'Citizens prefer redeemability to rhetoric. This is awkward for governments.',
            ],
            lastAction: 'A gold-backed digital peso was announced with limited convertibility windows.',
          }
        : {
            ...nextState,
            euThreat: clamp(nextState.euThreat + 18, 0, 100),
            cohesion: clamp(nextState.cohesion - 6, 0, 100),
            gdpGrowth: clamp(nextState.gdpGrowth + 0.4, -5, 16),
            decayLog: [
              'The ECB-specific default threat landed as calmly as a chair through a window.',
              'Brussels upgraded its language from concern to legal escalation.',
              'Some traders loved the audacity. Most loved the spreads.',
            ],
            lastAction: 'The trustee threatened a selective ECB-linked default path.',
          };
  }

  if (event.id === 'pension-march') {
    nextState =
      choice === 'A'
        ? {
            ...nextState,
            cohesion: clamp(nextState.cohesion + 8, 0, 100),
            annuityPool: Math.max(0, nextState.annuityPool - 2_000_000_000),
            euThreat: clamp(nextState.euThreat - 2, 0, 100),
            decayLog: [
              'A board seat costs less than a riot and far less than a broken annuity narrative.',
              'Representation got attached to collateral instead of campaign slogans.',
              'Madrid calmed because retirees received governance rights, not another promise.',
            ],
            lastAction: 'Pensioners received trust board seats and direct reporting rights.',
          }
        : {
            ...nextState,
            taxRate: clamp(nextState.taxRate - 2, 0, 40),
            cohesion: clamp(nextState.cohesion + 5, 0, 100),
            gdpGrowth: clamp(nextState.gdpGrowth + 0.5, -5, 16),
            decayLog: [
              'Food VAT disappeared and with it a chunk of performative compassion bureaucracy.',
              'Pensioners trust cheaper groceries faster than policy white papers.',
              'Treasury desks groaned. Households did not.',
            ],
            lastAction: 'VAT on food was abolished to stabilize pensioner purchasing power.',
          };
  }

  if (event.id === 'civil-service-walkout') {
    nextState =
      choice === 'A'
        ? {
            ...nextState,
            publicEmployees: Math.max(0, nextState.publicEmployees - 250_000),
            gdpGrowth: clamp(nextState.gdpGrowth + 1.2, -5, 16),
            cohesion: clamp(nextState.cohesion + 2, 0, 100),
            assetMultiplier: nextState.assetMultiplier + 0.03,
            regions: nudgeRegions(nextState.regions, 4),
            ministriesClosed: nextState.ministriesClosed + 1,
            decayLog: [
              'The walkout became a buyout, which is much harder to chant against.',
              'Departments turned into co-ops when invoices replaced decrees.',
              'The bureaucracy lost payroll mass and the economy gained owners.',
            ],
            lastAction: 'Civil service units were tendered into voucherized cooperatives.',
          }
        : {
            ...nextState,
            annuityPool: Math.max(0, nextState.annuityPool - 9_000_000_000),
            cohesion: clamp(nextState.cohesion + 4, 0, 100),
            decayLog: [
              'Severance buys quiet, which is not noble but often efficient.',
              'The annuity pool took a hit so streets did not have to.',
              'Public order survived because the trust paid cash instead of giving speeches.',
            ],
            lastAction: 'Severance packages were paid to defuse the ministry walkout.',
          };
  }

  if (event.id === 'regional-port-auction') {
    nextState =
      choice === 'A'
        ? {
            ...nextState,
            annuityPool: nextState.annuityPool + 11_000_000_000,
            gdpGrowth: clamp(nextState.gdpGrowth + 0.8, -5, 16),
            regions: nudgeRegions(nextState.regions, 7),
            charterCities: nextState.charterCities + 1,
            decayLog: [
              'Regional concession bidding discovered prices central planning never could.',
              'Port politics gave way to margins, and everyone became a logistics analyst.',
              'Cash hit the trust while patronage networks discovered resale value was low.',
            ],
            lastAction: 'The port package was split into regional concession auctions.',
          }
        : {
            ...nextState,
            goldLockedTonnes: clamp(nextState.goldLockedTonnes + 10, 0, nextState.goldTonnes),
            euThreat: clamp(nextState.euThreat - 6, 0, 100),
            cohesion: clamp(nextState.cohesion - 2, 0, 100),
            decayLog: [
              'The ports stayed in reserve for diplomacy, proving optionality is a real asset.',
              'Brussels relaxed because leverage postponed is leverage preserved.',
              'Regional leaders complained, confirming the chip remained valuable.',
            ],
            lastAction: 'Port assets were held back as collateral in external negotiations.',
          };
  }

  nextState = withHistory(nextState, `Black swan resolved: ${event.title} via Option ${choice}.`);
  return advanceTurn(nextState);
};

export const createInitialState = (): SimulationState =>
  refreshDerived({
    initialDebt: INITIAL_DEBT,
    debt: INITIAL_DEBT,
    annualPensionBurden: ANNUAL_PENSION_BURDEN,
    trustValue: 0,
    pensionCoverage: 0,
    goldTonnes: 281.6,
    goldLockedTonnes: 118,
    annuityPool: 42_000_000_000,
    cohesion: 68,
    gdpGrowth: 1.8,
    taxRate: 37,
    euThreat: 44,
    publicEmployees: 2_700_000,
    assetMultiplier: 1,
    turns: 0,
    phase: 'Trustee',
    debtConverted: false,
    vetoLock: false,
    libertyIndex: 0,
    arbitrationCoverage: 18,
    lawPagesRemaining: 0,
    ministriesClosed: 0,
    charterCities: 0,
    doctrine: {
      rothbard: 18,
      bastos: 16,
      prudence: 22,
    },
    charterCityRegions: [],
    wire: '',
    decayLog: [
      'The state still has letterhead, which is not the same thing as solvency.',
      'The pension promise remains sacred right up to the point where math asks to see it.',
      'Brussels is watching the bond desk and pretending this is only about process.',
    ],
    lastAction: 'Awaiting first decree.',
    assets: baseAssets.map((asset) => ({ ...asset })),
    regions: baseRegions.map((region) => ({ ...region })),
    ministries: baseMinistries.map((entry) => ({ ...entry })),
    lawBook: baseLawBook.map((entry) => ({ ...entry })),
    eventsSeen: [],
    currentEvent: null,
    history: ['Simulation initialized. The debt clock starts loaded.'],
  });

export const simulationReducer = (state: SimulationState, action: SimulationAction): SimulationState => {
  switch (action.type) {
    case 'run-command':
      return runCommand(state, action.command);
    case 'event-choice':
      return resolveEventChoice(state, action.choice);
    case 'adopt-doctrine':
      return applyDoctrine(state, action.doctrineId);
    case 'close-ministry':
      return applyCloseMinistryById(state, action.ministryId);
    case 'shred-law':
      return applyShredLawById(state, action.lawId);
    case 'charter-city':
      return applyCharterCityByRegionId(state, action.regionId);
    case 'expand-arbitration':
      return applyArbitrationExpand(state);
    case 'issue-gold-bond':
      return applyGoldBond(state);
    default:
      return state;
  }
};

export const getBreakdown = (state: SimulationState): SimulationBreakdown => {
  const retainedAssetValue = state.assets.reduce(
    (sum, asset) => sum + asset.baseValue * asset.remainingShare,
    0,
  ) * state.assetMultiplier;
  const goldValue = state.goldTonnes * GOLD_VALUE_PER_TONNE;
  const annualDividendFlow = state.assets.reduce(
    (sum, asset) => sum + asset.baseValue * asset.remainingShare * asset.dividendYield,
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
