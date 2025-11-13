import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export default function StickyCtaButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={scrollToContact}
      size="lg"
      className={`fixed bottom-8 right-8 z-[99] glow-primary-lg shadow-2xl transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
      data-testid="button-sticky-cta"
    >
      Get Started
      <ArrowUp className="ml-2 w-4 h-4" />
    </Button>
  );
}
