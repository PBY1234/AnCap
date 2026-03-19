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

/* ═══ INTELLIGENT AGENTS ═══════════════════════════════ */

export interface AgentTemplate {
  id: string;
  name: string;
  role: string;
  icon: string;
  bio: string;
  minTurn: number;
  innovationIds: string[];
}

export const agentTemplates: AgentTemplate[] = [
  {
    id: 'elena-vega',
    name: 'Elena Vega',
    role: 'Serial Entrepreneur',
    icon: '👩‍💼',
    bio: 'Former Mercadona logistics director. Sees deregulation gaps as startup opportunities.',
    minTurn: 1,
    innovationIds: ['private-logistics', 'insurance-markets'],
  },
  {
    id: 'marcos-pellegrini',
    name: 'Dr. Marcos Pellegrini',
    role: 'Monetary Economist',
    icon: '🧑‍🔬',
    bio: 'Juan de Mariana Institute fellow. Designs competing currency frameworks.',
    minTurn: 2,
    innovationIds: ['private-currency', 'clearing-house'],
  },
  {
    id: 'lucia-ramos',
    name: 'Lucía Ramos',
    role: 'Community Builder',
    icon: '💪',
    bio: 'Mondragon-trained cooperative leader. Converts bureaucrats into stakeholders.',
    minTurn: 1,
    innovationIds: ['mutual-aid', 'health-coops'],
  },
  {
    id: 'satoshi-serrano',
    name: '"Satoshi" Serrano',
    role: 'Crypto Architect',
    icon: '🧑‍💻',
    bio: "Anonymous dev. Built Spain's first DAOs for water and power distribution.",
    minTurn: 3,
    innovationIds: ['title-blockchain', 'dao-governance'],
  },
  {
    id: 'viktor-holm',
    name: 'Viktor Holm',
    role: 'Nordic VC',
    icon: '🤵',
    bio: 'Runs €2B Stockholm fund. Needs title clarity and court speed to deploy.',
    minTurn: 2,
    innovationIds: ['fdi-corridor', 'special-economic-zone'],
  },
  {
    id: 'carmen-torres',
    name: 'Carmen Torres',
    role: 'Legal Innovator',
    icon: '👩‍⚖️',
    bio: 'Ex-Supreme Court magistrate. Designs dispute resolution protocols.',
    minTurn: 3,
    innovationIds: ['dispute-protocol', 'contract-standard'],
  },
  {
    id: 'alejandro-ruiz',
    name: 'Alejandro Ruiz',
    role: 'Security Entrepreneur',
    icon: '🛡️',
    bio: 'Former Guardia Civil captain. Building subscription security services.',
    minTurn: 2,
    innovationIds: ['voluntary-security', 'private-fire'],
  },
  {
    id: 'ines-moreno',
    name: 'Inés Moreno',
    role: 'Agricultural Pioneer',
    icon: '🌾',
    bio: 'Runs vertical farms in Almería. Wants to replace EU subsidies with markets.',
    minTurn: 1,
    innovationIds: ['agri-coops', 'food-markets'],
  },
];

/* ═══ MARKET INNOVATIONS ══════════════════════════════ */

export interface InnovationTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'finance' | 'governance' | 'infrastructure' | 'social' | 'security' | 'tech';
  costBillions: number;
}

