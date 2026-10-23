import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Film, TrendingUp, Newspaper, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Movie, NewsArticle } from '../types/cinema';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  news: NewsArticle[];
  onSelectMovie: (movie: Movie) => void;
  onSelectNews: (news: NewsArticle) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  movies,
  news,
  onSelectMovie,
  onSelectNews,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard shortcut escape & arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter movies and news
  const trimmed = query.trim().toLowerCase();

  const filteredMovies = trimmed
    ? movies.filter(
        (m) =>
          m.title.toLowerCase().includes(trimmed) ||
          m.nativeTitle.toLowerCase().includes(trimmed) ||
          m.director.toLowerCase().includes(trimmed) ||
          m.language.toLowerCase().includes(trimmed) ||
          m.tags.some((t) => t.toLowerCase().includes(trimmed))
      )
    : movies.slice(0, 4);

  const filteredNews = trimmed
    ? news.filter(
        (n) =>
          n.title.toLowerCase().includes(trimmed) ||
          n.category.toLowerCase().includes(trimmed) ||
          n.tags.some((t) => t.toLowerCase().includes(trimmed))
      )
    : news.slice(0, 3);

  const totalResults = filteredMovies.length + filteredNews.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalResults || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalResults) % (totalResults || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredMovies.length) {
        onSelectMovie(filteredMovies[selectedIndex]);
        onClose();
      } else {
        const newsIndex = selectedIndex - filteredMovies.length;
        if (filteredNews[newsIndex]) {
          onSelectNews(filteredNews[newsIndex]);
          onClose();
        }
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Global Search">
      <div className="search-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon text-accent" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input font-body"
            placeholder="Search films, actors, directors, box office milestones, trade tags..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery('')} aria-label="Clear query">
              <X size={16} />
            </button>
          )}
          <button className="search-modal-close" onClick={onClose} aria-label="Close search">
            <kbd className="font-mono">ESC</kbd>
          </button>
        </div>

        {/* Search Results Container */}
        <div className="search-modal-results">
          {totalResults === 0 ? (
            <div className="search-empty-state">
              <p className="font-editorial text-secondary">No cinema records found for "{query}"</p>
              <span className="font-mono text-muted text-xs">
                Try searching for "Pushpa", "Tollywood", "Kalki", "Stree", or "Sukumar"
              </span>
            </div>
          ) : (
            <>
              {/* Movies Section */}
              {filteredMovies.length > 0 && (
                <div className="search-result-group">
                  <div className="search-group-header font-mono">
                    <Film size={14} />
                    <span>FILMS & TRACKED RELEASES ({filteredMovies.length})</span>
                  </div>

                  {filteredMovies.map((movie, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={movie.id}
                        className={`search-result-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onSelectMovie(movie);
                          onClose();
                        }}
                      >
                        <img src={movie.posterUrl} alt={movie.title} className="search-item-thumb" />
                        <div className="search-item-info">
                          <div className="search-item-title-row">
                            <span className="search-item-title">{movie.title}</span>
                            <span className="search-item-native text-muted">{movie.nativeTitle}</span>
                            <span className="search-tag-lang font-mono">{movie.language}</span>
                          </div>
                          <div className="search-item-meta font-mono text-xs text-muted">
                            <span>Dir: {movie.director}</span>
                            <span>•</span>
                            <span className="text-status-positive">
                              ₹{movie.boxOffice.worldwideGrossCr > 0 ? `${movie.boxOffice.worldwideGrossCr} Cr WW` : 'Upcoming'}
                            </span>
                            <span>•</span>
                            <span>★ {movie.audienceScore}/10</span>
                          </div>
                        </div>
                        <CornerDownLeft size={16} className="search-item-arrow" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* News & Trade Stories Section */}
              {filteredNews.length > 0 && (
                <div className="search-result-group">
                  <div className="search-group-header font-mono">
                    <Newspaper size={14} />
                    <span>TRADE EDITORIAL & ANALYSIS ({filteredNews.length})</span>
                  </div>

                  {filteredNews.map((article, idx) => {
                    const actualIdx = filteredMovies.length + idx;
                    const isSelected = selectedIndex === actualIdx;
                    return (
                      <div
                        key={article.id}
                        className={`search-result-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onSelectNews(article);
                          onClose();
                        }}
                      >
                        <div className="search-item-news-badge font-mono text-xs">
                          {article.category.slice(0, 12)}
                        </div>
                        <div className="search-item-info">
                          <span className="search-item-title line-clamp-1">{article.title}</span>
                          <div className="search-item-meta font-mono text-xs text-muted">
                            <span>{article.publisher}</span>
                            <span>•</span>
                            <span>{article.publishedAt}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="search-item-arrow" />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Shortcut Instructions */}
        <div className="search-modal-footer font-mono">
          <div className="search-footer-hint">
            <kbd>↑</kbd> <kbd>↓</kbd> <span>Navigate</span>
          </div>
          <div className="search-footer-hint">
            <kbd>↵</kbd> <span>Open Dossier</span>
          </div>
          <div className="search-footer-hint">
            <kbd>ESC</kbd> <span>Dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
