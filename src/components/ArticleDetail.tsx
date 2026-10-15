import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Check,
  Copy,
  ChevronDown,
  Sparkles,
  Quote,
  MessageSquare,
  Star,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Article, CommentItem } from '../types';
import { ProductRecommendationCard } from './ProductRecommendationCard';
import { ArticleCard } from './ArticleCard';

interface ArticleDetailProps {
  article: Article;
  allArticles: Article[];
  onBack: () => void;
  onNavigateSlug: (slug: string) => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  allArticles,
  onBack,
  onNavigateSlug,
  isSaved,
  onToggleSave,
}) => {
  // Reading progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // FAQs open states
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  // Comments state persisted in localStorage
  const storageKey = `comments_${article.slug}`;
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial mock comments for authenticity
    return [
      {
        id: 'c-1',
        authorName: 'Sophie M.',
        skinType: 'Combination / Sensitive',
        date: '2 days ago',
        rating: 5,
        content:
          'This guide broke down the exact steps I was struggling with. The recommendation for application order completely stopped my foundation from pilling!',
      },
      {
        id: 'c-2',
        authorName: 'Jessica R.',
        skinType: 'Dry Skin',
        date: 'Yesterday',
        rating: 5,
        content:
          'I bought the editor pick recommendation and it is already my holy grail. The pros and cons breakdown was so honest and helpful.',
      },
    ];
  });

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentSkin, setNewCommentSkin] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [newCommentText, setNewCommentText] = useState('');

  // Scroll listener for reading progress & TOC highlight
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check which section is in view
      const headings = article.tableOfContents.map((item) => document.getElementById(item.id));
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveTocId(article.tableOfContents[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async (platform: 'copy' | 'twitter' | 'pinterest' | 'facebook' | 'whatsapp') => {
    const cleanUrl = `${window.location.origin}/${article.slug}`;
    const title = article.title;

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        showToast(`Short link copied: /${article.slug}`);
      } catch {
        showToast('Link copied: ' + cleanUrl);
      }
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(cleanUrl)}`,
        '_blank'
      );
    } else if (platform === 'pinterest') {
      window.open(
        `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(cleanUrl)}&media=${encodeURIComponent(
          article.heroImage
        )}&description=${encodeURIComponent(title)}`,
        '_blank'
      );
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + cleanUrl)}`,
        '_blank'
      );
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const item: CommentItem = {
      id: Date.now().toString(),
      authorName: newCommentName.trim(),
      skinType: newCommentSkin.trim() || undefined,
      date: 'Just now',
      rating: newCommentRating,
      content: newCommentText.trim(),
    };

    const updated = [item, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewCommentName('');
    setNewCommentSkin('');
    setNewCommentText('');
    showToast('Thank you! Your beauty review has been posted.');
  };

  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  // Font size multiplier
  const textSizeClass =
    fontSize === 'larger'
      ? 'text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  return (
    <div className="relative pb-20">
      {/* Top Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 z-50">
        <div
          className="h-full bg-rose-700 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#241A1B] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-rose-900 font-medium transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex items-center gap-2 text-stone-400 text-xs">
            <span className="hover:text-stone-700 cursor-pointer" onClick={onBack}>
              Home
            </span>
            <span>/</span>
            <span className="text-stone-700 font-medium">{article.category}</span>
            <span>/</span>
            <span className="text-stone-400 truncate max-w-[200px] hidden sm:inline">
              {article.title}
            </span>
          </div>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 text-center sm:text-left">
        {/* Category & Date Metadata - Zero Pill */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-500 font-medium mb-4">
          <span className="text-rose-800 font-bold uppercase tracking-wider text-xs">
            {article.category}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Published {article.publishedAt}</span>
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{article.readTime}</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-5xl font-bold text-[#241A1B] leading-tight mb-4 tracking-tight">
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="text-stone-600 text-base sm:text-xl font-normal leading-relaxed mb-6 font-serif-title italic">
          {article.subtitle}
        </p>

        {/* Author Byline & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#EDE3DE]">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-rose-200"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-stone-900">{article.author.name}</p>
              <p className="text-[11px] text-stone-500">{article.author.role}</p>
            </div>
          </div>

          {/* Reader Controls: Font size, Bookmark, Share */}
          <div className="flex items-center justify-center sm:justify-end gap-2 text-xs">
            {/* Font size toggles */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 text-stone-700">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                  fontSize === 'normal' ? 'bg-white shadow-xs text-rose-900 font-bold' : ''
                }`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-sm font-medium cursor-pointer ${
                  fontSize === 'large' ? 'bg-white shadow-xs text-rose-900 font-bold' : ''
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-2 py-1 rounded text-base font-medium cursor-pointer ${
                  fontSize === 'larger' ? 'bg-white shadow-xs text-rose-900 font-bold' : ''
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(article.slug)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-white border-[#E5D7D0] text-stone-700 hover:text-rose-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-700' : ''}`} />
              <span className="hidden md:inline text-[11px] font-semibold">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>

            {/* Share link */}
            <button
              onClick={() => handleShare('copy')}
              className="p-2 rounded-lg bg-white border border-[#E5D7D0] text-stone-700 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Copy share link"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden md:inline text-[11px] font-semibold">Copy Link</span>
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-lg bg-white border border-[#E5D7D0] text-stone-700 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Share on X"
              aria-label="Share on X"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-2xl overflow-hidden shadow-sm border border-[#EBE1DC] bg-stone-100">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt}
            className="w-full max-h-[520px] object-cover"
          />
        </div>
        <p className="text-center text-xs text-stone-400 mt-2.5 italic">
          {article.heroImageAlt} · Photography courtesy of Velvet & Glow Studio
        </p>
      </div>

      {/* Main Grid: Sticky Sidebar TOC + Article Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-white border border-[#EDE2DC] rounded-xl p-5 shadow-xs">
              <h3 className="font-serif-title text-base font-bold text-[#241A1B] uppercase tracking-wider mb-4 pb-2 border-b border-[#F5EDE8]">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-xs">
                {article.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block py-1.5 transition-colors ${
                      activeTocId === item.id
                        ? 'text-rose-900 font-bold pl-2 border-l-2 border-rose-700'
                        : 'text-stone-600 hover:text-stone-900 pl-2 border-l-2 border-transparent'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              {/* Quick Jump to Products */}
              <div className="mt-6 pt-5 border-t border-[#F5EDE8]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Featured Recommendations
                </p>
                <div className="space-y-2">
                  {article.recommendedProducts.map((p, pI) => (
                    <div key={p.id} className="text-xs text-stone-700 truncate">
                      <span className="font-semibold text-rose-800">#{pI + 1} </span>
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Article Prose & Sections */}
          <main className="lg:col-span-8">
            {/* Quick Mobile TOC Accordion */}
            <div className="lg:hidden mb-8 bg-[#FAF4F0] border border-[#ECE0D8] rounded-xl p-4">
              <details className="text-xs">
                <summary className="font-bold text-stone-800 cursor-pointer flex items-center justify-between">
                  <span>In This Article (Table of Contents)</span>
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                </summary>
                <div className="mt-3 space-y-2 pt-2 border-t border-[#EDE1D9]">
                  {article.tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-stone-700 hover:text-rose-900 py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </details>
            </div>

            {/* Content Sections */}
            <div className={`space-y-10 text-stone-700 ${textSizeClass}`}>
              {article.contentSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-28">
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B] mb-2 leading-snug">
                    {sec.heading}
                  </h2>
                  {sec.subheading && (
                    <p className="text-rose-900 font-medium text-sm sm:text-base mb-4 font-serif-title italic">
                      {sec.subheading}
                    </p>
                  )}

                  <div className="space-y-4 leading-relaxed">
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-stone-700 whitespace-pre-line">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Pro Tip Callout */}
                  {sec.proTip && (
                    <div className="my-6 p-4 sm:p-5 bg-rose-50/70 border-l-4 border-rose-600 rounded-r-xl text-stone-800 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-1">
                        <Sparkles className="w-4 h-4 text-rose-600" />
                        <span>Artist Pro Tip</span>
                      </div>
                      <p className="italic text-stone-800 leading-relaxed">{sec.proTip}</p>
                    </div>
                  )}

                  {/* Pull Quote */}
                  {sec.quote && (
                    <blockquote className="my-8 pl-6 border-l-2 border-[#241A1B] text-[#241A1B] font-serif-title italic text-lg sm:text-xl leading-snug">
                      <Quote className="w-6 h-6 text-rose-300 mb-1" />
                      “{sec.quote}”
                    </blockquote>
                  )}
                </section>
              ))}

              {/* Product Recommendations Section */}
              <section id="recommended-starter-products" className="scroll-mt-28 pt-4">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
                    Curated Lab & Field Tests
                  </span>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B] mt-1">
                    Tested & Recommended Products
                  </h2>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1">
                    Every formulation is evaluated for wear-time, skin texture compatibility, and true-to-pan undertone accuracy.
                  </p>
                </div>

                <div className="space-y-6">
                  {article.recommendedProducts.map((product, idx) => (
                    <ProductRecommendationCard key={product.id} product={product} index={idx} />
                  ))}
                </div>
              </section>

              {/* FAQs Section */}
              <section id="faqs" className="scroll-mt-28 pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="w-5 h-5 text-rose-800" />
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B]">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {article.faqs.map((faq, fIdx) => {
                    const isOpen = !!openFaqs[fIdx];
                    return (
                      <div
                        key={fIdx}
                        className="bg-white border border-[#EBE1DC] rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() =>
                            setOpenFaqs((prev) => ({ ...prev, [fIdx]: !prev[fIdx] }))
                          }
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif-title text-base sm:text-lg font-bold text-[#241A1B] hover:text-rose-900 transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180 text-rose-700' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-[#F7EFEA] pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Editor Verdict Card */}
              <section id="verdict" className="scroll-mt-28 pt-4">
                <div className="bg-[#FAF2ED] border-2 border-rose-200/80 rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
                      Editorial Director's Verdict
                    </span>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{article.editorVerdict.rating.toFixed(2)} / 5.0 Rating</span>
                    </div>
                  </div>

                  <p className="text-stone-800 text-sm sm:text-base leading-relaxed mb-4">
                    {article.editorVerdict.summary}
                  </p>

                  <div className="pt-3 border-t border-[#E8DDD5] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-700">
                    <span>
                      <strong>Editor's Top Recommendation: </strong>
                      <span className="text-rose-950 font-bold">{article.editorVerdict.topPick}</span>
                    </span>
                  </div>
                </div>
              </section>

              {/* Author Bio Section */}
              <div className="p-6 bg-white border border-[#EFE5E0] rounded-2xl flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left mt-10">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-rose-300 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-800">
                    Written by
                  </span>
                  <h4 className="font-serif-title text-lg font-bold text-[#241A1B]">
                    {article.author.name}
                  </h4>
                  <p className="text-xs text-stone-500 mb-2">{article.author.role}</p>
                  <p className="text-xs text-stone-600 leading-relaxed">{article.author.bio}</p>
                </div>
              </div>

              {/* Community Reviews & Comments */}
              <section className="pt-8 border-t border-[#EDE1D9]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-800" />
                    <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B]">
                      Community Reviews & Discussion ({comments.length})
                    </h3>
                  </div>
                </div>

                {/* Comment Form */}
                <form
                  onSubmit={handleAddComment}
                  className="bg-white border border-[#EAE0D8] rounded-xl p-5 mb-8"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                    Leave Your Experience or Question
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Your name or handle *"
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      required
                      className="px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <input
                      type="text"
                      placeholder="Skin Type (e.g. Oily, Dry, Rosacea)"
                      value={newCommentSkin}
                      onChange={(e) => setNewCommentSkin(e.target.value)}
                      className="px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-stone-600">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewCommentRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newCommentRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Share how this product or tutorial worked for you..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 mb-3"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-white border border-[#EFE5E0] rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{c.authorName}</span>
                          {c.skinType && (
                            <span className="text-[11px] text-stone-500">
                              ({c.skinType})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(c.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{c.content}</p>
                      <p className="text-[10px] text-stone-400">{c.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Related Posts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-[#EAE0DA]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Continue Reading
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B] mt-1">
              Related Beauty Guides
            </h3>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-rose-800 hover:text-rose-950 uppercase tracking-wider"
          >
            View All Guides →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedArticles.map((art) => (
            <ArticleCard
              key={art.slug}
              article={art}
              onRead={(slug) => {
                onNavigateSlug(slug);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isSaved={isSaved}
              onToggleSave={onToggleSave}
              compact
            />
          ))}
        </div>
      </section>
    </div>
  );
};
