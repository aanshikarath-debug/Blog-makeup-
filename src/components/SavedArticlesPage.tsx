import React from 'react';
import { Bookmark, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface SavedArticlesPageProps {
  savedSlugs: string[];
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onRemoveSave: (slug: string) => void;
  onClearAll: () => void;
  onBackHome: () => void;
}

export const SavedArticlesPage: React.FC<SavedArticlesPageProps> = ({
  savedSlugs,
  articles,
  onSelectArticle,
  onRemoveSave,
  onClearAll,
  onBackHome,
}) => {
  const savedArticles = articles.filter(
    (a) => savedSlugs.includes(a.slug) || (a.aliases && a.aliases.some((al) => savedSlugs.includes(al)))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <button
          onClick={onBackHome}
          aria-label="Return to Velvet Glow Complete Makeup Guide Homepage"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-rose-900 transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Velvet Glow Homepage Makeup Guide</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EDE1D9] mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 fill-rose-800 text-rose-800" />
            <span>Personal Beauty Library</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#241A1B]">
            Your Saved Beauty Guides & Reading List
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Revisit your bookmarked makeup tutorials, shade guides, and cosmetic recommendations.
          </p>
        </div>

        {savedArticles.length > 0 && (
          <button
            onClick={onClearAll}
            aria-label="Clear all saved articles from reading list"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-rose-900 transition-colors cursor-pointer py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Reading List</span>
          </button>
        )}
      </div>

      {/* List */}
      {savedArticles.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#EDE1D9] rounded-2xl p-8 max-w-lg mx-auto">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="font-serif-title text-xl font-bold text-stone-800 mb-2">
            Your reading list is currently empty
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Click the bookmark icon on any guide or foundation review to save it for quick reference while you apply your makeup.
          </p>
          <button
            onClick={onBackHome}
            aria-label="Explore all step-by-step beauty tutorials on Velvet Glow"
            className="px-6 py-3 bg-rose-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-rose-950 transition-colors cursor-pointer"
          >
            Explore All Makeup Guides
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              onRead={(slug) => onSelectArticle(slug)}
              isSaved={true}
              onToggleSave={onRemoveSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
