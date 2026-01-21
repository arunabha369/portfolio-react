import { about, mySkills } from '@/config/About';
import Image from '@/components/ui/Image';
import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
export default function About() {
  return <Container className="mt-20">
    <SectionHeading subHeading="About" heading="Me" />
    {/* About me */}
    <div className="mt-8 flex flex-col gap-4 md:flex-row">
      <Image src="/assets/new-logo.png" alt="About" width={100} height={100} className="border-secondary size-60 rounded-md border-2 bg-black" />
      <div className="mt-4 flex flex-col items-start text-left">
        <h3 className="text-2xl font-bold">{about.name}</h3>
        <p className="text-secondary mt-4">{about.description}</p>
        <p className="text-secondary mt-8 font-bold">Skills</p>
        <div className="flex flex-wrap gap-2 justify-start">
          {mySkills.map(skill => <Tooltip key={skill.key}>
            <TooltipTrigger asChild>
              <div className="mt-4 size-6 hover:cursor-pointer">
                {skill}
              </div>
            </TooltipTrigger>
            <TooltipContent>{skill.key}</TooltipContent>
          </Tooltip>)}
        </div>
      </div>
    </div>
  </Container>;
}