export const innovationTemplates: InnovationTemplate[] = [
  { id: 'private-logistics', title: 'Private Logistics Network', description: 'Entrepreneur-operated delivery mesh replacing state postal monopoly.', icon: '📦', category: 'infrastructure', costBillions: 2 },
  { id: 'insurance-markets', title: 'Competitive Insurance', description: 'Multi-provider coverage pools replacing social security mandates.', icon: '🛟', category: 'finance', costBillions: 4 },
  { id: 'private-currency', title: 'Gold-Digital Currency', description: 'Competing private money backed by allocated gold reserves.', icon: '🪙', category: 'finance', costBillions: 6 },
  { id: 'clearing-house', title: 'Private Clearing House', description: 'Non-state settlement and payment infrastructure.', icon: '🏦', category: 'finance', costBillions: 5 },
  { id: 'mutual-aid', title: 'Mutual Aid Networks', description: 'Voluntary community insurance for health and hardship.', icon: '🤝', category: 'social', costBillions: 1 },
  { id: 'health-coops', title: 'Health Cooperatives', description: 'Member-owned clinics replacing state health mandates.', icon: '🏥', category: 'social', costBillions: 4 },
  { id: 'title-blockchain', title: 'Land Title Blockchain', description: 'Immutable digital property registry eliminating title fraud.', icon: '⛓️', category: 'tech', costBillions: 4 },
  { id: 'dao-governance', title: 'DAO Municipal Gov', description: 'Smart-contract town governance with transparent treasury.', icon: '🏛️', category: 'governance', costBillions: 3 },
  { id: 'fdi-corridor', title: 'FDI Express Corridor', description: 'Fast-track foreign investment with guaranteed arbitration.', icon: '🌐', category: 'finance', costBillions: 2 },
  { id: 'special-economic-zone', title: 'Special Economic Zone', description: 'Zero-regulation production zone with own port access.', icon: '🏭', category: 'governance', costBillions: 5 },
  { id: 'dispute-protocol', title: 'Dispute Resolution Protocol', description: 'Multi-tier arbitration cutting resolution time 80%.', icon: '📋', category: 'governance', costBillions: 2 },
  { id: 'contract-standard', title: 'Universal Contract Std', description: 'Machine-readable contracts for cross-border enforcement.', icon: '📄', category: 'tech', costBillions: 3 },
  { id: 'voluntary-security', title: 'Security Cooperatives', description: 'Subscription neighborhood security replacing police monopoly.', icon: '🔒', category: 'security', costBillions: 3 },
  { id: 'private-fire', title: 'Private Fire & Rescue', description: 'Community-funded fire service with rapid response.', icon: '🚒', category: 'security', costBillions: 2 },
  { id: 'agri-coops', title: 'Agricultural Cooperatives', description: 'Farmer-owned supply chains bypassing state distribution.', icon: '🌱', category: 'infrastructure', costBillions: 3 },
  { id: 'food-markets', title: 'Direct Farm Markets', description: 'Deregulated farm-to-city trading without middlemen.', icon: '🥬', category: 'infrastructure', costBillions: 1 },
  { id: 'energy-grid', title: 'Community Energy Grid', description: 'Decentralized solar+storage owned by neighborhoods.', icon: '⚡', category: 'infrastructure', costBillions: 5 },
  { id: 'education-market', title: 'Education Marketplace', description: 'Voucher-funded private academies competing on outcomes.', icon: '📚', category: 'social', costBillions: 3 },
];

export const seasonNames = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;

/* ═══ PROLOGUE CARDS ════════════════════════════════════ */

export interface PrologueCard {
  id: string;
  title: string;
  body: string;
  icon: string;
  stat: string;
}

export const prologueCards: PrologueCard[] = [
  {
    id: 'prologue-1',
    title: 'Madrid, March 2026',
    icon: '🏛️',
    body: 'Spain\'s sovereign debt hit €1.65 trillion at dawn. By noon, Fitch had cut the rating to junk. The Prime Minister resigned live on television — mid-sentence. By evening, Brussels had appointed you.\n\nYour title: Liquidation Trustee. Your mandate: convert a bankrupt state into something its 47 million citizens can survive.',
    stat: 'Debt: €1.65T · Rating: Junk · Government: Dissolved',
  },
  {
    id: 'prologue-2',
    title: 'The Inheritance',
    icon: '📋',
    body: 'You inherit 2.7 million public employees, 9.5 million pensioners with unfunded promises, 32,800 pages of regulation, six ministries that have never once audited themselves, and 281 tonnes of gold in a vault under Madrid.\n\nAlso: €42 billion in an annuity pool, the goodwill of a population that hasn\'t panicked yet, and a window that closes in roughly ten turns.',
    stat: 'Gold: 281t · Employees: 2.7M · Pensioners: 9.5M',
  },
  {
    id: 'prologue-3',
    title: 'The Rules',
    icon: '⚖️',
    body: 'You will be offered shortcuts. The EU will offer bailouts with strings. Generals will offer stability with strings. The IMF will offer liquidity with strings. Populists will offer hope with strings.\n\nEvery string leads to the same place: a state that cannot die because someone keeps resuscitating it.\n\nYour job is to let it die — carefully, humanely, and faster than the bond market loses patience.',
    stat: 'Interventionist Temptations will appear. Resist them — or don\'t.',
  },
];

/* ═══ TEMPTATION CARDS ══════════════════════════════════ */


