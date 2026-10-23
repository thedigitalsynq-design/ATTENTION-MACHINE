import React from 'react';
import { Newspaper, Clock, ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { NewsArticle, Movie } from '../types/cinema';

interface HeroEditorialProps {
  news: NewsArticle[];
  movies: Movie[];
  onSelectMovieById: (id: string) => void;
  onSelectNews: (news: NewsArticle) => void;
}

export const HeroEditorial: React.FC<HeroEditorialProps> = ({
  news,
  movies,
  onSelectMovieById,
  onSelectNews,
}) => {
  // Dynamically select lead story by priority
  const leadStory = news.find((n) => n.priority === 'lead') || news[0];
  const secondaryStories = news.filter((n) => n.id !== leadStory.id).slice(0, 3);

  // Contextual related movie
  const relatedMovie = movies.find((m) => m.id === leadStory.relatedMovieId);

  return (
    <section className="hero-editorial-section" aria-label="Flagship Editorial & Cinema Investigation">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">CINÉPULSE DISPATCH</span>
          <h2 className="section-title font-display">Flagship Trade Editorial & Lead Investigations</h2>
        </div>
        <div className="telemetry-badge font-mono text-xs">
          <ShieldCheck size={14} className="text-status-positive" />
          <span>Curated Institutional Journalism</span>
        </div>
      </div>

      <div className="editorial-bento-grid">
        {/* Dominant Lead Story Card */}
        {leadStory && (
          <article 
            className="lead-story-card glass-panel interactive-card"
            onClick={() => onSelectNews(leadStory)}
          >
            <div className="lead-story-image-wrap">
              <img
                src={leadStory.imageUrl}
                alt={leadStory.title}
                className="lead-story-img"
                loading="eager"
              />
              <div className="lead-story-overlay" />
              
              <div className="lead-category-badge font-mono">
                <Sparkles size={12} className="text-accent" />
                <span>{leadStory.category.toUpperCase()}</span>
              </div>

              {relatedMovie && (
                <div 
                  className="lead-movie-chip glass-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMovieById(relatedMovie.id);
                  }}
                  title="View Film Dossier"
                >
                  <TrendingUp size={12} className="text-status-positive" />
                  <span className="font-mono text-xs text-primary">{relatedMovie.title}</span>
                  <span className="font-mono text-xs text-status-positive">₹{relatedMovie.boxOffice.worldwideGrossCr} Cr WW</span>
                </div>
              )}
            </div>

            <div className="lead-story-content">
              <div className="lead-meta-row font-mono text-xs text-muted">
                <span className="lead-publisher text-accent">{leadStory.publisher}</span>
                <span>•</span>
                <span>By {leadStory.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {leadStory.publishedAt}
                </span>
                <span>•</span>
                <span>{leadStory.readTime}</span>
              </div>

              <h1 className="lead-story-headline font-display">
                {leadStory.title}
              </h1>

              <p className="lead-story-excerpt font-body">
                {leadStory.excerpt}
              </p>

              <div className="lead-story-footer">
                <div className="lead-tags-row">
                  {leadStory.tags.map((tag) => (
                    <span key={tag} className="editorial-tag font-mono text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                <button className="read-dispatch-btn font-mono text-xs">
                  <span>Read Full Analysis</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Supporting Secondary Stories Stack */}
        <div className="secondary-stories-stack">
          {secondaryStories.map((story) => {
            const storyMovie = movies.find((m) => m.id === story.relatedMovieId);
            return (
              <article
                key={story.id}
                className="secondary-story-card glass-panel interactive-card"
                onClick={() => onSelectNews(story)}
              >
                <div className="secondary-thumb-wrap">
                  <img src={story.imageUrl} alt={story.title} className="secondary-thumb-img" />
                  <span className="secondary-tag font-mono text-xs">{story.category}</span>
                </div>

                <div className="secondary-content">
                  <div className="secondary-meta-row font-mono text-xs text-muted">
                    <span className="text-accent">{story.publisher}</span>
                    <span>•</span>
                    <span>{story.publishedAt}</span>
                  </div>

                  <h3 className="secondary-headline font-display line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="secondary-excerpt font-body text-xs text-secondary line-clamp-2">
                    {story.excerpt}
                  </p>

                  <div className="secondary-footer font-mono text-xs">
                    {storyMovie && (
                      <span 
                        className="text-status-positive hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMovieById(storyMovie.id);
                        }}
                      >
                        Tracking: {storyMovie.title}
                      </span>
                    )}
                    <span className="text-muted ml-auto">{story.readTime}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
