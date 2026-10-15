import React, { useState, useEffect, useMemo } from 'react';
import { ARTICLES } from './data/articles';
import { Category } from './types';
import { useRouter } from './utils/router';
import { updateMetaTags } from './utils/seo';
import { Header } from './components/Header';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { BeautyQuizModal } from './components/BeautyQuizModal';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

export default function App() {
  const { route, navigate } = useRouter();

  // Active Category & Search
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Saved articles in localStorage
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_saved_articles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['beginners']; // seed with 1 article
  });

  const isArticleSaved = (slug: string) => {
    const article = ARTICLES.find((a) => a.slug === slug || a.aliases?.includes(slug));
    if (!article) return savedSlugs.includes(slug);
    return savedSlugs.includes(article.slug) || (article.aliases ? article.aliases.some((al) => savedSlugs.includes(al)) : false);
  };

  const handleToggleSave = (slug: string) => {
    const article = ARTICLES.find((a) => a.slug === slug || a.aliases?.includes(slug));
    const targetSlug = article ? article.slug : slug;

    setSavedSlugs((prev) => {
      const isAlreadySaved = prev.includes(targetSlug) || (article?.aliases && article.aliases.some((al) => prev.includes(al)));
      let next: string[];
      if (isAlreadySaved) {
        next = prev.filter((s) => s !== targetSlug && !(article?.aliases && article.aliases.includes(s)));
      } else {
        next = [...prev, targetSlug];
      }
      try {
        localStorage.setItem('velvet_saved_articles', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleClearAllSaved = () => {
    setSavedSlugs([]);
    try {
      localStorage.removeItem('velvet_saved_articles');
    } catch {
      // ignore
    }
  };

  // Find active article if slug in route (matches direct short slug or any alias)
  const currentArticle = useMemo(() => {
    const slug = route.slug;
    if (!slug) return null;
    return ARTICLES.find((a) => a.slug === slug || (a.aliases && a.aliases.includes(slug))) || null;
  }, [route.slug]);

  // Sync SEO meta tags and canonical URL whenever route or active article changes
  useEffect(() => {
    if (currentArticle) {
      updateMetaTags(currentArticle);
    } else {
      updateMetaTags(undefined);
    }
  }, [currentArticle]);

  // Filtered articles for homepage
  const filteredArticles = useMemo(() => {
    let list = [...ARTICLES];

    if (selectedCategory !== 'All') {
      list = list.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.recommendedProducts.some(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          )
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Featured article and companion stories for homepage hero
  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const secondaryStories = ARTICLES.filter((a) => a.trending && a.slug !== featuredArticle.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7] text-[#241A1B]">
      {/* Header */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          if (route.slug) {
            navigate('/');
          }
        }}
        savedCount={savedSlugs.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onNavigateHome={() => {
          setSelectedCategory('All');
          setSearchQuery('');
          navigate('/');
        }}
        onSearch={(q) => {
          setSearchQuery(q);
          if (route.slug && q.trim()) {
            navigate('/');
          }
        }}
        searchQuery={searchQuery}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentArticle ? (
          /* Individual Article Page */
          <ArticleDetail
            article={currentArticle}
            allArticles={ARTICLES}
            onBack={() => navigate('/')}
            onNavigateSlug={(slug) => navigate(`/${slug}`)}
            isSaved={isArticleSaved(currentArticle.slug)}
            onToggleSave={handleToggleSave}
          />
        ) : (
          /* Editorial Homepage */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
            {/* Show Featured Magazine Hero only when NOT searching and on "All" category */}
            {selectedCategory === 'All' && !searchQuery && (
              <HeroFeatured
                featuredArticle={featuredArticle}
                secondaryArticles={secondaryStories}
                onRead={(slug) => navigate(`/${slug}`)}
                isSaved={isArticleSaved}
                onToggleSave={handleToggleSave}
              />
            )}

            {/* Section Header & Search / Filter feedback */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#EDE1D9]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
                  {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Curated Archives' : selectedCategory}
                </span>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B] mt-1">
                  {searchQuery
                    ? `Articles matching "${searchQuery}"`
                    : selectedCategory === 'All'
                    ? 'All 10 In-Depth Beauty & Makeup Guides'
                    : `${selectedCategory} Masterclasses`}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'guide' : 'guides'} with comprehensive shade analysis, product picks, and FAQs
                </p>
              </div>

              {(selectedCategory !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-800 hover:text-rose-950 font-semibold cursor-pointer py-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#EDE1D9] rounded-2xl p-8">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif-title text-xl font-bold text-stone-800 mb-2">
                  No articles matched your criteria
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5">
                  Try searching for terms like "foundation", "mascara", "oily skin", "blush", or reset filters to browse all 10 guides.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-rose-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-rose-900 transition-colors cursor-pointer"
                >
                  Browse All Guides
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    onRead={(slug) => navigate(`/${slug}`)}
                    isSaved={isArticleSaved(article.slug)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}

            {/* Interactive Routine Finder Banner */}
            <div className="mt-16 bg-gradient-to-r from-[#F9EFE9] to-[#F5E6DE] border border-[#E8D6CB] rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-700" />
                  <span>Personalized Diagnosis</span>
                </div>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B] mb-2">
                  Need Help Finding Your Ideal Match?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Take our 60-second shade, skin-type, and routine matcher quiz to receive curated editorial recommendations tailored directly to your beauty goals.
                </p>
              </div>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-6 py-3.5 bg-[#241A1B] hover:bg-rose-950 text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
              >
                Launch Routine Matcher
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          navigate('/');
        }}
        onNavigateSlug={(slug) => navigate(`/${slug}`)}
        articles={ARTICLES}
      />

      {/* Modals & Drawers */}
      <BeautyQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        articles={ARTICLES}
        onSelectArticle={(slug) => navigate(`/${slug}`)}
      />

      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedSlugs={savedSlugs}
        articles={ARTICLES}
        onSelectArticle={(slug) => navigate(`/${slug}`)}
        onRemoveSave={handleToggleSave}
        onClearAll={handleClearAllSaved}
      />
    </div>
  );
}
