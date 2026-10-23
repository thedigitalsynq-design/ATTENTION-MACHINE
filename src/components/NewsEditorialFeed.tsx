import React from 'react';
import { Newspaper, Clock, ExternalLink, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { NewsArticle, Movie } from '../types/cinema';

interface NewsEditorialFeedProps {
  news: NewsArticle[];
  movies: Movie[];
  onSelectNews: (article: NewsArticle) => void;
  onSelectMovieById: (movieId: string) => void;
}

export const NewsEditorialFeed: React.FC<NewsEditorialFeedProps> = ({
  news,
  movies,
  onSelectNews,
  onSelectMovieById,
}) => {
  return (
    <section className="news-editorial-section" aria-label="Cinema Trade News & Critical Editorial">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">INSTITUTIONAL PRESS</span>
          <h2 className="section-title font-display">Trade Dispatches, Reviews & Industry Analysis</h2>
        </div>
        <div className="telemetry-badge font-mono text-xs">
          <ShieldCheck size={14} className="text-status-positive" />
          <span>Curated from Top Trade Journals</span>
        </div>
      </div>

      <div className="news-feed-grid">
        {news.map((item) => {
          const relatedMovie = movies.find((m) => m.id === item.relatedMovieId);

          return (
            <article
              key={item.id}
              className="news-card glass-panel interactive-card"
              onClick={() => onSelectNews(item)}
            >
              <div className="news-card-image-wrap">
                <img src={item.imageUrl} alt={item.title} className="news-card-img" loading="lazy" />
                <span className="news-category-badge font-mono text-xs">{item.category}</span>
              </div>

              <div className="news-card-body">
                <div className="news-meta-row font-mono text-xs text-muted">
                  <span className="news-publisher text-accent font-semibold">{item.publisher}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {item.publishedAt}
                  </span>
                </div>

                <h3 className="news-headline font-display line-clamp-2">{item.title}</h3>

                <p className="news-excerpt font-body text-xs text-secondary line-clamp-2">
                  {item.excerpt}
                </p>

                {relatedMovie && (
                  <div
                    className="news-film-link font-mono text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMovieById(relatedMovie.id);
                    }}
                  >
                    <span>Referenced Title: </span>
                    <strong className="text-primary hover:underline">{relatedMovie.title}</strong>
                  </div>
                )}

                <div className="news-card-footer font-mono text-xs">
                  <span className="text-muted">By {item.author}</span>
                  <button className="read-more-btn">
                    <span>Read Article</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
