import React from 'react';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { Movie } from '../types/cinema';
import { useCinemaTelemetry, type EnhancedMovie } from '../context/TelemetryContext';

interface UpcomingReleaseCalendarProps {
  movies: (Movie | EnhancedMovie)[];
  onSelectMovie: (movie: Movie) => void;
}

export const UpcomingReleaseCalendar: React.FC<UpcomingReleaseCalendarProps> = ({
  onSelectMovie,
}) => {
  const { upcomingMovies, formattedISTDateTime } = useCinemaTelemetry();

  // Sort chronologically
  const sortedUpcoming = [...upcomingMovies].sort(
    (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  );

  return (
    <section className="release-calendar-section" aria-label="Indian Cinema Theatrical Release Calendar">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">CHRONOLOGICAL RADAR // POST-IST HORIZON</span>
          <h2 className="section-title font-display">Theatrical Release Horizon & Formats</h2>
        </div>
        <div className="telemetry-badge font-mono text-xs">
          <Calendar size={14} className="text-accent" />
          <span>Verified Scheduled Releases (Post {formattedISTDateTime.split(',')[0]})</span>
        </div>
      </div>

      <div className="calendar-timeline-container glass-panel">
        <div className="calendar-cards-grid">
          {sortedUpcoming.map((movie) => {
            const isConfirmed = movie.releaseStatus === 'Confirmed' || movie.releaseStatus === 'Screening Now';
            const classification = movie.releaseClassification;

            return (
              <div
                key={movie.id}
                className="calendar-movie-card glass-panel interactive-card"
                onClick={() => onSelectMovie(movie)}
              >
                {/* Date Header Badge */}
                <div className="calendar-date-header font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="release-calendar-date text-accent font-bold">
                      {movie.releaseDate}
                    </span>
                    {classification && (
                      <span className="countdown-pill font-mono text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                        <Clock size={11} className="inline mr-1" />
                        {classification.badgeText}
                      </span>
                    )}
                  </div>

                  <span className={`status-tag ${isConfirmed ? 'confirmed' : 'tentative'}`}>
                    {isConfirmed ? (
                      <CheckCircle2 size={12} className="text-status-positive" />
                    ) : (
                      <AlertCircle size={12} className="text-amber-500" />
                    )}
                    <span>{movie.releaseStatus}</span>
                  </span>
                </div>

                {/* Movie Info */}
                <div className="calendar-movie-body">
                  <img src={movie.posterUrl} alt={movie.title} className="calendar-thumb" />

                  <div className="calendar-content">
                    <h3 className="calendar-title font-display line-clamp-1">{movie.title}</h3>
                    <span className={`calendar-native text-xs text-muted ${movie.scriptClass}`}>
                      {movie.nativeTitle}
                    </span>

                    <div className="calendar-meta font-mono text-xs text-muted mt-1">
                      <span className="uppercase text-secondary">{movie.industry}</span>
                      <span>•</span>
                      <span>Dir: {movie.director}</span>
                    </div>

                    {/* Exhibition Formats Pills */}
                    <div className="calendar-formats-row font-mono text-xs">
                      {movie.formats.map((fmt) => (
                        <span key={fmt} className="format-pill">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="calendar-footer font-mono text-xs text-muted">
                  <span>Censor: {movie.censorRating}</span>
                  <span className="text-accent hover:underline">Explore Prospectus →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
