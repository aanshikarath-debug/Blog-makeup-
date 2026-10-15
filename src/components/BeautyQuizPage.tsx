import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Article } from '../types';

interface BeautyQuizPageProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onBackHome: () => void;
}

export const BeautyQuizPage: React.FC<BeautyQuizPageProps> = ({
  articles,
  onSelectArticle,
  onBackHome,
}) => {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string>('');
  const [desiredFinish, setDesiredFinish] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');

  const resetQuiz = () => {
    setStep(1);
    setSkinType('');
    setDesiredFinish('');
    setPrimaryGoal('');
  };

  const getMatchedArticleSlug = (): string => {
    if (skinType === 'Oily' || desiredFinish === 'Matte') {
      return 'best-foundation-for-flawless-skin';
    }
    if (primaryGoal === 'Beginner Essentials') {
      return 'makeup-for-beginners';
    }
    if (primaryGoal === 'Lip Definition & Color') {
      return 'how-to-apply-lipstick-perfectly';
    }
    if (primaryGoal === 'Budget Friendly') {
      return 'affordable';
    }
    return 'best-foundation-for-flawless-skin';
  };

  const matchedSlug = getMatchedArticleSlug();
  const matchedArticle =
    articles.find((a) => a.slug === matchedSlug || a.aliases?.includes(matchedSlug)) || articles[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

      <div className="bg-white border border-[#EAE0D8] rounded-2xl overflow-hidden shadow-sm">
        {/* Masthead Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#241A1B] via-rose-950 to-[#241A1B] text-white">
          <div className="inline-flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Complexion & Routine Matcher</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-4xl font-bold leading-tight">
            Find Your Holy Grail Complexion & Beauty Routine
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-2 max-w-2xl leading-relaxed">
            Answer 3 quick questions about your skin type, desired finish, and daily goals to receive an immediate personalized tutorial and curated product match.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F0E5DF]">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? 'bg-rose-900 text-white shadow-xs'
                      : step > s
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-stone-500">
              {step <= 3 ? `Step ${step} of 3` : 'Your Tailored Result'}
            </span>
          </div>

          {step === 1 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
                Step 1 · Biological Skin Matrix
              </p>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B] mb-4">
                What best describes your skin type?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'Dry', label: 'Dry / Dehydrated', desc: 'Flakes easily, feels tight without rich cream' },
                  { id: 'Normal', label: 'Normal / Balanced', desc: 'Even texture, rare midday oil breakthrough' },
                  { id: 'Combination', label: 'Combination', desc: 'Oily center T-zone, balanced or dry cheeks' },
                  { id: 'Oily', label: 'Oily / Shine-Prone', desc: 'Excess sebum by midday, makeup tends to slide' },
                  { id: 'Sensitive', label: 'Sensitive / Rosacea', desc: 'Prone to stinging, flushing, or reactive patches' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSkinType(item.id);
                      setStep(2);
                    }}
                    className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                      skinType === item.id
                        ? 'border-rose-700 bg-rose-50/60 font-semibold'
                        : 'border-[#EAE0D8] bg-white hover:border-rose-300'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold text-stone-900">{item.label}</p>
                    <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
                Step 2 · Aesthetic Finish
              </p>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B] mb-4">
                What finish do you gravitate toward?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'Dewy Glow', label: 'Fresh Lit-from-Within Dew', desc: 'Juicy, radiant glass skin tint' },
                  { id: 'Satin', label: 'Natural Demi-Satin', desc: 'Looks like bare healthy skin in direct light' },
                  { id: 'Matte', label: 'Soft Velvet Matte', desc: 'Pore-blurring, shine-locked 14-hour wear' },
                  { id: 'High Glam', label: 'Red-Carpet High Definition', desc: 'Full-wear flawless camera coverage' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDesiredFinish(item.id);
                      setStep(3);
                    }}
                    className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                      desiredFinish === item.id
                        ? 'border-rose-700 bg-rose-50/60 font-semibold'
                        : 'border-[#EAE0D8] bg-white hover:border-rose-300'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold text-stone-900">{item.label}</p>
                    <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
                Step 3 · Main Focus
              </p>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B] mb-4">
                What is your highest makeup priority right now?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'Beginner Essentials', label: 'Beginner Essentials & Simple Routine', desc: 'Foolproof starter kit under 10 minutes' },
                  { id: 'Flawless Complexion', label: 'Flawless Foundation & Shade Matching', desc: 'Long-wearing base that never creases' },
                  { id: 'Lip Definition & Color', label: 'Lipstick Application & Liner Precision', desc: 'Flattering shades for my skin tone' },
                  { id: 'Budget Friendly', label: 'Budget-Friendly Drugstore Dupes', desc: 'Top value cosmetics that beat luxury' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPrimaryGoal(item.id);
                      setStep(4);
                    }}
                    className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                      primaryGoal === item.id
                        ? 'border-rose-700 bg-rose-50/60 font-semibold'
                        : 'border-[#EAE0D8] bg-white hover:border-rose-300'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold text-stone-900">{item.label}</p>
                    <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
                Your Customized Routine Match
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#241A1B] mt-1 mb-2">
                {matchedArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
                Based on your {skinType.toLowerCase()} profile and craving for a {desiredFinish.toLowerCase()} finish, our editorial team recommends starting with this comprehensive guide.
              </p>

              <div className="bg-[#FAF4F0] border border-[#EAE0D8] rounded-xl p-4 sm:p-5 text-left mb-6 flex flex-col sm:flex-row gap-4 items-center">
                <img
                  src={matchedArticle.heroImage}
                  alt={matchedArticle.heroImageAlt}
                  className="w-full sm:w-28 h-28 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                    {matchedArticle.category} · {matchedArticle.readTime}
                  </span>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#241A1B] leading-snug">
                    {matchedArticle.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {matchedArticle.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => onSelectArticle(matchedArticle.slug)}
                  aria-label={`Read recommended guide: ${matchedArticle.title}`}
                  className="w-full sm:w-auto px-6 py-3.5 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Read Complete Tailored Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full sm:w-auto px-5 py-3 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Routine Matcher</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
