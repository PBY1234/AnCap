import { startTransition, useDeferredValue, useReducer, useState } from 'react';
import { commandCards, directiveRack, doctrineCards, initializationScript, strategyEpochs } from './content';
import { createInitialState, getBreakdown, simulationReducer, type Phase, type SimulationState } from './engine';

const currencyCompact = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const currencyFull = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat('en-IE');

const phaseIndex: Record<Phase, number> = {
  Trustee: 0,
  Liquidator: 1,
  Architect: 2,
  Sovereign: 3,
};

interface PromptScenario {
  title: string;
  summary: string;
  prompts: string[];
}

const fallbackScenario = (state: SimulationState): PromptScenario => {
  if (!state.debtConverted) {
    return {
      title: 'First Decree',
      summary: 'The bond market still prices disbelief. Debt conversion and collateral credibility remain the opening move.',
      prompts: ['/swap-debt', '/gold-bond'],
    };
  }

  if (state.pensionCoverage < 100) {
    return {
      title: 'Coverage Gap',
      summary: 'Pension optics are improving, but collateral still needs to outrun fear narratives.',
      prompts: ['/liquidate aena 10', '/gold-bond'],
    };
  }

  if (state.lawPagesRemaining > 12_000) {
    return {
      title: 'Regulatory Overhang',
      summary: 'The tax burden may be falling, but law-volume drag is still absorbing entrepreneurial energy.',
      prompts: ['/shred Labor Law 2012', '/deregulate Energy'],
    };
  }

  return {
    title: 'Sovereign Endgame',
    summary: 'Debt pressure is controlled. Now convert institutional wins into a stable post-state market order.',
    prompts: ['/arbitrate', '/charter-city Valencia'],
  };
};

const euro = (value: number) => currencyCompact.format(value);
const euroFull = (value: number) => currencyFull.format(value);
const pct = (value: number) => `${value.toFixed(1)}%`;

const getGrandmaFactor = (state: SimulationState) => {
  if (state.pensionCoverage >= 110) {
    return 'Grandma factor: pension security has moved from political promise to over-collateralized balance sheet reality.';
  }

  if (state.pensionCoverage >= 90) {
    return 'Grandma factor: the retirement narrative is now mostly collateralized, but confidence still depends on consistent execution.';
  }

  return 'Grandma factor: pension anxiety remains elevated. Keep collateral actions ahead of political volatility.';
};

const getEntrepreneurFactor = (state: SimulationState) => {
  if (state.lawPagesRemaining <= 7000 && state.gdpGrowth >= 8) {
    return 'Entrepreneur factor: launch friction is collapsing and venture formation is outpacing administrative throughput.';
  }

  if (state.libertyIndex >= 65) {
    return 'Entrepreneur factor: ownership security is credible enough to trigger private risk-taking in more sectors.';
  }

  return 'Entrepreneur factor: momentum exists, but legal drag is still slowing capital formation.';
};

const getCohesionFactor = (state: SimulationState) => {
  if (state.cohesion >= 75 && state.arbitrationCoverage >= 60) {
    return 'Cohesion factor: private law rails are reducing social conflict faster than emergency politics can inflame it.';
  }

  if (state.cohesion >= 60) {
    return 'Cohesion factor: society is tense but cooperative; visible gains are still the best stabilizer.';
  }

  return 'Cohesion factor: social trust is fragile. Favor collateralized and immediately felt improvements.';
};

