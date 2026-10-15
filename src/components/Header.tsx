import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenQuiz: () => void;
  onNavigateHome: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const CATEGORIES: Category[] = [
  'All',
  'Beginner Guides',
  'Complexion & Base',
  'Lips',
  'Budget Beauty',
  'Eyes & Brows',
  'Blush & Cheek',
  'Brand Reviews',
  'Tutorials',
];

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  savedCount,
  onOpenSaved,
  onOpenQuiz,
  onNavigateHome,
  onSearch,
  searchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#F0E6E1] transition-all">
      {/* Top Editorial Ticker Bar */}
      <div className="bg-[#241A1B] text-[#FDF8F5] text-xs py-1.5 px-4 tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-medium text-[11px] sm:text-xs tracking-widest">
              Velvet Glow
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] tracking-widest text-[#E6D8D2]">
            <span>Editorial Integrity & 100% Honest Testing</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenQuiz}
              className="hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Sparkles className="w-3 h-3 text-rose-300" />
              <span>Take The Foundation & Routine Matcher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Masthead Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <button
              onClick={onNavigateHome}
              className="inline-block text-left group cursor-pointer"
            >
              <span className="font-serif-title text-2xl sm:text-3xl tracking-wide text-[#241A1B] font-bold group-hover:text-rose-900 transition-colors">
                Velvet Glow
              </span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700">
            <button
              onClick={onNavigateHome}
              className="hover:text-rose-800 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-rose-400"
            >
              All Articles
            </button>
            <button
              onClick={() => onSelectCategory('Beginner Guides')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentCategory === 'Beginner Guides'
                  ? 'border-rose-700 text-rose-950 font-bold'
                  : 'border-transparent hover:border-rose-400 hover:text-rose-800'
              }`}
            >
              Beginners
            </button>
            <button
              onClick={() => onSelectCategory('Complexion & Base')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentCategory === 'Complexion & Base'
                  ? 'border-rose-700 text-rose-950 font-bold'
                  : 'border-transparent hover:border-rose-400 hover:text-rose-800'
              }`}
            >
              Base & Foundation
            </button>
            <button
              onClick={() => onSelectCategory('Lips')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentCategory === 'Lips'
                  ? 'border-rose-700 text-rose-950 font-bold'
                  : 'border-transparent hover:border-rose-400 hover:text-rose-800'
              }`}
            >
              Lips
            </button>
            <button
              onClick={() => onSelectCategory('Budget Beauty')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentCategory === 'Budget Beauty'
                  ? 'border-rose-700 text-rose-950 font-bold'
                  : 'border-transparent hover:border-rose-400 hover:text-rose-800'
              }`}
            >
              Affordable
            </button>
            <button
              onClick={() => onSelectCategory('Tutorials')}
              className={`transition-colors cursor-pointer py-1 border-b-2 ${
                currentCategory === 'Tutorials'
                  ? 'border-rose-700 text-rose-950 font-bold'
                  : 'border-transparent hover:border-rose-400 hover:text-rose-800'
              }`}
            >
              Tutorials
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick search input / toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-white border border-[#E5D7D0] rounded-full px-3 py-1.5 shadow-sm">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search foundations, lips, oils..."
                    className="w-40 sm:w-56 text-xs text-stone-800 focus:outline-none placeholder:text-stone-400 bg-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearch('');
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-1 p-0.5"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 text-stone-700 hover:text-rose-900 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                  title="Search articles"
                  aria-label="Open search input"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Routine Matcher Quiz Button */}
            <button
              onClick={onOpenQuiz}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-900 bg-rose-100/70 hover:bg-rose-200/80 rounded-full transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>Routine Matcher</span>
            </button>

            {/* Saved Bookmarks Button */}
            <button
              onClick={onOpenSaved}
              className="relative p-2.5 text-stone-700 hover:text-rose-900 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              title="Saved reading list"
              aria-label="View saved articles"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-700 text-[10px] font-bold text-white flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar border-t border-[#F5ECE8] text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-2 shrink-0">
            Topics:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat && !searchQuery;
            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onSearch('');
                }}
                className={`px-3 py-1 rounded-md text-xs transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#241A1B] text-white font-medium shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2EAE5]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCF9F7] border-b border-[#EBE1DC] px-4 pt-3 pb-6 space-y-4">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search all 10 beauty guides..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5D7D0] rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              Browse Categories
            </p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                  onSearch('');
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  currentCategory === cat && !searchQuery
                    ? 'bg-rose-100 text-rose-950 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EBE1DC] space-y-2">
            <button
              onClick={() => {
                onOpenQuiz();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Foundation & Routine Matcher Quiz</span>
            </button>
            <button
              onClick={() => {
                onOpenSaved();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-[#E5D7D0] text-stone-700 text-xs font-medium cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-rose-700" />
              <span>Saved Articles ({savedCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