export const temptationDeck = [
  // Phase: Trustee
  {
    id: 'tempt-eu-bridge',
    title: 'EU Emergency Bridge Loan',
    source: 'European Commission',
    sourceIcon: '🇪🇺',
    flavour: 'Von der Leyen is on the phone. "We can wire €80 billion by Friday. Conditionality is minimal — just pause the privatisations for 90 days."',
    offer: '+€80B annuity pool, −20 EU threat, +8 cohesion',
    poison: 'Privatisation freeze for 3 turns. +15 interventionCount. Liberty index locked.',
    acceptLabel: 'Accept the bridge loan',
    refuseLabel: 'Decline — we go it alone',
    minPhase: 'Trustee',
  },
  {
    id: 'tempt-price-controls',
    title: 'Emergency Price Controls',
    source: 'Deputy PM (Caretaker)',
    sourceIcon: '🤵',
    flavour: 'The caretaker government is nervous. "Inflation is at 9%. One decree — price caps on food and fuel — and the protests stop. Nobody needs to know it came from us."',
    offer: '+12 cohesion, −4 inflation short-term, +public mood',
    poison: 'Food security −15 next 2 turns. Black market +25. GDP growth −1.2.',
    acceptLabel: 'Issue the price caps',
    refuseLabel: 'Refuse — let markets clear',
    minPhase: 'Trustee',
    requiredStat: { key: 'inflation', above: 7 },
  },
  {
    id: 'tempt-imf-conditionality',
    title: 'IMF Standby Arrangement',
    source: 'IMF Managing Director',
    sourceIcon: '🏦',
    flavour: '"Fifty billion in Special Drawing Rights, immediate access. The conditionality clause just requires you to maintain the tax rate above 20% and preserve the pension ministry structure."',
    offer: '+€50B pool, −10 EU threat, +10 international reputation',
    poison: 'Tax rate locked ≥20% for 4 turns. Pension ministry cannot be closed.',
    acceptLabel: 'Sign the standby arrangement',
    refuseLabel: 'Walk away from the table',
    minPhase: 'Trustee',
  },
  // Phase: Liquidator
  {
    id: 'tempt-renationalise',
    title: 'Re-nationalise the Grid',
    source: 'Unión General de Trabajadores (UGT)',
    sourceIcon: '✊',
    flavour: '"Workers are scared. Re-nationalise the energy grid for one year — call it a transition measure. It saves 40,000 jobs and the unions will stop blocking the rest of your programme."',
    offer: '+10 cohesion, +8 energy stability, +military loyalty +5',
    poison: 'Liberty index −12. Asset multiplier −0.08. EU threat +10.',
    acceptLabel: 'Accept the re-nationalisation',
    refuseLabel: 'Hold the line on privatisation',
    minPhase: 'Liquidator',
    requiredStat: { key: 'energyStability', below: 45 },
  },
  {
    id: 'tempt-wealth-tax',
    title: 'Emergency Wealth Levy',
    source: 'Podemos (Rump faction)',
    sourceIcon: '💰',
    flavour: '"Two percent on assets above €5M — collected once, right now. We\'re talking €35 billion. You get your runway. We get to say markets were regulated."',
    offer: '+€35B annuity pool, +6 cohesion, −EU threat 5',
    poison: 'Capital flight +30, international reputation −15, asset multiplier −0.06, liberty index −8.',
    acceptLabel: 'Levy the wealth tax',
    refuseLabel: 'Refuse capital confiscation',
    minPhase: 'Liquidator',
    requiredStat: { key: 'annuityPool', below: 30_000_000_000 },
  },
  {
    id: 'tempt-media-blackout',
    title: 'Temporary Press Restrictions',
    source: 'Interior Ministry (Dissolved)',
    sourceIcon: '📰',
    flavour: 'A ghost of the old Interior Ministry surfaces. "Six news channels are running coordinated panic narratives. One decree — 30-day emergency broadcast rules — and we control the story."',
    offer: '+8 cohesion, EU threat −6, −emigration rate 1.5',
    poison: 'International reputation −20, liberty index −10, corruption +8. EU threat surges after 2 turns.',
    acceptLabel: 'Restrict the press',
    refuseLabel: 'Defend free speech',
    minPhase: 'Liquidator',
    requiredStat: { key: 'cohesion', below: 45 },
  },
  // Phase: Architect
  {
    id: 'tempt-army-order',
    title: 'Military Administration Order',
    source: 'General Varela, Army Chief',
    sourceIcon: '🎖️',
    flavour: '"Six provinces are ungoverned. I can restore order in 48 hours — interim military administration, just for the transition. No politics. Just order."',
    offer: '+15 public safety, +10 cohesion, −black market 20',
    poison: 'Military loyalty becomes military power. Liberty index −20. International reputation −15. Coup risk doubles.',
    acceptLabel: 'Grant military authority',
    refuseLabel: 'Keep the military in barracks',
    minPhase: 'Architect',
    requiredStat: { key: 'publicSafety', below: 35 },
  },
  {
    id: 'tempt-sovereign-fund',
    title: 'State Sovereign Wealth Fund',
    source: 'Goldman Sachs / BlackRock Consortium',
    sourceIcon: '🏦',
    flavour: '"Create a €200B sovereign wealth fund — we manage it. Returns fund the pensions, interest pays the debt. You hand over asset control for 15 years. Pensions are safe overnight."',
    offer: '+pension coverage 40%, +€80B pool, EU threat −10',
    poison: 'Assets locked for 4 turns. Liberty index −8. Asset control partially surrendered.',
    acceptLabel: 'Create the wealth fund',
    refuseLabel: 'Keep assets in trust hands',
    minPhase: 'Architect',
  },
  {
    id: 'tempt-bitcoin-mandate',
    title: 'Mandatory Crypto Reserve',
    source: '"Satoshi" Serrano (if present)',
    sourceIcon: '🧑‍💻',
    flavour: '"Make bitcoin legal tender by decree. Force businesses to hold 5% reserves in BTC. Instant inflation hedge, instant international attention, instant capital inflow."',
    offer: '+private currency adoption 30%, inflation −6, reputation +10',
    poison: 'EU threat +18, cohesion −8, market volatility spike.',
    acceptLabel: 'Issue the bitcoin mandate',
    refuseLabel: 'Keep currency voluntary',
    minPhase: 'Architect',
    requiredStat: { key: 'privateCurrencyAdoption', below: 30 },
  },
];

