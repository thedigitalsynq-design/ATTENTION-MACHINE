import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import './styles/design-tokens.css';
import './App.css';

import type { IndustryCode, Movie, NewsArticle } from './types/cinema';
import {
  NEWS_EDITORIAL_DATABASE,
  LIVE_PULSE_ITEMS,
  DISCUSSION_THREADS,
} from './data/cinemaData';

import { TelemetryProvider, useCinemaTelemetry } from './context/TelemetryContext';
import { Navbar } from './components/Navbar';
import { CineSouthHome } from './components/CineSouthHome';
import { LivePulseBar } from './components/LivePulseBar';
import { HeroEditorial } from './components/HeroEditorial';
import { BoxOfficeTerminal } from './components/BoxOfficeTerminal';
import { TrendingMoviesGrid } from './components/TrendingMoviesGrid';
import { RollingWindowControls } from './components/RollingWindowControls';
import { RegionalIndustryHub } from './components/RegionalIndustryHub';
import { UpcomingReleaseCalendar } from './components/UpcomingReleaseCalendar';
import { NewsEditorialFeed } from './components/NewsEditorialFeed';
import { CommunityForum } from './components/CommunityForum';
import { MovieDossierModal } from './components/MovieDossierModal';
import { NewsReaderModal } from './components/NewsReaderModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PipelineInspectorModal } from './components/PipelineInspectorModal';
import { Footer } from './components/Footer';

// Dedicated Routed Pages
import { SourcesPage } from './pages/SourcesPage';
import { CorrectionsPage } from './pages/CorrectionsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { RatingsPage } from './pages/RatingsPage';
import { TrailersPage } from './pages/TrailersPage';
import { OttReleasesPage } from './pages/OttReleasesPage';

// Flagship CineSouth Home Page
const HomePage: React.FC<{
  selectedIndustry: IndustryCode;
  setSelectedIndustry: (ind: IndustryCode) => void;
  onSelectMovie: (m: Movie) => void;
  onSelectMovieById: (id: string) => void;
  onSelectNews: (n: NewsArticle) => void;
  onNavigateTab: (tab: string) => void;
  onOpenPipelineInspector: () => void;
}> = ({
  selectedIndustry,
  setSelectedIndustry,
  onSelectMovie,
  onSelectMovieById,
  onSelectNews,
  onNavigateTab,
  onOpenPipelineInspector,
}) => {
  const { movies } = useCinemaTelemetry();

  return (
    <>
      {/* CineSouth Flagship Hero, Releases, Box Office, Articles, Discussions & Reviews */}
      <CineSouthHome
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
        onSelectMovie={onSelectMovie}
        onSelectMovieById={onSelectMovieById}
        onSelectNews={onSelectNews}
        onNavigateTab={onNavigateTab}
      />

      <div id="pulse" className="pt-8">
        <LivePulseBar
          items={LIVE_PULSE_ITEMS}
          movies={movies}
          onSelectMovieById={onSelectMovieById}
        />
      </div>

      <div id="movies" className="pt-4">
        <RollingWindowControls onOpenPipelineInspector={onOpenPipelineInspector} />
        <TrendingMoviesGrid
          movies={movies}
          onSelectMovie={onSelectMovie}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={setSelectedIndustry}
        />
      </div>

      <div id="boxoffice">
        <BoxOfficeTerminal
          movies={movies}
          onSelectMovie={onSelectMovie}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={setSelectedIndustry}
        />
      </div>

      <div id="upcoming">
        <UpcomingReleaseCalendar movies={movies} onSelectMovie={onSelectMovie} />
      </div>

      <div id="editorial">
        <HeroEditorial
          news={NEWS_EDITORIAL_DATABASE}
          movies={movies}
          onSelectMovieById={onSelectMovieById}
          onSelectNews={onSelectNews}
        />
      </div>

      <div id="community">
        <CommunityForum threads={DISCUSSION_THREADS} onSelectMovieById={onSelectMovieById} />
      </div>
    </>
  );
};

// Route: /movies or /recently-released (Strict Rolling 30-Day Window Focus)
const MoviesCatalogPage: React.FC<{
  selectedIndustry: IndustryCode;
  setSelectedIndustry: (ind: IndustryCode) => void;
  onSelectMovie: (m: Movie) => void;
  onOpenPipelineInspector: () => void;
}> = ({ selectedIndustry, setSelectedIndustry, onSelectMovie, onOpenPipelineInspector }) => {
  const { movies } = useCinemaTelemetry();
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          South Indian Movies Catalog
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Tamil, Telugu, Malayalam, and Kannada verified theatrical releases.
        </p>
      </div>
      <RollingWindowControls onOpenPipelineInspector={onOpenPipelineInspector} />
      <TrendingMoviesGrid
        movies={movies}
        onSelectMovie={onSelectMovie}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
      />
    </div>
  );
};

