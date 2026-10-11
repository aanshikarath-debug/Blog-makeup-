import React from 'react';
import { Star, Check, Minus, Tag, Sparkles } from 'lucide-react';
import { RecommendedProduct } from '../types';

interface ProductCardProps {
  product: RecommendedProduct;
  index: number;
}

export const ProductRecommendationCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <div className="bg-white border border-[#EBE0DA] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image + Badge */}
        <div className="md:w-56 shrink-0 flex flex-col items-center">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 border border-[#F0E6E1]">
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {product.badge && (
              <div className="absolute top-2.5 left-2.5 bg-[#241A1B] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-rose-300" />
                <span>{product.badge}</span>
              </div>
            )}
          </div>
          <span className="text-stone-400 text-[11px] mt-2 font-mono">
            Recommendation #{index + 1}
          </span>
        </div>

        {/* Product Details & Specs */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                {product.brand}
              </span>
              <span className="text-base font-bold text-stone-900 font-serif-title">
                {product.price}
              </span>
            </div>

            <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-[#241A1B] mb-2 leading-snug">
              {product.name}
            </h4>

            {/* Rating Stars & Review Count */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-800">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">({product.reviewCount.toLocaleString()} editor & reader reviews)</span>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#FAF4F0] rounded-lg text-xs mb-4">
              <div>
                <span className="text-stone-400 font-medium">Finish/Texture: </span>
                <span className="text-stone-800 font-semibold">{product.finishOrType}</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">Best Suited For: </span>
                <span className="text-stone-800 font-semibold">{product.bestFor}</span>
              </div>
              {product.shadeRange && (
                <div className="sm:col-span-2">
                  <span className="text-stone-400 font-medium">Shades: </span>
                  <span className="text-stone-800 font-semibold">{product.shadeRange}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-stone-700 text-sm leading-relaxed mb-5">
              {product.description}
            </p>
          </div>

          {/* Pros & Cons Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F2E8E3] text-xs">
            <div className="space-y-1.5">
              <p className="font-bold uppercase tracking-wider text-emerald-800 text-[11px] flex items-center gap-1">
                <span>The Highlights (Pros)</span>
              </p>
              {product.pros.map((pro, pIdx) => (
                <div key={pIdx} className="flex items-start gap-1.5 text-stone-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <p className="font-bold uppercase tracking-wider text-rose-800 text-[11px] flex items-center gap-1">
                <span>Considerations (Cons)</span>
              </p>
              {product.cons.map((con, cIdx) => (
                <div key={cIdx} className="flex items-start gap-1.5 text-stone-700">
                  <Minus className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {product.purchaseTip && (
            <div className="mt-4 p-3 bg-rose-50/60 border border-rose-100 rounded-lg text-xs text-rose-900 flex items-start gap-2">
              <Tag className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
              <span>
                <strong>Application Secret:</strong> {product.purchaseTip}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
