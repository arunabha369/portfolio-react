import { Box, Braces, CodeXml, Database } from 'lucide-react';
import {
  SiCplusplus,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiRedis,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel
} from 'react-icons/si';

// No `color` = near-black brand mark that follows the theme; `muted` = generic glyph with no brand.
export const skills = [
  // Languages
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'C/C++', icon: SiCplusplus, color: '#00599C' },
  { name: 'SQL', icon: Database, muted: true },
  { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', icon: SiCss3, color: '#663399' },
  // Frontend
  { name: 'React.js', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Shadcn UI', icon: SiShadcnui },
  // Backend & databases
  { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Express.js', icon: SiExpress },
  { name: 'REST APIs', icon: Braces, muted: true },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Redis', icon: SiRedis, color: '#FF4438' },
  { name: 'Prisma', icon: SiPrisma },
  { name: 'Supabase', icon: SiSupabase, color: '#3FCF8E' },
  // Tools & platforms
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'GitHub', icon: SiGithub },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
  { name: 'VS Code', icon: CodeXml, muted: true },
  { name: 'Cursor', icon: Box },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Figma', icon: SiFigma, color: '#F24E1E' }
];
