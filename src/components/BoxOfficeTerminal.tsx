import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Info,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Layers,
  Table as TableIcon
} from 'lucide-react';
import type { Movie, IndustryCode } from '../types/cinema';
import { useCinemaTelemetry } from '../context/TelemetryContext';
import { getMovieTriangulation } from '../utils/boxOfficeTriangulation';

interface BoxOfficeTerminalProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  selectedIndustry: IndustryCode;
  onSelectIndustry?: (ind: IndustryCode) => void;
}

export const BoxOfficeTerminal: React.FC<BoxOfficeTerminalProps> = ({
  movies,
  onSelectMovie,
  selectedIndustry,
}) => {
  const {
    formattedISTDateTime,
    lastSyncTime,
    nextSyncCountdown,
    isSyncing,
    refreshFeeds,
    windowInfo,
  } = useCinemaTelemetry();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'triangulation'>('leaderboard');
  const [metricMode, setMetricMode] = useState<'worldwide' | 'indiaNet' | 'indiaGross' | 'overseas'>('worldwide');
  const [selectedAuditMovieId, setSelectedAuditMovieId] = useState<string>('kantara-chapter-1');
  const [hoveredPoint, setHoveredPoint] = useState<{
    movieTitle: string;
    day: number;
    amount: number;
    occupancy: number;
    x: number;
    y: number;
  } | null>(null);

  // Filter movies with reported box office in the active window
  const validMovies = movies.filter((m) => m.boxOffice.worldwideGrossCr > 0);

  const filteredMovies = selectedIndustry === 'all'
    ? validMovies
    : validMovies.filter((m) => m.industry === selectedIndustry);

  // Sort leaderboard by metric
  const sortedLeaderboard = [...filteredMovies].sort((a, b) => {
    if (metricMode === 'worldwide') {
      return b.boxOffice.worldwideGrossCr - a.boxOffice.worldwideGrossCr;
    } else if (metricMode === 'indiaNet') {
      return b.boxOffice.totalIndiaNetCr - a.boxOffice.totalIndiaNetCr;
    } else if (metricMode === 'indiaGross') {
      return b.boxOffice.totalIndiaGrossCr - a.boxOffice.totalIndiaGrossCr;
    } else {
      return b.boxOffice.overseasGrossCr - a.boxOffice.overseasGrossCr;
    }
  });

  // Active blockbusters in the current 30-day window
  const kantara = movies.find((m) => m.id === 'kantara-chapter-1');
  const coolie = movies.find((m) => m.id === 'coolie');
  const alpha = movies.find((m) => m.id === 'alpha');

  // Chart coordinate calculations (SVG viewBox 0 0 700 240)
  const maxDay = 14;
  const maxCollection = 550;
  const width = 700;
  const height = 240;
  const paddingLeft = 60;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const getCumulativePoints = (movie: Movie | undefined) => {
    if (!movie || !movie.boxOffice.dayWise.length) return [];
    let sum = 0;
    return movie.boxOffice.dayWise.slice(0, 14).map((d) => {
      sum += d.collectionNetCr;
      const x = paddingLeft + ((d.day - 1) / (maxDay - 1)) * chartW;
      const y = paddingTop + chartH - (sum / maxCollection) * chartH;
      return { day: d.day, cumulative: sum, x, y, occupancy: d.occupancyPct };
    });
  };

  const kantaraPoints = getCumulativePoints(kantara);
  const cooliePoints = getCumulativePoints(coolie);
  const alphaPoints = getCumulativePoints(alpha);

  const makePathD = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  };

  const selectedAuditMovie = movies.find((m) => m.id === selectedAuditMovieId) || movies[0];
  const auditDossier = selectedAuditMovie ? getMovieTriangulation(selectedAuditMovie) : null;

  return (
    <section className="boxoffice-terminal-section" aria-label="Box Office Financial Intelligence Terminal">
      {/* Real-time IST Telemetry Strip */}
      <div className="telemetry-live-strip font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="live-pulse-dot" title="Live IST Telemetry Stream"></span>
          <span className="text-secondary font-semibold">IST TELEMETRY:</span>
          <span className="text-primary font-bold">{formattedISTDateTime}</span>
          <span className="divider-dot">•</span>
          <span className="text-muted">{windowInfo.windowLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted">
            Auto-Sync in: <span className="text-accent font-bold">{nextSyncCountdown}s</span>
          </span>
          <span className="divider-dot">•</span>
          <span className="text-xs text-secondary">Last Calibrated: {lastSyncTime}</span>
          <button
            className={`refresh-sync-btn ${isSyncing ? 'syncing' : ''}`}
            onClick={refreshFeeds}
            disabled={isSyncing}
            title="Cross-check feeds against Sacnilk, Trade Consensus & Comscore"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Auditing Feeds...' : 'Sync Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">FINANCIAL TELEMETRY // DESK 01</span>
          <h2 className="section-title font-display">Indian Cinema Box-Office Intelligence Terminal</h2>
        </div>
        <div className="telemetry-badge font-mono text-xs">
          <ShieldCheck size={14} className="text-status-positive" />
          <span>Multi-Source Triangulation Active (Sacnilk • BOI & Regional • Comscore)</span>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-label-row font-mono text-xs text-muted">
            <span>TODAY'S ESTIMATED NET (ALL-INDIA • IST)</span>
            <span className="live-beacon-green"></span>
          </div>
          <div className="kpi-value font-mono">
            ₹26.85 <span className="kpi-unit">Cr</span>
          </div>
          <div className="kpi-trend font-mono text-xs text-status-positive">
            <ArrowUpRight size={13} />
            <span>+12.4% Wednesday festive holdover</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-label-row font-mono text-xs text-muted">
            <span>ACTIVE MONITORED SCREENS</span>
            <BarChart3 size={14} className="text-accent" />
          </div>
          <div className="kpi-value font-mono">
            10,420 <span className="kpi-unit">Screens</span>
          </div>
          <div className="kpi-trend font-mono text-xs text-muted">
            <span>2,650 Single Screens • 7,770 Multiplexes</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-label-row font-mono text-xs text-muted">
            <span>OCTOBER LEADER (WW GROSS)</span>
            <TrendingUp size={14} className="text-status-positive" />
          </div>
          <div className="kpi-value font-mono text-accent">
            ₹742.0 <span className="kpi-unit">Cr WW</span>
          </div>
          <div className="kpi-trend font-mono text-xs text-secondary">
            <span>Kantara: Chapter 1 (₹494.8 Cr Net)</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-label-row font-mono text-xs text-muted">
            <span>OCTOBER MULTIPLIER INDEX</span>
            <Info size={14} className="text-muted" />
          </div>
          <div className="kpi-value font-mono">
            3.41<span className="kpi-unit">x</span>
          </div>
          <div className="kpi-trend font-mono text-xs text-status-positive">
            <span>Strongest in Mythological Action & Auteur Crime</span>
          </div>
        </div>
      </div>

      {/* Terminal View Switcher Navigation */}
      <div className="terminal-view-switcher font-mono text-xs mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`terminal-tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <TableIcon size={14} />
            <span>Audited Leaderboard & Trajectory Curve</span>
          </button>
          <button
            className={`terminal-tab-btn ${activeTab === 'triangulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('triangulation')}
          >
            <Layers size={14} />
            <span>Multi-Source Triangulation Matrix & Discrepancy Analyzer</span>
          </button>
        </div>

        <div className="metric-toggle-group">
          <button
            className={`metric-toggle-btn ${metricMode === 'worldwide' ? 'active' : ''}`}
            onClick={() => setMetricMode('worldwide')}
          >
            WW Gross
          </button>
          <button
            className={`metric-toggle-btn ${metricMode === 'indiaNet' ? 'active' : ''}`}
            onClick={() => setMetricMode('indiaNet')}
          >
            India Net
          </button>
          <button
            className={`metric-toggle-btn ${metricMode === 'indiaGross' ? 'active' : ''}`}
            onClick={() => setMetricMode('indiaGross')}
          >
            India Gross
          </button>
          <button
            className={`metric-toggle-btn ${metricMode === 'overseas' ? 'active' : ''}`}
            onClick={() => setMetricMode('overseas')}
          >
            Overseas ($/₹)
          </button>
        </div>
      </div>

      {/* View 1: Main Terminal Grid (Chart + Leaderboard) */}
      {activeTab === 'leaderboard' && (
        <div className="terminal-main-grid">
          {/* Interactive Trajectory Chart Panel */}
          <div className="terminal-chart-panel glass-panel">
            <div className="chart-panel-header">
              <div>
                <h3 className="font-display text-md">Cumulative Net Trajectory: Active 30-Day Window (Days 1–14)</h3>
                <p className="font-mono text-xs text-muted">
                  Audited All-India net progression curves for blockbusters running in the 30-day window
                </p>
              </div>
              {/* Chart Legend */}
              <div className="chart-legend font-mono text-xs">
                <span className="legend-item">
                  <span className="legend-color-dot pushpa-dot"></span> Kantara Chapter 1
                </span>
                <span className="legend-item">
                  <span className="legend-color-dot kalki-dot"></span> Coolie
                </span>
                <span className="legend-item">
                  <span className="legend-color-dot stree-dot"></span> Alpha
                </span>
              </div>
            </div>

            {/* SVG Vector Chart */}
            <div className="svg-chart-container">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="boxoffice-svg-chart"
                aria-label="Interactive Box Office Trajectory Chart"
              >
                {/* Horizontal Gridlines */}
                {[0, 100, 200, 300, 400, 500].map((val) => {
                  const y = paddingTop + chartH - (val / maxCollection) * chartH;
                  return (
                    <g key={val} className="chart-gridline-group">
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingLeft - 10}
                        y={y + 4}
                        fill="rgba(255,255,255,0.35)"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        ₹{val}Cr
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Day Lines */}
                {[1, 3, 5, 7, 10, 14].map((day) => {
                  const x = paddingLeft + ((day - 1) / (maxDay - 1)) * chartW;
                  return (
                    <g key={day}>
                      <line
                        x1={x}
                        y1={paddingTop}
                        x2={x}
                        y2={paddingTop + chartH}
                        stroke="rgba(255,255,255,0.04)"
                      />
                      <text
                        x={x}
                        y={height - 12}
                        fill="rgba(255,255,255,0.4)"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        D{day}
                      </text>
                    </g>
                  );
                })}

                {/* SVG Curve: Kantara Chapter 1 (Gold/Amber) */}
                <path
                  d={makePathD(kantaraPoints)}
                  fill="none"
                  stroke="var(--color-accent-gold)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line-kantara"
                />

                {/* SVG Curve: Coolie (Crimson) */}
                <path
                  d={makePathD(cooliePoints)}
                  fill="none"
                  stroke="var(--color-accent-crimson)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line-coolie"
                />

                {/* SVG Curve: Alpha (Indigo/Purple) */}
                <path
                  d={makePathD(alphaPoints)}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line-alpha"
                />

                {/* Interactive Data Points for Kantara */}
                {kantaraPoints.map((p) => (
                  <circle
                    key={`kantara-${p.day}`}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="var(--color-accent-gold)"
                    stroke="#000"
                    strokeWidth="1.5"
                    className="chart-dot interactive"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        movieTitle: 'Kantara: Chapter 1',
                        day: p.day,
                        amount: p.cumulative,
                        occupancy: p.occupancy,
                        x: p.x,
                        y: p.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Interactive Data Points for Coolie */}
                {cooliePoints.map((p) => (
                  <circle
                    key={`coolie-${p.day}`}
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill="var(--color-accent-crimson)"
                    stroke="#000"
                    strokeWidth="1.5"
                    className="chart-dot interactive"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        movieTitle: 'Coolie',
                        day: p.day,
                        amount: p.cumulative,
                        occupancy: p.occupancy,
                        x: p.x,
                        y: p.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Interactive Data Points for Alpha */}
                {alphaPoints.map((p) => (
                  <circle
                    key={`alpha-${p.day}`}
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill="#a855f7"
                    stroke="#000"
                    strokeWidth="1"
                    className="chart-dot interactive"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        movieTitle: 'Alpha',
                        day: p.day,
                        amount: p.cumulative,
                        occupancy: p.occupancy,
                        x: p.x,
                        y: p.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className="chart-floating-tooltip glass-panel font-mono text-xs"
                  style={{
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: `${(hoveredPoint.y / height) * 100}%`,
                  }}
                >
                  <div className="tooltip-title font-display text-accent">{hoveredPoint.movieTitle}</div>
                  <div className="tooltip-row">
                    <span className="text-muted">Day {hoveredPoint.day} Cum. Net:</span>
                    <span className="text-primary font-bold">₹{hoveredPoint.amount.toFixed(1)} Cr</span>
                  </div>
                  <div className="tooltip-row">
                    <span className="text-muted">Avg Occupancy:</span>
                    <span className="text-status-positive">{hoveredPoint.occupancy}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Grossers Financial Leaderboard */}
          <div className="terminal-leaderboard-panel glass-panel">
            <div className="leaderboard-header">
              <div>
                <h3 className="font-display text-md">Active 30-Day Theatrical Leaderboard</h3>
                <p className="font-mono text-xs text-muted">Audited multi-circuit theatrical collections as of IST clock</p>
              </div>
            </div>

            {/* Table Container */}
            <div className="leaderboard-table-wrap">
              <table className="leaderboard-table font-mono" role="table">
                <thead>
                  <tr>
                    <th scope="col">Rank & Film</th>
                    <th scope="col">Industry</th>
                    <th scope="col" className="text-right">India Net</th>
                    <th scope="col" className="text-right">India Gross</th>
                    <th scope="col" className="text-right">Overseas</th>
                    <th scope="col" className="text-right">WW Gross</th>
                    <th scope="col" className="text-center">Verdict</th>
                    <th scope="col" className="text-right">Audited Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard.map((movie, index) => {
                    return (
                      <tr
                        key={movie.id}
                        className="leaderboard-row interactive-card"
                        onClick={() => onSelectMovie(movie)}
                        title={`Click to open ${movie.title} full audit dossier`}
                      >
                        <td className="film-cell">
                          <span className="rank-num">#{index + 1}</span>
                          <img src={movie.posterUrl} alt="" className="table-thumb" />
                          <div>
                            <div className="table-title font-body font-semibold">{movie.title}</div>
                            <div className="table-native text-xs text-muted">{movie.nativeTitle}</div>
                          </div>
                        </td>

                        <td className="text-secondary text-xs uppercase">{movie.industry}</td>

                        <td className="text-right font-bold text-accent">
                          ₹{movie.boxOffice.totalIndiaNetCr.toFixed(1)} Cr
                        </td>

                        <td className="text-right text-xs text-muted">
                          ₹{movie.boxOffice.totalIndiaGrossCr.toFixed(1)} Cr
                        </td>

                        <td className="text-right text-xs text-cyan-400">
                          ₹{movie.boxOffice.overseasGrossCr.toFixed(1)} Cr
                        </td>

                        <td className="text-right font-bold text-status-positive">
                          ₹{movie.boxOffice.worldwideGrossCr.toFixed(1)} Cr
                        </td>

                        <td className="text-center">
                          <span className="verdict-chip font-mono text-xs">
                            {movie.boxOffice.verdict}
                          </span>
                        </td>

                        <td className="text-right">
                          <span className="confidence-pill font-mono text-xs text-status-positive">
                            {movie.boxOffice.confidenceScorePct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="leaderboard-footer font-mono text-xs text-muted">
              <span>Audited against MAI, Sacnilk, Circuit Distributors & Comscore</span>
              <span>•</span>
              <span className="text-status-positive">{windowInfo.windowLabel}</span>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Multi-Source Triangulation Matrix & Discrepancy Analyzer */}
      {activeTab === 'triangulation' && (
        <div className="triangulation-desk-grid">
          {/* Movie Selector Strip */}
          <div className="audit-movie-selector font-mono text-xs glass-panel p-3 mb-4 flex items-center justify-between">
            <span className="text-secondary font-bold">SELECT ACTIVE TITLE FOR CROSS-CHECKING AUDIT:</span>
            <div className="flex gap-2">
              {validMovies.map((m) => (
                <button
                  key={m.id}
                  className={`filter-pill-btn ${selectedAuditMovieId === m.id ? 'active' : ''}`}
                  onClick={() => setSelectedAuditMovieId(m.id)}
                >
                  {m.title}
                </button>
              ))}
            </div>
          </div>

          {/* Triangulation Analysis View for Selected Movie */}
          {auditDossier && selectedAuditMovie && (
            <div className="audit-dossier-card glass-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl text-primary">{selectedAuditMovie.title}</h3>
                    <span className="text-xs font-mono uppercase bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/30">
                      {selectedAuditMovie.industry}
                    </span>
                    <span className="text-xs font-mono text-muted">
                      Released: {selectedAuditMovie.releaseDate}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted mt-1">
                    Multi-source cross-checking comparing machine-tracked screens, trade consensus distributors, producer press releases, and Comscore international telemetry.
                  </p>
                </div>

                {/* Consensus Rating Badge */}
                <div className="consensus-rating-badge font-mono text-xs text-right">
                  <div className="text-muted text-[10px] uppercase">Consensus Status</div>
                  <div className={`font-bold ${auditDossier.consensusRating.includes('Divergence') ? 'text-amber-400' : 'text-status-positive'}`}>
                    {auditDossier.consensusRating}
                  </div>
                  <div className="text-[11px] text-secondary">
                    Spread Variance: ±{auditDossier.discrepancySpreadPct}%
                  </div>
                </div>
              </div>

              {/* 4 Representative Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5 font-mono text-xs">
                <div className="p-3 rounded bg-white/[0.03] border border-white/10">
                  <span className="text-muted block mb-1">REPRESENTATIVE INDIA NET</span>
                  <span className="text-xl font-bold text-accent">₹{auditDossier.representativeIndiaNetCr} Cr</span>
                  <span className="text-[11px] text-muted block mt-1">Post GST & Entertainment Tax</span>
                </div>
                <div className="p-3 rounded bg-white/[0.03] border border-white/10">
                  <span className="text-muted block mb-1">REPRESENTATIVE INDIA GROSS</span>
                  <span className="text-xl font-bold text-primary">₹{auditDossier.representativeIndiaGrossCr} Cr</span>
                  <span className="text-[11px] text-muted block mt-1">Total Domestic Box-Office</span>
                </div>
                <div className="p-3 rounded bg-white/[0.03] border border-white/10">
                  <span className="text-muted block mb-1">OVERSEAS GROSS (RENTRAK)</span>
                  <span className="text-xl font-bold text-cyan-400">
                    ₹{auditDossier.representativeOverseasGrossCr} Cr
                  </span>
                  <span className="text-[11px] text-cyan-300 block mt-1">
                    ${auditDossier.overseasUSDMillion}M USD Diaspora
                  </span>
                </div>
                <div className="p-3 rounded bg-white/[0.03] border border-white/10">
                  <span className="text-muted block mb-1">WORLDWIDE GROSS (TOTAL)</span>
                  <span className="text-xl font-bold text-status-positive">
                    ₹{auditDossier.representativeWorldwideGrossCr} Cr
                  </span>
                  <span className="text-[11px] text-secondary block mt-1">
                    Distributor Share: ₹{auditDossier.distributorShareCr} Cr
                  </span>
                </div>
              </div>

              {/* Side-by-Side Source Comparison Table */}
              <div className="source-comparison-table-wrap mb-4">
                <h4 className="font-mono text-xs uppercase text-accent mb-2">Tracked Source Disclosures & Discrepancy Breakdown:</h4>
                <table className="leaderboard-table font-mono text-xs">
                  <thead>
                    <tr>
                      <th scope="col">Reporting Source</th>
                      <th scope="col">Category</th>
                      <th scope="col" className="text-right">India Net</th>
                      <th scope="col" className="text-right">India Gross</th>
                      <th scope="col" className="text-right">Overseas Gross</th>
                      <th scope="col" className="text-right">Worldwide Gross</th>
                      <th scope="col" className="text-center">Audit Status</th>
                      <th scope="col">Discrepancy Analysis Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditDossier.sources.map((src, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="font-bold text-primary">{src.sourceName}</td>
                        <td className="text-secondary text-xs">{src.sourceCategory}</td>
                        <td className="text-right font-bold text-accent">
                          {src.indiaNetCr ? `₹${src.indiaNetCr.toFixed(2)} Cr` : '—'}
                        </td>
                        <td className="text-right text-muted">
                          {src.indiaGrossCr ? `₹${src.indiaGrossCr.toFixed(2)} Cr` : '—'}
                        </td>
                        <td className="text-right text-cyan-400">
                          {src.overseasGrossCr ? `₹${src.overseasGrossCr.toFixed(2)} Cr` : '—'}
                        </td>
                        <td className="text-right font-bold text-status-positive">
                          {src.worldwideGrossCr ? `₹${src.worldwideGrossCr.toFixed(2)} Cr` : '—'}
                        </td>
                        <td className="text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            src.auditStatus === 'Flagged Divergence'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : src.auditStatus === 'Audited & Verified'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {src.auditStatus}
                          </span>
                        </td>
                        <td className="text-xs text-muted max-w-[280px]">
                          {src.varianceNote}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Methodology Explainer Callout */}
              <div className="methodology-callout p-3 rounded bg-accent/5 border border-accent/20 font-mono text-xs">
                <div className="flex items-center gap-2 text-accent font-bold mb-1">
                  <Info size={14} />
                  <span>TRIANGULATION METHODOLOGY & RECONCILIATION RULE:</span>
                </div>
                <p className="text-secondary leading-relaxed">
                  {auditDossier.triangulationMethodology}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
