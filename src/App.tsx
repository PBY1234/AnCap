import { startTransition, useEffect, useReducer, useRef, useState, useCallback } from 'react';
import {
  doctrineCards, strategyEpochs, innovationTemplates,
  seasonNames, agentTemplates, prologueCards, unlockableActions,
} from './content';
import {
  achievementDefinitions, createInitialState, getBreakdown, simulationReducer,
  type Achievement, type Phase, type SimulationState, type AgentInstance,
} from './engine';

/* ── Types ─────────────────────────────────────────────── */
type TabId = 'board' | 'play' | 'build' | 'agents' | 'trophy';
const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: 'board',  icon: '📊', label: 'Command'  },
  { id: 'play',   icon: '🃏', label: 'Decrees'  },
  { id: 'build',  icon: '🏗️', label: 'Dismantle'},
  { id: 'agents', icon: '🧠', label: 'Council'  },
  { id: 'trophy', icon: '🏆', label: 'Codex'    },
];

/* ── Formatters ─────────────────────────────────────────── */
const fmt  = new Intl.NumberFormat('en-IE');
const euro = (v: number) => new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', notation:'compact', maximumFractionDigits:1 }).format(v);
const pct  = (v: number) => `${v.toFixed(1)}%`;
const phaseIndex: Record<Phase,number> = { Trustee:0, Liquidator:1, Architect:2, Sovereign:3 };

/* ── Health ─────────────────────────────────────────────── */
type Health = 'good'|'warn'|'bad';
const health = (v:number, good:number, bad:number, inv=false): Health => {
  if (inv) return v<=good?'good':v<=bad?'warn':'bad';
  return v>=good?'good':v>=bad?'warn':'bad';
};
const rank = (score:number) => {
  if (score>=3500) return { letter:'S', name:'Sovereign Master',    color:'#FFD700' };
  if (score>=2500) return { letter:'A', name:'Grand Architect',     color:'#C8A44A' };
  if (score>=1500) return { letter:'B', name:'Skilled Liquidator',  color:'#9E9E9E' };
  if (score>=800)  return { letter:'C', name:'Competent Trustee',   color:'#A0785A' };
  return              { letter:'D', name:'Novice Trustee',      color:'#666'    };
};

/* ── Agent portraits ────────────────────────────────────── */
const agentPortraits: Record<string,{emoji:string;color:string;mood:string}> = {
  'elena-vega':        { emoji:'👩‍💼', color:'#D4893A', mood:'Optimistic'  },
  'marcos-pellegrini': { emoji:'🧑‍🔬', color:'#3B82A0', mood:'Analytical'  },
  'lucia-ramos':       { emoji:'🤜',  color:'#5BAA4A', mood:'Determined'  },
  'satoshi-serrano':   { emoji:'🧑‍💻', color:'#8B5CF6', mood:'Cryptic'     },
  'viktor-holm':       { emoji:'🤵',  color:'#4A6FA5', mood:'Cautious'    },
  'carmen-torres':     { emoji:'👩‍⚖️', color:'#B85450', mood:'Precise'     },
  'alejandro-ruiz':    { emoji:'🛡️', color:'#6B7280', mood:'Vigilant'    },
  'ines-moreno':       { emoji:'🌾',  color:'#8A7A2A', mood:'Resilient'   },
};
const agentDialogue: Record<string,string[]> = {
  'elena-vega':        ['"Every closure is a market waiting to be born."','"Deregulation without infrastructure is just chaos."','"The logistics gap won\'t fill itself."'],
  'marcos-pellegrini': ['"Sound money is not optional."','"The price signal is the only honest bureaucrat."','"Gold is the only honest balance sheet."'],
  'lucia-ramos':       ['"People don\'t need the state. They need each other."','"Mutual aid is the safety net that actually holds."','"Every coop is a vote of no-confidence."'],
  'satoshi-serrano':   ['"The blockchain doesn\'t lie."','"Smart contracts don\'t retire on a state pension."','"Anonymity is sovereignty of the individual."'],
  'viktor-holm':       ['"My fund waits for title clarity."','"Capital goes where it\'s welcomed."','"Show me enforcement, I\'ll show you deployment."'],
  'carmen-torres':     ['"Law without a state is precision."','"No one monopolises justice under polycentric law."','"The constitution was always optional."'],
  'alejandro-ruiz':    ['"Security is a service, not a monopoly."','"My team protects property better than any patrol."','"Military loyalty is earned."'],
  'ines-moreno':       ['"Subsidies created dependency."','"Food security comes from soil, not Brussels."','"The coop model is older than any ministry."'],
};
const phaseQuips: Record<Phase,string[]> = {
  Trustee:   ['The bond market wants proof, not promises.','Every hour of delay is a gift to the short-sellers.','Legitimacy is borrowed. Make it permanent.'],
  Liquidator:['Every asset sold is a chain dissolved.','The bureaucrats are watching. Keep moving.','Debt is time made expensive.'],
  Architect: ['Replace the mandate with the market.','Voluntary institutions outlast coerced ones.','Build faster than they can legislate.'],
  Sovereign: ['The state has run out of reasons to exist.','The market order holds. For now.','History is watching this footnote become a chapter.'],
};

