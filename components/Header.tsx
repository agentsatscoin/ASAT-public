'use client';

import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Why', href: '#why' },
    { label: 'What', href: '#what' },
    { label: 'Registry', href: '#registry' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${
        scrolled ? 'border-white/10 bg-[#050816]' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-white"
        >
          <img src="/logos/asat-agent-glyph.svg" alt="ASAT" className="h-8 w-8" />
          <div>
            <div className="text-sm font-semibold tracking-[0.2em]">ASAT</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#8FA3BC]">Reserve Protocol</div>
          </div>
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#8FA3BC] transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/agentsatscoin/ASAT"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#8FA3BC] transition hover:text-white"
          >
            GitHub
          </a>
          <a
            href="#registry"
            onClick={(e) => handleNavClick(e, '#registry')}
            className="btn-secondary hidden sm:inline-flex"
          >
            Register
          </a>
        </div>
      </div>
    </header>
  );
}
