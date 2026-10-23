import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Film,
  TrendingUp,
  Newspaper,
  Star,
  MessageSquare,
  User,
  ChevronDown,
} from 'lucide-react';
import type { IndustryCode } from '../types/cinema';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedIndustry: IndustryCode;
  onSelectIndustry: (ind: IndustryCode) => void;
  onOpenSearch: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedIndustry,
  onSelectIndustry,
  onOpenSearch,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moviesDropdownOpen, setMoviesDropdownOpen] = useState(false);

  const mainNavLinks = [
    { id: 'intelligence', label: 'Home' },
    { id: 'movies', label: 'Movies', hasDropdown: true },
    { id: 'editorial', label: 'News' },
    { id: 'ratings', label: 'Reviews' },
    { id: 'boxoffice', label: 'Box Office' },
    { id: 'articles', label: 'Articles' },
    { id: 'community', label: 'Discussions' },
  ];

  const southLanguages: { code: IndustryCode; label: string }[] = [
    { code: 'all', label: 'All' },
    { code: 'tamil', label: 'Tamil' },
    { code: 'telugu', label: 'Telugu' },
    { code: 'malayalam', label: 'Malayalam' },
    { code: 'kannada', label: 'Kannada' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'articles') {
      onSelectTab('editorial');
    } else {
      onSelectTab(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      {/* Top Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo: CineSouth */}
          <button
            onClick={() => onSelectTab('intelligence')}
            className="flex items-center gap-3 text-left focus:outline-none group flex-shrink-0"
            aria-label="CineSouth Home"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Film size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                <span>Cine</span>
                <span className="text-amber-400">South</span>
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-wider text-slate-400 font-mono uppercase font-semibold">
                ONE HUB. FOUR LANGUAGES. ENDLESS STORIES.
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavLinks.map((item) => {
              const isActive =
                currentTab === item.id ||
                (item.id === 'editorial' && currentTab === 'news') ||
                (item.id === 'articles' && currentTab === 'news') ||
                (item.id === 'intelligence' && currentTab === 'home');

              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        isActive ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform" />
                    </button>

                    {/* Movies Dropdown */}
                    <div className="absolute top-full left-0 mt-1 w-44 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                      {southLanguages.filter(l => l.code !== 'all').map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onSelectIndustry(lang.code);
                            onSelectTab('movies');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          {lang.label} Movies
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Search, Theme, User Avatar */}
          <div className="flex items-center gap-3">
            {/* Search Input Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all w-36 sm:w-56 md:w-64"
              aria-label="Search movies, actors, articles"
            >
              <Search size={14} className="text-slate-400 flex-shrink-0" />
              <span className="truncate text-left flex-1 hidden sm:inline">Search movies, actors, articles...</span>
              <span className="truncate text-left flex-1 sm:hidden">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => onSelectTab('admin')}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-amber-400 transition-colors flex-shrink-0"
              title="Admin & Account Terminal"
            >
              <User size={18} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Filter Sub-Bar (Exact Match from Mockup) */}
      <div className="border-t border-slate-800/60 bg-slate-950/60 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {/* Left: Language Pills */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {southLanguages.map((lang) => {
              const isSelected = selectedIndustry === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectIndustry(lang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>

          {/* Right: Category Breadcrumbs / Filters */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-medium whitespace-nowrap flex-shrink-0">
            <span className="text-slate-300 font-semibold">South Indian Cinema</span>
            <span>|</span>
            <button onClick={() => onSelectTab('movies')} className="hover:text-amber-400 transition-colors">Drama</button>
            <button onClick={() => onSelectTab('movies')} className="hover:text-amber-400 transition-colors">Action</button>
            <button onClick={() => onSelectTab('movies')} className="hover:text-amber-400 transition-colors">Romance</button>
            <button onClick={() => onSelectTab('movies')} className="hover:text-amber-400 transition-colors">Thriller</button>
            <button onClick={() => onSelectTab('movies')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>More</span>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[115px] bottom-0 bg-slate-950/95 backdrop-blur-2xl z-50 p-6 overflow-y-auto space-y-6 border-t border-slate-800">
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Navigation</div>
            {mainNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm font-bold text-white hover:bg-slate-800 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronDown size={14} className="-rotate-90 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Select Industry</div>
            <div className="grid grid-cols-2 gap-2">
              {southLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectIndustry(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl text-xs font-bold text-center border ${
                    selectedIndustry === lang.code
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
