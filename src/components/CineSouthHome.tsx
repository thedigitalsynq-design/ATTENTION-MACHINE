import React, { useState, useMemo } from 'react';
import {
  Play,
  Star,
  TrendingUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Clapperboard,
  Sparkles,
  Award
} from 'lucide-react';
import type { Movie, NewsArticle, IndustryCode } from '../types/cinema';
import { useCinemaTelemetry } from '../context/TelemetryContext';

interface CineSouthHomeProps {
  selectedIndustry: IndustryCode;
  onSelectIndustry: (ind: IndustryCode) => void;
  onSelectMovie: (m: Movie) => void;
  onSelectMovieById: (id: string) => void;
  onSelectNews: (n: NewsArticle) => void;
  onNavigateTab: (tab: string) => void;
}

export const CineSouthHome: React.FC<CineSouthHomeProps> = ({
  selectedIndustry,
  onSelectIndustry,
  onSelectMovie,
  onSelectMovieById,
  onSelectNews,
  onNavigateTab,
}) => {
  const { movies } = useCinemaTelemetry();
  const [heroIndex, setHeroIndex] = useState(0);
  const [boxOfficeTab, setBoxOfficeTab] = useState<'worldwide' | 'india' | 'tamilnadu'>('worldwide');
  const [hideSpoilers, setHideSpoilers] = useState(true);
  const [releasesLanguage, setReleasesLanguage] = useState<'all' | 'tamil' | 'telugu' | 'malayalam' | 'kannada'>('all');

  // Featured Spotlight Hero List
  const heroList = useMemo(() => {
    const featuredIds = ['devara-part-1', 'pushpa-2-the-rule', 'kalki-2898-ad', 'kantara-chapter-1', 'amaran'];
    const found = featuredIds.map(id => movies.find(m => m.id === id)).filter(Boolean) as Movie[];
    return found.length > 0 ? found : movies.slice(0, 5);
  }, [movies]);

  const currentHero = heroList[heroIndex] || heroList[0];

  // Hero Right Breaking News Stack
  const heroNewsStack = [
    {
      id: 'stack-1',
      title: 'Devara Part 1: Trailer Breaks Records With 50M+ Views In 24 Hours',
      timeAgo: '2 hours ago',
      category: 'Movie Updates',
      movieId: 'devara-part-1',
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'stack-2',
      title: 'Thalapathy 69: Official Title and First Look to Be Revealed Soon',
      timeAgo: '5 hours ago',
      category: 'Tamil',
      movieId: 'thalapathy-69',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'stack-3',
      title: 'Pushpa 2: The Rule - Box Office Crosses ₹1000 Crore Worldwide',
      timeAgo: '7 hours ago',
      category: 'Box Office',
      movieId: 'pushpa-2-the-rule',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'stack-4',
      title: 'Kalki 2898 AD Gets Oscar Entry (Officially Confirmed)',
      timeAgo: '10 hours ago',
      category: 'Trending',
      movieId: 'kalki-2898-ad',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
    },
  ];

  // Latest Releases (5 flagship movies from screenshot)
  const latestReleases = useMemo(() => {
    const flagshipIds = ['amaran', 'lucky-baskhar', 'manjummel-boys', 'kantara-chapter-1', 'vettaiyan'];
    let list = flagshipIds.map(id => movies.find(m => m.id === id)).filter(Boolean) as Movie[];
    
    if (releasesLanguage !== 'all') {
      list = list.filter(m => m.industry === releasesLanguage);
      if (list.length === 0) {
        list = movies.filter(m => m.industry === releasesLanguage).slice(0, 5);
      }
    }
    return list;
  }, [movies, releasesLanguage]);

  // Box Office Top Ranked List
  const boxOfficeLeaderboard = useMemo(() => {
    return [
      {
        rank: 1,
        id: 'pushpa-2-the-rule',
        title: 'Pushpa 2: The Rule',
        amount: '₹ 1,050 Cr',
        label: 'Worldwide Gross',
        verdict: 'Hit',
        verdictClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=200&auto=format&fit=crop',
      },
      {
        rank: 2,
        id: 'kalki-2898-ad',
        title: 'Kalki 2898 AD',
        amount: '₹ 950 Cr',
        label: 'Worldwide Gross',
        verdict: 'Hit',
        verdictClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop',
      },
      {
        rank: 3,
        id: 'devara-part-1',
        title: 'Devara Part 1',
        amount: '₹ 650 Cr',
        label: 'Worldwide Gross',
        verdict: 'Hit',
        verdictClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop',
      },
      {
        rank: 4,
        id: 'leo-rerun',
        title: 'Leo (Re-release)',
        amount: '₹ 520 Cr',
        label: 'Worldwide Gross',
        verdict: 'Super Hit',
        verdictClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
      },
      {
        rank: 5,
        id: 'jailer',
        title: 'Jailer',
        amount: '₹ 450 Cr',
        label: 'Worldwide Gross',
        verdict: 'Hit',
        verdictClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      },
    ];
  }, []);

  // Articles & Features (from mockup)
  const articlesList = [
    {
      id: 'art-1',
      tag: 'INTERVIEW',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'Behind the Scenes of Kalki 2898 AD – Exclusive with Nag Ashwin',
      timeAgo: '2 hours ago',
      lang: 'Telugu',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
      movieId: 'kalki-2898-ad',
    },
    {
      id: 'art-2',
      tag: 'ANALYSIS',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'Why Manjummel Boys Struck a Chord with Audiences',
      timeAgo: '4 hours ago',
      lang: 'Malayalam',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
      movieId: 'manjummel-boys',
    },
    {
      id: 'art-3',
      tag: 'FEATURE',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'The Evolution of Rajinikanth – From Mass to Metaphor',
      timeAgo: '6 hours ago',
      lang: 'Tamil',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      movieId: 'vettaiyan',
    },
    {
      id: 'art-4',
      tag: 'INDUSTRY NEWS',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: "South Indian Cinema's Global Rise: What's Next?",
      timeAgo: '8 hours ago',
      lang: 'All Languages',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
      movieId: 'pushpa-2-the-rule',
    },
  ];

  // Trending Discussions (from mockup)
  const trendingDiscussions = [
    {
      id: 'disc-1',
      title: 'Is Devara a worthy successor to RRR?',
      commentsCount: '2.4K comments',
      tag: 'Telugu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
    },
    {
      id: 'disc-2',
      title: 'Which actor has the best screen presence in South India?',
      commentsCount: '1.8K comments',
      tag: 'General',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    },
    {
      id: 'disc-3',
      title: 'Kantara 2 - What are your expectations?',
      commentsCount: '1.2K comments',
      tag: 'Kannada',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    },
    {
      id: 'disc-4',
      title: 'Will Thalapathy 69 be his last film?',
      commentsCount: '1.1K comments',
      tag: 'Tamil',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    },
    {
      id: 'disc-5',
      title: 'Best South Indian movie of 2024 so far?',
      commentsCount: '980 comments',
      tag: 'Poll',
      avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=120&auto=format&fit=crop',
    },
  ];

  // Reviews & Ratings (from mockup)
  const reviewsList = [
    {
      id: 'rev-1',
      movieId: 'amaran',
      movieTitle: 'Amaran',
      score: '8.5',
      badge: 'Audience',
      review: 'A heartfelt and powerful film that honors real heroes. Sivakarthikeyan is outstanding!',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500&auto=format&fit=crop',
      spoilerSnippet: 'The final Shopian anti-insurgency assault pays deeply emotional tribute to Major Mukund’s sacrifice.',
    },
    {
      id: 'rev-2',
      movieId: 'kalki-2898-ad',
      movieTitle: 'Kalki 2898 AD',
      score: '8.2',
      badge: 'Audience',
      review: 'Visuals are breathtaking, but the story could have been tighter.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
      spoilerSnippet: 'Bhairava discovering his Karna identity during the climax faceoff against Ashwatthama blew minds.',
    },
    {
      id: 'rev-3',
      movieId: 'manjummel-boys',
      movieTitle: 'Manjummel Boys',
      score: '9.0',
      badge: 'Audience',
      review: 'An emotional rollercoaster. One of the best survival dramas in Indian cinema.',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop',
      spoilerSnippet: 'When Kuttan descends into the Devil’s Kitchen cave pit to pull Subhash out, sheer goosebumps.',
    },
    {
      id: 'rev-4',
      movieId: 'kantara-chapter-1',
      movieTitle: 'Kantara Chapter 1',
      score: '8.9',
      badge: 'Audience',
      review: 'Raw, divine, and unforgettable. Rishab Shetty delivers once again.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
      spoilerSnippet: 'The pre-interval Kadamba battle and spiritual Daiva manifestation reaches ethereal heights.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* =========================================================================
          SECTION 1: HERO SPOTLIGHT + BREAKING UPDATES STACK (Exact Mockup Match)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Main Spotlight Carousel (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-10 border border-slate-800 bg-slate-950 shadow-2xl group">
          {/* Backdrop Image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentHero?.backdropUrl || currentHero?.posterUrl}
              alt={currentHero?.title}
              className="w-full h-full object-cover object-center filter brightness-[0.6] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 space-y-4 max-w-2xl">
            {/* Trending Now Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase font-mono backdrop-blur-md">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>TRENDING NOW</span>
            </div>

            {/* Stylized Title */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase drop-shadow-md">
                {currentHero?.title}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-300 tracking-widest uppercase mt-1">
                A MAN. A MISSION. A LEGACY.
              </p>
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-md bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
                {currentHero?.language}
              </span>
              {currentHero?.genres.slice(0, 2).map((g) => (
                <span key={g} className="px-3 py-1 rounded-md bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-300">
                  {g}
                </span>
              ))}
              <span className="px-3 py-1 rounded-md bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-300">
                27 Sep 2024
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectMovie(currentHero)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play size={16} fill="currentColor" />
                <span>Watch Trailer</span>
              </button>

              <button
                onClick={() => onSelectMovie(currentHero)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 backdrop-blur-md transition-all hover:border-slate-500"
              >
                <span>Read Full Update</span>
              </button>
            </div>

            {/* Carousel Navigation Indicator Dots & Arrows */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                {heroList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      heroIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHeroIndex((prev) => (prev > 0 ? prev - 1 : heroList.length - 1))}
                  className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-all"
                  aria-label="Previous Spotlight"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setHeroIndex((prev) => (prev < heroList.length - 1 ? prev + 1 : 0))}
                  className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-all"
                  aria-label="Next Spotlight"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vertical Breaking News Stack (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3">
          {heroNewsStack.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMovieById(item.movieId)}
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-snug transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-500">
                  <span>{item.timeAgo}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-medium">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LATEST RELEASES (Left) + BOX OFFICE WIDGET (Right)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Latest Releases 5-card row (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Latest Releases</h2>
              <p className="text-xs text-slate-400 mt-0.5">New movies. Fresh stories. Your next favorite watch.</p>
            </div>

            {/* Language filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
              {(['all', 'tamil', 'telugu', 'malayalam', 'kannada'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setReleasesLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                    releasesLanguage === lang
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'all' ? 'All' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* 5-Column Grid of Movie Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {latestReleases.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 p-2.5 transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-lg"
              >
                {/* Poster */}
                <div className="aspect-[2/3] rounded-xl overflow-hidden relative bg-slate-800 mb-3">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/90 text-[10px] font-bold text-slate-950 tracking-wider uppercase backdrop-blur-md">
                    Now Playing
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-1.5">
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 truncate transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {movie.language} • {movie.genres[0] || 'Drama'}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-white">{movie.audienceScore || '8.5'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({Math.round((movie.audienceVotesCount || 150000) / 1000)}K)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Box Office Leaderboard (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Box Office</h3>
            </div>
            <button
              onClick={() => onNavigateTab('boxoffice')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            {(['worldwide', 'india', 'tamilnadu'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setBoxOfficeTab(tab)}
                className={`flex-1 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  boxOfficeTab === tab
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'worldwide' ? 'Worldwide' : tab === 'india' ? 'India' : 'Tamil Nadu'}
              </button>
            ))}
          </div>

          {/* Ranked List */}
          <div className="space-y-3.5">
            {boxOfficeLeaderboard.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMovieById(item.id)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <span className="w-5 text-sm font-bold text-slate-500 font-mono text-center">
                  {item.rank}
                </span>

                <div className="w-11 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 truncate">
                    {item.title}
                  </h4>
                  <div className="text-sm font-extrabold text-amber-400 font-mono">
                    {item.amount}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.label}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.verdictClass}`}>
                  {item.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ARTICLES (Left) + TRENDING DISCUSSIONS (Right)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Articles 4-card horizontal row (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">📰</span>
                <h2 className="text-2xl font-black text-white tracking-tight">Articles</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">In-depth stories, interviews, and industry insights.</p>
            </div>
            <button
              onClick={() => onNavigateTab('editorial')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {articlesList.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectMovieById(art.movieId)}
                className="group flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 overflow-hidden cursor-pointer shadow-lg transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-800">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border backdrop-blur-md ${art.tagColor}`}>
                      {art.tag}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 line-clamp-3 leading-snug transition-colors">
                    {art.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
                    <span>{art.timeAgo}</span>
                    <span className="text-slate-400">{art.lang}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Trending Discussions (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Trending Discussions</h3>
            </div>
            <button
              onClick={() => onNavigateTab('community')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-4">
            {trendingDiscussions.map((d) => (
              <div
                key={d.id}
                onClick={() => onNavigateTab('community')}
                className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <img
                  src={d.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 line-clamp-2 leading-snug">
                    {d.title}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {d.commentsCount}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700 flex-shrink-0">
                  {d.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: REVIEWS & RATINGS (Critic vs Audience + Spoiler Toggle)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              <h2 className="text-2xl font-black text-white tracking-tight">Reviews & Ratings</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Honest opinions. Real fans. No spoilers (unless you want).
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Interactive Spoiler Control */}
            <button
              onClick={() => setHideSpoilers(!hideSpoilers)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all"
            >
              {hideSpoilers ? <EyeOff size={14} className="text-amber-400" /> : <Eye size={14} className="text-emerald-400" />}
              <span>{hideSpoilers ? 'Spoilers: Hidden' : 'Spoilers: Revealed'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('ratings')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              onClick={() => onSelectMovieById(rev.movieId)}
              className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3.5 hover:border-slate-700 transition-all cursor-pointer group shadow-lg"
            >
              {/* Thumbnail + Title */}
              <div className="flex items-center gap-3">
                <img
                  src={rev.imageUrl}
                  alt={rev.movieTitle}
                  className="w-12 h-16 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 truncate">
                    {rev.movieTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-extrabold text-white">{rev.score}</span>
                    <span className="text-[10px] text-slate-500 font-mono">/10</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {rev.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">
                "{rev.review}"
              </p>

              {/* Spoilers Section */}
              {!hideSpoilers && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  <span className="font-bold font-mono uppercase text-[9px] block text-amber-400 mb-1">Spoiler Note:</span>
                  {rev.spoilerSnippet}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "THE BEST OF SOUTH INDIAN CINEMA" BANNER & LANGUAGE PORTALS
          ========================================================================= */}
      <section className="space-y-6 pt-4">
        {/* Banner with Community CTA */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Clapperboard size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">The Best of South Indian Cinema</h2>
              <p className="text-xs text-slate-400 mt-1">Explore. Discuss. Celebrate.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('community')}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Join the Community</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 4 Language Portals (Tamil, Telugu, Malayalam, Kannada) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              lang: 'Tamil',
              code: 'tamil',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
              accent: 'from-amber-950/80',
            },
            {
              lang: 'Telugu',
              code: 'telugu',
              imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop',
              accent: 'from-blue-950/80',
            },
            {
              lang: 'Malayalam',
              code: 'malayalam',
              imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
              accent: 'from-emerald-950/80',
            },
            {
              lang: 'Kannada',
              code: 'kannada',
              imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
              accent: 'from-red-950/80',
            },
          ].map((portal) => (
            <div
              key={portal.lang}
              onClick={() => onSelectIndustry(portal.code as IndustryCode)}
              className="group aspect-[4/3] rounded-2xl overflow-hidden relative border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer shadow-lg"
            >
              <img
                src={portal.imageUrl}
                alt={portal.lang}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${portal.accent} via-slate-950/60 to-transparent`} />
              
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {portal.lang}
                </h3>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white inline-flex items-center gap-1 mt-0.5">
                  <span>Explore Movies</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
