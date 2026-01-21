import { heroConfig, skillComponents, socialLinks } from '@/config/Hero';
import { supabase } from '@/lib/supabase';
import { parseTemplate } from '@/lib/hero';
import { cn } from '@/lib/utils';
import Link from '@/components/ui/Link';
import Image from '@/components/ui/Image';
import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import Skill from '../common/Skill';
import CV from '../svgs/CV';
import Chat from '../svgs/Chat';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
const buttonIcons = {
  CV: CV,
  Chat: Chat
};
export default function Hero() {
  const {
    name,
    title,
    avatar,
    skills,
    description,
    buttons
  } = heroConfig;

  const [heroBg, setHeroBg] = useState(''); // Added state for hero background

  useEffect(() => {
    const fetchHeroBg = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('cover_image')
        .eq('is_published', true)
        .not('cover_image', 'is', null)
        .neq('cover_image', '')
        .neq('cover_image', '')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data?.cover_image) setHeroBg(data.cover_image);
    };
    fetchHeroBg();
  }, []);

  const renderDescription = () => {
    const parts = parseTemplate(description.template, skills);
    return parts.map(part => {
      if (part.type === 'skill' && 'skill' in part && part.skill) {
        const SkillComponent = skillComponents[part.skill.component];
        return <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
          <SkillComponent />
        </Skill>;
      } else if (part.type === 'bold' && 'text' in part) {
        return <b key={part.key} className="text-primary whitespace-pre-wrap">
          {part.text}
        </b>;
      } else if (part.type === 'text' && 'text' in part) {
        return <span key={part.key} className="whitespace-pre-wrap">
          {part.text}
        </span>;
      }
      return null;
    });
  };
  return <Container className="mx-auto max-w-5xl">
    {/* Image */}
    <Image src={avatar} alt="hero" width={100} height={100} className="size-24 rounded-full bg-black" />

    {/* Text Area */}
    <div className="mt-8 flex flex-col gap-2 items-center text-center sm:items-start sm:text-left">
      <h1 className="text-2xl font-bold whitespace-normal sm:whitespace-nowrap sm:text-3xl md:text-4xl">
        Hi, I&apos;m {name} — <span className="text-secondary">{title}</span>
      </h1>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-base whitespace-pre-wrap text-neutral-500 md:text-lg text-center sm:text-left sm:justify-start">
        {renderDescription()}
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-8 flex gap-4 justify-center sm:justify-start">
      {buttons.map((button, index) => {
        const IconComponent = buttonIcons[button.icon];
        return <Button key={index} variant={button.variant} className={cn(button.variant === 'outline' && 'inset-shadow-indigo-500', button.variant === 'default' && 'inset-shadow-indigo-500')}>
          {IconComponent && <IconComponent />}
          <Link href={button.href}>{button.text}</Link>
        </Button>;
      })}
    </div>

    {/* Social Links */}
    <div className="mt-8 flex gap-2 justify-center sm:justify-start">
      {socialLinks.map(link => <Tooltip key={link.name} delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href={link.href} key={link.name} className="text-secondary flex items-center gap-2" target="_blank" rel="noopener noreferrer">
            <span className="size-6">{link.icon}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{link.name}</p>
        </TooltipContent>
      </Tooltip>)}
    </div>
  </Container>;
}