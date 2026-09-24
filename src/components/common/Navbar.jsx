import { navbarConfig } from '@/config/Navbar';
import Link from '@/components/ui/Link';
import React from 'react';
import Container from './Container';
import { ThemeToggleButton } from './ThemeSwitch';

export default function Navbar() {
  return (
    <Container className="sticky top-0 z-20 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="rounded-md border-2 border-foreground px-2 pt-0.5 pb-1 font-pixel text-2xl leading-none tracking-wide text-foreground uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {navbarConfig.wordmark}
          <span className="sr-only"> - home</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Main" className="flex items-center gap-4">
            {navbarConfig.navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-light underline-offset-[5px] hover:underline sm:text-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span aria-hidden className="h-4 w-px bg-border" />
          <ThemeToggleButton variant="circle" start="top-right" blur />
        </div>
      </div>
    </Container>
  );
}
