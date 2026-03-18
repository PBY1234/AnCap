# Sovereign OS

Sovereign OS is a speculative macroeconomic strategy prototype built as a single-page React application. It turns a political-financial transition scenario into an interactive dashboard with commands, black swan events, collateral tracking, and a terminal-style control loop.

## What it includes
- A debt-to-zero dashboard with pension coverage, trust value, cohesion, GDP growth, and EU pressure.
- A reducer-driven simulation engine for commands such as debt swaps, asset liquidation, privatization, deregulation, veto-lock diplomacy, and BOE shredding.
- Black swan events every few turns to force trade-offs.
- A heat-map style regional panel, annuity waterfall, and generational impact cards.
- A built-in initialization script panel for seeding a Claude-style scenario.

## Commands
- `/status`
- `/swap-debt`
- `/liquidate [asset] [percent]`
- `/privatize [department]`
- `/veto-lock`
- `/deregulate [sector]`
- `/shred [law]`

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Notes
This is a speculative simulation interface, not an economic forecast or policy recommendation. The numbers and transitions are simplified to support interaction design and proof-of-concept behavior.