/* ═══ PHASE-GATED ACTIONS ══════════════════════════════ */

export interface UnlockableAction {
  id: string;
  tier: number;      // 1-4
  phase: 'Trustee' | 'Liquidator' | 'Architect' | 'Sovereign';
  icon: string;
  cardTier: 'common' | 'rare' | 'epic' | 'legendary';
  title: string;
  desc: string;
  cost: string;
  command?: string;
  actionType?: string;
  unlockNote?: string;
}

export const unlockableActions: UnlockableAction[] = [
  // Tier 1 — Trustee (always available)
  { id: 'swap-debt',   tier:1, phase:'Trustee',   icon:'💱', cardTier:'rare',    title:'Equity Swap',        desc:'Convert sovereign debt into trust shares. The single most important first move.',              cost:'−9 cohesion, +EU threat', command:'/swap-debt' },
  { id: 'gold-bond',   tier:1, phase:'Trustee',   icon:'🪙', cardTier:'epic',    title:'Gold Bond Ladder',   desc:'Ring-fence gold reserves against pension liabilities. Calms the retiree bloc.',                cost:'+pension, +EU threat',    actionType:'issue-gold-bond' },
  { id: 'status',      tier:1, phase:'Trustee',   icon:'📊', cardTier:'common',  title:'Status Pulse',       desc:'Refresh the dashboard. Free action. Always useful.',                                         cost:'free',                    command:'/status' },
  { id: 'liquidate',   tier:1, phase:'Trustee',   icon:'🏪', cardTier:'common',  title:'Auction Asset',      desc:'Sell a stake in AENA. Routes proceeds directly to the annuity pool.',                       cost:'+annuity',                command:'/liquidate aena 10' },
  // Tier 2 — Liquidator
  { id: 'veto-lock',   tier:2, phase:'Liquidator',icon:'🛡️', cardTier:'epic',   title:'Veto Lock',          desc:'Diplomatic shield. Buy time against Brussels escalation.',                                    cost:'−16 EU threat',           command:'/veto-lock', unlockNote:'Unlocked: Liquidator phase' },
  { id: 'privatize',   tier:2, phase:'Liquidator',icon:'🤝', cardTier:'common',  title:'Privatise Ministry', desc:'Move payroll into worker cooperatives. Short-term unemployment spike, long-term freedom.',  cost:'+unemp short-term',       command:'/privatize Transport Ministry', unlockNote:'Unlocked: Liquidator phase' },
  { id: 'deregulate',  tier:2, phase:'Liquidator',icon:'✂️', cardTier:'rare',    title:'Deregulate Energy',  desc:'Burn compliance friction. Lifts GDP and asset multipliers.',                                  cost:'+growth',                 command:'/deregulate Energy', unlockNote:'Unlocked: Liquidator phase' },
  { id: 'deregulate-agri', tier:2, phase:'Liquidator',icon:'🌱', cardTier:'rare', title:'Deregulate Agri',  desc:'Free the farms. Boosts food security and rural employment.',                                cost:'+food',                   command:'/deregulate Agriculture', unlockNote:'Unlocked: Liquidator phase' },
  // Tier 3 — Architect
  { id: 'arbitrate',   tier:3, phase:'Architect', icon:'⚖️', cardTier:'rare',    title:'Arbitration Mesh',   desc:'Expand private court coverage. Reduces corruption and black market.',                         cost:'+10 arb coverage',        actionType:'expand-arbitration', unlockNote:'Unlocked: Architect phase' },
  { id: 'charter',     tier:3, phase:'Architect', icon:'🗺️', cardTier:'epic',    title:'Charter City',       desc:'Launch an opt-in governance zone. Attracts investment and talent.',                          cost:'+liberty, +EU threat',    command:'/charter-city Valencia', unlockNote:'Unlocked: Architect phase' },
  { id: 'fdi',         tier:3, phase:'Architect', icon:'🌐', cardTier:'epic',    title:'FDI Fast Track',     desc:'Open a foreign investment corridor with guaranteed arbitration.',                            cost:'+reputation',             command:'/deregulate Finance', unlockNote:'Unlocked: Architect phase' },
  // Tier 4 — Sovereign
  { id: 'zero-tax',    tier:4, phase:'Sovereign', icon:'🪓', cardTier:'legendary',title:'Zero Tax Decree',   desc:'Abolish all remaining taxation. The final act of the fiscal state.',                         cost:'−tax rate, +EU crisis',   command:'/deregulate Tax', unlockNote:'Unlocked: Sovereign phase' },
  { id: 'dissolve',    tier:4, phase:'Sovereign', icon:'👑', cardTier:'legendary',title:'Dissolve the State', desc:'Issue the final dissolution decree. Voluntary order only from here.',                       cost:'Full commitment required',command:'/status', unlockNote:'Unlocked: Sovereign phase' },
];

