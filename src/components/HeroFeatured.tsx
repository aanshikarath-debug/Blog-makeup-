import React from 'react';
import { Clock, ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface HeroFeaturedProps {
  featuredArticle: Article;
  secondaryArticles: Article[];
  onRead: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  onToggleSave: (slug: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  featuredArticle,
  secondaryArticles,
  onRead,
  isSaved,
  onToggleSave,
}) => {
  return (
    <section className="mb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Lead Featured Story (7 Cols) */}
        <div
          onClick={() => onRead(featuredArticle.slug)}
          className="lg:col-span-7 group bg-white border border-[#EFE5E0] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-stone-100">
            <img
              src={featuredArticle.heroImage}
              alt={featuredArticle.heroImageAlt}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#241A1B]/90 backdrop-blur-md text-[#FDF8F5] px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-rose-300" />
              <span>Cover Story</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(featuredArticle.slug);
              }}
              aria-label={isSaved(featuredArticle.slug) ? 'Remove from saved' : 'Save article'}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-700 hover:bg-white shadow-sm transition-colors cursor-pointer"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isSaved(featuredArticle.slug) ? 'fill-rose-700 text-rose-700' : ''
                }`}
              />
            </button>

            {/* In-image caption on mobile / tablet */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs uppercase tracking-widest text-rose-200 font-medium">
                {featuredArticle.category}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-3">
                <span className="text-rose-800 font-semibold uppercase tracking-wider text-[11px]">
                  {featuredArticle.category}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{featuredArticle.publishedAt}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="flex items-center gap-1 text-stone-400">
                  <Clock className="w-3 h-3" />
                  <span>{featuredArticle.readTime}</span>
                </span>
              </div>

              <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#241A1B] group-hover:text-rose-900 transition-colors leading-tight mb-3">
                {featuredArticle.title}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="pt-5 border-t border-[#F5EDE8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={featuredArticle.author.avatar}
                  alt={featuredArticle.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-rose-300"
                />
                <div>
                  <p className="text-xs font-semibold text-stone-900">{featuredArticle.author.name}</p>
                  <p className="text-[11px] text-stone-500">{featuredArticle.author.role}</p>
                </div>
              </div>

              <span
                aria-label={`Read complete guide: ${featuredArticle.title}`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-800 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Complete {featuredArticle.primaryKeyword || 'Makeup Guide'}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Editorial Stories (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between border-b border-[#EAE0DA] pb-2">
            <span className="font-serif-title text-xl font-bold text-[#241A1B]">
              Trending In Beauty
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-rose-800">
              Editor Curations
            </span>
          </div>

          {secondaryArticles.slice(0, 2).map((art, idx) => (
            <div
              key={art.slug}
              onClick={() => onRead(art.slug)}
              className="group bg-white border border-[#EFE5E0] rounded-xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer flex gap-4 sm:gap-5 items-center flex-1"
            >
              <div className="relative w-28 sm:w-36 h-28 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                <img
                  src={art.heroImage}
                  alt={art.heroImageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#241A1B]/80 text-white text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1.5">
                    <span className="text-rose-800 font-semibold uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#241A1B] group-hover:text-rose-900 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                  <span>{art.author.name}</span>
                  <span
                    aria-label={`Read complete guide: ${art.title}`}
                    className="text-rose-800 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    <span>Read Full {art.primaryKeyword || 'Guide'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Editorial Quote Box */}
          <div className="bg-[#FAF2ED] border border-[#ECDCD3] rounded-xl p-5 text-stone-800 relative">
            <p className="font-serif-title italic text-stone-800 text-sm sm:text-base leading-relaxed mb-2">
              “Beauty in 2026 is skin-first and unapologetically intuitive. The best routine is the one you look forward to doing every morning.”
            </p>
            <p className="text-[11px] uppercase tracking-widest text-rose-800 font-semibold">
              — Camille Laurent, Editorial Director
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
