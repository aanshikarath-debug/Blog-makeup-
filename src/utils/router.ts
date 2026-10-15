import { useState, useEffect } from 'react';
import { Category } from '../types';

export const CATEGORY_SLUG_MAP: Record<string, Category> = {
  'beginner-guides': 'Beginner Guides',
  'complexion-and-base': 'Complexion & Base',
  'lips': 'Lips',
  'budget-beauty': 'Budget Beauty',
  'eyes-and-brows': 'Eyes & Brows',
  'blush-and-cheek': 'Blush & Cheek',
  'brand-reviews': 'Brand Reviews',
  'tutorials': 'Tutorials',
};

export const CATEGORY_TO_SLUG: Record<Category, string> = {
  'All': '',
  'Beginner Guides': 'beginner-guides',
  'Complexion & Base': 'complexion-and-base',
  'Lips': 'lips',
  'Budget Beauty': 'budget-beauty',
  'Eyes & Brows': 'eyes-and-brows',
  'Blush & Cheek': 'blush-and-cheek',
  'Brand Reviews': 'brand-reviews',
  'Tutorials': 'tutorials',
  'Skincare & Prep': 'skincare-and-prep',
};

export interface RouteState {
  path: string;
  slug?: string;
  category?: Category;
  view?: 'home' | 'quiz' | 'saved';
  searchQuery?: string;
}

export function parseLocation(): RouteState {
  const hash = window.location.hash;
  let rawPath = window.location.pathname;

  // Clean away any historical hash fragments to maintain clean URLs without '#'
  if (hash) {
    if (hash.startsWith('#/')) {
      rawPath = hash.replace('#', '');
    } else if (hash.startsWith('#') && !hash.includes('-section')) {
      rawPath = '/' + hash.replace('#', '');
    }
  }

  // Clean path: all lowercase, remove trailing slash and query params
  const cleanPath = (rawPath.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/').toLowerCase();

  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('q') || undefined;

  // 1. Dedicated Quiz tab
  if (cleanPath === '/beauty-matcher-quiz' || cleanPath === '/routine-matcher') {
    return {
      path: '/beauty-matcher-quiz',
      view: 'quiz',
      searchQuery: searchParam,
    };
  }

  // 2. Dedicated Saved articles tab
  if (cleanPath === '/saved-articles' || cleanPath === '/reading-list') {
    return {
      path: '/saved-articles',
      view: 'saved',
      searchQuery: searchParam,
    };
  }

  // 3. Category tab routes e.g. /category/beginner-guides
  if (cleanPath.startsWith('/category/')) {
    const catSlug = cleanPath.replace('/category/', '').trim();
    const mappedCategory = CATEGORY_SLUG_MAP[catSlug];
    return {
      path: cleanPath,
      category: mappedCategory || 'All',
      view: 'home',
      searchQuery: searchParam,
    };
  }

  // 4. Short clean root article slug e.g. /makeup-for-beginners or /beginners
  let candidateSlug: string | undefined = undefined;
  if (cleanPath.startsWith('/blog/')) {
    candidateSlug = cleanPath.replace('/blog/', '').trim();
  } else if (cleanPath.startsWith('/b/')) {
    candidateSlug = cleanPath.replace('/b/', '').trim();
  } else if (cleanPath.length > 1 && !cleanPath.includes('.')) {
    candidateSlug = cleanPath.substring(1).trim();
  }

  return {
    path: cleanPath,
    slug: candidateSlug,
    view: candidateSlug ? undefined : 'home',
    category: undefined,
    searchQuery: searchParam,
  };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(parseLocation);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string, options?: { replace?: boolean; preserveScroll?: boolean }) => {
    // If target is an on-page jump anchor inside an article
    if (to.startsWith('#') && !to.startsWith('#/')) {
      const elementId = to.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Format clean URL path: all lowercase, joined by hyphens, no '#' or random numbers
    let targetPath = to.toLowerCase().trim();
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    // Strip legacy /blog/ prefixes for clean short URL presentation
    if (targetPath.startsWith('/blog/')) {
      targetPath = targetPath.replace('/blog/', '/');
    }

    // Clean up double slashes
    targetPath = targetPath.replace(/\/+/g, '/');

    if (options?.replace) {
      window.history.replaceState({}, '', targetPath);
    } else {
      window.history.pushState({}, '', targetPath);
    }

    setRoute(parseLocation());

    if (!options?.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return { route, navigate };
}
