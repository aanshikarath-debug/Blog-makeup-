import React from 'react';
import { Bookmark, Clock, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onRead: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
  compact?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onRead,
  isSaved,
  onToggleSave,
  compact = false,
}) => {
  return (
    <article
      onClick={() => onRead(article.slug)}
      className="group relative flex flex-col bg-white border border-[#F0E6E1] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-stone-100 ${compact ? 'h-48' : 'h-60 sm:h-64'}`}>
        <img
          src={article.heroImage}
          alt={article.heroImageAlt}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Bookmark Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(article.slug);
          }}
          aria-label={isSaved ? 'Remove from saved' : 'Save article'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 hover:text-rose-700 hover:bg-white shadow-sm transition-colors cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 ${isSaved ? 'fill-rose-700 text-rose-700' : ''}`}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Metadata - Zero-Pill discipline: unboxed clean text with typographic separator */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
            <span className="text-rose-800 font-semibold uppercase tracking-wider text-[11px]">
              {article.category}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{article.publishedAt}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1 text-stone-400">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B] group-hover:text-rose-900 transition-colors leading-snug mb-2.5">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </div>

        {/* Footer info: Author signature + Read Link */}
        <div className="pt-4 border-t border-[#F7EFEA] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-7 h-7 rounded-full object-cover border border-rose-200"
            />
            <span className="text-xs text-stone-700 font-medium">
              {article.author.name}
            </span>
          </div>

          <span
            aria-label={`Read complete tutorial: ${article.title}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 group-hover:translate-x-1 transition-transform"
          >
            <span>Read {article.primaryKeyword || 'Full Guide'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
