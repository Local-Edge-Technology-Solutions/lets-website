import { Mail, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-foreground">Local Edge</span>{' '}
              <span className="text-primary">Solutions</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              AI-powered business transformation for small businesses. Enterprise technology, small business affordability.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button
                  onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-solutions"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-faq"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@localedgesolutions.ai"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail className="w-5 h-5" />
                <span>hello@localedgesolutions.ai</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
                <span>Follow us on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} Local Edge Technology Solutions, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
