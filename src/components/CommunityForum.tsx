import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, EyeOff, Eye, ShieldCheck, UserCheck, Award, Send } from 'lucide-react';
import { DiscussionThread } from '../types/cinema';

interface CommunityForumProps {
  threads: DiscussionThread[];
  onSelectMovieById: (movieId: string) => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  threads,
  onSelectMovieById,
}) => {
  const [localThreads, setLocalThreads] = useState<DiscussionThread[]>(threads);
  const [revealedSpoilers, setRevealedSpoilers] = useState<{ [id: string]: boolean }>({});
  const [activeReplyThreadId, setActiveReplyThreadId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpvote = (threadId: string) => {
    setLocalThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  const handleAddComment = (threadId: string) => {
    if (!newCommentText.trim()) return;

    setLocalThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: 'You (Audited Trade Member)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
            badge: 'Cinephile Fellow',
            text: newCommentText,
            timestamp: 'Just now',
            upvotes: 0,
          };
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            comments: [...t.comments, newComment],
          };
        }
        return t;
      })
    );

    setNewCommentText('');
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Verified Trade Analyst':
        return <ShieldCheck size={12} className="text-accent" />;
      case 'Film Critic':
        return <Award size={12} className="text-cyan-400" />;
      case 'Box Office Mod':
        return <UserCheck size={12} className="text-status-positive" />;
      default:
        return null;
    }
  };

  return (
    <section className="community-section" aria-label="Trade Community & Critical Discourse">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <span className="section-pretitle font-mono text-accent">TRADE FORUM // PEER DISCOURSE</span>
          <h2 className="section-title font-display">Box Office Community & Critical Debates</h2>
        </div>
        <div className="telemetry-badge font-mono text-xs">
          <ShieldCheck size={14} className="text-status-positive" />
          <span>Moderated for Signal-to-Noise Integrity</span>
        </div>
      </div>

      <div className="threads-stack">
        {localThreads.map((thread) => {
          const isSpoilerRevealed = revealedSpoilers[thread.id];
          const isReplying = activeReplyThreadId === thread.id;

          return (
            <article key={thread.id} className="thread-card glass-panel">
              {/* Thread Author Row */}
              <div className="thread-author-row">
                <img src={thread.author.avatar} alt="" className="author-avatar" />
                <div className="author-meta">
                  <div className="author-name-row font-mono text-xs">
                    <span className="author-name font-semibold text-primary">{thread.author.name}</span>
                    <span className="author-handle text-muted">{thread.author.handle}</span>
                    <span className="author-badge glass-pill">
                      {getBadgeIcon(thread.author.badge)}
                      <span>{thread.author.badge}</span>
                    </span>
                  </div>
                  <span className="thread-time font-mono text-xs text-muted">{thread.timestamp}</span>
                </div>

                {thread.movieTitle && (
                  <button
                    className="thread-film-pill font-mono text-xs"
                    onClick={() => thread.movieId && onSelectMovieById(thread.movieId)}
                  >
                    <span>Re: {thread.movieTitle}</span>
                  </button>
                )}
              </div>

              {/* Thread Headline & Tags */}
              <div className="thread-body">
                <h3 className="thread-title font-display text-md">{thread.title}</h3>

                {/* Spoiler Masking */}
                {thread.isSpoiler && !isSpoilerRevealed ? (
                  <div className="spoiler-container">
                    <div className="spoiler-blurred-text font-body text-secondary">
                      {thread.content}
                    </div>
                    <div className="spoiler-overlay-guard">
                      <EyeOff size={16} className="text-accent" />
                      <span className="font-mono text-xs">Film Spoilers Masked</span>
                      <button
                        className="reveal-spoiler-btn font-mono text-xs"
                        onClick={() => toggleSpoiler(thread.id)}
                      >
                        <Eye size={13} />
                        <span>Reveal Content</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="thread-text font-body text-secondary">{thread.content}</p>
                )}

                {/* Tags Row */}
                <div className="thread-tags-row font-mono text-xs">
                  {thread.tags.map((tag) => (
                    <span key={tag} className="thread-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Controls: Upvotes & Reply toggle */}
              <div className="thread-action-footer font-mono text-xs">
                <button
                  className="thread-action-btn upvote"
                  onClick={() => handleUpvote(thread.id)}
                  title="Upvote analysis"
                >
                  <ThumbsUp size={14} />
                  <span>{thread.upvotes}</span>
                </button>

                <button
                  className={`thread-action-btn reply ${isReplying ? 'active' : ''}`}
                  onClick={() => setActiveReplyThreadId(isReplying ? null : thread.id)}
                >
                  <MessageSquare size={14} />
                  <span>{thread.repliesCount} Responses</span>
                </button>
              </div>

              {/* Expanded Comments & Input Drawer */}
              {isReplying && (
                <div className="thread-comments-drawer">
                  <div className="comments-list">
                    {thread.comments.length === 0 ? (
                      <div className="no-comments-hint font-mono text-xs text-muted">
                        No responses yet. Initiate the peer review below.
                      </div>
                    ) : (
                      thread.comments.map((comment) => (
                        <div key={comment.id} className="comment-bubble glass-panel">
                          <div className="comment-header font-mono text-xs">
                            <span className="font-semibold text-primary">{comment.author}</span>
                            <span className="text-muted">{comment.timestamp}</span>
                          </div>
                          <p className="comment-text font-body text-xs text-secondary mt-1">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Response Input */}
                  <div className="comment-input-row">
                    <input
                      type="text"
                      className="comment-text-input font-body text-xs"
                      placeholder="Contribute verified trade perspective or observation..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(thread.id);
                      }}
                    />
                    <button
                      className="send-comment-btn"
                      onClick={() => handleAddComment(thread.id)}
                      aria-label="Submit comment"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
