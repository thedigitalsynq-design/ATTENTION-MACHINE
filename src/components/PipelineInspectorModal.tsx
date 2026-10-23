import React, { useState } from 'react';
import { 
  X, ShieldCheck, Cpu, Database, Calendar, AlertTriangle, 
  CheckCircle2, ArrowRight, RefreshCw, BarChart3, Layers, Lock 
} from 'lucide-react';
import { useCinemaTelemetry } from '../context/TelemetryContext';
import { executeCinemaDataPipeline } from '../services/movieDataPipeline';
import { MOVIES_DATABASE } from '../data/cinemaData';

interface PipelineInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipelineInspectorModal: React.FC<PipelineInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentISTDateStr, windowInfo, refreshFeeds, isSyncing } = useCinemaTelemetry();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'math' | 'quarantine' | 'sources'>('pipeline');

  if (!isOpen) return null;

  const result = executeCinemaDataPipeline(MOVIES_DATABASE, currentISTDateStr);

  return (
    <div className="modal-backdrop-scrim" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-dossier-card glass-panel max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-dossier-header border-b border-border/50 pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/30 text-accent">
                <Cpu size={24} />
              </div>
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-wider">
                  ARCHITECTURAL SPECIFICATION & LIVE TELEMETRY
                </span>
                <h2 className="text-xl font-display font-bold text-primary flex items-center gap-2">
                  Cinema Data Discovery & Verification Pipeline
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refreshFeeds}
                disabled={isSyncing}
                className="flex items-center gap-1.5 font-mono text-xs bg-surface hover:bg-surface-hover border border-border px-3 py-1.5 rounded transition-all text-secondary"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin text-accent' : ''} />
                <span>{isSyncing ? 'Auditing...' : 'Run Pipeline Audit'}</span>
              </button>
              <button 
                onClick={onClose}
                className="text-muted hover:text-primary p-1.5 rounded-lg hover:bg-surface transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 mt-4 font-mono text-xs border-t border-border/30 pt-3">
            <button
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'pipeline' ? 'bg-accent text-background font-bold' : 'text-muted hover:text-primary'}`}
              onClick={() => setActiveTab('pipeline')}
            >
              7-Stage Execution Logs ({result.auditLogs.length})
            </button>
            <button
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'math' ? 'bg-accent text-background font-bold' : 'text-muted hover:text-primary'}`}
              onClick={() => setActiveTab('math')}
            >
              Rolling 30-Day Math & Boundary Logic
            </button>
            <button
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'quarantine' ? 'bg-accent text-background font-bold' : 'text-muted hover:text-primary'}`}
              onClick={() => setActiveTab('quarantine')}
            >
              Postponement & Quarantine ({result.quarantinedCount})
            </button>
            <button
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'sources' ? 'bg-accent text-background font-bold' : 'text-muted hover:text-primary'}`}
              onClick={() => setActiveTab('sources')}
            >
              Multi-Source Triangulation
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-dossier-body py-4 space-y-6">
          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-surface/60 border border-border/60">
              <span className="text-muted block text-[10px]">TOTAL INGESTED</span>
              <span className="text-lg font-bold text-primary">{result.totalIngested}</span>
              <span className="text-[10px] text-muted block">Candidate Records</span>
            </div>
            <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/40">
              <span className="text-emerald-400 block text-[10px]">IN THEATRES (30D)</span>
              <span className="text-lg font-bold text-emerald-300">{result.activeTheatricalCount}</span>
              <span className="text-[10px] text-emerald-400/80 block">{windowInfo.formattedStartDate.split(' ')[0]} – {windowInfo.formattedEndDate.split(' ')[0]}</span>
            </div>
            <div className="p-3 rounded bg-cyan-950/40 border border-cyan-800/40">
              <span className="text-cyan-400 block text-[10px]">UPCOMING RELEASES</span>
              <span className="text-lg font-bold text-cyan-300">{result.upcomingScheduledCount}</span>
              <span className="text-[10px] text-cyan-400/80 block">Today Onward</span>
            </div>
            <div className="p-3 rounded bg-amber-950/40 border border-amber-800/40">
              <span className="text-amber-400 block text-[10px]">QUARANTINED POSTPONED</span>
              <span className="text-lg font-bold text-amber-300">{result.quarantinedCount}</span>
              <span className="text-[10px] text-amber-400/80 block">The Raja Saab</span>
            </div>
            <div className="p-3 rounded bg-surface/60 border border-border/60">
              <span className="text-muted block text-[10px]">EVICTED TO ARCHIVE</span>
              <span className="text-lg font-bold text-secondary">{result.archivedPast30DaysCount}</span>
              <span className="text-[10px] text-muted block">&gt; 30 Days Old</span>
            </div>
          </div>

          {/* TAB 1: 7-Stage Execution Logs */}
          {activeTab === 'pipeline' && (
            <div className="space-y-3 font-mono text-xs">
              <h3 className="text-sm font-display font-bold text-primary mb-2 flex items-center gap-2">
                <Layers size={15} className="text-accent" />
                Live Deterministic Pipeline Execution Sequence
              </h3>

              {result.auditLogs.map((log) => (
                <div 
                  key={log.stage}
                  className="p-3 rounded bg-surface/50 border border-border/50 hover:border-accent/40 transition-colors flex items-start gap-3"
                >
                  <div className="p-1 rounded bg-accent/20 text-accent font-bold mt-0.5">
                    0{log.stage}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-xs">{log.stageName}</span>
                      <span className="text-[11px] text-status-positive flex items-center gap-1">
                        <CheckCircle2 size={12} /> {log.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-secondary text-[11px] mt-1">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Mathematical Specification */}
          {activeTab === 'math' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded bg-surface/70 border border-accent/20 space-y-3">
                <h3 className="text-sm font-display font-bold text-primary flex items-center gap-2">
                  <BarChart3 size={15} className="text-accent" />
                  Mathematical Definition of the Continuous Rolling 30-Day Window
                </h3>
                <div className="p-3 rounded bg-background/80 border border-border font-mono text-xs text-accent">
                  <code>
                    W_theatrical = [T_IST - 29 calendar days, T_IST] (inclusive of today = 30 calendar days)
                  </code>
                </div>
                <ul className="space-y-2 text-secondary text-xs">
                  <li>
                    <strong>Anchor Timezone:</strong> Indian Standard Time (<span className="text-accent">Asia/Kolkata</span>, UTC+05:30).
                  </li>
                  <li>
                    <strong>Day of Run Calculation:</strong> If a movie was released on date <span className="text-primary">D_rel</span>, its active theatrical run day is:
                    <br />
                    <code>DayOfRun = (T_IST - D_rel) + 1</code>.
                    <br />
                    <em>Example:</em> On 21 Oct 2026, Jailer 2 (15 Oct 2026) has elapsed 6 days + 1 = <strong>Day 7 of Theatrical Run</strong>.
                  </li>
                  <li>
                    <strong>Automatic Daily Shift:</strong> Tomorrow at <span className="text-accent">00:00:00 IST</span>, the window shifts to <code>[23 Sep 2026, 22 Oct 2026]</code>. Jailer 2 automatically advances to Day 8 without manual database updates.
                  </li>
                  <li>
                    <strong>Automatic Eviction:</strong> When a movie's elapsed days exceed 29 (e.g. Stree 2 released 14 Aug 2026 = 68 days ago), it is automatically evicted from the theatrical repertoire.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Postponement & Quarantine */}
          {activeTab === 'quarantine' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle size={15} />
                  <span>Quarantined Title: The Raja Saab (Prabhas & Maruthi)</span>
                </div>
                <p className="text-secondary text-xs">
                  <strong>Reconciliation Reason:</strong> Originally slated for October 2026. People Media Factory and Telugu Film Producers Guild officially announced postponement to 2027 for extensive visual effects polish.
                </p>
                <p className="text-muted text-[11px]">
                  <strong>Pipeline Action:</strong> Quarantined from active theatrical screenings and active upcoming lists. Clearly flagged in audit records to prevent misleading viewers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Multi-Source Triangulation */}
          {activeTab === 'sources' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded bg-surface/70 border border-border space-y-2">
                <h4 className="font-bold text-primary text-xs flex items-center gap-2">
                  <Database size={14} className="text-accent" />
                  Triangulation & Divergence Rules
                </h4>
                <ul className="space-y-2 text-secondary text-xs">
                  <li>
                    <strong>1. Net vs Gross Separation:</strong> Net is domestic post-tax earnings (Gross / 1.18). Worldwide Gross = India Gross + Overseas Gross in INR.
                  </li>
                  <li>
                    <strong>2. Producer Claims Divergence (&gt;4.5%):</strong> In Kantara: Chapter 1, Hombale claim (₹533.8 Cr) diverges by +8.7% from machine-tracked Sacnilk (₹491.1 Cr). The algorithm automatically flags the producer claim and excludes it from the representative consensus.
                  </li>
                  <li>
                    <strong>3. Representative Net:</strong> Computed as the median of machine-tracked ticketing and 14-circuit trade consensus.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-dossier-footer border-t border-border/50 pt-3 flex items-center justify-between font-mono text-xs text-muted">
          <span>Temporal Anchor: {currentISTDateStr} IST • Engine v2.4</span>
          <button
            onClick={onClose}
            className="filter-pill-btn active px-4 py-1"
          >
            Close Pipeline Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