// Route: /discussions
const DiscussionsPage: React.FC<{
  onSelectMovieById: (id: string) => void;
}> = ({ onSelectMovieById }) => {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          CineSouth Fan Community & Debates
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Join conversations, share movie theories, vote in polls, and debate box office verdicts.
        </p>
      </div>
      <CommunityForum threads={DISCUSSION_THREADS} onSelectMovieById={onSelectMovieById} />
    </div>
  );
};

// Route: /upcoming (Future Releases from Today Onward)
const UpcomingPage: React.FC<{
  onSelectMovie: (m: Movie) => void;
}> = ({ onSelectMovie }) => {
  const { movies } = useCinemaTelemetry();
  return (
    <div className="py-8">
      <UpcomingReleaseCalendar movies={movies} onSelectMovie={onSelectMovie} />
    </div>
  );
};

// Route: /now-in-cinemas (Active Theatrical Screening Evidence)
const NowInCinemasPage: React.FC<{
  selectedIndustry: IndustryCode;
  setSelectedIndustry: (ind: IndustryCode) => void;
  onSelectMovie: (m: Movie) => void;
}> = ({ selectedIndustry, setSelectedIndustry, onSelectMovie }) => {
  const { theatricalMovies } = useCinemaTelemetry();
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-3xl font-extrabold text-white">Now in Cinemas</h1>
        <p className="text-slate-400 text-sm">Verified commercial screenings actively reporting admissions across South India.</p>
      </div>
      <TrendingMoviesGrid
        movies={theatricalMovies}
        onSelectMovie={onSelectMovie}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
      />
    </div>
  );
};

// Route: /articles or /news (Editorial Intelligence Feed)
const NewsPage: React.FC<{
  onSelectNews: (n: NewsArticle) => void;
  onSelectMovieById: (id: string) => void;
}> = ({ onSelectNews, onSelectMovieById }) => {
  const { movies } = useCinemaTelemetry();
  return (
    <div className="py-8">
      <NewsEditorialFeed
        news={NEWS_EDITORIAL_DATABASE}
        movies={movies}
        onSelectNews={onSelectNews}
        onSelectMovieById={onSelectMovieById}
      />
    </div>
  );
};

// Route: /box-office (Sourced Box Office Intelligence)
const BoxOfficePage: React.FC<{
  selectedIndustry: IndustryCode;
  setSelectedIndustry: (ind: IndustryCode) => void;
  onSelectMovie: (m: Movie) => void;
}> = ({ selectedIndustry, setSelectedIndustry, onSelectMovie }) => {
  const { movies } = useCinemaTelemetry();
  return (
    <div className="py-8">
      <BoxOfficeTerminal
        movies={movies}
        onSelectMovie={onSelectMovie}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
      />
    </div>
  );
};

// Route: /language/:language (Language specific view)
const LanguagePage: React.FC<{
  onSelectMovie: (m: Movie) => void;
}> = ({ onSelectMovie }) => {
  const { language } = useParams<{ language: string }>();
  const { movies } = useCinemaTelemetry();
  const langCode = (language || 'all').toLowerCase() as IndustryCode;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-3xl font-extrabold text-white capitalize">{language} Cinema</h1>
        <p className="text-slate-400 text-sm">Audited theatrical intelligence and releases for {language} film territories.</p>
      </div>
      <TrendingMoviesGrid
        movies={movies}
        onSelectMovie={onSelectMovie}
        selectedIndustry={langCode}
        onSelectIndustry={() => {}}
      />
    </div>
  );
};

// Route: /movie/:slug (Direct URL Movie Dossier Reader)
const MovieRoutePage: React.FC<{
  onSelectMovie: (m: Movie) => void;
}> = ({ onSelectMovie }) => {
  const { slug } = useParams<{ slug: string }>();
  const { movies } = useCinemaTelemetry();

  useEffect(() => {
    if (slug) {
      const found = movies.find((m) => m.slug === slug || m.id === slug);
      if (found) {
        onSelectMovie(found);
      }
    }
  }, [slug, movies, onSelectMovie]);

  return <div className="py-12 text-center text-slate-400">Loading movie dossier...</div>;
};

