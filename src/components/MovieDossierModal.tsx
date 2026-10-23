import React, { useState } from 'react';
import {
  X,
  Star,
  Award,
  TrendingUp,
  Clock,
  Calendar,
  Users,
  ShieldCheck,
  Play,
  Film,
  BarChart2,
  Newspaper,
  MessageSquare,
  Share2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Movie, NewsArticle, DiscussionThread } from '../types/cinema';

interface MovieDossierModalProps {
  movie: Movie | null;
  onClose: () => void;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  news: NewsArticle[];
  threads: DiscussionThread[];
  onSelectNews: (news: NewsArticle) => void;
}

export const MovieDossierModal: React.FC<MovieDossierModalProps> = ({
  movie,
  onClose,
  allMovies,
  onSelectMovie,
  news,
  threads,
  onSelectNews,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'boxoffice' | 'news' | 'discussions'>('overview');
  const [showTrailer, setShowTrailer] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!movie) return null;

  // Filter related movies and news
  const relatedMovies = allMovies
    .filter((m) => m.id !== movie.id && (m.industry === movie.industry || m.director === movie.director))
    .slice(0, 3);

  const movieNews = news.filter((n) => n.relatedMovieId === movie.id);
  const movieThreads = threads.filter((t) => t.movieId === movie.id);

  const hasDayWise = movie.boxOffice.dayWise && movie.boxOffice.dayWise.length > 0;
  const hasBoxOffice = movie.boxOffice.worldwideGrossCr > 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dossier-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Film Dossier: ${movie.title}`}>
      <div className="dossier-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top Floating Control Bar */}
        <div className="dossier-top-bar">
          <div className="dossier-top-identity font-mono text-xs">
            <span className="live-beacon"></span>
            <span className="text-accent font-bold">FILM INTELLIGENCE DOSSIER</span>
            <span className="text-muted">• {movie.id.toUpperCase()}</span>
          </div>

          <div className="dossier-top-actions">
            <button
              className={`dossier-action-icon ${saved ? 'active' : ''}`}
              onClick={() => setSaved(!saved)}
              title={saved ? 'In Watchlist' : 'Add to Watchlist'}
              aria-label="Bookmark film"
            >
              <Bookmark size={16} />
            </button>

            <button
              className="dossier-action-icon"
              onClick={handleShare}
              title="Copy Dossier URL"
              aria-label="Share dossier"
            >
              <Share2 size={16} />
              {copied && <span className="copied-pill font-mono">Copied</span>}
            </button>

            <button
              className="dossier-close-btn"
              onClick={onClose}
              aria-label="Close dossier"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cinematic Backdrop Hero Section */}
        <div className="dossier-hero">
          <img src={movie.backdropUrl} alt="" className="dossier-hero-backdrop" />
          <div className="dossier-hero-scrim" />

          {/* Hero Content Overlay */}
          <div className="dossier-hero-content">
            {/* Poster Thumbnail */}
            <div className="dossier-poster-wrap">
              <img src={movie.posterUrl} alt={movie.title} className="dossier-poster-img" />
              <button
                className="trailer-play-overlay-btn"
                onClick={() => setShowTrailer(true)}
                aria-label="Play theatrical teaser"
              >
                <Play size={20} className="fill-current" />
                <span className="font-mono text-xs">Play Teaser</span>
              </button>
            </div>

            {/* Title & Key Metadata */}
            <div className="dossier-hero-info">
              <div className="dossier-tags-top font-mono text-xs">
                <span className="censor-tag">{movie.censorRating}</span>
                <span className="industry-tag uppercase">{movie.industry}</span>
                <span className="lang-tag">{movie.language}</span>
                {movie.formats.map((f) => (
                  <span key={f} className="format-tag">{f}</span>
                ))}
              </div>

              <h1 className="dossier-title font-display">{movie.title}</h1>
              <div className={`dossier-native-title ${movie.scriptClass}`}>
                {movie.nativeTitle}
              </div>

              {/* Vital Stat Row */}
              <div className="dossier-vital-row font-mono text-xs text-secondary">
                <span>
                  <Clock size={13} className="inline mr-1 text-accent" />
                  {movie.runtimeMinutes} Minutes
                </span>
                <span>•</span>
                <span>
                  <Calendar size={13} className="inline mr-1 text-accent" />
                  Released {movie.releaseDate}
                </span>
                <span>•</span>
                <span>
                  <Film size={13} className="inline mr-1 text-accent" />
                  {movie.genres.join(', ')}
                </span>
              </div>

              {/* Dual Rating Scorecard */}
              <div className="dossier-ratings-scorecard font-mono">
                <div className="scorecard-block audience glass-panel">
                  <div className="scorecard-label text-muted text-xs">AUDIENCE REPUTATION</div>
                  <div className="scorecard-val-row">
                    <Star size={18} className="text-accent fill-accent" />
                    <span className="scorecard-num font-bold text-lg text-primary">{movie.audienceScore}</span>
                    <span className="scorecard-den text-muted text-xs">/10</span>
                  </div>
                  <div className="scorecard-sub text-muted text-xs">
                    {movie.audienceVotesCount.toLocaleString()} verified ratings
                  </div>
                </div>

                <div className="scorecard-block critic glass-panel">
                  <div className="scorecard-label text-muted text-xs">CRITIC METASCORE</div>
                  <div className="scorecard-val-row">
                    <Award size={18} className="text-cyan-400" />
                    <span className="scorecard-num font-bold text-lg text-cyan-400">{movie.criticScore}</span>
                    <span className="scorecard-den text-muted text-xs">/100</span>
                  </div>
                  <div className="scorecard-sub text-muted text-xs">
                    {movie.criticReviewsCount} accredited reviews
                  </div>
                </div>

                {hasBoxOffice && (
                  <div className="scorecard-block financial glass-panel">
                    <div className="scorecard-label text-muted text-xs">WORLDWIDE GROSS</div>
                    <div className="scorecard-val-row">
                      <TrendingUp size={18} className="text-status-positive" />
                      <span className="scorecard-num font-bold text-lg text-accent">
                        ₹{movie.boxOffice.worldwideGrossCr.toFixed(1)}
                      </span>
                      <span className="scorecard-den text-accent text-xs">Cr</span>
                    </div>
                    <div className="scorecard-sub text-status-positive text-xs">
                      {movie.boxOffice.verdict}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dossier Section Tabs */}
        <div className="dossier-tabs-nav font-mono text-xs">
          <button
            className={`dossier-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Executive Summary & Personnel
          </button>
          <button
            className={`dossier-tab-btn ${activeTab === 'boxoffice' ? 'active' : ''}`}
            onClick={() => setActiveTab('boxoffice')}
          >
            Box-Office Telemetry {hasBoxOffice && '(Audited)'}
          </button>
          <button
            className={`dossier-tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            Trade News ({movieNews.length})
          </button>
          <button
            className={`dossier-tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
            onClick={() => setActiveTab('discussions')}
          >
            Trade Discourse ({movieThreads.length})
          </button>
        </div>

        {/* Tab 1: Overview & Personnel */}
        {activeTab === 'overview' && (
          <div className="dossier-body-tab">
            <div className="overview-layout-grid">
              {/* Left Synopsis & Film Details */}
              <div className="overview-main">
                <div className="dossier-section-block">
                  <h3 className="dossier-block-title font-display">Narrative Synopsis</h3>
                  <p className="dossier-synopsis-text font-body text-secondary">
                    {movie.synopsis}
                  </p>
                </div>

                {/* Key Credits & Key Personnel */}
                <div className="dossier-section-block">
                  <h3 className="dossier-block-title font-display">Creative & Production Personnel</h3>
                  <div className="personnel-grid font-mono text-xs">
                    <div className="personnel-item glass-panel">
                      <span className="personnel-role text-muted">Director</span>
                      <span className="personnel-name text-primary font-semibold">{movie.director}</span>
                    </div>
                    <div className="personnel-item glass-panel">
                      <span className="personnel-role text-muted">Original Score & Music</span>
                      <span className="personnel-name text-primary font-semibold">{movie.musicDirector}</span>
                    </div>
                    <div className="personnel-item glass-panel">
                      <span className="personnel-role text-muted">Producers & Studio</span>
                      <span className="personnel-name text-primary font-semibold">{movie.producers}</span>
                    </div>
                    <div className="personnel-item glass-panel">
                      <span className="personnel-role text-muted">Production Banner</span>
                      <span className="personnel-name text-primary font-semibold">{movie.banner}</span>
                    </div>
                  </div>
                </div>

                {/* Dubbing & Multilingual Distribution */}
                <div className="dossier-section-block">
                  <h3 className="dossier-block-title font-display">Multilingual Distribution Footprint</h3>
                  <div className="languages-pill-row font-mono text-xs">
                    <span className="lang-pill primary">Original: {movie.language}</span>
                    {movie.dubbedLanguages.map((dl) => (
                      <span key={dl} className="lang-pill dubbed">
                        Dubbed: {dl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Key Box Office Snapshot & Related Releases */}
              <div className="overview-sidebar">
                <div className="sidebar-card glass-panel">
                  <h4 className="font-display text-sm text-accent mb-2">Financial Snapshot</h4>
                  <div className="financial-summary-rows font-mono text-xs">
                    <div className="financial-row">
                      <span className="text-muted">Production Budget:</span>
                      <span className="text-primary font-bold">₹{movie.boxOffice.budgetCr} Cr</span>
                    </div>
                    <div className="financial-row">
                      <span className="text-muted">India Opening Net:</span>
                      <span className="text-primary font-bold">
                        {movie.boxOffice.openingDayIndiaNetCr > 0
                          ? `₹${movie.boxOffice.openingDayIndiaNetCr} Cr`
                          : 'Awaiting Premiere'}
                      </span>
                    </div>
                    <div className="financial-row">
                      <span className="text-muted">Total India Net:</span>
                      <span className="text-primary font-bold">
                        {movie.boxOffice.totalIndiaNetCr > 0
                          ? `₹${movie.boxOffice.totalIndiaNetCr} Cr`
                          : 'Awaiting Run'}
                      </span>
                    </div>
                    <div className="financial-row">
                      <span className="text-muted">Trade Verdict:</span>
                      <span className="text-status-positive font-bold">{movie.boxOffice.verdict}</span>
                    </div>
                    <div className="financial-row">
                      <span className="text-muted">Data Confidence:</span>
                      <span className="text-accent font-bold">{movie.boxOffice.confidenceScorePct}% Verified</span>
                    </div>
                  </div>
                </div>

                {/* Related Releases */}
                <div className="sidebar-card glass-panel mt-4">
                  <h4 className="font-display text-sm text-secondary mb-2">Related Comps & Releases</h4>
                  <div className="related-mini-list">
                    {relatedMovies.map((rel) => (
                      <div
                        key={rel.id}
                        className="related-mini-item interactive-card"
                        onClick={() => onSelectMovie(rel)}
                      >
                        <img src={rel.posterUrl} alt="" className="related-mini-thumb" />
                        <div className="related-mini-info">
                          <span className="related-mini-title font-body font-semibold line-clamp-1">{rel.title}</span>
                          <span className="related-mini-sub font-mono text-xs text-muted">
                            {rel.language} • ₹{rel.boxOffice.worldwideGrossCr} Cr WW
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Box Office Telemetry */}
        {activeTab === 'boxoffice' && (
          <div className="dossier-body-tab">
            {hasBoxOffice ? (
              <div className="boxoffice-dossier-layout">
                {/* Top Metrics Cards */}
                <div className="boxoffice-metrics-strip font-mono text-xs">
                  <div className="metric-box glass-panel">
                    <span className="text-muted">OPENING DAY NET</span>
                    <span className="metric-amount text-primary">₹{movie.boxOffice.openingDayIndiaNetCr} Cr</span>
                  </div>
                  <div className="metric-box glass-panel">
                    <span className="text-muted">WEEKEND 1 NET</span>
                    <span className="metric-amount text-primary">₹{movie.boxOffice.openingWeekendIndiaNetCr} Cr</span>
                  </div>
                  <div className="metric-box glass-panel">
                    <span className="text-muted">INDIA NET TOTAL</span>
                    <span className="metric-amount text-accent font-bold">₹{movie.boxOffice.totalIndiaNetCr} Cr</span>
                  </div>
                  <div className="metric-box glass-panel">
                    <span className="text-muted">OVERSEAS GROSS</span>
                    <span className="metric-amount text-cyan-400">₹{movie.boxOffice.overseasGrossCr} Cr</span>
                  </div>
                  <div className="metric-box glass-panel">
                    <span className="text-muted">WORLDWIDE GROSS</span>
                    <span className="metric-amount text-status-positive font-bold">
                      ₹{movie.boxOffice.worldwideGrossCr} Cr
                    </span>
                  </div>
                </div>

                {/* Day-Wise Collection Table */}
                {hasDayWise && (
                  <div className="daywise-block glass-panel mt-4">
                    <div className="daywise-header font-mono text-xs">
                      <span className="font-bold text-accent">DAY-WISE THEATRICAL BREAKDOWN</span>
                      <span className="text-muted">{movie.boxOffice.dayWise.length} Tracked Theatrical Days</span>
                    </div>

                    <div className="daywise-table-scroll">
                      <table className="daywise-table font-mono text-xs">
                        <thead>
                          <tr>
                            <th>Day #</th>
                            <th>Date</th>
                            <th className="text-right">Net Collection</th>
                            <th className="text-right">Gross Collection</th>
                            <th className="text-right">Occupancy %</th>
                            <th className="text-right">Monitored Screens</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movie.boxOffice.dayWise.map((d) => (
                            <tr key={d.day}>
                              <td className="font-bold text-accent">Day {d.day}</td>
                              <td>{d.date}</td>
                              <td className="text-right font-bold text-primary">₹{d.collectionNetCr.toFixed(2)} Cr</td>
                              <td className="text-right text-muted">₹{d.collectionGrossCr.toFixed(2)} Cr</td>
                              <td className="text-right text-status-positive">{d.occupancyPct}%</td>
                              <td className="text-right">{d.screenCount.toLocaleString()}</td>
                              <td className="text-xs text-secondary">{d.notableOccurrences || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Territory Distribution */}
                {movie.boxOffice.territories.length > 0 && (
                  <div className="territories-block glass-panel mt-4">
                    <h4 className="font-display text-sm text-accent mb-3">Territory-Wise Circuit Distribution</h4>
                    <div className="territory-bars-list font-mono text-xs">
                      {movie.boxOffice.territories.map((terr) => (
                        <div key={terr.territory} className="territory-bar-item">
                          <div className="territory-info-row">
                            <span className="text-primary">{terr.territory}</span>
                            <span className="text-muted">₹{terr.amountCr.toFixed(1)} Cr ({terr.sharePct}%)</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${Math.min(terr.sharePct * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Attribution Footer */}
                <div className="boxoffice-audit-footer font-mono text-xs text-muted glass-panel mt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-status-positive" />
                    <span>Last Audited: {movie.boxOffice.lastAuditedTimestamp}</span>
                  </div>
                  <div>Attributed Sources: {movie.boxOffice.sourcesAttributed.join(' • ')}</div>
                </div>
              </div>
            ) : (
              <div className="dossier-empty-state font-mono text-xs text-muted glass-panel p-8 text-center">
                Box-office collections for {movie.title} are currently awaiting commercial theatrical release.
                Pre-release distribution estimates are modeled at ₹{movie.boxOffice.budgetCr} Cr budget.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Trade News */}
        {activeTab === 'news' && (
          <div className="dossier-body-tab">
            {movieNews.length === 0 ? (
              <div className="dossier-empty-state font-mono text-xs text-muted glass-panel p-8 text-center">
                No dedicated trade articles currently indexed for {movie.title}.
              </div>
            ) : (
              <div className="news-feed-grid">
                {movieNews.map((n) => (
                  <div
                    key={n.id}
                    className="news-card glass-panel interactive-card"
                    onClick={() => {
                      onSelectNews(n);
                      onClose();
                    }}
                  >
                    <img src={n.imageUrl} alt="" className="news-card-img" />
                    <div className="news-card-body font-mono text-xs">
                      <span className="text-accent">{n.publisher}</span>
                      <h4 className="font-display font-semibold text-primary mt-1 line-clamp-2">{n.title}</h4>
                      <p className="text-muted line-clamp-2 mt-1">{n.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Discussions */}
        {activeTab === 'discussions' && (
          <div className="dossier-body-tab">
            {movieThreads.length === 0 ? (
              <div className="dossier-empty-state font-mono text-xs text-muted glass-panel p-8 text-center">
                No active discourse threads found specifically for {movie.title}. Start one in the Community Terminal.
              </div>
            ) : (
              <div className="threads-stack">
                {movieThreads.map((t) => (
                  <div key={t.id} className="thread-card glass-panel">
                    <div className="author-meta font-mono text-xs">
                      <span className="font-semibold text-primary">{t.author.name}</span>
                      <span className="text-muted ml-2">{t.timestamp}</span>
                    </div>
                    <h4 className="font-display text-md text-primary mt-2">{t.title}</h4>
                    <p className="font-body text-xs text-secondary mt-1">{t.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trailer Modal Player Embed */}
        {showTrailer && (
          <div className="trailer-modal-backdrop" onClick={() => setShowTrailer(false)}>
            <div className="trailer-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="trailer-modal-header font-mono text-xs">
                <span>{movie.title} // Theatrical Teaser</span>
                <button onClick={() => setShowTrailer(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="trailer-video-responsive">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1`}
                  title={`${movie.title} Teaser`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