/* ── Scenario fallback ──────────────────────────────────── */
interface Fallback { title:string; summary:string; prompts:string[]; }
const fallbackScenario = (s: SimulationState): Fallback => {
  if (!s.debtConverted)        return { title:'First Decree',         summary:'The bond market prices disbelief. Convert debt or shore up collateral.',       prompts:['/swap-debt','/gold-bond'] };
  if (s.foodSecurity<45)       return { title:'Food Crisis Brewing',  summary:'Food security is dangerously low. Act before riots spread.',                    prompts:['/deregulate Agriculture','/arbitrate'] };
  if (s.pensionCoverage<100)   return { title:'Coverage Gap',         summary:'Pension collateral must outrun fear.',                                           prompts:['/liquidate aena 10','/gold-bond'] };
  if (s.publicSafety<40)       return { title:'Safety Crisis',        summary:'Public order is declining. Arbitration and security innovations help.',          prompts:['/arbitrate','/charter-city Valencia'] };
  if (s.euThreat>65)           return { title:'Brussels Closing In',  summary:'EU threat is critical. Deploy the diplomatic shield.',                           prompts:['/veto-lock'] };
  if (s.pressureMeter>70)      return { title:'Pressure Building',    summary:'The transition is lagging. Act decisively or lose momentum.',                    prompts:['/deregulate Energy','/close-ministry labor-ministry'] };
  if (s.lawPagesRemaining>12000) return { title:'Regulatory Drag',   summary:'Law friction devours productivity. Shred it.',                                    prompts:['/shred Labor Law 2012','/deregulate Energy'] };
  return                          { title:'Sovereign Endgame',        summary:'Build the post-state market order. Victory is close.',                           prompts:['/arbitrate','/charter-city Valencia'] };
};

const severityColor = (s?:string) => s==='catastrophic'?'#C62828':s==='major'?'#E65100':'#7B5E00';

