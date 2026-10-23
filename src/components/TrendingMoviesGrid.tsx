import React from 'react';
import { Star, ChevronRight, Award, Clock, Film, ShieldCheck } from 'lucide-react';
import type { Movie, IndustryCode } from '../types/cinema';
import { useCinemaTelemetry, type EnhancedMovie } from '../context/TelemetryContext';
import { CinemaPoster } from './CinemaPoster';

interface TrendingMoviesGridProps {
  movies: (Movie | EnhancedMovie)[];
  onSelectMovie: (movie: Movie) => void;
  selectedIndustry: IndustryCode;
  onSelectIndustry: (ind: IndustryCode) => void;
}

export const TrendingMoviesGrid: React.FC<TrendingMoviesGridProps> = ({
  onSelectMovie,
  selectedIndustry,
  onSelectIndustry,
}) => {
  const { windowInfo, theatricalMovies, currentISTDateStr } = useCinemaTelemetry();

  const industries: { code: IndustryCode; label: string }[] = [
    { code: 'all', label: 'All Industries' },
    { code: 'tamil', label: 'Tamil' },
    { code: 'kannada', label: 'Kannada' },
    { code: 'hindi', label: 'Hindi' },
    { code: 'telugu', label: 'Telugu' },
    { code: 'malayalam', label: 'Malayalam' },
    { code: 'bengali', label: 'Bengali' },
  ];

  // Strictly filter for movies released within the rolling 30-day window:
  // [current IST date minus 29 calendar days through current IST date, inclusive]
  const windowTheatricalMovies = theatricalMovies.filter((m) => {
    return m.releaseDate >= windowInfo.startDateStr && m.releaseDate <= windowInfo.endDateStr;
  });

  // Filter by selected regional industry
  const filtered = selectedIndustry === 'all'
    ? windowTheatricalMovies
    : windowTheatricalMovies.filter((m) => m.industry === selectedIndustry);

  return (
    <section className="trending-grid-section" id="movies" aria-label="Recently Released in Theatres (Last 30 Days)">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">THEATRICAL RUN // STRICTLY LAST 30 DAYS</span>
          <h2 className="section-title font-display">Recently Released in Theatres</h2>
        </div>

        {/* Dynamic 30-Day Window Indicator */}
        <div className="telemetry-badge font-mono text-xs">
          <Clock size={13} className="text-accent" />
          <span>{windowInfo.windowLabel}</span>
        </div>
      </div>

      {/* Filter Strip: Regional Industry & Live Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="industry-filter-pills font-mono text-xs">
          {industries.map((ind) => {
            const count = ind.code === 'all'
              ? windowTheatricalMovies.length
              : windowTheatricalMovies.filter((m) => m.industry === ind.code).length;

            return (
              <button
                key={ind.code}
                className={`filter-pill-btn ${selectedIndustry === ind.code ? 'active' : ''}`}
                onClick={() => onSelectIndustry(ind.code)}
              >
                {ind.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="font-mono text-xs text-muted flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-status-positive" />
          <span>{filtered.length} Verified Theatrical Releases</span>
        </div>
      </div>

      {/* Empty State when no releases in filtered industry */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-8 text-center font-mono text-xs text-muted my-6 rounded">
          <Film size={28} className="mx-auto mb-2 text-muted opacity-50" />
          <p className="text-primary font-semibold text-sm">
            No commercial theatrical releases verified in {selectedIndustry.toUpperCase()} within the last 30 days.
          </p>
          <p className="mt-1">
            Rolling window active from <span className="text-accent">{windowInfo.formattedStartDate}</span> to{' '}
            <span className="text-accent">{windowInfo.formattedEndDate}</span>.
          </p>
          <button
            className="filter-pill-btn active mt-4"
            onClick={() => onSelectIndustry('all')}
          >
            Show All Active Releases ({windowTheatricalMovies.length})
          </button>
        </div>
      ) : (
        /* Grid of Cinema Cards */
        <div className="movies-cinema-grid">
          {filtered.map((movie) => {
            const hasBoxOffice = movie.boxOffice.worldwideGrossCr > 0;
            const enhanced = movie as EnhancedMovie;
            const dayOfRun = enhanced.releaseClassification?.dayOfRun || 1;
            const isToday = movie.releaseDate === currentISTDateStr;

            return (
              <article
                key={movie.id}
                className="movie-poster-card glass-panel interactive-card"
                onClick={() => onSelectMovie(movie)}
                tabIndex={0}
                role="button"
                aria-label={`View dossier for ${movie.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectMovie(movie);
                  }
                }}
              >
                {/* Poster Wrap with Aspect Ratio */}
                <div className="poster-aspect-wrap">
                  <CinemaPoster
                    src={movie.posterUrl}
                    alt={movie.title}
                    title={movie.title}
                    nativeTitle={movie.nativeTitle}
                    language={movie.language}
                    censorRating={movie.censorRating}
                    industry={movie.industry}
                    className="poster-img"
                  />

                  <div className="poster-gradient-scrim" />

                  {/* Top Badges */}
                  <div className="poster-badges-top font-mono text-xs">
                    <span className="censor-badge">{movie.censorRating}</span>
                    <span className="lang-badge">{movie.language}</span>
                    {movie.formats.includes('IMAX') && (
                      <span className="format-badge">IMAX</span>
                    )}
                    <span className="theatre-active-badge">
                      {isToday ? 'OPENING TODAY' : `DAY ${dayOfRun}`}
                    </span>
                  </div>

                  {/* Bottom Overlay Info on Hover */}
                  <div className="poster-hover-details font-mono text-xs">
                    <div className="flex justify-between items-center text-muted">
                      <span>{movie.runtimeMinutes} min</span>
                      <span>{movie.genres.slice(0, 2).join(' • ')}</span>
                    </div>
                    <div className="text-secondary line-clamp-2 mt-1">
                      Dir: {movie.director}
                    </div>
                  </div>
                </div>

                {/* Card Meta Body */}
                <div className="card-meta-body">
                  <div className="card-title-row">
                    <h3 className="card-main-title font-display">{movie.title}</h3>
                    <span className={`card-native-title text-muted text-xs ${movie.scriptClass}`}>
                      {movie.nativeTitle}
                    </span>
                  </div>

                  {/* Day of Theatrical Run Indicator */}
                  <div className="card-run-status font-mono text-xs mb-2">
                    <span className="text-amber-400 font-bold">
                      {isToday ? 'Day 1 (Opening Today in Theatres)' : `Day ${dayOfRun} of Theatrical Run`}
                    </span>
                  </div>

                  {/* Transparent Ratings Score Bar */}
                  <div className="card-ratings-row font-mono text-xs">
                    <div className="rating-badge audience" title="Audience Score">
                      <Star size={13} className="text-accent fill-accent" />
                      <span className="score-val">{movie.audienceScore}</span>
                      <span className="score-total">/10</span>
                    </div>

                    <div className="rating-badge critic" title="Critic Metascore">
                      <Award size={13} className="text-cyan-400" />
                      <span className="score-val">{movie.criticScore}</span>
                      <span className="score-total">/100</span>
                    </div>

                    {movie.ratingsBreakdown && movie.ratingsBreakdown.length > 0 && (
                      <span className="text-[10px] text-muted self-center ml-auto">
                        {movie.ratingsBreakdown[0].provider}: {movie.ratingsBreakdown[0].scoreDisplay}
                      </span>
                    )}
                  </div>

                  {/* Box Office Metrics Footer */}
                  <div className="card-financial-footer font-mono text-xs">
                    {hasBoxOffice ? (
                      <div className="financial-data-group">
                        <div className="financial-label text-muted">WW Gross (Net)</div>
                        <div className="financial-val text-accent font-bold">
                          ₹{movie.boxOffice.worldwideGrossCr.toFixed(1)} Cr{' '}
                          <span className="text-[11px] text-muted font-normal">
                            (₹{movie.boxOffice.totalIndiaNetCr.toFixed(1)} Cr)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="financial-data-group">
                        <div className="financial-label text-muted">Theatrical Release</div>
                        <div className="financial-val text-status-positive font-bold">
                          {movie.releaseDate}
                        </div>
                      </div>
                    )}

                    <div className="card-action-hint">
                      <span className="text-muted">Dossier</span>
                      <ChevronRight size={14} className="text-accent" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