function App() {
  const [state, dispatch] = useReducer(simulationReducer, undefined, createInitialState);
  const [commandInput, setCommandInput] = useState('/status');
  const deferredCommand = useDeferredValue(commandInput);
  const breakdown = getBreakdown(state);
  const currentEpoch = strategyEpochs[phaseIndex[state.phase]];
  const scenario = state.currentEvent ?? fallbackScenario(state);

  const submitCommand = (command: string) => {
    startTransition(() => {
      dispatch({ type: 'run-command', command });
    });
    setCommandInput('/status');
  };

  const resolveEvent = (choice: 'A' | 'B') => {
    startTransition(() => {
      dispatch({ type: 'event-choice', choice });
    });
  };

  const adoptDoctrine = (doctrineId: string) => {
    startTransition(() => {
      dispatch({ type: 'adopt-doctrine', doctrineId });
    });
  };

  const closeMinistry = (ministryId: string) => {
    startTransition(() => {
      dispatch({ type: 'close-ministry', ministryId });
    });
  };

  const shredLaw = (lawId: string) => {
    startTransition(() => {
      dispatch({ type: 'shred-law', lawId });
    });
  };

  const launchCharter = (regionId: string) => {
    startTransition(() => {
      dispatch({ type: 'charter-city', regionId });
    });
  };

  const expandArbitration = () => {
    startTransition(() => {
      dispatch({ type: 'expand-arbitration' });
    });
  };

  const issueGoldBond = () => {
    startTransition(() => {
      dispatch({ type: 'issue-gold-bond' });
    });
  };

  const handleCommandSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitCommand(commandInput);
  };

  return (
    <main className="app-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <span className="eyebrow">Sovereign OS / Doctrine Strategy Simulator</span>
          <h1>The Great Unwinding</h1>
          <p className="hero-text">
            A command-center simulation for debt conversion, collateralized pensions, ministry liquidation,
            legal shredding, charter-city experimentation, and polycentric legal rollout under external pressure.
          </p>
          <div className="hero-meta">
            <span className="phase-pill">{state.phase}</span>
            <span>Turn {state.turns}</span>
            <span>{currentEpoch.title}</span>
            <span>Law Pages Remaining: {integer.format(state.lawPagesRemaining)}</span>
          </div>
        </div>
        <div className="gauge-card">
          <div
            className="gauge-ring"
            style={{
              background: `conic-gradient(var(--gold) ${breakdown.debtProgress}%, rgba(255, 255, 255, 0.08) ${breakdown.debtProgress}% 100%)`,
            }}
          >
            <div className="gauge-core">
              <span className="gauge-label">Debt-to-Zero</span>
              <strong>{pct(breakdown.debtProgress)}</strong>
              <span className="gauge-caption">Boss: entropy and interest</span>
            </div>
          </div>
          <div className="gauge-stats">
            <div>
              <span>Debt Remaining</span>
              <strong>{euro(state.debt)}</strong>
            </div>
            <div>
              <span>Trust Value</span>
              <strong>{euro(state.trustValue)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-grid metrics-grid-wide">
        <article className="panel metric-card">
          <span>Debt</span>
          <strong>{euro(state.debt)}</strong>
          <small>{state.debtConverted ? 'Converted into trust equity.' : 'Still compounding each turn.'}</small>
        </article>
        <article className="panel metric-card">
          <span>Pension Coverage</span>
          <strong>{pct(state.pensionCoverage)}</strong>
          <small>{euro(state.annualPensionBurden)} annual burden modeled.</small>
        </article>
        <article className="panel metric-card">
          <span>Social Cohesion</span>
          <strong>{pct(state.cohesion)}</strong>
          <small>Stability under stress.</small>
        </article>
        <article className="panel metric-card">
          <span>GDP Growth</span>
          <strong>{pct(state.gdpGrowth)}</strong>
          <small>Productivity slope under current rule set.</small>
        </article>
        <article className="panel metric-card">
          <span>EU Threat</span>
          <strong>{pct(state.euThreat)}</strong>
          <small>{state.vetoLock ? 'Veto-lock active.' : 'No shield active.'}</small>
        </article>
        <article className="panel metric-card">
          <span>Liberty Index</span>
          <strong>{pct(state.libertyIndex)}</strong>
          <small>Ownership clarity and institutional optionality.</small>
        </article>
        <article className="panel metric-card">
          <span>Arbitration Mesh</span>
          <strong>{pct(state.arbitrationCoverage)}</strong>
          <small>Share of disputes offloaded from monopoly courts.</small>
        </article>
      </section>

      <section className="command-layout">
        <article className="panel terminal-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Command Surface</span>
              <h2>Trustee Console</h2>
            </div>
            <span className="terminal-preview">Preview: {deferredCommand.trim() || '/status'}</span>
          </div>
          <form className="terminal-form" onSubmit={handleCommandSubmit}>
            <input
              aria-label="Command input"
              value={commandInput}
              onChange={(event) => setCommandInput(event.target.value)}
              placeholder="/swap-debt"
            />
            <button type="submit">Execute</button>
          </form>
          <div className="command-grid">
            {commandCards.map((card) => (
              <button
                key={card.command}
                className="command-card"
                type="button"
                onClick={() => submitCommand(card.command)}
              >
                <span>{card.title}</span>
                <strong>{card.command}</strong>
                <small>{card.description}</small>
              </button>
            ))}
          </div>
          <div className="directive-strip">
            {directiveRack.map((directive) => (
              <button key={directive.id} type="button" className="directive-card" onClick={() => submitCommand(directive.command)}>
                <span>{directive.title}</span>
                <small>{directive.description}</small>
              </button>
            ))}
          </div>
          <div className="feed-block">
            <div className="panel-heading compact">
              <h3>Activity Feed</h3>
              <span>{state.lastAction}</span>
            </div>
            <ul className="feed-list">
              {state.history.map((entry, index) => (
                <li key={`${index}-${entry}`}>{entry}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="panel scenario-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Scenario Engine</span>
              <h2>{scenario.title}</h2>
            </div>
          </div>
          <p className="scenario-summary">{scenario.summary}</p>
          {'options' in scenario ? (
            <div className="choice-grid">
              {scenario.options.map((option) => (
                <button key={option.id} type="button" className="choice-card" onClick={() => resolveEvent(option.id)}>
                  <span>Option {option.id}</span>
                  <strong>{option.label}</strong>
                </button>
              ))}
            </div>
          ) : (
            <div className="choice-grid">
              {scenario.prompts.map((prompt) => (
                <button key={prompt} type="button" className="choice-card" onClick={() => submitCommand(prompt)}>
                  <span>Recommended</span>
                  <strong>{prompt}</strong>
                </button>
              ))}
            </div>
          )}
          <div className="epoch-strip">
            {strategyEpochs.map((epoch, index) => (
              <article key={epoch.title} className={`epoch-card ${index <= phaseIndex[state.phase] ? 'active' : ''}`}>
                <span>{epoch.level}</span>
                <strong>{epoch.title}</strong>
                <small>{epoch.description}</small>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="interactive-layout">
        <article className="panel doctrine-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Doctrine Deck</span>
              <h2>Strategic Schools</h2>
            </div>
          </div>
          <div className="doctrine-gauges">
            <div>
              <span>Rothbard Momentum</span>
              <div className="mini-meter"><div style={{ width: `${state.doctrine.rothbard}%` }} /></div>
            </div>
            <div>
              <span>Bastos Momentum</span>
              <div className="mini-meter"><div style={{ width: `${state.doctrine.bastos}%` }} /></div>
            </div>
            <div>
              <span>Prudence Momentum</span>
              <div className="mini-meter"><div style={{ width: `${state.doctrine.prudence}%` }} /></div>
            </div>
          </div>
          <div className="doctrine-grid">
            {doctrineCards.map((card) => (
              <button key={card.id} type="button" className="doctrine-card" onClick={() => adoptDoctrine(card.id)}>
                <span>{card.title}</span>
                <strong>{card.thesis}</strong>
                <small>{card.gameplayEffect}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="panel ministry-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Ministry Exit Rack</span>
              <h2>State Organs</h2>
            </div>
            <span>{state.ministriesClosed} closed</span>
          </div>
          <div className="stack-list">
            {state.ministries.map((ministry) => (
              <article key={ministry.id} className={`stack-item ${ministry.closed ? 'done' : ''}`}>
                <div>
                  <strong>{ministry.label}</strong>
                  <small>
                    {integer.format(ministry.headcountImpact)} workforce impact • Cohesion hit {ministry.cohesionCost.toFixed(1)}
                  </small>
                </div>
                <button type="button" disabled={ministry.closed} onClick={() => closeMinistry(ministry.id)}>
                  {ministry.closed ? 'Closed' : 'Close Ministry'}
                </button>
              </article>
            ))}
          </div>
        </article>

        <article className="panel shred-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">BOE Shredder</span>
              <h2>Law Volume</h2>
            </div>
            <span>{integer.format(state.lawPagesRemaining)} pages</span>
          </div>
          <div className="stack-list">
            {state.lawBook.map((law) => (
              <article key={law.id} className={`stack-item ${law.shredded ? 'done' : ''}`}>
                <div>
                  <strong>{law.label}</strong>
                  <small>
                    {integer.format(law.pages)} pages • Growth boost +{law.growthBoost.toFixed(1)}
                  </small>
                </div>
                <button type="button" disabled={law.shredded} onClick={() => shredLaw(law.id)}>
                  {law.shredded ? 'Shredded' : 'Shred Law'}
                </button>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="intel-layout">
        <article className="panel log-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">State Decay Log</span>
              <h2>Bureaucratic Dismantling</h2>
            </div>
          </div>
          <ul className="decay-list">
            {state.decayLog.map((entry, index) => (
              <li key={`${index}-${entry}`}>{entry}</li>
            ))}
          </ul>
        </article>

        <article className="panel wire-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Brussels Wire</span>
              <h2>Threat Channel</h2>
            </div>
          </div>
          <p>{state.wire}</p>
          <div className="wire-meter">
            <div className="wire-fill" style={{ width: `${state.euThreat}%` }} />
          </div>
          <small>Threat increases with shock moves and decreases when diplomacy buys time.</small>
        </article>
      </section>

      <section className="asset-layout">
        <article className="panel waterfall-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Annuity Waterfall</span>
              <h2>Pension Shield</h2>
            </div>
          </div>
          <div className="waterfall-stack">
            <div className="waterfall-bar gold" style={{ width: `${Math.min((breakdown.goldValue / 350_000_000_000) * 100, 100)}%` }}>
              <span>Gold Reserve {euro(breakdown.goldValue)}</span>
            </div>
            <div className="waterfall-bar cash" style={{ width: `${Math.min((state.annuityPool / 220_000_000_000) * 100, 100)}%` }}>
              <span>Annuity Pool {euro(state.annuityPool)}</span>
            </div>
            <div className="waterfall-bar yield" style={{ width: `${Math.min((breakdown.annualDividendFlow / 15_000_000_000) * 100, 100)}%` }}>
              <span>Dividend Flow {euro(breakdown.annualDividendFlow)}</span>
            </div>
          </div>
          <div className="waterfall-meta">
            <div>
              <span>Gold locked to pensioners</span>
              <strong>{state.goldLockedTonnes.toFixed(1)} t</strong>
            </div>
            <div>
              <span>Gold still maneuverable</span>
              <strong>{breakdown.unlockedGoldTonnes.toFixed(1)} t</strong>
            </div>
            <div>
              <span>Secured capital</span>
              <strong>{euroFull(breakdown.securedCapital)}</strong>
            </div>
          </div>
        </article>

        <article className="panel trust-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Trust Inventory</span>
              <h2>Asset Book</h2>
            </div>
          </div>
          <div className="asset-table">
            {state.assets.map((asset) => (
              <div key={asset.id} className="asset-row">
                <div>
                  <strong>{asset.label}</strong>
                  <small>{pct(asset.remainingShare * 100)} retained</small>
                </div>
                <div>
                  <span>{euro(asset.baseValue * asset.remainingShare * state.assetMultiplier)}</span>
                  <button type="button" onClick={() => submitCommand(`/liquidate ${asset.id} 10`)}>
                    Sell 10%
                  </button>
                </div>
              </div>
            ))}
          </div>
          <small>Retained assets reprice upward as legal drag and tax extraction fall.</small>
        </article>
      </section>

      <section className="territory-layout">
        <article className="panel map-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Map of Spain</span>
              <h2>State Red to Market Gold</h2>
            </div>
          </div>
          <div className="region-grid">
            {state.regions.map((region) => (
              <button
                key={region.id}
                type="button"
                className={`region-tile ${state.charterCityRegions.includes(region.id) ? 'chartered' : ''}`}
                onClick={() => launchCharter(region.id)}
                style={{
                  background: `linear-gradient(135deg, rgba(129, 20, 28, 0.88), rgba(202, 164, 74, ${Math.max(0.25, region.openness / 100)}))`,
                }}
              >
                <strong>{region.label}</strong>
                <span>{pct(region.openness)}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel launchpad-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Tactical Launchpad</span>
              <h2>Interactive Levers</h2>
            </div>
          </div>
          <div className="launchpad-grid">
            <button type="button" className="choice-card" onClick={expandArbitration}>
              <span>Immediate Action</span>
              <strong>Expand Arbitration Mesh</strong>
            </button>
            <button type="button" className="choice-card" onClick={issueGoldBond}>
              <span>Immediate Action</span>
              <strong>Issue Gold Bond Ladder</strong>
            </button>
          </div>
          <div className="impact-grid impact-grid-single">
            <article>
              <span>Grandma Factor</span>
              <p>{getGrandmaFactor(state)}</p>
            </article>
            <article>
              <span>Entrepreneur Factor</span>
              <p>{getEntrepreneurFactor(state)}</p>
            </article>
            <article>
              <span>Cohesion Factor</span>
              <p>{getCohesionFactor(state)}</p>
            </article>
          </div>
        </article>
      </section>

      <section className="panel script-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Master Initialization Script</span>
            <h2>Claude World-State Seed</h2>
          </div>
          <span className="disclaimer">Speculative simulation content for scenario testing.</span>
        </div>
        <pre>{initializationScript}</pre>
      </section>
    </main>
  );
}

export default App;
