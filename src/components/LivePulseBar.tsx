import React, { useState } from 'react';
import { Radio, TrendingUp, Film, Sparkles, MessageCircle, ArrowUpRight, Flame } from 'lucide-react';
import { LivePulseItem, Movie } from '../types/cinema';

interface LivePulseBarProps {
  items: LivePulseItem[];
  movies: Movie[];
  onSelectMovieById: (movieId: string) => void;
}

export const LivePulseBar: React.FC<LivePulseBarProps> = ({
  items,
  onSelectMovieById,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'boxoffice' | 'news' | 'trailer' | 'milestone'>('all');

  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(i => i.type === activeFilter);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'boxoffice': return TrendingUp;
      case 'trailer': return Film;
      case 'milestone': return Flame;
      default: return Sparkles;
    }
  };

  return (
    <section className="live-pulse-container" aria-label="Real-time Cinema Intelligence Pulse">
      <div className="pulse-strip glass-panel">
        {/* Pulse Bar Header Badge */}
        <div className="pulse-header-badge">
          <span className="live-beacon"></span>
          <span className="pulse-title font-mono">CINEMA PULSE</span>
          <span className="pulse-frequency font-mono text-xs text-muted">2.4s TELEMETRY</span>
        </div>

        {/* Pulse Type Filter Tabs */}
        <div className="pulse-tabs">
          <button
            className={`pulse-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Stream
          </button>
          <button
            className={`pulse-tab ${activeFilter === 'boxoffice' ? 'active' : ''}`}
            onClick={() => setActiveFilter('boxoffice')}
          >
            Box Office
          </button>
          <button
            className={`pulse-tab ${activeFilter === 'milestone' ? 'active' : ''}`}
            onClick={() => setActiveFilter('milestone')}
          >
            Audited Milestones
          </button>
          <button
            className={`pulse-tab ${activeFilter === 'trailer' ? 'active' : ''}`}
            onClick={() => setActiveFilter('trailer')}
          >
            Trailers
          </button>
        </div>

        {/* Horizontal Scrolling Items Feed */}
        <div className="pulse-items-track" role="region" aria-live="polite">
          {filteredItems.map((item) => {
            const Icon = getIconForType(item.type);
            return (
              <div 
                key={item.id} 
                className="pulse-item interactive-card"
                onClick={() => {
                  if (item.movieId) onSelectMovieById(item.movieId);
                }}
              >
                <div className="pulse-item-badge-row">
                  <span className={`pulse-category-badge font-mono ${item.isBreaking ? 'breaking' : ''}`}>
                    <Icon size={12} />
                    {item.badge || item.type.toUpperCase()}
                  </span>
                  <span className="pulse-timestamp font-mono text-xs text-muted">{item.timeAgo}</span>
                </div>

                <p className="pulse-item-headline">{item.headline}</p>

                {item.delta && (
                  <div className="pulse-delta-row font-mono text-xs">
                    <span className="text-status-positive">{item.delta}</span>
                    <ArrowUpRight size={12} className="text-status-positive" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
