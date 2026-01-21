import { Book, FilmStrip, Laptop, Monitor, YoutubeLogo } from '@phosphor-icons/react/dist/ssr';

export const developmentItems = [{
  name: 'Gears Used',
  description: 'Productivity Tools, Gears i use to get my work done.',
  icon: Laptop,
  href: '/gears'
}, {
  name: 'VS Code / Cursor Setup',
  description: 'VS Code / Cursor Setup i use daily.',
  icon: Monitor,
  href: '/setup'
}];

export const personalItems = [{
  name: 'Books',
  description: 'Books that have influenced my thinking and growth.',
  icon: Book,
  href: '/books'
}, {
  name: 'Movies',
  description: 'Movies and shows that have inspired and entertained me.',
  icon: FilmStrip,
  href: '/movies'
}, {
  name: 'Favorite Youtubers',
  description: 'Designers and engineers I admire and learn from.',
  icon: YoutubeLogo,
  href: '/youtubers'
}];