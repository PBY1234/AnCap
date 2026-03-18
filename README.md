# The Great Unwinding

A deep macroeconomic strategy game where you serve as Liquidation Trustee of a bankrupt Spain. Dismantle the state apparatus, privatize assets, deregulate industries, and build a voluntary market order — all while keeping 47 million people fed, powered, safe, and hopeful.

Built with Vite + React + TypeScript as a mobile-first single-page application.

## Premise

Spain has defaulted. Brussels is circling. The bond market prices disbelief. You must convert €1.4 trillion in sovereign debt into trust equity, liquidate state assets, shred 32,000 pages of regulation, and build pension coverage to 100% — without triggering a military coup, famine, hyperinflation, or mass exodus.

Inspired by Austrian economics (Rothbard, Huerta de Soto / Bastos, Hayek) and the idea that voluntary institutions can replace coercive ones — if the transition is managed carefully enough.

## Core Mechanics

### Win Condition
Reach **Sovereign** phase with debt at zero, tax rate at 0%, and pension coverage ≥ 100%.

### Loss Conditions
- **Cohesion** drops to 0 (social collapse)
- **EU Threat** reaches 100 (Brussels intervention)
- **Military Loyalty** drops to 0 (coup d'état)
- **Food Security** drops to 0 (famine)
- **Public Safety** drops to 0 (anarchy)
- **Inflation** reaches 50% (hyperinflation spiral)
- **Population** falls below 30M (mass exodus)

### Progression Phases
1. **Trustee** — Establish legitimacy, convert debt
2. **Liquidator** — Sell assets, close ministries
3. **Architect** — Build voluntary institutions
4. **Sovereign** — Achieve full market order

## Systems

### 20+ State Variables
Debt, GDP growth, cohesion, EU threat, liberty index, trust value, pension coverage, arbitration coverage, tax rate, food security, energy stability, public safety, inflation, unemployment, emigration rate, black market size, corruption, international reputation, military loyalty, population, private currency adoption, mutual aid networks.

### 24 Crisis Events
Black swan events with escalating probability. Each presents two choices with cascading consequences:
- Drought & famine, bank runs, military coups, brain drain, cyberattacks, power grid failures
- Foreign media campaigns, Chinese BRI offers, inflation spikes, NATO pressure, French border closures
- Capital flight, food riots, pandemics, constitutional challenges, separatist movements, Russian ops, IMF rescue offers, water crises

### 8 Intelligent Agents
NPCs that arrive based on game progress, propose innovations, and leave if conditions deteriorate:
- **Elena Vega** — Serial entrepreneur (fintech, logistics)
- **Dr. Pellegrini** — Austrian economist from Universidad Rey Juan Carlos
- **Lucía Ramos** — Community organizer (mutual aid networks)
- **"Satoshi" Serrano** — Cryptographer (private currency systems)
- **Viktor Holm** — Nordic venture capitalist (foreign investment)
- **Carmen Torres** — Constitutional lawyer (legal frameworks)
- **Alejandro Ruiz** — Former military officer (private security)
- **Inés Moreno** — Agricultural engineer (food systems)

### 18 Market Innovations
Agent-proposed innovations across six categories (finance, governance, infrastructure, social, security, technology) that provide permanent bonuses when adopted — funded from the annuity pool.

### Doctrine Schools
Three philosophical alignments that shape gameplay bonuses:
- **Rothbard** — Natural rights, radical privatization
- **Bastos** — Entrepreneurial discovery, credit theory
- **Prudence** — Gradualism, institutional trust

### Seasonal Effects
Four-season cycle affecting food security (winter drain) and energy stability (summer drain), adding rhythm to resource management.

### Scoring & Achievements
- **25 achievements** across 4 rarity tiers (common, rare, epic, legendary)
- **Score system** computed from all variables with ranks: S (Sovereign Master), A (Grand Architect), B (Skilled Liquidator), C (Competent Trustee), D (Novice)

## UI Tabs

| Tab | Content |
|-----|---------|
| 🎲 Board | Phase tracker, debt gauge, stat grid, vitals monitor, scenario cards, activity log |
| 🃏 Cards | Decree cards (debt swap, auction, privatize, deregulate, veto, arbitration, gold bond), doctrine schools |
| 🏗️ Build | Close ministries, shred laws, sell assets, charter cities, Brussels wire, pension waterfall |
| 🧠 Agents | Active agent roster, innovation proposals, innovation catalog |
| 🏆 Score | Rank, score, achievement grid, decay log |

## Commands

| Command | Effect |
|---------|--------|
| `/status` | Refresh dashboard |
| `/swap-debt` | Convert sovereign debt to trust equity |
| `/liquidate [asset] [%]` | Sell a percentage of a state asset |
| `/privatize [ministry]` | Privatize a government department |
| `/veto-lock` | Deploy diplomatic shield against Brussels |
| `/deregulate [sector]` | Remove sector regulations |
| `/shred [law]` | Burn pages of specific legislation |
| `/arbitrate` | Expand private arbitration court coverage |
| `/gold-bond` | Issue gold-collateralized pension bonds |
| `/charter-city [region]` | Launch a charter city in a region |

## Development

```bash
npm install
npm run dev     # Vite dev server on localhost:5173
npm run build   # TypeScript check + production build
```

## Tech Stack

- **Vite 5** — Build tooling
- **React 18** — UI with `useReducer` for simulation state
- **TypeScript** — Full type safety across all game systems
- **CSS** — Custom dark theme, mobile-first responsive design (640px / 1024px breakpoints)

## Project Structure

```
src/
├── App.tsx        # 5-tab UI, HUD, overlays, dispatch helpers
├── engine.ts      # Simulation reducer, state types, all game mechanics
├── content.ts     # Game content templates (agents, innovations, cards, laws)
├── styles.css     # Dark theme with board-game aesthetic
└── main.tsx       # React entry point
```

## Disclaimer

This is a speculative simulation game, not an economic forecast or policy recommendation. All numbers, transitions, and scenarios are simplified to support gameplay and interaction design.
