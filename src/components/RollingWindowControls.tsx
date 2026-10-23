import React from 'react';
import { Calendar, FastForward, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { useCinemaTelemetry } from '../context/TelemetryContext';

interface RollingWindowControlsProps {
  onOpenPipelineInspector?: () => void;
}

export const RollingWindowControls: React.FC<RollingWindowControlsProps> = ({ onOpenPipelineInspector }) => {
  const {
    currentISTDateStr,
    windowInfo,
    simulatedOffsetDays,
    setSimulatedOffsetDays,
    resetDateSimulation,
    isSimulatingDate,
    nextSyncCountdown,
  } = useCinemaTelemetry();

  const presets = [
    { label: 'Live Today (21 Oct)', days: 0, desc: 'Anchor: 22 Sep – 21 Oct 2026' },
    { label: 'Tomorrow (+1 Day)', days: 1, desc: 'Window shifts: 23 Sep – 22 Oct 2026' },
    { label: 'Thalapathy 69 Bow (+8 Days)', days: 8, desc: '29 Oct 2026: Vijay final film moves to Day 1' },
    { label: 'Ramayana Part 1 Bow (+15 Days)', days: 15, desc: '05 Nov 2026: Ramayana Day 1; Kantara/Alpha purged' },
    { label: '+35 Days Horizon', days: 35, desc: '25 Nov 2026: Coolie & Jailer 2 purged outside 30d' },
  ];

  return (
    <div className="rolling-window-controls-panel glass-panel mb-8 border border-accent/20 p-4 rounded-lg bg-surface-elevated/70 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-accent" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            Continuous Rolling 30-Day Window Engine
          </span>
          {isSimulatingDate ? (
            <span className="font-mono text-[11px] bg-amber-950/80 text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <FastForward size={11} /> SIMULATING DATE: {currentISTDateStr} (+{simulatedOffsetDays}d)
            </span>
          ) : (
            <span className="font-mono text-[11px] bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE IST: {currentISTDateStr}
            </span>
          )}
        </div>

        {/* Dynamic Interval Summary & Reset Action */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-secondary font-semibold">
            {windowInfo.windowLabel}
          </span>
          {isSimulatingDate && (
            <button
              onClick={resetDateSimulation}
              className="flex items-center gap-1 bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 px-2.5 py-1 rounded text-[11px] transition-colors"
              title="Reset simulation to real-time IST clock"
            >
              <RotateCcw size={11} />
              Reset to Live Clock
            </button>
          )}
        </div>
      </div>

      {/* Preset Buttons Strip */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-muted flex items-center gap-1 mr-1">
          <Sparkles size={11} className="text-accent" /> Test Date Progression:
        </span>
        {presets.map((preset) => {
          const isActive = simulatedOffsetDays === preset.days;
          return (
            <button
              key={preset.days}
              onClick={() => setSimulatedOffsetDays(preset.days)}
              className={`font-mono text-xs px-3 py-1.5 rounded transition-all ${
                isActive
                  ? 'bg-accent text-background font-bold shadow-md shadow-accent/20'
                  : 'bg-surface hover:bg-surface-hover text-muted hover:text-primary border border-border/50'
              }`}
              title={preset.desc}
            >
              {preset.label}
            </button>
          );
        })}

        <div className="ml-auto font-mono text-[11px] text-muted flex items-center gap-1">
          <Clock size={11} className="text-muted" />
          <span>Next Auto-Sync: {nextSyncCountdown}s</span>
          <span className="text-border">|</span>
          <span>Daily Midnight Rollover: 00:00:00 IST</span>
        </div>
      </div>
    </div>
  );
};
