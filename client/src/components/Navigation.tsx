import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '#examples', label: 'Examples' },
  { href: '#how', label: 'How it works' },
  { href: '#about', label: 'About' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="wrap">
        <div className="site-header__bar">
          <a className="wordmark" href="/">
            <span className="wordmark__name">Local Edge</span>
            <span className="wordmark__sub">Technology Solutions</span>
          </a>

          <nav className="site-nav" aria-label="Main">
            <ul className="site-nav__links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <a className="button button--small" href="#contact">Tell us what you need</a>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </nav>
        </div>

        <div id="mobile-menu" className="mobile-menu" hidden={!open}>
          <ul>
            {[...links, { href: '#contact', label: 'Tell us what you need' }].map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