const AppInner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movies } = useCinemaTelemetry();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCode>('all');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Sync theme with html root dataset
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K / slash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectMovieById = (movieId: string) => {
    const found = movies.find((m) => m.id === movieId);
    if (found) setSelectedMovie(found);
  };

  const handleSelectTab = (tabId: string) => {
    const routeMap: Record<string, string> = {
      intelligence: '/',
      home: '/',
      movies: '/movies',
      'recently-released': '/movies',
      upcoming: '/upcoming',
      boxoffice: '/box-office',
      editorial: '/articles',
      news: '/articles',
      articles: '/articles',
      community: '/discussions',
      discussions: '/discussions',
      sources: '/sources',
      corrections: '/corrections',
      admin: '/admin',
      ratings: '/reviews',
      reviews: '/reviews',
      trailers: '/trailers',
      ott: '/ott-releases',
    };

    const targetRoute = routeMap[tabId] || '/';
    if (targetRoute.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(tabId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      navigate(targetRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Derive currentTab from path
  const currentTab = location.pathname === '/' ? 'intelligence' : location.pathname.slice(1).split('/')[0];

  return (
    <div className="app-shell bg-slate-950 text-slate-100 min-h-screen">
      {/* Flagship CineSouth Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
        onOpenSearch={() => setSearchModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Routed Content Area */}
      <main className="main-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                onSelectMovie={(m) => setSelectedMovie(m)}
                onSelectMovieById={handleSelectMovieById}
                onSelectNews={(n) => setSelectedNews(n)}
                onNavigateTab={handleSelectTab}
                onOpenPipelineInspector={() => setPipelineModalOpen(true)}
              />
            }
          />
          <Route
            path="/movies"
            element={
              <MoviesCatalogPage
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                onSelectMovie={(m) => setSelectedMovie(m)}
                onOpenPipelineInspector={() => setPipelineModalOpen(true)}
              />
            }
          />
          <Route
            path="/recently-released"
            element={
              <MoviesCatalogPage
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                onSelectMovie={(m) => setSelectedMovie(m)}
                onOpenPipelineInspector={() => setPipelineModalOpen(true)}
              />
            }
          />
          <Route
            path="/upcoming"
            element={<UpcomingPage onSelectMovie={(m) => setSelectedMovie(m)} />}
          />
          <Route
            path="/now-in-cinemas"
            element={
              <NowInCinemasPage
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                onSelectMovie={(m) => setSelectedMovie(m)}
              />
            }
          />
          <Route
            path="/box-office"
            element={
              <BoxOfficePage
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                onSelectMovie={(m) => setSelectedMovie(m)}
              />
            }
          />
          <Route
            path="/articles"
            element={
              <NewsPage
                onSelectNews={(n) => setSelectedNews(n)}
                onSelectMovieById={handleSelectMovieById}
              />
            }
          />
          <Route
            path="/news"
            element={
              <NewsPage
                onSelectNews={(n) => setSelectedNews(n)}
                onSelectMovieById={handleSelectMovieById}
              />
            }
          />
          <Route
            path="/reviews"
            element={<RatingsPage />}
          />
          <Route
            path="/ratings"
            element={<RatingsPage />}
          />
          <Route
            path="/discussions"
            element={<DiscussionsPage onSelectMovieById={handleSelectMovieById} />}
          />
          <Route
            path="/trailers"
            element={<TrailersPage />}
          />
          <Route
            path="/ott-releases"
            element={<OttReleasesPage />}
          />
          <Route
            path="/movie/:slug"
            element={<MovieRoutePage onSelectMovie={(m) => setSelectedMovie(m)} />}
          />
          <Route
            path="/language/:language"
            element={<LanguagePage onSelectMovie={(m) => setSelectedMovie(m)} />}
          />
          <Route
            path="/sources"
            element={<SourcesPage />}
          />
          <Route
            path="/corrections"
            element={<CorrectionsPage />}
          />
          <Route
            path="/admin/*"
            element={<AdminDashboard />}
          />
          <Route
            path="*"
            element={
              <div className="py-20 text-center">
                <h1 className="text-4xl font-extrabold text-white mb-3">404 - Page Not Found</h1>
                <p className="text-slate-400 text-sm mb-6">The requested CineSouth page does not exist.</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all"
                >
                  Return to Home
                </button>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Global CineSouth Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        movies={movies}
        news={NEWS_EDITORIAL_DATABASE}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onSelectNews={(article) => setSelectedNews(article)}
      />

      {/* Flagship Movie Dossier Modal */}
      {selectedMovie && (
        <MovieDossierModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          allMovies={movies}
          onSelectMovie={(m) => setSelectedMovie(m)}
          news={NEWS_EDITORIAL_DATABASE}
          threads={DISCUSSION_THREADS}
          onSelectNews={(n) => setSelectedNews(n)}
        />
      )}

      {/* Full Article Reader Modal */}
      {selectedNews && (
        <NewsReaderModal
          article={selectedNews}
          onClose={() => setSelectedNews(null)}
          movies={movies}
          onSelectMovieById={handleSelectMovieById}
        />
      )}

      {/* 7-Stage Cinema Data Discovery & Pipeline Inspector Modal */}
      <PipelineInspectorModal
        isOpen={pipelineModalOpen}
        onClose={() => setPipelineModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TelemetryProvider>
        <AppInner />
      </TelemetryProvider>
    </BrowserRouter>
  );
};

export default App;
