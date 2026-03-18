import { startTransition, useEffect, useReducer, useRef, useState } from 'react';
import { doctrineCards, strategyEpochs, innovationTemplates, seasonNames } from './content';
import {
  achievementDefinitions,
  createInitialState,
  getBreakdown,
  simulationReducer,
  type Achievement,
  type Phase,
  type SimulationState,
} from './engine';

/* ── Types ─────────────────────────────────────────────── */

type TabId = 'board' | 'play' | 'build' | 'agents' | 'trophy';

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: 'board', icon: '🎲', label: 'Board' },
  { id: 'play', icon: '🃏', label: 'Cards' },
  { id: 'build', icon: '🏗️', label: 'Build' },
  { id: 'agents', icon: '🧠', label: 'Agents' },
  { id: 'trophy', icon: '🏆', label: 'Score' },
];

/* ── Formatters ────────────────────────────────────────── */

const fmt = new Intl.NumberFormat('en-IE');

const euro = (v: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(v);

const pct = (v: number) => `${v.toFixed(1)}%`;

const phaseIndex: Record<Phase, number> = {
  Trustee: 0,
  Liquidator: 1,
  Architect: 2,
  Sovereign: 3,
};

/* ── Helpers ───────────────────────────────────────────── */

type Health = 'good' | 'warn' | 'bad';

const health = (v: number, good: number, bad: number, inverted = false): Health => {
  if (inverted) return v <= good ? 'good' : v <= bad ? 'warn' : 'bad';
  return v >= good ? 'good' : v >= bad ? 'warn' : 'bad';
};

const rank = (score: number): { letter: string; name: string } => {
  if (score >= 3500) return { letter: 'S', name: 'Sovereign Master' };
  if (score >= 2500) return { letter: 'A', name: 'Grand Architect' };
  if (score >= 1500) return { letter: 'B', name: 'Skilled Liquidator' };
  if (score >= 800) return { letter: 'C', name: 'Competent Trustee' };
  return { letter: 'D', name: 'Novice Trustee' };
};

/* ── Scenario fallback ─────────────────────────────────── */

interface PromptScenario {
  title: string;
  summary: string;
  prompts: string[];
}

const fallbackScenario = (s: SimulationState): PromptScenario => {
  if (!s.debtConverted)
    return { title: 'First Decree', summary: 'The bond market prices disbelief. Convert debt or shore up collateral.', prompts: ['/swap-debt', '/gold-bond'] };
  if (s.foodSecurity < 45)
    return { title: 'Food Crisis Brewing', summary: 'Food security is dangerously low. Adopt agricultural innovations or deregulate fast.', prompts: ['/deregulate Agriculture', '/veto-lock'] };
  if (s.pensionCoverage < 100)
    return { title: 'Coverage Gap', summary: 'Pension collateral needs to outrun fear.', prompts: ['/liquidate aena 10', '/gold-bond'] };
  if (s.publicSafety < 40)
    return { title: 'Safety Crisis', summary: 'Public safety is declining. Security innovations or arbitration could help.', prompts: ['/arbitrate', '/charter-city Valencia'] };
  if (s.lawPagesRemaining > 12000)
    return { title: 'Regulatory Drag', summary: 'Law-volume friction absorbs energy. Start shredding.', prompts: ['/shred Labor Law 2012', '/deregulate Energy'] };
  return { title: 'Sovereign Endgame', summary: 'Build the post-state market order.', prompts: ['/arbitrate', '/charter-city Valencia'] };
};

/* ── Component ─────────────────────────────────────────── */

function App() {
  const [state, dispatch] = useReducer(simulationReducer, undefined, createInitialState);
  const [tab, setTab] = useState<TabId>('board');
  const [toast, setToast] = useState<string | null>(null);
  const [achieveToast, setAchieveToast] = useState<Achievement | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const prevAction = useRef(state.lastAction);
  const breakdown = getBreakdown(state);
  const scenario = state.currentEvent ?? fallbackScenario(state);
  const r = rank(state.score);

  // Toast on action
  useEffect(() => {
    if (state.lastAction !== prevAction.current) {
      prevAction.current = state.lastAction;
      setToast(state.lastAction);
    }
  }, [state.lastAction]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  // Achievement toast
  useEffect(() => {
    if (state.newAchievement) setAchieveToast(state.newAchievement);
  }, [state.newAchievement]);

  useEffect(() => {
    if (!achieveToast) return;
    const t = setTimeout(() => setAchieveToast(null), 3500);
    return () => clearTimeout(t);
  }, [achieveToast]);

  // Dispatch helpers
  const cmd = (command: string) => startTransition(() => dispatch({ type: 'run-command', command }));
  const choice = (c: 'A' | 'B') => startTransition(() => dispatch({ type: 'event-choice', choice: c }));
  const adoptDoctrine = (id: string) => startTransition(() => dispatch({ type: 'adopt-doctrine', doctrineId: id }));
  const closeMinistry = (id: string) => startTransition(() => dispatch({ type: 'close-ministry', ministryId: id }));
  const shredLaw = (id: string) => startTransition(() => dispatch({ type: 'shred-law', lawId: id }));
  const launchCharter = (id: string) => startTransition(() => dispatch({ type: 'charter-city', regionId: id }));
  const expandArb = () => startTransition(() => dispatch({ type: 'expand-arbitration' }));
  const goldBond = () => startTransition(() => dispatch({ type: 'issue-gold-bond' }));
  const adoptInnovation = (id: string) => startTransition(() => dispatch({ type: 'adopt-innovation', innovationId: id }));

  // Win / Loss
  const isWin = state.phase === 'Sovereign' && state.debt === 0 && state.taxRate === 0 && state.pensionCoverage >= 100;
  const isLoss = state.cohesion <= 0 || state.euThreat >= 100;
  const lossMessage = state.lossReason
    ?? (state.cohesion <= 0 ? 'Social cohesion collapsed to zero.' : 'Brussels deployed intervention.');

  // Health
  const debtH = health(breakdown.debtProgress, 80, 30);
  const pensionH = health(state.pensionCoverage, 100, 50);
  const cohesionH = health(state.cohesion, 60, 30);
  const gdpH = health(state.gdpGrowth, 4, 1.5);
  const euH = health(state.euThreat, 30, 60, true);
  const libertyH = health(state.libertyIndex, 60, 30);
  const foodH = health(state.foodSecurity, 65, 40);
  const energyH = health(state.energyStability, 60, 35);
  const safetyH = health(state.publicSafety, 55, 30);
  const inflationH = health(state.inflation, 5, 15, true);
  const unemployH = health(state.unemployment, 8, 18, true);
  const milH = health(state.militaryLoyalty, 60, 30);

  const hasEvent = !!state.currentEvent;
  const hasProposals = state.agentProposals.length > 0;

  return (
    <main className="app">
      {/* ── HUD ───────────────────────────── */}
      <header className="hud">
        <div className="hud-left">
          <div className="hud-rank" data-rank={r.letter}>{r.letter}</div>
          <div className="hud-info">
            <span className="hud-score">{fmt.format(state.score)} pts</span>
            <span className="hud-phase">{state.phase} · T{state.turns} · {seasonNames[state.seasonIndex]}</span>
          </div>
        </div>
        <div className="hud-meters">
          <div className="hud-meter" title="Debt Progress">
            <div className="hud-meter-fill" style={{ width: `${breakdown.debtProgress}%`, background: 'var(--gold)' }} />
            <span>{pct(breakdown.debtProgress)}</span>
          </div>
          <div className="hud-meter" title="Cohesion">
            <div className={`hud-meter-fill ${cohesionH}`} style={{ width: `${state.cohesion}%` }} />
            <span>{pct(state.cohesion)}</span>
          </div>
          <div className="hud-meter" title="EU Threat">
            <div className="hud-meter-fill threat" style={{ width: `${state.euThreat}%` }} />
            <span>{pct(state.euThreat)}</span>
          </div>
        </div>
      </header>

      {/* ── Toasts ────────────────────────── */}
      {toast && <div className="toast" key={toast}>{toast}</div>}
      {achieveToast && (
        <div className="achieve-toast" key={achieveToast.id}>
          <span className="achieve-toast-icon">{achieveToast.icon}</span>
          <div>
            <strong>Achievement Unlocked!</strong>
            <span>{achieveToast.title}</span>
          </div>
          <span className={`rarity-badge ${achieveToast.rarity}`}>{achieveToast.rarity}</span>
        </div>
      )}

      {/* ── Intro ─────────────────────────── */}
      {showIntro && (
        <div className="overlay">
          <div className="intro-card" onClick={(e) => e.stopPropagation()}>
            <div className="intro-emblem">🏛️</div>
            <h1>The Great<br />Unwinding</h1>
            <div className="intro-subtitle">A Sovereign Liquidation Game</div>
            <p>Spain is bankrupt. As Liquidation Trustee, dismantle the state while keeping society alive — feed the people, power the grid, maintain order, and resist Brussels.</p>
            <div className="intro-rules">
              <div><span>🎯</span> Win: Debt 0, Tax 0%, Pensions 100%+</div>
              <div><span>💀</span> Lose: Cohesion 0, EU 100%, or vitals collapse</div>
              <div><span>🌾</span> Watch food, energy, safety — they drain every turn</div>
              <div><span>🧠</span> Recruit agents &amp; adopt innovations to survive</div>
              <div><span>🏆</span> Earn 25 achievements &amp; climb the ranks</div>
            </div>
            <button className="btn-gold" onClick={() => setShowIntro(false)}>Begin Liquidation</button>
          </div>
        </div>
      )}

      {/* ── Win / Loss ────────────────────── */}
      {isWin && (
        <div className="overlay">
          <div className="result-card win">
            <div className="result-emblem">👑</div>
            <h1>Sovereign Achieved</h1>
            <p>Debt: zero. Tax: zero. Pensions covered. The state is dissolved.</p>
            <div className="result-stats">
              <div><span>Score</span><strong>{fmt.format(state.score)}</strong></div>
              <div><span>Rank</span><strong>{r.letter}</strong></div>
              <div><span>Turns</span><strong>{state.turns}</strong></div>
              <div><span>Trophies</span><strong>{state.achievements.length}/{achievementDefinitions.length}</strong></div>
              <div><span>Agents</span><strong>{state.activeAgents.length}</strong></div>
              <div><span>Innovations</span><strong>{state.innovationsAdopted.length}</strong></div>
            </div>
            <button className="btn-gold" onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}
      {isLoss && !isWin && (
        <div className="overlay">
          <div className="result-card loss">
            <div className="result-emblem">{state.lossReason?.includes('Military') ? '🪖' : state.lossReason?.includes('Famine') ? '🌵' : state.cohesion <= 0 ? '💀' : '🇪🇺'}</div>
            <h1>{state.lossReason?.includes('Military') ? 'Military Coup' : state.lossReason?.includes('Famine') ? 'Famine Collapse' : state.lossReason?.includes('Anarchy') ? 'Total Anarchy' : state.lossReason?.includes('Hyperinflation') ? 'Hyperinflation' : state.lossReason?.includes('exodus') ? 'Mass Exodus' : state.cohesion <= 0 ? 'Cohesion Collapse' : 'Brussels Intervened'}</h1>
            <p>{lossMessage}</p>
            <div className="result-stats">
              <div><span>Score</span><strong>{fmt.format(state.score)}</strong></div>
              <div><span>Rank</span><strong>{r.letter}</strong></div>
              <div><span>Turns</span><strong>{state.turns}</strong></div>
              <div><span>Crises</span><strong>{state.crisesSurvived}</strong></div>
            </div>
            <button className="btn-gold" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      )}

      {/* ── Tab Body ──────────────────────── */}
      <div className="tab-body">
        {/* ═══ BOARD ═══ */}
        {tab === 'board' && (
          <div className="tab-panel">
            {/* Phase Board */}
            <div className="phase-board">
              {strategyEpochs.map((ep, i) => (
                <div key={ep.title} className={`phase-square ${i <= phaseIndex[state.phase] ? 'unlocked' : ''} ${i === phaseIndex[state.phase] ? 'current' : ''}`}>
                  <span className="phase-num">{ep.level}</span>
                  <strong>{ep.title}</strong>
                </div>
              ))}
            </div>

            {/* Season + Population banner */}
            <div className="season-banner">
              <span>{['🌸','☀️','🍂','❄️'][state.seasonIndex]} {seasonNames[state.seasonIndex]}</span>
              <span>👥 {state.populationMillions.toFixed(1)}M pop</span>
              <span>📦 {state.crisesSurvived} crises survived</span>
            </div>

            {/* Central gauge */}
            <div className="gauge-hero">
              <div className="gauge-ring" style={{ background: `conic-gradient(var(--gold) ${breakdown.debtProgress}%, rgba(255,255,255,0.04) ${breakdown.debtProgress}% 100%)` }}>
                <div className="gauge-inner">
                  <small>DEBT-TO-ZERO</small>
                  <strong>{pct(breakdown.debtProgress)}</strong>
                </div>
              </div>
            </div>

            {/* Core stats */}
            <div className="stat-grid">
              <div className={`stat-tile ${debtH}`}><span className="stat-icon">💰</span><div><small>Debt</small><strong>{euro(state.debt)}</strong></div></div>
              <div className={`stat-tile ${pensionH}`}><span className="stat-icon">👵</span><div><small>Pension</small><strong>{pct(state.pensionCoverage)}</strong></div></div>
              <div className={`stat-tile ${gdpH}`}><span className="stat-icon">📈</span><div><small>GDP</small><strong>{pct(state.gdpGrowth)}</strong></div></div>
              <div className={`stat-tile ${libertyH}`}><span className="stat-icon">🗽</span><div><small>Liberty</small><strong>{pct(state.libertyIndex)}</strong></div></div>
              <div className={`stat-tile ${euH}`}><span className="stat-icon">🇪🇺</span><div><small>EU Threat</small><strong>{pct(state.euThreat)}</strong></div></div>
              <div className="stat-tile"><span className="stat-icon">📊</span><div><small>Trust Val</small><strong>{euro(state.trustValue)}</strong></div></div>
            </div>

            {/* Vitals row */}
            <h2 className="section-title">🩺 Vitals Monitor</h2>
            <div className="vitals-grid">
              <div className={`vital-tile ${foodH}`}><span>🌾</span><div><small>Food</small><strong>{pct(state.foodSecurity)}</strong></div></div>
              <div className={`vital-tile ${energyH}`}><span>⚡</span><div><small>Energy</small><strong>{pct(state.energyStability)}</strong></div></div>
              <div className={`vital-tile ${safetyH}`}><span>🛡️</span><div><small>Safety</small><strong>{pct(state.publicSafety)}</strong></div></div>
              <div className={`vital-tile ${inflationH}`}><span>💹</span><div><small>Inflation</small><strong>{pct(state.inflation)}</strong></div></div>
              <div className={`vital-tile ${unemployH}`}><span>👷</span><div><small>Unemp.</small><strong>{pct(state.unemployment)}</strong></div></div>
              <div className={`vital-tile ${milH}`}><span>🎖️</span><div><small>Military</small><strong>{pct(state.militaryLoyalty)}</strong></div></div>
            </div>

            {/* Secondary vitals */}
            <div className="vitals-secondary">
              <div><small>Corruption</small><strong style={{ color: state.corruption > 30 ? 'var(--red)' : 'var(--green)' }}>{pct(state.corruption)}</strong></div>
              <div><small>Black Mkt</small><strong>{pct(state.blackMarketSize)}</strong></div>
              <div><small>Emigration</small><strong>{state.emigrationRate.toFixed(1)}%</strong></div>
              <div><small>Intl Rep</small><strong style={{ color: state.internationalReputation > 60 ? 'var(--green)' : 'var(--muted)' }}>{pct(state.internationalReputation)}</strong></div>
            </div>

            {/* Scenario card */}
            <div className={`scenario-card ${hasEvent ? 'event' : 'hint'}`}>
              <div className="scenario-header">
                <span className="scenario-type">{hasEvent ? `⚠️ ${state.currentEvent?.severity?.toUpperCase() ?? 'BLACK SWAN'}` : '💡 ADVISOR'}</span>
                <h2>{scenario.title}</h2>
              </div>
              <p>{scenario.summary}</p>
              {'options' in scenario ? (
                <div className="scenario-choices">
                  {scenario.options.map((opt) => (
                    <button key={opt.id} className="game-btn" onClick={() => choice(opt.id)}>
                      <span className="game-btn-label">Option {opt.id}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="scenario-choices">
                  {scenario.prompts.map((p) => (
                    <button key={p} className="game-btn" onClick={() => cmd(p)}>
                      <span className="game-btn-label">Execute</span>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Feed */}
            <div className="feed-card">
              <h3>📜 Activity Log</h3>
              <ul className="feed">
                {state.history.slice(0, 6).map((entry, i) => (
                  <li key={`${i}-${entry}`}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ═══ CARDS ═══ */}
        {tab === 'play' && (
          <div className="tab-panel">
            <h2 className="section-title">🃏 Play a Decree Card</h2>
            <div className="card-hand">
              <button className="decree-card" onClick={() => cmd('/swap-debt')} disabled={state.debtConverted}>
                <div className="decree-top rare"><span>💱</span></div>
                <div className="decree-body"><strong>Equity Swap</strong><small>Convert sovereign debt into trust shares</small></div>
                <div className="decree-cost">-9 cohesion</div>
              </button>
              <button className="decree-card" onClick={() => cmd('/liquidate aena 10')}>
                <div className="decree-top common"><span>🏪</span></div>
                <div className="decree-body"><strong>Auction Asset</strong><small>Fund annuity pool with AENA stake</small></div>
                <div className="decree-cost">+annuity</div>
              </button>
              <button className="decree-card" onClick={() => cmd('/privatize Transport Ministry')}>
                <div className="decree-top common"><span>🤝</span></div>
                <div className="decree-body"><strong>Privatize</strong><small>Worker cooperatives &amp; vouchers</small></div>
                <div className="decree-cost">+unemp!</div>
              </button>
              <button className="decree-card" onClick={() => cmd('/deregulate Energy')}>
                <div className="decree-top rare"><span>✂️</span></div>
                <div className="decree-body"><strong>Deregulate</strong><small>Burn compliance, boost multipliers</small></div>
                <div className="decree-cost">+growth</div>
              </button>
              <button className="decree-card" onClick={() => cmd('/veto-lock')}>
                <div className="decree-top epic"><span>🛡️</span></div>
                <div className="decree-body"><strong>Veto Lock</strong><small>Diplomatic shield from Brussels</small></div>
                <div className="decree-cost">-16 EU</div>
              </button>
              <button className="decree-card" onClick={expandArb}>
                <div className="decree-top rare"><span>⚖️</span></div>
                <div className="decree-body"><strong>Arbitration</strong><small>Expand private court mesh</small></div>
                <div className="decree-cost">+10 arb</div>
              </button>
              <button className="decree-card" onClick={goldBond}>
                <div className="decree-top epic"><span>🪙</span></div>
                <div className="decree-body"><strong>Gold Bond</strong><small>Collateralized pension ladder</small></div>
                <div className="decree-cost">+pension</div>
              </button>
              <button className="decree-card" onClick={() => cmd('/status')}>
                <div className="decree-top common"><span>📊</span></div>
                <div className="decree-body"><strong>Status</strong><small>Refresh dashboard data</small></div>
                <div className="decree-cost">free</div>
              </button>
            </div>

            {/* Doctrine */}
            <h2 className="section-title">📖 Doctrine Schools</h2>
            <div className="doctrine-meters">
              <div className="d-meter"><span className="d-name">Rothbard</span><div className="bar-track"><div className="bar-fill rothbard" style={{ width: `${state.doctrine.rothbard}%` }} /></div><span className="d-val">{state.doctrine.rothbard}</span></div>
              <div className="d-meter"><span className="d-name">Bastos</span><div className="bar-track"><div className="bar-fill bastos" style={{ width: `${state.doctrine.bastos}%` }} /></div><span className="d-val">{state.doctrine.bastos}</span></div>
              <div className="d-meter"><span className="d-name">Prudence</span><div className="bar-track"><div className="bar-fill prudence" style={{ width: `${state.doctrine.prudence}%` }} /></div><span className="d-val">{state.doctrine.prudence}</span></div>
            </div>
            <div className="card-hand compact">
              {doctrineCards.map((card) => (
                <button key={card.id} className="decree-card small" onClick={() => adoptDoctrine(card.id)}>
                  <div className="decree-top legendary"><span>📜</span></div>
                  <div className="decree-body"><strong>{card.title}</strong><small>{card.gameplayEffect}</small></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ BUILD ═══ */}
        {tab === 'build' && (
          <div className="tab-panel">
            {/* Ministries */}
            <h2 className="section-title">🏛 Close Ministries</h2>
            <div className="build-progress">
              <div className="bp-fill" style={{ width: `${(state.ministriesClosed / state.ministries.length) * 100}%` }} />
              <span>{state.ministriesClosed}/{state.ministries.length}</span>
            </div>
            <div className="build-list">
              {state.ministries.map((m) => (
                <div key={m.id} className={`build-item ${m.closed ? 'done' : ''}`}>
                  <div className="build-icon">{m.closed ? '✅' : '🏢'}</div>
                  <div className="build-info">
                    <strong>{m.label}</strong>
                    <small>{fmt.format(m.headcountImpact)} jobs · -{m.cohesionCost.toFixed(1)} coh · +unemp</small>
                  </div>
                  <button className="build-btn" disabled={m.closed} onClick={() => closeMinistry(m.id)}>{m.closed ? 'Done' : 'Close'}</button>
                </div>
              ))}
            </div>

            {/* Laws */}
            <h2 className="section-title">🔥 Shred Laws</h2>
            <div className="build-progress">
              <div className="bp-fill shred" style={{ width: `${((32800 - state.lawPagesRemaining) / 32800) * 100}%` }} />
              <span>{fmt.format(state.lawPagesRemaining)} pages left</span>
            </div>
            <div className="build-list">
              {state.lawBook.map((law) => (
                <div key={law.id} className={`build-item ${law.shredded ? 'done' : ''}`}>
                  <div className="build-icon">{law.shredded ? '🔥' : '📋'}</div>
                  <div className="build-info">
                    <strong>{law.label}</strong>
                    <small>{fmt.format(law.pages)} pp · +{law.growthBoost.toFixed(1)} growth</small>
                  </div>
                  <button className="build-btn" disabled={law.shredded} onClick={() => shredLaw(law.id)}>{law.shredded ? 'Done' : 'Shred'}</button>
                </div>
              ))}
            </div>

            {/* Assets */}
            <h2 className="section-title">💎 Asset Book</h2>
            <div className="build-list">
              {state.assets.map((asset) => (
                <div key={asset.id} className="build-item">
                  <div className="build-icon">🏗️</div>
                  <div className="build-info">
                    <strong>{asset.label}</strong>
                    <small>{pct(asset.remainingShare * 100)} held · {euro(asset.baseValue * asset.remainingShare * state.assetMultiplier)}</small>
                  </div>
                  <button className="build-btn" onClick={() => cmd(`/liquidate ${asset.id} 10`)}>Sell 10%</button>
                </div>
              ))}
            </div>

            {/* Regions */}
            <h2 className="section-title">🗺️ Charter Cities</h2>
            <div className="region-board">
              {state.regions.map((reg) => {
                const isChartered = state.charterCityRegions.includes(reg.id);
                return (
                  <button key={reg.id} className={`region-square ${isChartered ? 'owned' : ''}`}
                    onClick={() => launchCharter(reg.id)}
                    style={{ backgroundImage: `linear-gradient(135deg, rgba(129,20,28,${isChartered ? 0.2 : 0.7}), rgba(202,164,74,${Math.max(0.2, reg.openness / 100)}))` }}>
                    <strong>{reg.label}</strong>
                    <span>{pct(reg.openness)}</span>
                    {isChartered && <em>⭐ Chartered</em>}
                  </button>
                );
              })}
            </div>

            {/* Wire */}
            <div className="wire-card">
              <h3>📡 Brussels Wire</h3>
              <p>{state.wire}</p>
              <div className="wire-bar"><div className="wire-fill" style={{ width: `${state.euThreat}%` }} /></div>
              <small>{state.vetoLock ? '🛡️ Veto shield active' : 'No shield'} · EU Threat: {pct(state.euThreat)}</small>
            </div>

            {/* Pension waterfall */}
            <div className="waterfall-card">
              <h3>🏦 Pension Shield</h3>
              <div className="wf-bars">
                <div className="wf-bar gold" style={{ width: `${Math.min((breakdown.goldValue / 350_000_000_000) * 100, 100)}%` }}>Gold {euro(breakdown.goldValue)}</div>
                <div className="wf-bar teal" style={{ width: `${Math.min((state.annuityPool / 220_000_000_000) * 100, 100)}%` }}>Pool {euro(state.annuityPool)}</div>
                <div className="wf-bar red" style={{ width: `${Math.min((breakdown.annualDividendFlow / 15_000_000_000) * 100, 100)}%` }}>Yield {euro(breakdown.annualDividendFlow)}</div>
              </div>
              <div className="wf-stats">
                <div><small>Gold locked</small><strong>{state.goldLockedTonnes.toFixed(1)}t</strong></div>
                <div><small>Free gold</small><strong>{breakdown.unlockedGoldTonnes.toFixed(1)}t</strong></div>
                <div><small>Secured</small><strong>{euro(breakdown.securedCapital)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ AGENTS ═══ */}
        {tab === 'agents' && (
          <div className="tab-panel">
            {/* Active Agents */}
            <h2 className="section-title">🧠 Active Agents — {state.activeAgents.length}</h2>
            {state.activeAgents.length === 0 ? (
              <div className="empty-state">
                <span>🕐</span>
                <p>No agents yet. They will arrive as the transition progresses. Keep reforming to attract talent.</p>
              </div>
            ) : (
              <div className="agent-grid">
                {state.activeAgents.map((agent) => (
                  <div key={agent.id} className="agent-card">
                    <div className="agent-header">
                      <span className="agent-icon">{agent.icon}</span>
                      <div className="agent-meta">
                        <strong>{agent.name}</strong>
                        <small>{agent.role}</small>
                      </div>
                      <div className="agent-rep">
                        <small>Rep</small>
                        <strong>{agent.reputation}</strong>
                      </div>
                    </div>
                    <p className="agent-bio">{agent.bio}</p>
                    {agent.currentProposal && (
                      <div className="agent-proposal">
                        <span className="proposal-tag">💡 Proposing</span>
                        <span>{innovationTemplates.find(i => i.id === agent.currentProposal)?.title ?? agent.currentProposal}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Innovation Proposals */}
            {state.agentProposals.length > 0 && (
              <>
                <h2 className="section-title">💡 Innovation Proposals</h2>
                <div className="build-list">
                  {state.agentProposals.map((proposal) => {
                    const template = innovationTemplates.find(i => i.id === proposal.innovationId);
                    const agent = state.activeAgents.find(a => a.id === proposal.agentId);
                    if (!template) return null;
                    const canAfford = state.annuityPool >= template.costBillions * 1_000_000_000;
                    return (
                      <div key={proposal.innovationId} className="build-item innovation-item">
                        <div className="build-icon">{template.icon}</div>
                        <div className="build-info">
                          <strong>{template.title}</strong>
                          <small>{template.description}</small>
                          <small className="innovation-meta">
                            Cost: {template.costBillions}B · By: {agent?.name ?? 'Unknown'} · {template.category}
                          </small>
                        </div>
                        <button className="build-btn adopt-btn" disabled={!canAfford} onClick={() => adoptInnovation(proposal.innovationId)}>
                          {canAfford ? 'Adopt' : 'Can\'t afford'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Available Innovations (not yet proposed or adopted) */}
            <h2 className="section-title">🔬 Innovation Catalog — {state.innovationsAdopted.length}/{innovationTemplates.length}</h2>
            <div className="build-list">
              {innovationTemplates.map((inn) => {
                const adopted = state.innovationsAdopted.includes(inn.id);
                const proposed = state.agentProposals.some(p => p.innovationId === inn.id);
                if (proposed) return null; // Already shown above
                return (
                  <div key={inn.id} className={`build-item ${adopted ? 'done' : ''}`}>
                    <div className="build-icon">{adopted ? '✅' : inn.icon}</div>
                    <div className="build-info">
                      <strong>{inn.title}</strong>
                      <small>{inn.description}</small>
                      {!adopted && <small className="innovation-meta">Cost: {inn.costBillions}B · {inn.category}</small>}
                    </div>
                    {!adopted && (
                      <button className="build-btn" disabled={state.annuityPool < inn.costBillions * 1_000_000_000}
                        onClick={() => adoptInnovation(inn.id)}>
                        Adopt
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ TROPHY ═══ */}
        {tab === 'trophy' && (
          <div className="tab-panel">
            <div className="score-hero">
              <div className={`rank-emblem rank-${r.letter}`}>{r.letter}</div>
              <div className="score-info">
                <strong>{fmt.format(state.score)}</strong>
                <span>{r.name}</span>
              </div>
            </div>

            <h2 className="section-title">🏆 Achievements — {state.achievements.length}/{achievementDefinitions.length}</h2>
            <div className="trophy-grid">
              {achievementDefinitions.map((ach) => {
                const unlocked = state.achievements.includes(ach.id);
                return (
                  <div key={ach.id} className={`trophy-tile ${ach.rarity} ${unlocked ? 'unlocked' : 'locked'}`}>
                    <span className="trophy-icon">{unlocked ? ach.icon : '🔒'}</span>
                    <strong>{ach.title}</strong>
                    <small>{ach.description}</small>
                    <span className={`rarity-dot ${ach.rarity}`}>{ach.rarity}</span>
                  </div>
                );
              })}
            </div>

            <div className="feed-card">
              <h3>📰 State Decay Log</h3>
              <ul className="feed">
                {state.decayLog.map((entry, i) => (
                  <li key={`${i}-${entry}`}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ────────────────────── */}
      <nav className="bottom-nav">
        {tabs.map((t) => (
          <button key={t.id}
            className={`${tab === t.id ? 'active' : ''} ${t.id === 'board' && hasEvent ? 'has-alert' : ''} ${t.id === 'agents' && hasProposals ? 'has-alert' : ''}`}
            onClick={() => setTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

export default App;
