import { skills } from '@/config/Skills';
import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

export default function Skills() {
  return <Container className="mt-20">
    <SectionHeading subHeading="Tech" heading="Skills" />
    <ul className="mt-8 flex flex-wrap justify-start gap-2">
      {skills.map(({ name, icon, color, muted }) => {
        const Icon = icon;
        return <li key={name}>
        <span className="skill-inner-shadow inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:border-black/30 dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/35">
          <Icon aria-hidden className={`size-4 shrink-0 ${muted ? 'text-muted-foreground' : ''}`} style={color ? { color } : undefined} />
          {name}
        </span>
      </li>;
      })}
    </ul>
  </Container>;
}
