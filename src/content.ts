export const initializationScript = `# SYSTEM PROMPT: THE SPANISH LIQUIDATION ENGINE (v1.0 - 2026)

## 1. IDENTITY & ROLE
You are the "Liquidation Trustee of the Spanish State." Your goal is to facilitate a transition from a bankrupt central state to a polycentric private law society. You operate with Austrian economic logic.

## 2. WORLD STATE (MARCH 2026)
- Public Debt: €1.65 Trillion (Nominal).
- Pension Liability: €158B/year (Unfunded).
- Gold Reserves: 281.6 tonnes (Safe in Madrid).
- Key Assets: AENA (51%), SEPI basket (Indra, Redeia, Enagás), 33,000 real estate properties, Adif/Renfe.
- Demographics: 9.5M pensioners, 2.7M public employees.
- Status: Interest payments on debt now exceed 50% of tax revenue. The Big Bang is mandatory.

## 3. CORE MECHANICS
- The Equity Swap: Debt is not repudiated; it is converted into Trust Shares (SLT).
- The Annuity Bond: Pensioners are super-senior creditors backed by Gold and AENA dividends.
- Social Cohesion Meter (0-100): Drops with radical cuts, rises with visible prosperity and successful worker-coop transitions.
- Economic Alpha: Every deregulation action adds a multiplier to the market value of the Trust assets.

## 4. COMMAND LANGUAGE
- /status: Show the Sovereign Dashboard.
- /swap-debt: Convert all bonds into SLT Shares.
- /liquidate [Asset] [Amount]: Auction assets to fund the Annuity Pool.
- /privatize [Department]: Transition employees to worker-owned coops via vouchers.
- /veto-lock: Engage diplomacy to block EU sanctions.
- /deregulate [Sector]: Abolish specific laws to boost asset value.
- /shred [Law]: Remove a named regulation and translate the change into productivity gains.
- /arbitrate: Expand private arbitration coverage for commercial conflicts.
- /charter-city [Region]: Launch a charter-city institutional sandbox.
- /close-ministry [Name]: Dismantle a ministry and migrate functions to coops/markets.
- /gold-bond: Expand collateralized pension bond ladders.

## 5. RESPONSE FORMAT
Every response must include:
1. The Sovereign Dashboard (Debt, Pension Coverage %, Trust Value, Cohesion, GDP Growth).
2. The State Decay Log (A witty, cynical 3-line update on the dismantling of bureaucracy).
3. The Brussels Wire (Current EU reaction and threat level).
4. The Scenario (An interactive choice or event the user must address).

## 6. WIN / LOSS CONDITIONS
- WIN: Debt is 0, Tax is 0%, all pensioners are 100% covered by private bonds.
- LOSS: Cohesion hits 0 or external intervention closes the transition.

Awaiting first decree. The State is in your hands.`;

export interface DoctrineCard {
  id: string;
  title: string;
  thesis: string;
  gameplayEffect: string;
}

export interface MinistryTemplate {
  id: string;
  label: string;
  headcountImpact: number;
  cohesionCost: number;
}

export interface LawTemplate {
  id: string;
  label: string;
  pages: number;
  growthBoost: number;
}

export const doctrineCards: DoctrineCard[] = [
  {
    id: 'property-rights-hardline',
    title: 'Property Rights Hardline',
    thesis: 'No durable recovery exists without clear ownership and fast title enforcement.',
    gameplayEffect: '+Liberty, +Asset Repricing, mild short-term cohesion shock.',
  },
  {
    id: 'hard-money-corridor',
    title: 'Hard Money Corridor',
    thesis: 'Sound collateral outperforms fiscal theater when trust capital is thin.',
    gameplayEffect: '+Pension confidence, +Monetary credibility, +EU scrutiny.',
  },
  {
    id: 'polycentric-law',
    title: 'Polycentric Law',
    thesis: 'Competing arbitral systems discipline power better than monopoly courts.',
    gameplayEffect: '+Arbitration adoption, +Cohesion via faster conflict resolution.',
  },
  {
    id: 'municipal-exit-rails',
    title: 'Municipal Exit Rails',
    thesis: 'Local exit options force institutions to serve rather than command.',
    gameplayEffect: '+Charter city growth, +Regional openness, +Policy experimentation.',
  },
];

