import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  slug?: string;
  category?: string;
  searchQuery?: string;
}

function parseLocation(): RouteState {
  const hash = window.location.hash;
  let fullPath = window.location.pathname;

  // Support both hash-based routing and pushState pathname routing
  if (hash && hash.startsWith('#/')) {
    fullPath = hash.replace('#', '');
  } else if (hash && hash.startsWith('#blog/')) {
    fullPath = '/' + hash.replace('#', '');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') || undefined;
  const searchParam = urlParams.get('q') || undefined;

  if (fullPath.startsWith('/blog/')) {
    const slug = fullPath.replace('/blog/', '').split('?')[0].split('#')[0];
    return {
      path: fullPath,
      slug: slug || undefined,
      category: categoryParam,
      searchQuery: searchParam,
    };
  }

  return {
    path: fullPath || '/',
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
    // If target is anchor on same page
    if (to.startsWith('#') && !to.startsWith('#/')) {
      const elementId = to.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setRoute(parseLocation());

    if (!options?.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return { route, navigate };
}
