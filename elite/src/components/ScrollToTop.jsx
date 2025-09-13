import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    const scrollToTop = () => {
      // First try with smooth scrolling
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      // Fallback: Force scroll to top after a short delay
      setTimeout(() => {
        window.scrollTo(0, 0);

        // Additional fallback for cases where smooth scroll doesn't work
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    };

    // Small delay to ensure content is rendered before scrolling
    const timeoutId = setTimeout(scrollToTop, 10);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
