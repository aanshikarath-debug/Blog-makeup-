import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Article } from '../types';

interface BeautyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const BeautyQuizModal: React.FC<BeautyQuizModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string>('');
  const [desiredFinish, setDesiredFinish] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');

  if (!isOpen) return null;

  const resetQuiz = () => {
    setStep(1);
    setSkinType('');
    setDesiredFinish('');
    setPrimaryGoal('');
  };

  // Determine matched article based on quiz answers
  const getMatchedArticleSlug = (): string => {
    if (skinType === 'Oily' || desiredFinish === 'Matte') {
      return 'best-makeup-products-for-oily-skin';
    }
    if (primaryGoal === 'Beginner Essentials') {
      return 'best-makeup-products-for-beginners';
    }
    if (primaryGoal === 'Budget Friendly') {
      return 'affordable-makeup-products-worth-buying';
    }
    if (primaryGoal === 'Quick 10-Min Routine') {
      return 'step-by-step-everyday-makeup-tutorial';
    }
    if (desiredFinish === 'Dewy Glow' || primaryGoal === 'Cheek Radiance') {
      return 'best-blushes-for-a-natural-glow';
    }
    return 'top-10-foundations-for-flawless-skin';
  };

  const matchedSlug = getMatchedArticleSlug();
  const matchedArticle = articles.find((a) => a.slug === matchedSlug) || articles[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FCF9F7] border border-[#EAE0D8] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-900 to-[#241A1B] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            aria-label="Close quiz"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Beauty Matcher</span>
          </div>
          <h3 className="font-serif-title text-2xl font-bold">
            Find Your Holy Grail Complexion & Routine
          </h3>
          <p className="text-xs text-rose-200 mt-1">
            Answer 3 quick questions for a personalized routine recommendation.
          </p>
        </div>

        {/* Content body */}
        <div className="p-6">
          {step === 1 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
                Step 1 of 3 · Skin Profile
              </p>
              <h4 className="font-serif-title text-xl font-bold text-[#241A1B] mb-4">
                What best describes your skin type?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {[
                  { id: 'Dry', label: 'Dry / Dehydrated', desc: 'Flakes easily, feels tight' },
                  { id: 'Normal', label: 'Normal / Balanced', desc: 'Even texture, rare breakouts' },
                  { id: 'Combination', label: 'Combination', desc: 'Oily T-zone, normal cheeks' },
                  { id: 'Oily', label: 'Oily / Shine-Prone', desc: 'Excess sebum by midday' },
                  { id: 'Sensitive', label: 'Sensitive / Rosacea', desc: 'Prone to redness or stinging' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSkinType(item.id);
                      setStep(2);
                    }}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      skinType === item.id
                        ? 'border-rose-700 bg-rose-50/60 font-semibold'
                        : 'border-[#EAE0D8] bg-white hover:border-rose-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-stone-900">{item.label}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
                Step 2 of 3 · Desired Aesthetics
              </p>
              <h4 className="font-serif-title text-xl font-bold text-[#241A1B] mb-4">
                What finish do you gravitate toward?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {[
                  { id: 'Dewy Glow', label: 'Fresh Lit-from-Within Glow', desc: 'Juicy, radiant skin tint' },
                  { id: 'Satin', label: 'Natural Demi-Satin', desc: 'Looks like bare healthy skin' },
                  { id: 'Matte', label: 'Soft Velvet Matte', desc: 'Pore-blurring, shine-locked' },
                  { id: 'High Glam', label: 'Red-Carpet High Definition', desc: 'Full-wear flawless coverage' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDesiredFinish(item.id);
                      setStep(3);
                    }}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      desiredFinish === item.id
                        ? 'border-rose-700 bg-rose-50/60 font-semibold'
                        : 'border-[#EAE0D8] bg-white hover:border-rose-300'
                    }`}
                  >
                    <p className="text-xs font-bold text-stone-900">{item.label}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
                Step 3 of 3 · Main Focus
              </p>
              <h4 className="font-serif-title text-xl font-bold text-[#241A1B] mb-4">
                What is your highest makeup priority right now?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {[
                  { id: 'Beginner Essentials', label: 'Starting from Scratch', desc: 'Need a foolproof starter kit' },
                  { id: 'Quick 10-Min Routine', label: 'Fast Morning Routine', desc: 'Out the door in 10 minutes' },
                  { id: 'Budget Friendly', label: 'High Performance on Budget', desc: 'Drugstore dupes under $15' },
                  { id: 'Cheek Radiance', label: 'Flushed Natural Glow', desc: 'Blush & lip harmony' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPrimaryGoal(item.id);
                      setStep(4);
                    }}
                    className="p-3 text-left rounded-xl border border-[#EAE0D8] bg-white hover:border-rose-300 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-stone-900">{item.label}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-rose-800" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                Your Match Is Ready
              </span>
              <h4 className="font-serif-title text-2xl font-bold text-[#241A1B] mb-2">
                {matchedArticle.title}
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed">
                Based on your {skinType} skin profile and preference for {desiredFinish}, our editors recommend this deep-dive guide.
              </p>

              <div className="p-4 bg-white border border-[#EBE1DC] rounded-xl text-left mb-6 flex gap-4 items-center">
                <img
                  src={matchedArticle.heroImage}
                  alt={matchedArticle.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                    {matchedArticle.category} · {matchedArticle.readTime}
                  </p>
                  <p className="font-serif-title text-sm font-bold text-[#241A1B] line-clamp-2 mt-0.5">
                    {matchedArticle.title}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Features {matchedArticle.recommendedProducts.length} expert-tested recommendations
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-2.5 px-3 border border-[#E5D7D0] rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={() => {
                    onSelectArticle(matchedArticle.slug);
                    onClose();
                  }}
                  className="flex-2 py-2.5 px-4 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Read Recommended Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
