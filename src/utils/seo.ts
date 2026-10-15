import { Article } from '../types';

export function updateMetaTags(article?: Article) {
  const origin = window.location.origin;

  if (article) {
    document.title = article.metaTitle;

    setMetaTag('name', 'description', article.metaDescription);
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
          'headline': article.title,
          'description': article.metaDescription,
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
            'name': 'Velvet & Glow',
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
    // Reset to homepage SEO
    const defaultTitle = 'Velvet & Glow – Beauty & Makeup Journal';
    const defaultDesc = 'An editorial beauty destination featuring expert makeup guides, curated product reviews, beginner tutorials, and skincare advice.';

    document.title = defaultTitle;
    setMetaTag('name', 'description', defaultDesc);
    setMetaTag('property', 'og:title', defaultTitle);
    setMetaTag('property', 'og:description', defaultDesc);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', origin);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = origin;
    }

    const homeJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'Velvet & Glow',
      'description': defaultDesc,
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