/* ════════════════════════════════════════════════════════════
   COMPONENT
═════════════════════════════════════════════════════════════ */
function App() {
  const [state, dispatch] = useReducer(simulationReducer, undefined, createInitialState);
  const [tab, setTab] = useState<TabId>('board');
  const [toast, setToast] = useState<string|null>(null);
  const [achieveToast, setAchieveToast] = useState<Achievement|null>(null);
  const [arrivedAgent, setArrivedAgent] = useState<AgentInstance|null>(null);
  const [showCinematic, setShowCinematic] = useState(false);
  const [prevEventId, setPrevEventId] = useState<string|null>(null);
  const [quipIdx, setQuipIdx] = useState(0);
  const [showTemptCinematic, setShowTemptCinematic] = useState(false);
  const prevAction = useRef(state.lastAction);
  const prevAgentCount = useRef(0);
  const breakdown = getBreakdown(state);
  const r = rank(state.score);
  const currentQuip = phaseQuips[state.phase][quipIdx % phaseQuips[state.phase].length];

  /* effects */
  useEffect(() => { const t = setInterval(()=>setQuipIdx(x=>x+1), 7000); return ()=>clearInterval(t); }, []);
  useEffect(() => {
    if (state.lastAction!==prevAction.current) { prevAction.current=state.lastAction; setToast(state.lastAction); }
  }, [state.lastAction]);
  useEffect(() => { if (!toast) return; const t=setTimeout(()=>setToast(null),3200); return ()=>clearTimeout(t); }, [toast]);
  useEffect(() => { if (state.newAchievement) setAchieveToast(state.newAchievement); }, [state.newAchievement]);
  useEffect(() => { if (!achieveToast) return; const t=setTimeout(()=>setAchieveToast(null),4500); return ()=>clearTimeout(t); }, [achieveToast]);
  useEffect(() => {
    if (state.currentEvent && state.currentEvent.id!==prevEventId) {
      setPrevEventId(state.currentEvent.id); setShowCinematic(true); setTab('board');
    }
  }, [state.currentEvent]);
  useEffect(() => {
    if (state.currentTemptation) setShowTemptCinematic(true);
  }, [state.currentTemptation?.id]);
  useEffect(() => {
    if (state.activeAgents.length>prevAgentCount.current && state.turns>0) {
      const newest = state.activeAgents[state.activeAgents.length-1];
      if (newest) { setArrivedAgent(newest); setTimeout(()=>setArrivedAgent(null),6000); }
    }
    prevAgentCount.current = state.activeAgents.length;
  }, [state.activeAgents.length]);

  /* dispatchers */
  const cmd        = useCallback((c:string) => startTransition(()=>dispatch({type:'run-command',command:c})),[]);
  const choice     = useCallback((c:'A'|'B') => startTransition(()=>dispatch({type:'event-choice',choice:c})),[]);
  const adoptDoc   = useCallback((id:string) => startTransition(()=>dispatch({type:'adopt-doctrine',doctrineId:id})),[]);
  const closeMin   = useCallback((id:string) => startTransition(()=>dispatch({type:'close-ministry',ministryId:id})),[]);
  const shredLaw   = useCallback((id:string) => startTransition(()=>dispatch({type:'shred-law',lawId:id})),[]);
  const launchChar = useCallback((id:string) => startTransition(()=>dispatch({type:'charter-city',regionId:id})),[]);
  const expandArb  = useCallback(() => startTransition(()=>dispatch({type:'expand-arbitration'})),[]);
  const goldBond   = useCallback(() => startTransition(()=>dispatch({type:'issue-gold-bond'})),[]);
  const adoptInn   = useCallback((id:string) => startTransition(()=>dispatch({type:'adopt-innovation',innovationId:id})),[]);
  const acceptTempt= useCallback((id:string) => { startTransition(()=>dispatch({type:'temptation-choice',temptationId:id,accept:true})); setShowTemptCinematic(false); },[]);
  const refuseTempt= useCallback((id:string) => { startTransition(()=>dispatch({type:'temptation-choice',temptationId:id,accept:false})); setShowTemptCinematic(false); },[]);
  const advPrologue= useCallback(() => startTransition(()=>dispatch({type:'advance-prologue'})),[]);

  /* derived */
  const isWin  = state.phase==='Sovereign' && state.debt===0 && state.taxRate===0 && state.pensionCoverage>=100;
  const isLoss = state.cohesion<=0 || state.euThreat>=100;
  const lossMsg = state.lossReason ?? (state.cohesion<=0?'Social cohesion collapsed.':'Brussels deployed intervention.');
  const hasEvent     = !!state.currentEvent;
  const hasProposals = state.agentProposals.length>0;
  const hasTemptation= !!state.currentTemptation;

  /* health shortcuts */
  const debtH  = health(breakdown.debtProgress,80,30);
  const penH   = health(state.pensionCoverage,100,50);
  const cohH   = health(state.cohesion,60,30);
  const gdpH   = health(state.gdpGrowth,4,1.5);
  const euH    = health(state.euThreat,30,60,true);
  const libH   = health(state.libertyIndex,60,30);
  const foodH  = health(state.foodSecurity,65,40);
  const enH    = health(state.energyStability,60,35);
  const safH   = health(state.publicSafety,55,30);
  const inflH  = health(state.inflation,5,15,true);
  const unempH = health(state.unemployment,8,18,true);
  const milH   = health(state.militaryLoyalty,60,30);

  /* phase-gated actions */
  const availableActions = unlockableActions.filter(a => phaseIndex[a.phase as Phase] <= phaseIndex[state.phase]);
  const lockedActions    = unlockableActions.filter(a => phaseIndex[a.phase as Phase] > phaseIndex[state.phase]);

  /* Vital tile component */
  const VT = ({icon,label,val,h,pv}:{icon:string;label:string;val:string;h:Health;pv:number}) => (
    <div className={`vt ${h}`}>
      <div className="vt-top"><span>{icon}</span><span className="vt-lbl">{label}</span><span className="vt-val">{val}</span></div>
      <div className="vt-bar"><div style={{width:`${Math.min(100,Math.max(0,pv))}%`}}/></div>
    </div>
  );

  const scenario = state.currentEvent ?? fallbackScenario(state) as any;
  const isFallback = !state.currentEvent;

  /* ─── PROLOGUE SCREEN ─────────────────────────────────── */
  if (!state.prologueDone) {
    const card = prologueCards[state.prologueStep];
    const isLast = state.prologueStep >= prologueCards.length - 1;
    return (
      <div className="app">
        <div className="bg-atmosphere"/>
        <div className="overlay">
          <div className="prologue-card">
            <div className="prol-step">
              {prologueCards.map((_,i) => (
                <div key={i} className={`prol-pip ${i<=state.prologueStep?'active':''}`}/>
              ))}
            </div>
            <div className="prol-icon">{card.icon}</div>
            <h2 className="prol-title">{card.title}</h2>
            <p className="prol-body">{card.body}</p>
            <div className="prol-stat">{card.stat}</div>
            <button className="btn-begin" onClick={advPrologue}>
              {isLast ? 'Take Command →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="app">
      <div className="bg-atmosphere"/>

      {/* ── TOAST ─────────────────────────────── */}
      {toast && <div className="toast" key={toast}><span className="toast-pip"/>{toast}</div>}

      {/* ── ACHIEVEMENT TOAST ─────────────────── */}
      {achieveToast && (
        <div className={`achieve-toast rarity-${achieveToast.rarity}`} key={achieveToast.id}>
          <div className="at-glow"/>
          <span className="at-icon">{achieveToast.icon}</span>
          <div className="at-body">
            <em>Achievement Unlocked</em>
            <strong>{achieveToast.title}</strong>
            <span className={`rarity-chip ${achieveToast.rarity}`}>{achieveToast.rarity}</span>
          </div>
        </div>
      )}

      {/* ── AGENT ARRIVAL ─────────────────────── */}
      {arrivedAgent && (()=>{
        const p = agentPortraits[arrivedAgent.id]??{emoji:arrivedAgent.icon,color:'#888',mood:'Present'};
        const lines = agentDialogue[arrivedAgent.id]??['"Reporting for duty."'];
        return (
          <div className="agent-arrival">
            <div className="aa-card" style={{'--ac':p.color} as React.CSSProperties}>
              <div className="aa-badge">NEW ALLY</div>
              <div className="aa-portrait" style={{background:`radial-gradient(circle at 40% 30%, ${p.color}44, transparent)`}}>
                <span className="aa-emoji">{p.emoji}</span>
                <span className="aa-mood" style={{color:p.color}}>{p.mood}</span>
              </div>
              <div className="aa-info">
                <strong>{arrivedAgent.name}</strong>
                <span>{arrivedAgent.role}</span>
                <p>{lines[0]}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── WIN ───────────────────────────────── */}
      {isWin && (
        <div className="overlay">
          <div className="result-card win">
            <div className="rc-icon">👑</div>
            <h1>SOVEREIGN<br/>ACHIEVED</h1>
            <p className="rc-sub">The state is dissolved. The market order holds. History will debate this for centuries — and probably get it wrong.</p>
            <div className="rc-stats">
              <div><span>Score</span><strong>{fmt.format(state.score)}</strong></div>
              <div><span>Rank</span><strong style={{color:r.color}}>{r.letter} — {r.name}</strong></div>
              <div><span>Turns</span><strong>{state.turns}</strong></div>
              <div><span>Crises</span><strong>{state.crisesSurvived}</strong></div>
              <div><span>Temptations resisted</span><strong>{state.temptationsSeen.length - state.interventionCount}</strong></div>
              <div><span>Council</span><strong>{state.activeAgents.length}</strong></div>
              <div><span>Innovations</span><strong>{state.innovationsAdopted.length}</strong></div>
              <div><span>Population</span><strong>{state.populationMillions.toFixed(1)}M</strong></div>
            </div>
            <button className="btn-begin" onClick={()=>window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}

      {/* ── LOSS ──────────────────────────────── */}
      {isLoss && !isWin && (
        <div className="overlay">
          <div className="result-card loss">
            <div className="rc-icon">{state.lossReason?.includes('Military')?'🪖':state.lossReason?.includes('Famine')?'🌵':state.lossReason?.includes('Anarchy')?'🔥':state.lossReason?.includes('Hyper')?'📈':state.lossReason?.includes('exodus')?'✈️':state.cohesion<=0?'💀':'🇪🇺'}</div>
            <h1>{state.lossReason?.includes('Military')?'COUP D\'ÉTAT':state.lossReason?.includes('Famine')?'FAMINE':state.lossReason?.includes('Anarchy')?'ANARCHY':state.lossReason?.includes('Hyper')?'HYPERINFLATION':state.lossReason?.includes('exodus')?'MASS EXODUS':state.cohesion<=0?'COLLAPSE':'BRUSSELS INTERVENED'}</h1>
            <p className="rc-sub">{lossMsg}</p>
            <div className="rc-stats">
              <div><span>Score</span><strong>{fmt.format(state.score)}</strong></div>
              <div><span>Turns</span><strong>{state.turns}</strong></div>
              <div><span>Crises faced</span><strong>{state.crisesSurvived}</strong></div>
              <div><span>Temptations accepted</span><strong className={state.interventionCount>2?'bad':'good'}>{state.interventionCount}</strong></div>
            </div>
            <button className="btn-begin danger" onClick={()=>window.location.reload()}>Try Again</button>
          </div>
        </div>
      )}

      {/* ── CRISIS CINEMATIC ──────────────────── */}
      {showCinematic && state.currentEvent && (
        <div className="overlay crisis-overlay">
          <div className="crisis-card" style={{'--sc':severityColor(state.currentEvent.severity)} as React.CSSProperties}>
            <div className="cc-stripe" style={{background:severityColor(state.currentEvent.severity)}}/>
            <div className="cc-header">
              <span className="cc-big-icon">{state.currentEvent.icon??'⚡'}</span>
              <div>
                <span className="cc-sev" style={{color:severityColor(state.currentEvent.severity)}}>
                  {(state.currentEvent.severity??'event').toUpperCase()} — CRISIS
                </span>
                <h2>{state.currentEvent.title}</h2>
              </div>
            </div>
            <p className="cc-summary">{state.currentEvent.summary}</p>
            <div className="cc-choices">
              <button className="cc-choice opt-a" onClick={()=>{choice('A');setShowCinematic(false);}}>
                <span className="cc-opt-label">Option A</span>
                <span>{state.currentEvent.options[0].label}</span>
              </button>
              <button className="cc-choice opt-b" onClick={()=>{choice('B');setShowCinematic(false);}}>
                <span className="cc-opt-label">Option B</span>
                <span>{state.currentEvent.options[1].label}</span>
              </button>
            </div>
            <button className="cc-later" onClick={()=>setShowCinematic(false)}>Decide from the board →</button>
          </div>
        </div>
      )}

      {/* ── TEMPTATION CINEMATIC ──────────────── */}
      {showTemptCinematic && state.currentTemptation && (
        <div className="overlay tempt-overlay">
          <div className="tempt-card">
            <div className="tempt-glow"/>
            <div className="tempt-header">
              <span className="tempt-src-icon">{state.currentTemptation.sourceIcon}</span>
              <div>
                <span className="tempt-src-label">OFFER FROM</span>
                <strong className="tempt-src-name">{state.currentTemptation.source}</strong>
              </div>
              <div className="tempt-badge">TEMPTATION</div>
            </div>
            <h2 className="tempt-title">{state.currentTemptation.title}</h2>
            <p className="tempt-flavour">"{state.currentTemptation.flavour}"</p>
            <div className="tempt-terms">
              <div className="tempt-offer">
                <span className="tt-label">✅ WHAT THEY'RE OFFERING</span>
                <span>{state.currentTemptation.offer}</span>
              </div>
              <div className="tempt-poison">
                <span className="tt-label">☠️ THE HIDDEN COST</span>
                <span>{state.currentTemptation.poison}</span>
              </div>
            </div>
            <div className="tempt-warn">
              ⚠️ Every acceptance weakens the principled transition. Interventions compound.
              {state.interventionCount > 0 && <span className="tempt-count"> You have accepted {state.interventionCount} offer{state.interventionCount>1?'s':''} already.</span>}
            </div>
            <div className="tempt-choices">
              <button className="tempt-accept" onClick={()=>acceptTempt(state.currentTemptation!.id)}>
                <span>Accept</span>
                <small>{state.currentTemptation.acceptLabel}</small>
              </button>
              <button className="tempt-refuse" onClick={()=>refuseTempt(state.currentTemptation!.id)}>
                <span>Refuse</span>
                <small>{state.currentTemptation.refuseLabel}</small>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HUD ───────────────────────────────── */}
      <header className="hud">
        <div className="hud-left">
          <div className="hud-rank" style={{color:r.color,borderColor:`${r.color}66`}}>{r.letter}</div>
          <div className="hud-info">
            <span className="hud-pts">{fmt.format(state.score)}<em> pts</em></span>
            <span className="hud-meta">{state.phase} · T{state.turns} · {['🌸','☀️','🍂','❄️'][state.seasonIndex]} {seasonNames[state.seasonIndex]}</span>
          </div>
        </div>

        {/* Pressure meter */}
        <div className={`pressure-wrap ${state.pressureWarningActive?'warn':''}`} title="Reform Pressure">
          <span className="pres-icon">{state.pressureWarningActive?'🚨':'⏱️'}</span>
          <div className="pres-bar">
            <div className="pres-fill" style={{width:`${state.pressureMeter}%`}}/>
          </div>
        </div>

        <div className="hud-strip">
          <div className={`hs-meter ${cohH}`} title="Cohesion"><span>❤️</span><div className="hsm-bar"><div style={{width:`${state.cohesion}%`}}/></div></div>
          <div className={`hs-meter ${euH}`}  title="EU Threat"><span>🇪🇺</span><div className="hsm-bar"><div style={{width:`${state.euThreat}%`}}/></div></div>
          <div className={`hs-meter ${foodH}`} title="Food"><span>🌾</span><div className="hsm-bar"><div style={{width:`${state.foodSecurity}%`}}/></div></div>
        </div>

        <div className="hud-alerts">
          {hasEvent     && <button className="hud-pill crisis-pill"  onClick={()=>setShowCinematic(true)}>⚡ Crisis</button>}
          {hasTemptation&& <button className="hud-pill tempt-pill"   onClick={()=>setShowTemptCinematic(true)}>🐍 Offer</button>}
        </div>
      </header>

      {/* ── HEADLINE TICKER ───────────────────── */}
      <div className="headline-ticker">
        <span className="ht-label">PRESS</span>
        <span className="ht-text">{state.headlineText}</span>
      </div>

      {/* ── PHASE STRIP ───────────────────────── */}
      <div className="phase-strip">
        <div className="ps-steps">
          {strategyEpochs.map((ep,i)=>(
            <div key={ep.title} className={`ps-step ${i<phaseIndex[state.phase]?'done':''} ${i===phaseIndex[state.phase]?'active':''}`}>
              <div className="ps-dot"/>
              <span>{ep.title}</span>
            </div>
          ))}
        </div>
        <div className="ps-quip">"{currentQuip}"</div>
      </div>

      {/* ── TAB BODY ──────────────────────────── */}
      <div className="tab-body">

        {/* ══════════════ BOARD / COMMAND ════════════════════ */}
        {tab==='board' && (
          <div className="tab-panel">

            {/* Pressure Warning Banner */}
            {state.pressureWarningActive && (
              <div className="pressure-banner">
                <span>🚨</span>
                <div>
                  <strong>Reform Pressure Critical</strong>
                  <span>The transition is lagging. Inaction is a choice — and it has consequences.</span>
                </div>
                <span className="pb-meter">{Math.round(state.pressureMeter)}%</span>
              </div>
            )}

            {/* Mood narrative */}
            <div className="mood-strip">
              <span className="mood-icon">🗣️</span>
              <span className="mood-text">{state.publicMoodNarrative}</span>
              {state.interventionCount>0 && (
                <span className="interv-count" title="Interventionist compromises accepted">
                  ⚠️ {state.interventionCount} compromise{state.interventionCount>1?'s':''}
                </span>
              )}
            </div>

            {/* Debt gauge */}
            <div className="debt-hero">
              <div className="dh-ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#dg)" strokeWidth="10"
                    strokeDasharray={`${breakdown.debtProgress*3.14159} 314.159`}
                    strokeDashoffset="78.54" strokeLinecap="round"/>
                  <defs><linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="100%" stopColor="#FF8F00"/>
                  </linearGradient></defs>
                </svg>
                <div className="dh-inner">
                  <small>DEBT CLEARED</small>
                  <strong>{pct(breakdown.debtProgress)}</strong>
                  <small>{euro(state.debt)} left</small>
                </div>
              </div>
              <div className="dh-stats">
                {[
                  {lbl:'💰 Annuity',  val:euro(state.annuityPool),       h:''},
                  {lbl:'🪙 Gold',     val:`${state.goldLockedTonnes.toFixed(0)}t`, h:''},
                  {lbl:'👵 Pensions', val:pct(state.pensionCoverage),    h:penH},
                  {lbl:'📈 GDP',      val:pct(state.gdpGrowth),          h:gdpH},
                  {lbl:'🗽 Liberty',  val:pct(state.libertyIndex),       h:libH},
                  {lbl:'💼 Tax Rate', val:pct(state.taxRate),            h:state.taxRate<=5?'good':state.taxRate>25?'bad':'warn'},
                ].map(s=>(
                  <div key={s.lbl} className="dhs"><span>{s.lbl}</span><strong className={s.h}>{s.val}</strong></div>
                ))}
              </div>
            </div>

            {/* Vitals */}
            <div className="section-hdr"><span>🩺</span><h2>Vitals Monitor</h2><em>T{state.turns} · {state.populationMillions.toFixed(1)}M pop</em></div>
            <div className="vitals-grid">
              <VT icon="🌾" label="Food"       val={pct(state.foodSecurity)}          h={foodH}  pv={state.foodSecurity} />
              <VT icon="⚡" label="Energy"     val={pct(state.energyStability)}        h={enH}    pv={state.energyStability} />
              <VT icon="🛡️" label="Safety"    val={pct(state.publicSafety)}           h={safH}   pv={state.publicSafety} />
              <VT icon="❤️" label="Cohesion"  val={pct(state.cohesion)}               h={cohH}   pv={state.cohesion} />
              <VT icon="💹" label="Inflation"  val={pct(state.inflation)}              h={inflH}  pv={Math.min(100,state.inflation*2)} />
              <VT icon="👷" label="Unemploy"  val={pct(state.unemployment)}            h={unempH} pv={Math.min(100,state.unemployment*2.5)} />
              <VT icon="🎖️" label="Military"  val={pct(state.militaryLoyalty)}        h={milH}   pv={state.militaryLoyalty} />
              <VT icon="🌐" label="Int. Rep"   val={pct(state.internationalReputation)} h={health(state.internationalReputation,60,30)} pv={state.internationalReputation} />
              <VT icon="🕳️" label="Black Mkt"  val={pct(state.blackMarketSize)}       h={health(state.blackMarketSize,15,40,true)} pv={state.blackMarketSize} />
              <VT icon="🤫" label="Corruption" val={pct(state.corruption)}             h={health(state.corruption,20,50,true)} pv={state.corruption} />
              <VT icon="✈️" label="Emigration" val={`${state.emigrationRate.toFixed(1)}%`} h={health(state.emigrationRate,2,8,true)} pv={Math.min(100,state.emigrationRate*5)} />
              <VT icon="🪙" label="Priv. €"   val={pct(state.privateCurrencyAdoption)} h={health(state.privateCurrencyAdoption,40,10)} pv={state.privateCurrencyAdoption} />
            </div>

            {/* Active event or scenario */}
            {!isFallback ? (
              <div className="event-card" style={{borderColor:severityColor((scenario as any).severity)}}>
                <div className="ec-header" style={{background:`${severityColor((scenario as any).severity)}18`}}>
                  <span className="ec-icon">{(scenario as any).icon??'⚡'}</span>
                  <div>
                    <span className="ec-sev" style={{color:severityColor((scenario as any).severity)}}>{((scenario as any).severity??'event').toUpperCase()}</span>
                    <h3>{(scenario as any).title}</h3>
                  </div>
                  <button className="ec-expand" onClick={()=>setShowCinematic(true)}>▶ Full View</button>
                </div>
                <p className="ec-sum">{(scenario as any).summary}</p>
                <div className="ec-choices">
                  <button className="ec-choice opt-a" onClick={()=>{choice('A');setShowCinematic(false);}}>
                    <strong>A</strong> — {(scenario as any).options[0].label.slice(0,65)}{(scenario as any).options[0].label.length>65?'…':''}
                  </button>
                  <button className="ec-choice opt-b" onClick={()=>{choice('B');setShowCinematic(false);}}>
                    <strong>B</strong> — {(scenario as any).options[1].label.slice(0,65)}{(scenario as any).options[1].label.length>65?'…':''}
                  </button>
                </div>
              </div>
            ) : (
              <div className="scenario-card">
                <span className="sc-icon">🎲</span>
                <div>
                  <h3>{(scenario as Fallback).title}</h3>
                  <p>{(scenario as Fallback).summary}</p>
                  <div className="sc-prompts">
                    {(scenario as Fallback).prompts.map(p=>(
                      <button key={p} className="sc-prompt" onClick={()=>cmd(p)}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Brussels wire */}
            <div className="wire-card">
              <div className="wire-hdr">
                <span>📡 Brussels Wire</span>
                <span className={`wire-threat ${euH}`}>{pct(state.euThreat)} {state.vetoLock?'🛡️':''}</span>
              </div>
              <p>{state.wire}</p>
              <div className="wire-bar"><div className="wf" style={{width:`${state.euThreat}%`}}/></div>
            </div>

            {/* Pension shield */}
            <div className="pension-card">
              <div className="pension-hdr"><span>🏦 Pension Shield</span><span className={penH}>{pct(state.pensionCoverage)}</span></div>
              <div className="pension-bars">
                <div className="pb gold" style={{width:`${Math.min(100,(breakdown.goldValue/350e9)*100)}%`}}>Gold {euro(breakdown.goldValue)}</div>
                <div className="pb teal" style={{width:`${Math.min(100,(state.annuityPool/220e9)*100)}%`}}>Pool {euro(state.annuityPool)}</div>
                <div className="pb red"  style={{width:`${Math.min(100,(breakdown.annualDividendFlow/15e9)*100)}%`}}>Yield {euro(breakdown.annualDividendFlow)}</div>
              </div>
            </div>

            {/* Council strip */}
            {state.activeAgents.length>0 && (
              <div className="council-strip">
                <span className="cs-lbl">Council</span>
                {state.activeAgents.map(a=>{
                  const p = agentPortraits[a.id]??{emoji:a.icon,color:'#888'};
                  return (
                    <button key={a.id} className="cs-chip" style={{borderColor:p.color}} onClick={()=>setArrivedAgent(a)}>
                      <span>{p.emoji}</span><span>{a.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Decay log */}
            <div className="decay-log">
              <div className="dl-hdr">📰 State Decay Log</div>
              {state.decayLog.slice(0,3).map((e,i)=>(
                <div key={i} className="dl-entry"><span>▸</span><span>{e}</span></div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="activity-feed">
              {state.history.slice(0,5).map((h,i)=>(
                <div key={i} className="af-item" style={{opacity:1-i*0.15}}>
                  <span className="af-dot"/><span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ DECREES ════════════════════════════ */}
        {tab==='play' && (
          <div className="tab-panel">
            <div className="section-hdr"><span>🃏</span><h2>Decree Cards</h2><em>Phase {phaseIndex[state.phase]+1} of 4 — {state.phase}</em></div>

            {/* Unlocked actions */}
            <div className="decree-grid">
              {availableActions.map((action,i)=>{
                const isDisabled =
                  (action.id==='swap-debt' && state.debtConverted) ||
                  (action.id==='veto-lock' && state.vetoLock);
                const fireAction = () => {
                  if (isDisabled) return;
                  if (action.command) cmd(action.command);
                  else if (action.actionType==='expand-arbitration') expandArb();
                  else if (action.actionType==='issue-gold-bond') goldBond();
                };
                return (
                  <button key={action.id} className={`decree-card tier-${action.cardTier} ${isDisabled?'disabled':''}`}
                    onClick={isDisabled?undefined:fireAction} disabled={isDisabled}>
                    <div className={`dc-tier ${action.cardTier}`}>{action.cardTier}</div>
                    <div className="dc-icon">{action.icon}</div>
                    <div className="dc-body">
                      <strong>{action.title}</strong>
                      <small>{action.desc}</small>
                    </div>
                    <div className="dc-cost">{action.cost}</div>
                  </button>
                );
              })}
            </div>

            {/* Locked future actions */}
            {lockedActions.length>0 && (
              <>
                <div className="section-hdr" style={{marginTop:'1.5rem'}}>
                  <span>🔒</span><h2>Locked Decrees</h2><em>Advance phases to unlock</em>
                </div>
                <div className="decree-grid locked">
                  {lockedActions.map(action=>(
                    <div key={action.id} className="decree-card locked">
                      <div className={`dc-tier ${action.cardTier}`}>{action.cardTier}</div>
                      <div className="dc-icon locked-icon">🔒</div>
                      <div className="dc-body">
                        <strong>{action.title}</strong>
                        <small className="unlock-note">{action.unlockNote}</small>
                      </div>
                      <div className="dc-cost muted">{action.cost}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Doctrine */}
            <div className="section-hdr" style={{marginTop:'2rem'}}><span>📖</span><h2>Doctrine Schools</h2><em>Alignment shapes bonuses</em></div>
            <div className="doctrine-row">
              {[
                {k:'rothbard' as const, label:'Rothbard', desc:'Natural rights. Radical privatisation.', color:'#C0392B'},
                {k:'bastos'   as const, label:'Bastos',   desc:'Entrepreneurial discovery. Markets as process.', color:'#2980B9'},
                {k:'prudence' as const, label:'Prudence', desc:'Gradualism. Institutional trust.', color:'#27AE60'},
              ].map(d=>(
                <div key={d.k} className="doctrine-card" style={{'--dc':d.color} as React.CSSProperties}>
                  <div className="doctrine-top">
                    <span style={{color:d.color}}>{d.label}</span>
                    <strong style={{color:d.color}}>{state.doctrine[d.k]}</strong>
                  </div>
                  <small>{d.desc}</small>
                  <div className="dt-bar"><div style={{width:`${state.doctrine[d.k]}%`,background:d.color}}/></div>
                </div>
              ))}
            </div>
            <div className="doctrine-adopt">
              {doctrineCards.map(card=>(
                <button key={card.id} className="da-btn" onClick={()=>adoptDoc(card.id)}>
                  <span>📜</span>
                  <div><strong>{card.title}</strong><small>{card.gameplayEffect}</small></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ DISMANTLE ══════════════════════════ */}
        {tab==='build' && (
          <div className="tab-panel">
            <div className="section-hdr"><span>🏛️</span><h2>Close Ministries</h2><em>{state.ministriesClosed}/{state.ministries.length}</em></div>
            <div className="build-progress"><div className="bp-fill" style={{width:`${(state.ministriesClosed/state.ministries.length)*100}%`}}/></div>
            <div className="build-list">
              {state.ministries.map(m=>(
                <div key={m.id} className={`bi ${m.closed?'done':''}`}>
                  <div className="bi-icon">{m.closed?'✅':'🏢'}</div>
                  <div className="bi-body">
                    <strong>{m.label}</strong>
                    <div className="bi-tags">
                      <span>👤 {fmt.format(m.headcountImpact)}</span>
                      <span className="warn">❤️ −{m.cohesionCost.toFixed(1)}</span>
                      <span className="good">+liberty</span>
                    </div>
                  </div>
                  <button className={`ba ${m.closed?'done':''}`} disabled={m.closed} onClick={()=>closeMin(m.id)}>{m.closed?'Closed':'Close'}</button>
                </div>
              ))}
            </div>
            <div className="section-hdr"><span>🔥</span><h2>Shred Laws</h2><em>{fmt.format(state.lawPagesRemaining)} pages remain</em></div>
            <div className="build-progress shred"><div className="bp-fill shred" style={{width:`${((32800-state.lawPagesRemaining)/32800)*100}%`}}/></div>
            <div className="build-list">
              {state.lawBook.map(law=>(
                <div key={law.id} className={`bi ${law.shredded?'done':''}`}>
                  <div className="bi-icon">{law.shredded?'🔥':'📋'}</div>
                  <div className="bi-body">
                    <strong>{law.label}</strong>
                    <div className="bi-tags">
                      <span>{fmt.format(law.pages)} pages</span>
                      <span className="good">+{law.growthBoost.toFixed(1)}% growth</span>
                    </div>
                  </div>
                  <button className={`ba ${law.shredded?'done':'shred'}`} disabled={law.shredded} onClick={()=>shredLaw(law.id)}>{law.shredded?'Shredded':'Shred'}</button>
                </div>
              ))}
            </div>
            <div className="section-hdr"><span>💎</span><h2>Asset Liquidation</h2><em>Sell to fund annuity pool</em></div>
            <div className="build-list">
              {state.assets.map(asset=>(
                <div key={asset.id} className="bi">
                  <div className="bi-icon">🏗️</div>
                  <div className="bi-body">
                    <strong>{asset.label}</strong>
                    <div className="bi-tags">
                      <span>{pct(asset.remainingShare*100)} held</span>
                      <span>{euro(asset.baseValue*asset.remainingShare*state.assetMultiplier)}</span>
                      <span className="good">{pct(asset.dividendYield*100)} yield</span>
                    </div>
                  </div>
                  <button className="ba" onClick={()=>cmd(`/liquidate ${asset.id} 10`)}>Sell 10%</button>
                </div>
              ))}
            </div>
            <div className="section-hdr"><span>🗺️</span><h2>Charter Cities</h2><em>{state.charterCities} launched</em></div>
            <div className="region-grid">
              {state.regions.map(reg=>{
                const chartered = state.charterCityRegions.includes(reg.id);
                return (
                  <button key={reg.id} className={`region-card ${chartered?'chartered':''}`} onClick={()=>launchChar(reg.id)} disabled={chartered}>
                    <div className="rc-openness" style={{width:`${reg.openness}%`}}/>
                    <div className="rc-body">
                      <strong>{reg.label}</strong>
                      <span>Openness {pct(reg.openness)}</span>
                      {chartered && <span className="rc-chartered">⭐ Chartered</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════ COUNCIL ════════════════════════════ */}
        {tab==='agents' && (
          <div className="tab-panel">
            <div className="section-hdr"><span>🧠</span><h2>Your Council</h2><em>{state.activeAgents.length} active allies</em></div>
            {state.activeAgents.length===0 ? (
              <div className="empty-state"><span>⏳</span><p>No agents yet. Keep reforming — talent arrives when the opportunity is real.</p></div>
            ) : (
              <div className="agent-roster">
                {state.activeAgents.map(agent=>{
                  const p = agentPortraits[agent.id]??{emoji:agent.icon,color:'#888',mood:'Present'};
                  const lines = agentDialogue[agent.id]??['"Ready."'];
                  const quote = lines[state.turns%lines.length];
                  return (
                    <div key={agent.id} className="agent-card" style={{'--ac':p.color} as React.CSSProperties}>
                      <div className="agent-portrait" style={{background:`radial-gradient(circle at 35% 25%, ${p.color}44, ${p.color}11)`,borderColor:p.color}}>
                        <div className="ap-emoji">{p.emoji}</div>
                        <div className="ap-mood" style={{color:p.color}}>{p.mood}</div>
                      </div>
                      <div className="agent-body">
                        <div className="ab-header">
                          <strong>{agent.name}</strong>
                          <span className="ab-role">{agent.role}</span>
                        </div>
                        <div className="rep-row"><span>Rep</span><div className="rep-bar"><div style={{width:`${agent.reputation}%`,background:p.color}}/></div><span>{agent.reputation}</span></div>
                        <p className="ab-bio">{agent.bio}</p>
                        <p className="ab-quote">"{quote}"</p>
                        {agent.currentProposal && (
                          <div className="ab-proposal" style={{borderColor:`${p.color}55`}}>
                            <span>💡</span>
                            <span>Proposing: <strong>{innovationTemplates.find(i=>i.id===agent.currentProposal)?.title??agent.currentProposal}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {state.agentProposals.length>0 && (
              <>
                <div className="section-hdr" style={{marginTop:'2rem'}}><span>💡</span><h2>Active Proposals</h2><em>{state.agentProposals.length} pending</em></div>
                <div className="build-list">
                  {state.agentProposals.map(prop=>{
                    const tmpl = innovationTemplates.find(i=>i.id===prop.innovationId);
                    const ag   = state.activeAgents.find(a=>a.id===prop.agentId);
                    if (!tmpl) return null;
                    const afford = state.annuityPool>=tmpl.costBillions*1e9;
                    return (
                      <div key={prop.innovationId} className={`bi proposal ${!afford?'locked':''}`}>
                        <div className="bi-icon">{tmpl.icon}</div>
                        <div className="bi-body">
                          <strong>{tmpl.title}</strong>
                          <p style={{fontSize:'0.7rem',margin:'0.2rem 0',opacity:0.8}}>{tmpl.description}</p>
                          <div className="bi-tags">
                            <span>Cost: {tmpl.costBillions}B</span>
                            <span>{tmpl.category}</span>
                            {ag && <span>By {ag.name.split(' ')[0]}</span>}
                          </div>
                        </div>
                        <button className={`ba ${afford?'':'locked'}`} disabled={!afford} onClick={()=>adoptInn(prop.innovationId)}>{afford?'Adopt':'Need funds'}</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <div className="section-hdr" style={{marginTop:'2rem'}}><span>🔬</span><h2>Innovation Catalog</h2><em>{state.innovationsAdopted.length}/{innovationTemplates.length}</em></div>
            <div className="inno-catalog">
              {['finance','governance','infrastructure','social','security','tech'].map(cat=>(
                <div key={cat} className="inno-cat">
                  <div className="inno-cat-hdr">{cat.toUpperCase()}</div>
                  {innovationTemplates.filter(i=>i.category===cat).map(inn=>{
                    const adopted  = state.innovationsAdopted.includes(inn.id);
                    const proposed = state.agentProposals.some(p=>p.innovationId===inn.id);
                    const afford   = state.annuityPool>=inn.costBillions*1e9;
                    return (
                      <div key={inn.id} className={`inno-item ${adopted?'adopted':''}`}>
                        <span>{adopted?'✅':inn.icon}</span>
                        <div className="inno-body"><strong>{inn.title}</strong>{!adopted&&<small>{inn.costBillions}B</small>}</div>
                        {!adopted&&!proposed&&<button className={`inno-btn ${afford?'':'locked'}`} onClick={()=>adoptInn(inn.id)} disabled={!afford}>{afford?'Buy':'🔒'}</button>}
                        {proposed&&!adopted&&<span className="proposed-tag">Proposed</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ CODEX ══════════════════════════════ */}
        {tab==='trophy' && (
          <div className="tab-panel">
            <div className="score-hero" style={{'--rc':r.color} as React.CSSProperties}>
              <div className="sh-rank" style={{borderColor:r.color,color:r.color}}>{r.letter}</div>
              <div className="sh-info">
                <strong>{fmt.format(state.score)}</strong>
                <span>{r.name}</span>
                <div className="sh-ladder">
                  {['D','C','B','A','S'].map(l=>(
                    <span key={l} className={`sl-pip ${r.letter===l?'current':''} ${['D','C','B','A','S'].indexOf(l)<['D','C','B','A','S'].indexOf(r.letter)?'done':''}`} style={{color:r.letter===l?r.color:''}}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Integrity score */}
            <div className="integrity-bar">
              <span>🎯 Integrity</span>
              <div className="ib-track">
                <div className="ib-fill" style={{width:`${Math.max(0,100-(state.interventionCount*15))}%`}}/>
              </div>
              <span className={state.interventionCount===0?'good':state.interventionCount>3?'bad':'warn'}>
                {state.interventionCount===0?'Pure':state.interventionCount<=2?'Compromised':'Corrupted'}
              </span>
            </div>

            <div className="codex-stats">
              {[
                ['🔄','Turns',String(state.turns)],
                ['⚡','Crises',String(state.crisesSurvived)],
                ['🧠','Agents',String(state.activeAgents.length)],
                ['🚀','Innovations',String(state.innovationsAdopted.length)],
                ['🏙️','Charter Cities',String(state.charterCities)],
                ['⚠️','Compromises',String(state.interventionCount)],
              ].map(([icon,lbl,val])=><div key={lbl}><span>{icon}</span><div><small>{lbl}</small><strong>{val}</strong></div></div>)}
            </div>

            <div className="section-hdr"><span>🏆</span><h2>Achievements</h2><em>{state.achievements.length}/{achievementDefinitions.length}</em></div>
            <div className="trophy-grid">
              {achievementDefinitions.map(ach=>{
                const unlocked = state.achievements.includes(ach.id);
                return (
                  <div key={ach.id} className={`tt ${ach.rarity} ${unlocked?'unlocked':'locked'}`}>
                    <span className="tt-icon">{unlocked?ach.icon:'🔒'}</span>
                    <strong>{ach.title}</strong>
                    <small>{ach.description}</small>
                    <span className={`tt-rarity ${ach.rarity}`}>{ach.rarity}</span>
                  </div>
                );
              })}
            </div>

            <div className="section-hdr"><span>📰</span><h2>Decay Log</h2></div>
            <div className="decay-codex">
              {state.decayLog.map((e,i)=>(
                <div key={i} className="dc-entry">
                  <span className="dc-n">{String(i+1).padStart(2,'0')}</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ────────────────────────── */}
      <nav className="bottom-nav">
        {tabs.map(t=>(
          <button key={t.id} className={`nav-btn ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
            <div className={`nav-alert ${(t.id==='board'&&(hasEvent||hasTemptation))||(t.id==='agents'&&hasProposals)?'on':''}`}/>
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-lbl">{t.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
export default App;