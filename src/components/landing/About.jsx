import { about } from '@/config/About';
import Image from '@/components/ui/Image';
import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
export default function About() {
  return <Container className="mt-20">
    <SectionHeading subHeading="About" heading="Me" />
    {/* About me */}
    <div className="mt-8 flex flex-col gap-4 md:flex-row">
      <Image src="/assets/new-logo.png" alt="About" width={100} height={100} className="border-secondary size-60 rounded-md border-2 bg-black" />
      <div className="mt-4 flex flex-col items-start text-left">
        <h3 className="text-2xl font-bold">{about.name}</h3>
        <p className="text-secondary mt-4">{about.description}</p>
      </div>
    </div>
  </Container>;
}