/* ═══ HEADLINES ════════════════════════════════════════ */
export const headlines: Record<string, string[]> = {
  Trustee: [
    '"SPAIN IN FREEFALL: Liquidation Trustee Named Amid Market Chaos" — Reuters',
    '"Is Spain the First to Try Anarcho-Capitalism? Experts Unsure" — FT',
    '"The Debt Is Gone But the Math Remains" — El País',
    '"Brussels Warns: This Is Unconventional" — Euronews',
    '"Gold Vault Opened: What Does It Mean?" — Bloomberg',
  ],
  Liquidator: [
    '"Three Ministries Closed: Unions Call Strike, Markets Cheer" — El Mundo',
    '"AENA Stake Sold: Foreign Investors Queue" — WSJ',
    '"Spain\'s Tax Rate Falls Below France\'s For First Time Since 1978" — Le Monde',
    '"Cooperatives Rise From Bureaucratic Ashes" — Guardian',
    '"Brussels Sends Third Warning Letter" — Politico',
  ],
  Architect: [
    '"Charter City Barcelona: 40,000 Firms Applied in Week One" — Bloomberg',
    '"Private Arbitration Courts Handle 60% of Commercial Disputes" — FT',
    '"Is This Working? GDP Rises As Government Shrinks" — Economist',
    '"The Hayek Experiment: Year Two" — New Yorker',
    '"NATO Nervous As Spain Privatises Defence Contracts" — BBC',
  ],
  Sovereign: [
    '"SPAIN DOES IT: Zero Tax, Zero Debt, Zero State" — Breaking',
    '"The Market Order Holds — For Now" — Reuters',
    '"Spain Becomes The World\'s Freest Economy" — Heritage Foundation',
    '"What Brussels Got Wrong About Spain" — FT Editorial',
    '"Rothbard Would Have Approved" — Mises Institute',
  ],
};

/* ═══ PUBLIC MOOD NARRATIVES ════════════════════════════ */
export const moodNarratives: Record<string, string> = {
  high_cohesion_early:   'Citizens are cautiously hopeful. The trust framework is strange but the pension promises feel real.',
  low_cohesion_early:    'Anger is building. Queues at employment offices. The transition\'s legitimacy is being tested in the streets.',
  high_food:             'Markets are stocked. Mutual aid networks fill gaps. People are eating.',
  low_food:              'Food queues are forming. The agricultural deregulation hasn\'t taken hold yet. Time is short.',
  high_liberty:          'The private sector is booming. Entrepreneurs are calling Spain "the new Hong Kong of Europe."',
  low_safety:            'Crime is rising in ungoverned zones. The voluntary security model is not yet mature enough.',
  high_gdp:              'The economy is growing faster than any forecast. Tax revenue is collapsing — but so is expenditure.',
  inflation_bad:         'Prices are rising faster than wages. The black market is expanding. People are losing faith in the currency.',
  temptation_accepted:   'Some celebrate the pragmatic move. Purists within the transition warn of precedent-setting compromises.',
  great:                 'The transition is ahead of schedule. Agents are arriving. Innovations are spreading. This might actually work.',
};