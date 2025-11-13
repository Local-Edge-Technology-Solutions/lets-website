import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div 
            className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover-elevate transition-transform hover:scale-105"
            onClick={() => scrollToSection('hero')}
            data-testid="link-logo"
          >
            <span className="text-foreground">Local Edge</span>
            <span className="text-primary text-gradient">Solutions</span>
          </div>

          <ul className="hidden md:flex gap-10 items-center">
            <li>
              <button
                onClick={() => scrollToSection('solutions')}
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                data-testid="link-solutions"
              >
                Solutions
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                data-testid="link-about"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                data-testid="link-faq"
              >
                FAQ
              </button>
            </li>
            <li>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="glow-primary"
                data-testid="button-nav-contact"
              >
                Get Started
              </Button>
            </li>
          </ul>

          <button
            className="md:hidden z-[102] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-full h-screen bg-background z-[99] md:hidden flex flex-col justify-center items-center gap-8 transition-transform duration-400 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => scrollToSection('solutions')}
          className="text-4xl font-bold text-foreground"
          data-testid="link-mobile-solutions"
        >
          Solutions
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className="text-4xl font-bold text-foreground"
          data-testid="link-mobile-about"
        >
          About
        </button>
        <button
          onClick={() => scrollToSection('faq')}
          className="text-4xl font-bold text-foreground"
          data-testid="link-mobile-faq"
        >
          FAQ
        </button>
        <Button
          onClick={() => scrollToSection('contact')}
          size="lg"
          className="text-2xl px-8 py-6"
          data-testid="button-mobile-contact"
        >
          Get Started
        </Button>
      </div>
    </>
  );
}
