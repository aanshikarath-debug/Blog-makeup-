import { Article } from '../types';

export function updateMetaTags(article?: Article) {
  const origin = (import.meta.env.VITE_APP_URL as string) || window.location.origin;

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

    // Schema.org Article + FAQPage JSON-LD
    const faqEntities = article.faqs.map(faq => ({
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
        ...(faqEntities.length > 0 ? [{
          '@type': 'FAQPage',
          'mainEntity': faqEntities,
        }] : []),
      ],
    };

    updateJsonLd(jsonLdData);
  } else {
    // Reset to homepage SEO — Main Makeup Guide
    const defaultTitle = 'Velvet Glow – Complete Makeup Guide, Makeup Tips & Step-by-Step Tutorials';
    const defaultDesc = 'Your complete makeup guide featuring expert makeup tips and tricks, easy makeup tutorials for beginners, step-by-step guides, natural makeup looks, and everyday makeup routines.';
    const defaultKeywords = 'Makeup Guide, Makeup tips, Makeup tutorials, Makeup tips for beginners, Easy makeup tutorial, Step-by-step makeup guide, Natural makeup looks, Everyday makeup routine, Makeup tips and tricks, Complete makeup guide, Simple makeup looks';

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
