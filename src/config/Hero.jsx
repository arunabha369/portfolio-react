/*
 * CUSTOMIZATION EXAMPLE
 *
 * Want to customize this portfolio for yourself? Here's how easy it is:
 *
 * 1. Update your personal info:
 *    name: "Your Name"
 *    title: "Your Professional Title"
 *    avatar: "/path/to/your/image.jpg"
 *
 * 2. Add your skills:
 *    skills: [
 *      { name: "Python", href: "https://python.org", component: "Python" }, // Note: You'd need to create Python component
 *      { name: "React", href: "https://react.dev", component: "ReactIcon" },
 *      { name: "Node.js", href: "https://nodejs.org", component: "NodeJs" },
 *    ]
 *
 * 3. Write your description using the template:
 *    template: "I'm a **passionate developer** who loves building apps with {skills:0} and {skills:1}. I specialize in **web development** and enjoy working with {skills:2}."
 *
 * 4. Update your social links:
 *    Just change the href values to your own social media profiles
 *
 * That's it! Your portfolio will automatically update with your information.
 */
import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';
import X from '@/components/svgs/X';
import YouTube from '@/components/svgs/YouTube';
import Instagram from '@/components/svgs/Instagram';
import ExpressJs from '@/components/technologies/ExpressJs';
import JavaScript from '@/components/technologies/JavaScript';
import MongoDB from '@/components/technologies/MongoDB';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
// Technology Components
import TypeScript from '@/components/technologies/TypeScript';
import NodeJs from '@/components/technologies/NodeJs';
import NextJs from '@/components/technologies/NextJs';
import Bun from '@/components/technologies/Bun';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Prisma from '@/components/technologies/Prisma';


// Component mapping for skills
export const skillComponents = {
  TypeScript: TypeScript,
  ReactIcon: ReactIcon,
  NextJs: NextJs,
  Bun: Bun,
  PostgreSQL: PostgreSQL,
  NodeJs: NodeJs,
  MongoDB: MongoDB,
  Prisma: Prisma,
  JavaScript: JavaScript,
  ExpressJs: ExpressJs,
  TailwindCss: TailwindCss
};
export const heroConfig = {
  // Personal Information
  name: 'Aru',
  title: 'A Full Stack web developer.',
  avatar: '/assets/new-logo.png',
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
  }],
  // Description Configuration
  description: {
    template: 'I build interactive web apps using {skills:0}, {skills:1}, {skills:2}, {skills:3}, {skills:4} with a strong focus on clean <b>UI\u00A0design</b> and seamless user experience.'
  },
  // Buttons Configuration
  buttons: [{
    variant: 'outline',
    text: 'Resume / CV',
    href: '/resume',
    icon: 'CV'
  }, {
    variant: 'default',
    text: 'Get in touch',
    href: '/contact',
    icon: 'Chat'
  }]
};

// Social Links Configuration
export const socialLinks = [{
  name: 'X',
  href: 'https://x.com/arunabha_369',
  icon: <X />
}, {
  name: 'LinkedIn',
  href: 'https://www.linkedin.com/in/arunabha369/',
  icon: <LinkedIn />
}, {
  name: 'Github',
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