import React, { useState } from 'react';
import { Send, Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Category, Article } from '../types';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onNavigateSlug: (slug: string) => void;
  articles: Article[];
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateSlug,
  articles,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#1C1415] text-[#F3EBE6] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & VIP Invitation Card */}
        <div className="bg-gradient-to-r from-rose-950/80 via-[#2B1B1D] to-stone-900 border border-rose-900/40 rounded-2xl p-8 sm:p-10 mb-16 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/50 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3 border border-rose-800/60">
              <Sparkles className="w-3 h-3 text-rose-300" />
              <span>The Velvet Letter</span>
            </span>
            <h3 className="font-serif-title text-2xl sm:text-4xl font-bold text-white mb-3">
              Join Our Private Beauty Collective
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg mx-auto">
              Receive Camille & Elena’s weekly unreleased lab swatches, seasonal holy grail edits, and drugstore dupe alerts delivered directly to your inbox every Sunday morning.
            </p>

            {subscribed ? (
              <div className="bg-rose-900/60 border border-rose-700/60 rounded-xl p-4 text-xs text-rose-100 flex items-center justify-center gap-2 max-w-md mx-auto">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Bienvenue! You are now subscribed to The Velvet Letter. Check your inbox for our Starter Swatch Guide.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-stone-700 text-white placeholder:text-stone-500 text-xs focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-500 mt-3">
              Strictly zero spam. Unsubscribe in 1-click anytime.
            </p>
          </div>
        </div>

        {/* 4-Column Editorial Links Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <span className="font-serif-title text-2xl tracking-wide text-white font-bold block">
              Velvet Glow
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              An independent beauty editorial journal published from Paris and New York. Dedicated to honest cosmetic chemistry, inclusive undertone guides, and timeless, effortless rituals.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <p className="font-semibold text-rose-300">Editor Office</p>
              <p>Rue Saint-Honoré, 75001 Paris</p>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="font-serif-title text-base font-bold text-white uppercase tracking-wider mb-4">
              Explore Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {[
                'Beginner Guides',
                'Complexion & Base',
                'Lips',
                'Budget Beauty',
                'Eyes & Brows',
                'Blush & Cheek',
                'Brand Reviews',
                'Tutorials',
              ].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      onSelectCategory(c as Category);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-rose-300 transition-colors cursor-pointer text-left"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The 10 Featured Guides */}
          <div className="lg:col-span-2">
            <h4 className="font-serif-title text-base font-bold text-white uppercase tracking-wider mb-4">
              All 10 Definitive Guides
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-400">
              {articles.map((art, idx) => (
                <button
                  key={art.slug}
                  onClick={() => {
                    onNavigateSlug(art.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-rose-300 transition-colors cursor-pointer py-1 truncate flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-stone-600 font-mono">0{idx + 1}</span>
                  <span className="truncate">{art.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Velvet Glow. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Editorial Standards</span>
            <span aria-hidden="true">·</span>
            <span>Transparency & Testing Policy</span>
            <span aria-hidden="true">·</span>
            <span>Privacy & Accessibility</span>
          </div>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
            <span>for beauty enthusiasts worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
