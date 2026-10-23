import React, { useState } from 'react';
import { Compass, Film, TrendingUp, Monitor, Users, Sparkles, ArrowRight } from 'lucide-react';
import { IndustryMetadata, IndustryCode, Movie } from '../types/cinema';
import { INDUSTRIES_METADATA } from '../data/cinemaData';

interface RegionalIndustryHubProps {
  selectedIndustry: IndustryCode;
  onSelectIndustry: (ind: IndustryCode) => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const RegionalIndustryHub: React.FC<RegionalIndustryHubProps> = ({
  selectedIndustry,
  onSelectIndustry,
  movies,
  onSelectMovie,
}) => {
  const [activeTab, setActiveTab] = useState<IndustryCode>(
    selectedIndustry === 'all' ? 'telugu' : selectedIndustry
  );

  const currentMeta = INDUSTRIES_METADATA.find((i) => i.code === activeTab) || INDUSTRIES_METADATA[1];
  const industryMovies = movies.filter((m) => m.industry === activeTab);

  return (
    <section className="regional-hub-section" aria-label="Regional Cinema Discovery Hub">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">FIRST-CLASS DISCOVERY</span>
          <h2 className="section-title font-display">Regional Cinema Intelligence & Auteur Hubs</h2>
        </div>
        <div className="telemetry-badge font-mono text-xs">
          <Compass size={14} className="text-accent" />
          <span>7 Distinct Film Ecosystems Tracked</span>
        </div>
      </div>

      <div className="hub-container glass-panel">
        {/* Industry Navigation Tabs */}
        <div className="hub-nav-tabs" role="tablist">
          {INDUSTRIES_METADATA.filter((i) => i.code !== 'all').map((meta) => {
            const isActive = activeTab === meta.code;
            return (
              <button
                key={meta.code}
                role="tab"
                aria-selected={isActive}
                className={`hub-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(meta.code);
                  onSelectIndustry(meta.code);
                }}
              >
                <span className="hub-tab-name font-display">{meta.name.split(' ')[0]}</span>
                <span className={`hub-tab-native ${meta.scriptClass}`}>{meta.nativeName}</span>
                {isActive && <span className="hub-tab-bar" />}
              </button>
            );
          })}
        </div>

        {/* Industry Intelligence Showcase Body */}
        <div className="hub-body-grid">
          {/* Left Metadata & Economic Profile */}
          <div className="hub-meta-card">
            <div className="hub-native-hero-header">
              <span className={`hub-native-large ${currentMeta.scriptClass}`}>
                {currentMeta.nativeName}
              </span>
              <h3 className="hub-english-title font-display">{currentMeta.name}</h3>
            </div>

            <p className="hub-description font-body text-secondary">
              {currentMeta.description}
            </p>

            <div className="hub-stats-grid font-mono text-xs">
              <div className="hub-stat-item">
                <span className="hub-stat-label text-muted">Primary Production Hub</span>
                <span className="hub-stat-val text-primary">{currentMeta.filmCity}</span>
              </div>

              <div className="hub-stat-item">
                <span className="hub-stat-label text-muted">National Box-Office Share</span>
                <span className="hub-stat-val text-accent font-bold">{currentMeta.boxOfficeShare2025}</span>
              </div>

              <div className="hub-stat-item">
                <span className="hub-stat-label text-muted">Dedicated Tracked Screens</span>
                <span className="hub-stat-val text-status-positive font-bold">
                  {currentMeta.totalTrackedScreens.toLocaleString()} Screens
                </span>
              </div>
            </div>

            <div className="hub-directors-block font-mono text-xs">
              <span className="text-muted block mb-2 font-semibold">MARQUEE AUTEURS & DIRECTORS</span>
              <div className="directors-tag-wrap">
                {currentMeta.marqueeDirectors.map((dir) => (
                  <span key={dir} className="director-tag glass-pill">
                    {dir}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Featured Films from this Regional Industry */}
          <div className="hub-films-showcase">
            <div className="showcase-header font-mono text-xs">
              <span className="text-accent font-bold uppercase">FLAGSHIP RELEASES IN {currentMeta.name.split(' ')[0]}</span>
              <span className="text-muted">{industryMovies.length} Tracked Titles</span>
            </div>

            <div className="hub-films-list">
              {industryMovies.length === 0 ? (
                <div className="hub-empty-state font-mono text-xs text-muted">
                  No active theatrical releases currently logged for this specific circuit.
                </div>
              ) : (
                industryMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="hub-film-row interactive-card glass-panel"
                    onClick={() => onSelectMovie(movie)}
                  >
                    <img src={movie.posterUrl} alt={movie.title} className="hub-film-thumb" />
                    <div className="hub-film-details">
                      <div className="hub-film-title font-display">{movie.title}</div>
                      <div className={`hub-film-native text-xs text-muted ${movie.scriptClass}`}>
                        {movie.nativeTitle} • {movie.genres.join(', ')}
                      </div>
                      <div className="hub-film-meta font-mono text-xs">
                        <span>Dir: {movie.director}</span>
                        <span>•</span>
                        <span className="text-accent font-bold">
                          {movie.boxOffice.worldwideGrossCr > 0
                            ? `₹${movie.boxOffice.worldwideGrossCr} Cr WW`
                            : movie.releaseStatus}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="hub-film-arrow text-accent" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
