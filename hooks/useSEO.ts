import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export const useSEO = ({ title, description, image, type = 'website' }: SEOProps) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | HowToTechly`;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:')) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description);
    }
    
    updateMeta('og:title', title);
    updateMeta('og:type', type);
    
    if (image) {
      updateMeta('og:image', image);
    }

    // Cleanup not strictly necessary for single page transitions unless we want to reset
  }, [title, description, image, type]);
};