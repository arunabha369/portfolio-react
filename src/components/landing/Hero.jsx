import { about } from '@/config/About';
import { heroConfig, socialLinks } from '@/config/Hero';
import Link from '@/components/ui/Link';
import { FileText, Mail, Send, Video } from 'lucide-react';
import React from 'react';
import Container from '../common/Container';
import MagneticButton from '../common/MagneticButton';
import TextCycle from '../common/TextCycle';
import InteractiveDots from './InteractiveDots';

const connectClass = 'skill-inner-shadow text-foreground inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-black/10 bg-black/[0.03] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:border-black/30 dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/35';

const internalLinks = [
  { name: 'Resume', href: '/resume', icon: <FileText /> },
  { name: 'Contact', href: '/contact', icon: <Send /> }
];

export default function Hero() {
  const { fullName, roles, avatar, email, callUrl } = heroConfig;

  return <Container>
    <InteractiveDots className="h-24 w-full border-b border-black/10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:h-32 dark:border-white/10" />

    <header className="flex items-start gap-4 pt-6 text-left sm:gap-5">
      <div className="w-fit shrink-0 rounded-[10px] border border-black/10 p-[3px] dark:border-white/15">
        <div className="size-20 overflow-hidden rounded-[7px] border border-black/10 bg-neutral-200 sm:size-24 dark:border-white/10 dark:bg-neutral-800">
          <img src={avatar} alt={`${fullName} portrait`} width={96} height={96} fetchPriority="high" className="size-full object-cover" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50">
          {fullName}
        </h1>
        <p className="flex min-h-7 items-center text-base font-medium text-neutral-500 md:text-lg dark:text-neutral-400">
          <TextCycle items={roles} />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <MagneticButton href={callUrl} label="Book a call" icon={<Video aria-hidden className="size-3.5 shrink-0 text-yellow-400 dark:text-yellow-600" />} />
          <MagneticButton href={`mailto:${email}`} label="Send an email" external={false} icon={<Mail aria-hidden className="size-3.5 shrink-0" />} />
        </div>
      </div>
    </header>

    <p className="mt-6 text-left text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
      {about.description}
    </p>

    <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {internalLinks.map(item => <li key={item.name} className="flex min-w-0">
        <Link href={item.href} className={connectClass}>
          <span aria-hidden className="size-3.5 shrink-0 [&>svg]:size-full">{item.icon}</span>
          <span className="truncate">{item.name}</span>
        </Link>
      </li>)}
      {socialLinks.map(item => <li key={item.name} className="flex min-w-0">
        <a href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className={connectClass}>
          <span aria-hidden className="size-3.5 shrink-0 [&>svg]:size-full">{item.icon}</span>
          <span className="truncate">{item.name}</span>
        </a>
      </li>)}
    </ul>
  </Container>;
}
