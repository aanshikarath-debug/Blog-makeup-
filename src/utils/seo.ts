import { Article, Category } from '../types';

interface PageSeoOptions {
  article?: Article | null;
  category?: Category;
  view?: 'home' | 'quiz' | 'saved';
}

export function updateMetaTags(options?: PageSeoOptions | Article | null) {
  const origin = (import.meta.env.VITE_APP_URL as string) || window.location.origin;

  // Handle direct Article passed for backwards compatibility
  let article: Article | null | undefined = null;
  let category: Category | undefined = undefined;
  let view: 'home' | 'quiz' | 'saved' | undefined = undefined;

  if (options) {
    if ('slug' in options && 'title' in options) {
      article = options as Article;
    } else {
      const opts = options as PageSeoOptions;
      article = opts.article;
      category = opts.category;
      view = opts.view;
    }
  }

  // 1. Article View
  if (article) {
    document.title = article.metaTitle;

    const keywordsContent = article.keywords?.length
      ? article.keywords.join(', ')
      : article.tags?.join(', ') || '';

    setMetaTag('name', 'description', article.metaDescription);
    if (keywordsContent) {
      setMetaTag('name', 'keywords', keywordsContent);
    }
    setMetaTag('property', 'og:title', article.metaTitle);
    setMetaTag('property', 'og:description', article.metaDescription);
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'og:url', `${origin}/${article.slug}`);
    setMetaTag('property', 'og:image', article.heroImage);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', article.metaTitle);
    setMetaTag('name', 'twitter:description', article.metaDescription);
    setMetaTag('name', 'twitter:image', article.heroImage);

    // Update canonical link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${origin}/${article.slug}`;

    // Schema.org Article + FAQPage JSON-LD for GEO / AEO
    const faqEntities = (article.faqs || []).map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    }));

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          'headline': article.metaTitle || article.title,
          'name': article.title,
          'description': article.metaDescription,
          'keywords': keywordsContent,
          'image': [article.heroImage],
          'datePublished': article.publishedAt,
          'dateModified': article.updatedAt,
          'author': {
            '@type': 'Person',
            'name': article.author.name,
            'jobTitle': article.author.role,
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Velvet Glow',
            'logo': {
              '@type': 'ImageObject',
              'url': `${origin}/logo.png`,
            },
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${origin}/${article.slug}`,
          },
        },
        ...(faqEntities.length > 0
          ? [
              {
                '@type': 'FAQPage',
                'mainEntity': faqEntities,
              },
            ]
          : []),
      ],
    };

    updateJsonLd(jsonLdData);
    return;
  }

  // 2. Beauty Matcher Quiz Tab
  if (view === 'quiz') {
    const quizTitle = 'Foundation & Beauty Routine Matcher Quiz | Velvet Glow';
    const quizDesc = 'Take the 60-second Velvet Glow beauty matcher quiz. Get personalized foundation shade matches, skin-type routines, and expert cosmetic recommendations tailored to your complexion.';
    document.title = quizTitle;
    setMetaTag('name', 'description', quizDesc);
    setMetaTag('name', 'keywords', 'foundation matcher quiz, beauty quiz, shade finder, skin type routine, makeup routine quiz');
    setMetaTag('property', 'og:title', quizTitle);
    setMetaTag('property', 'og:description', quizDesc);
    setMetaTag('property', 'og:url', `${origin}/beauty-matcher-quiz`);
    return;
  }

  // 3. Saved Articles Tab
  if (view === 'saved') {
    const savedTitle = 'Your Saved Beauty Guides & Reading List | Velvet Glow';
    const savedDesc = 'Access your personal collection of saved makeup tutorials, foundation shade reviews, and step-by-step beauty guides on Velvet Glow.';
    document.title = savedTitle;
    setMetaTag('name', 'description', savedDesc);
    setMetaTag('property', 'og:title', savedTitle);
    setMetaTag('property', 'og:description', savedDesc);
    setMetaTag('property', 'og:url', `${origin}/saved-articles`);
    return;
  }

  // 4. Category Tab
  if (category && category !== 'All') {
    const catTitle = `${category}: Makeup Guides, Tips & Reviews | Velvet Glow`;
    const catDesc = `Explore our expert editorial curation of ${category.toLowerCase()}. Master step-by-step techniques, discover dermatologist-approved formulations, and achieve radiant skin.`;
    document.title = catTitle;
    setMetaTag('name', 'description', catDesc);
    setMetaTag('property', 'og:title', catTitle);
    setMetaTag('property', 'og:description', catDesc);
    return;
  }

  // 5. Default Homepage SEO — Main Makeup Guide
  const defaultTitle = 'Velvet Glow – Complete Makeup Guide, Makeup Tips & Step-by-Step Tutorials';
  const defaultDesc =
    'Your complete makeup guide featuring expert makeup tips and tricks, easy makeup tutorials for beginners, step-by-step guides, natural makeup looks, and simple everyday makeup routines. Discover pro foundation shade matching, long-lasting lipstick application secrets, and honest cosmetic reviews tested for all skin types and undertones.';
  const defaultKeywords =
    'Makeup Guide, Makeup tips, Makeup tutorials, Makeup tips for beginners, Easy makeup tutorial, Step-by-step makeup guide, Natural makeup looks, Everyday makeup routine, Makeup tips and tricks, Complete makeup guide, Simple makeup looks';

  document.title = defaultTitle;
  setMetaTag('name', 'description', defaultDesc);
  setMetaTag('name', 'keywords', defaultKeywords);
  setMetaTag('property', 'og:title', defaultTitle);
  setMetaTag('property', 'og:description', defaultDesc);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:url', origin);

  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', defaultTitle);
  setMetaTag('name', 'twitter:description', defaultDesc);

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) {
    canonical.href = origin;
  }

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Velvet Glow',
    'headline': 'Velvet Glow – Complete Makeup Guide',
    'description': defaultDesc,
    'keywords': defaultKeywords,
    'url': origin,
  };
  updateJsonLd(homeJsonLd);
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateJsonLd(data: object) {
  const existingScript = document.getElementById('dynamic-json-ld');
  if (existingScript) {
    existingScript.textContent = JSON.stringify(data);
  } else {
    const script = document.createElement('script');
    script.id = 'dynamic-json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
