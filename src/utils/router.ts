import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  slug?: string;
  category?: string;
  searchQuery?: string;
}

function parseLocation(): RouteState {
  const hash = window.location.hash;
  let rawPath = window.location.pathname;

  // Support both hash-based fallback routing and pushState pathname routing
  if (hash) {
    if (hash.startsWith('#/')) {
      rawPath = hash.replace('#', '');
    } else if (hash.startsWith('#')) {
      rawPath = '/' + hash.replace('#', '');
    }
  }

  // Clean path: remove query parameters and trailing slashes
  const cleanPath = rawPath.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') || undefined;
  const searchParam = urlParams.get('q') || undefined;

  // Extract slug from path:
  // e.g. /beginners -> "beginners"
  // e.g. /blog/beginners -> "beginners"
  // e.g. /b/beginners -> "beginners"
  // e.g. / -> undefined
  let candidateSlug: string | undefined = undefined;

  if (cleanPath.startsWith('/blog/')) {
    candidateSlug = cleanPath.replace('/blog/', '').trim();
  } else if (cleanPath.startsWith('/b/')) {
    candidateSlug = cleanPath.replace('/b/', '').trim();
  } else if (cleanPath.length > 1 && !cleanPath.includes('.')) {
    // Direct short clean root slug e.g. /beginners
    candidateSlug = cleanPath.substring(1).trim();
  }

  return {
    path: cleanPath,
    slug: candidateSlug || undefined,
    category: categoryParam,
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
    // If target is an on-page anchor
    if (to.startsWith('#') && !to.startsWith('#/')) {
      const elementId = to.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Format clean URL path:
    // If given e.g. "beginners" -> "/beginners"
    // If given e.g. "/blog/beginners" -> normalize to "/beginners"
    let targetPath = to;
    if (!targetPath.startsWith('/') && !targetPath.startsWith('#')) {
      targetPath = '/' + targetPath;
    }

    // Shorten /blog/:slug to /:slug for clean, short presentation
    if (targetPath.startsWith('/blog/')) {
      targetPath = targetPath.replace('/blog/', '/');
    } else if (targetPath.startsWith('/b/')) {
      targetPath = targetPath.replace('/b/', '/');
    }

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
