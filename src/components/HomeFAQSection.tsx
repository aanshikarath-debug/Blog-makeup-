import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircleQuestion, Send, Check } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const GENERAL_FAQS: FAQ[] = [
  {
    category: 'Complexion & Shade',
    question: 'How do I choose the exact right foundation shade and undertone online?',
    answer:
      'Never match foundation to your cheek or hand. Check your jawline and collarbone in natural daylight. If silver jewelry flatters you more and your veins look blue/purple, you likely have cool undertones. If gold jewelry pops and veins appear greenish, you have warm undertones. If both look harmonious or foundations often look too pink or yellow, look for neutral or olive-designated formulas.',
  },
  {
    category: 'Skincare & Prep',
    question: 'What is the correct order to apply skincare and makeup?',
    answer:
      'The golden rule is lightest to heaviest consistency: Cleanser → Hydrating Toner / Essence → Vitamin C / Serum → Lightweight Moisturizer → Broad Spectrum Sunscreen (SPF). Allow your SPF to absorb for 2 to 3 minutes before applying any primer, skin tint, or foundation to prevent pilling.',
  },
  {
    category: 'Editorial Integrity',
    question: 'Are Velvet Glow product recommendations sponsored or tested independently?',
    answer:
      'Every single product featured on Velvet Glow undergoes rigorous 14-day lab and wear testing by our editorial directors and licensed makeup artists. We do not accept paid positive reviews or brand interference. If a cult luxury product pills or oxidizes, we state it transparently.',
  },
  {
    category: 'Longevity & Wear',
    question: 'How do I stop my makeup from separating or getting cakey by 2 PM?',
    answer:
      'Separation occurs when skincare oils and cosmetic binders repel each other. Ensure your primer and foundation share the same base (water-based with water-based, or silicone with silicone). Apply product in sheer micro-layers, use a damp teardrop sponge to press away excess residue, and use a velvet puff to tap translucent powder only on high-movement oil zones.',
  },
  {
    category: 'Beginners & Tools',
    question: 'Do I need expensive brushes, or can I do everything with a beauty sponge?',
    answer:
      'A single high-quality damp sponge (like the Real Techniques Miracle Sponge) and clean fingertips can execute 80% of an everyday makeup routine. Sponges press pigment into the skin for a seamless, natural finish. Save brushes for precise powder application, brows, and detailed eye crease blending.',
  },
  {
    category: 'Hygiene & Expiration',
    question: 'How often should I clean my makeup sponges and discard old makeup?',
    answer:
      'Clean beauty sponges after every 2 to 3 uses with warm water and antibacterial soap, replacing them every 3 months. Mascaras must be discarded every 90 days to prevent bacterial eye infections. Liquid foundations and concealers last 12 months, while powder compacts last up to 2 years.',
  },
];

export const HomeFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [userQuestion, setUserQuestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const topics = ['All', 'Complexion & Shade', 'Skincare & Prep', 'Longevity & Wear', 'Editorial Integrity'];

  const filteredFaqs =
    selectedTopic === 'All'
      ? GENERAL_FAQS
      : GENERAL_FAQS.filter((item) => item.category === selectedTopic);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setQuestionSubmitted(true);
    setUserQuestion('');
    setUserEmail('');
    setTimeout(() => setQuestionSubmitted(false), 5000);
  };

  return (
    <section className="mt-20 pt-14 border-t border-[#EDE1D9]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>Beauty Q&A</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A1B] mb-3">
            Frequently Asked Beauty Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Expert answers from our editorial team to help you master shade matching, product compatibility, and everyday application techniques.
          </p>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTopic(t);
                setOpenIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTopic === t
                  ? 'bg-[#241A1B] text-white shadow-xs'
                  : 'bg-white border border-[#EAE0D8] text-stone-600 hover:text-stone-900 hover:bg-[#F5ECE8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#EBE1DC] rounded-xl overflow-hidden transition-all shadow-2xs hover:border-rose-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif-title text-base sm:text-lg font-bold text-[#241A1B] hover:text-rose-900 transition-colors cursor-pointer"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-rose-800 text-xs font-mono font-bold mt-1 shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-rose-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-[#F7EFEA] pt-3 pl-11">
                    <p className="text-stone-700">{faq.answer}</p>
                    <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-rose-800">
                      Answered by Camille Laurent · Pro Artist
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit a Question Interactive Card */}
        <div className="bg-[#FAF2ED] border border-[#ECDCD3] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
              <MessageCircleQuestion className="w-4 h-4 text-rose-700" />
              <span>Have a Specific Beauty Dilemma?</span>
            </div>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B] mb-2">
              Ask The Velvet Glow Editors
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cannot find the answer you need? Send your question to our makeup artists and we will reply directly or feature it in our weekly Q&A digest.
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            {questionSubmitted ? (
              <div className="p-4 bg-white border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your question has been sent to our editors. We will get back to you shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuestion} className="space-y-2">
                <input
                  type="text"
                  placeholder="Ask a question (e.g. best foundation for dry skin)..."
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5D7D0] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-400 placeholder:text-stone-400"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-[#E5D7D0] rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-400 placeholder:text-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
