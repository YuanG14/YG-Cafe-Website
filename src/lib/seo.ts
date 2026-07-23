import { useEffect } from 'react';

const SITE_NAME = 'Our Cafe Journal';

interface PageMetaOptions {
  title: string;
  description?: string;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Sets the document title and description/OG/Twitter meta tags for the
 * current route. Private app, so nothing here is about search visibility —
 * it's for link previews (e.g. when a shared link shows up in Messages)
 * and so multiple tabs are easy to tell apart.
 */
export function usePageMeta({ title, description }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} · ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('name', 'twitter:title', fullTitle);
  }, [title, description]);
}