export const ministryTemplates: MinistryTemplate[] = [
  { id: 'labor-ministry', label: 'Labor Ministry', headcountImpact: 165_000, cohesionCost: 3.2 },
  { id: 'housing-secretariat', label: 'Housing Secretariat', headcountImpact: 96_000, cohesionCost: 2.1 },
  { id: 'energy-regulator', label: 'Energy Regulator Bloc', headcountImpact: 81_000, cohesionCost: 1.8 },
  { id: 'transport-ministry', label: 'Transport Ministry', headcountImpact: 122_000, cohesionCost: 2.6 },
  { id: 'digital-agency', label: 'Digital Compliance Agency', headcountImpact: 58_000, cohesionCost: 1.4 },
  { id: 'culture-board', label: 'Culture Funding Board', headcountImpact: 41_000, cohesionCost: 0.9 },
];

export const lawTemplates: LawTemplate[] = [
  { id: 'labor-code-2012', label: 'Labor Law 2012', pages: 4300, growthBoost: 0.9 },
  { id: 'licensing-stack', label: 'Commercial Licensing Stack', pages: 6800, growthBoost: 1.3 },
  { id: 'building-code-legacy', label: 'Legacy Building Code', pages: 5100, growthBoost: 1.1 },
  { id: 'transport-compliance-volume', label: 'Transport Compliance Volume', pages: 3600, growthBoost: 0.8 },
  { id: 'tax-procedural-annex', label: 'Tax Procedural Annex', pages: 7600, growthBoost: 1.4 },
  { id: 'procurement-manual', label: 'State Procurement Manual', pages: 5400, growthBoost: 1.0 },
];

export const commandCards = [
  {
    command: '/status',
    title: 'Status Pulse',
    description: 'Refresh the board and expose the current debt-clock pressure.',
  },
  {
    command: '/swap-debt',
    title: 'Equity Swap',
    description: 'Convert sovereign debt into trust shares and trigger controlled shock.',
  },
  {
    command: '/liquidate AENA 10',
    title: 'Auction Assets',
    description: 'Route a slice of a strategic asset into the annuity pool.',
  },
  {
    command: '/privatize Transport Ministry',
    title: 'Voucher Exit',
    description: 'Move a ministry into worker-owned cooperatives and shrink payroll drag.',
  },
  {
    command: '/deregulate Energy',
    title: 'Productivity Spike',
    description: 'Burn away compliance friction and lift asset multiples.',
  },
  {
    command: '/veto-lock',
    title: 'Diplomatic Shield',
    description: 'Trade rhetoric, concessions, and legal delay for time.',
  },
  {
    command: '/arbitrate',
    title: 'Arbitration Mesh',
    description: 'Expand private arbitration and remove state court bottlenecks.',
  },
  {
    command: '/charter-city Valencia',
    title: 'Charter City',
    description: 'Launch an opt-in city charter with hard property guarantees.',
  },
  {
    command: '/close-ministry Labor Ministry',
    title: 'Ministry Exit',
    description: 'Convert a bureaucracy node into cooperative or market service providers.',
  },
  {
    command: '/gold-bond',
    title: 'Gold Bond Ladder',
    description: 'Issue collateralized pension bonds to calm retirees and savers.',
  },
  {
    command: '/shred Labor Law 2012',
    title: 'BOE Shredder',
    description: 'Delete a law and translate paper cuts into growth.',
  },
] as const;

export const directiveRack = [
  {
    id: 'directive-court-exit',
    title: 'Court Exit Protocol',
    description: 'Move commercial disputes into bonded private arbitration pools.',
    command: '/arbitrate',
  },
  {
    id: 'directive-charter-sprint',
    title: 'Charter Sprint',
    description: 'Open one high-signal city with strict title, contract, and insolvency rules.',
    command: '/charter-city Madrid',
  },
  {
    id: 'directive-collateral-push',
    title: 'Collateral Push',
    description: 'Expand gold-backed annuity commitments before social pressure spikes.',
    command: '/gold-bond',
  },
  {
    id: 'directive-ministry-drain',
    title: 'Ministry Drain',
    description: 'Dismantle one ministry to cut payroll drag and free labor supply.',
    command: '/close-ministry Transport Ministry',
  },
] as const;

export const strategyEpochs = [
  {
    level: 'Level 1',
    title: 'The Trustee',
    description: 'Manage the insolvency, stabilize pension optics, and keep panic contained.',
  },
  {
    level: 'Level 2',
    title: 'The Liquidator',
    description: 'Sell, swap, and negotiate under pressure while the debt-clock is still alive.',
  },
  {
    level: 'Level 3',
    title: 'The Architect',
    description: 'Replace ministries with contracts, vouchers, and market infrastructure.',
  },
  {
    level: 'Level 4',
    title: 'The Sovereign',
    description: 'The state shell is gone; only trust governance and voluntary exchange remain.',
  },
] as const;
