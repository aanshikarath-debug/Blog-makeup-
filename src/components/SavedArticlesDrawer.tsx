import React from 'react';
import { X, Bookmark, ArrowRight, Trash2, Clock } from 'lucide-react';
import { Article } from '../types';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSlugs: string[];
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onRemoveSave: (slug: string) => void;
  onClearAll: () => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedSlugs,
  articles,
  onSelectArticle,
  onRemoveSave,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const savedArticles = articles.filter(
    (a) => savedSlugs.includes(a.slug) || (a.aliases && a.aliases.some((al) => savedSlugs.includes(al)))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-[#FCF9F7] h-full shadow-2xl flex flex-col border-l border-[#EBE1DC]">
        {/* Header */}
        <div className="p-6 border-b border-[#EDE2DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-800 fill-rose-800" />
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#241A1B]">
                Saved Reading List
              </h3>
              <p className="text-[11px] text-stone-500">
                {savedArticles.length} {savedArticles.length === 1 ? 'guide' : 'guides'} saved for offline reading
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="font-serif-title text-lg font-bold text-stone-800 mb-1">
                Your reading list is empty
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Tap the bookmark icon on any guide or product breakdown to save it here for quick reference during your shopping trips.
              </p>
            </div>
          ) : (
            savedArticles.map((art) => (
              <div
                key={art.slug}
                className="bg-white border border-[#EFE5E0] rounded-xl p-4 flex gap-4 hover:shadow-xs transition-shadow relative group"
              >
                <img
                  src={art.heroImage}
                  alt={art.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0 bg-stone-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium mb-1">
                      <span className="text-rose-800 font-bold uppercase">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {art.readTime}
                      </span>
                    </div>
                    <h4
                      onClick={() => {
                        onSelectArticle(art.slug);
                        onClose();
                      }}
                      className="font-serif-title text-sm font-bold text-[#241A1B] hover:text-rose-900 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {art.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-1">
                    <button
                      onClick={() => {
                        onSelectArticle(art.slug);
                        onClose();
                      }}
                      className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveSave(art.slug)}
                      className="text-stone-400 hover:text-rose-700 p-1 cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 border-t border-[#EDE2DC] bg-white flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-stone-500 hover:text-rose-800 transition-colors cursor-pointer"
            >
              Clear All Saved
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#241A1B] text-white rounded-lg font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
