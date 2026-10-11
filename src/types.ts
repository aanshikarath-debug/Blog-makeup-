export type Category = 
  | 'All'
  | 'Beginner Guides'
  | 'Complexion & Base'
  | 'Lips'
  | 'Budget Beauty'
  | 'Eyes & Brows'
  | 'Blush & Cheek'
  | 'Brand Reviews'
  | 'Tutorials'
  | 'Skincare & Prep';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: string;
  finishOrType: string;
  bestFor: string;
  badge?: string; // e.g. "Best Overall", "Best Budget", "Holy Grail"
  description: string;
  pros: string[];
  cons: string[];
  shadeRange?: string;
  purchaseTip?: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  image?: {
    url: string;
    caption: string;
    alt: string;
  };
  quote?: string;
  proTip?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  category: Category;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  author: Author;
  heroImage: string;
  heroImageAlt: string;
  featured?: boolean;
  trending?: boolean;
  tags: string[];
  excerpt: string;
  tableOfContents: {
    id: string;
    title: string;
    level: 2 | 3;
  }[];
  contentSections: ContentSection[];
  recommendedProducts: RecommendedProduct[];
  faqs: FAQItem[];
  editorVerdict: {
    summary: string;
    rating: number;
    topPick: string;
  };
}

export interface CommentItem {
  id: string;
  authorName: string;
  skinType?: string;
  date: string;
  rating: number;
  content: string;
}
