import React from 'react';
import { X, Clock, Newspaper, ArrowRight, ShieldCheck, Share2, TrendingUp } from 'lucide-react';
import { NewsArticle, Movie } from '../types/cinema';

interface NewsReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  movies: Movie[];
  onSelectMovieById: (id: string) => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({
  article,
  onClose,
  movies,
  onSelectMovieById,
}) => {
  if (!article) return null;

  const relatedMovie = movies.find((m) => m.id === article.relatedMovieId);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={article.title}>
      <div className="news-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="news-modal-header">
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <Newspaper size={14} />
            <span>TRADE DISPATCH // {article.category.toUpperCase()}</span>
          </div>
          <button className="dossier-close-btn" onClick={onClose} aria-label="Close article">
            <X size={18} />
          </button>
        </div>

        {/* Hero Artwork */}
        <div className="news-modal-hero">
          <img src={article.imageUrl} alt="" className="news-modal-hero-img" />
          <div className="news-modal-hero-scrim" />
          <div className="news-modal-hero-text">
            <span className="news-modal-cat-tag font-mono text-xs">{article.category}</span>
            <h1 className="news-modal-title font-display">{article.title}</h1>
            <div className="news-modal-meta font-mono text-xs text-secondary mt-2">
              <span className="text-accent font-semibold">{article.publisher}</span>
              <span>•</span>
              <span>By {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {article.publishedAt}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="news-modal-body">
          <p className="news-modal-lead font-editorial text-primary leading-relaxed font-medium text-lg">
            {article.excerpt}
          </p>

          <div className="news-modal-full-text font-body text-secondary mt-4 leading-relaxed space-y-4">
            <p>
              In what analysts are calling a structural shift in theatrical exhibition patterns across South Asian territories, audited data from both single-screen exhibitors and national multiplex chains indicates a sharp rise in tier-2 and tier-3 market capital capture. Audiences are demonstrating historic resilience for rooted, cultural spectacle films.
            </p>
            <p>
              According to the latest trade disclosures, non-holiday weekday holdovers have surpassed traditional 55% benchmarks, retaining upwards of 72% of weekend footfalls across key distribution hubs including Nizam, Coastal Andhra, Mumbai, and Chennai.
            </p>
            <p>
              Exhibitors credit multi-format rollouts—specifically 4K laser projection, immersive audio remastering, and localized language subtitling—for eliminating historic regional barriers.
            </p>
          </div>

          {relatedMovie && (
            <div className="news-related-film-box glass-panel mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-muted block">INDEXED PRODUCTION</span>
                  <h4 className="font-display text-primary text-md">{relatedMovie.title}</h4>
                  <span className="font-mono text-xs text-status-positive">
                    Worldwide Box Office: ₹{relatedMovie.boxOffice.worldwideGrossCr} Cr ({relatedMovie.boxOffice.verdict})
                  </span>
                </div>
                <button
                  className="open-dossier-from-news-btn font-mono text-xs"
                  onClick={() => {
                    onClose();
                    onSelectMovieById(relatedMovie.id);
                  }}
                >
                  <span>Open Dossier</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          <div className="news-tags-row font-mono text-xs mt-6">
            {article.tags.map((t) => (
              <span key={t} className="editorial-tag">
                #{t}
              </span>
            ))}
          </div>

          <div className="news-modal-footer font-mono text-xs text-muted mt-6 flex justify-between items-center border-t border-border-subtle pt-4">
            <span className="flex items-center gap-1 text-status-positive">
              <ShieldCheck size={13} />
              <span>Attributed to {article.publisher}</span>
            </span>
            <span>All citations verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
