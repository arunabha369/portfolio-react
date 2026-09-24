import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';
import X from '@/components/svgs/X';
import YouTube from '@/components/svgs/YouTube';
import Instagram from '@/components/svgs/Instagram';

export const heroConfig = {
  // Personal Information
  name: 'Aru',
  fullName: 'Arunabha Banerjee',
  title: 'A Full Stack web developer.',
  // Cycled under the name in the hero.
  roles: ['Full Stack Web Developer', 'React & Node.js Developer', 'Clean UI, Seamless UX'],
  avatar: '/assets/new-logo.png',
  email: 'arunabhabanerjee5@gmail.com',
  callUrl: 'https://cal.com/arunabha-banerjee-1wlqgk',
  // Skills Configuration
  skills: [{
    name: 'JavaScript',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    component: 'JavaScript'
  }, {
    name: 'React',
    href: 'https://react.dev/',
    component: 'ReactIcon'
  }, {
    name: 'Express',
    href: 'https://expressjs.com/',
    component: 'ExpressJs'
  }, {
    name: 'TailwindCSS',
    href: 'https://tailwindcss.com/',
    component: 'TailwindCss'
  }, {
    name: 'MongoDB',
    href: 'https://www.mongodb.com/',
    component: 'MongoDB'
  }]
};

// Social Links Configuration
export const socialLinks = [{
  name: 'X',
  href: 'https://x.com/arunabha369',
  icon: <X />
}, {
  name: 'LinkedIn',
  href: 'https://www.linkedin.com/in/arunabha369/',
  icon: <LinkedIn />
}, {
  name: 'GitHub',
  href: 'https://github.com/arunabha369',
  icon: <Github />
}, {
  name: 'Instagram',
  href: 'https://www.instagram.com/arunabha_369',
  icon: <Instagram />
}, {
  name: 'YouTube',
  href: 'https://www.youtube.com/@arunabha369',
  icon: <YouTube />
}, {
  name: 'Email',
  href: 'mailto:arunabhabanerjee5@gmail.com',
  icon: <Mail />
}];