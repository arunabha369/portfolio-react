import Container from '@/components/common/Container';
import About from '@/components/landing/About';
import Blog from '@/components/landing/Blog';
import CTA from '@/components/landing/CTA';
import Github from '@/components/landing/Github';
import Hero from '@/components/landing/Hero';
import Journey from '@/components/landing/Journey';
import Work from '@/components/landing/Projects';

import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function page() {
  return <Container className="min-h-screen py-16">
    <Helmet>
      <title>Arunabha Banerjee | Full Stack Developer</title>
    </Helmet>
    <Hero />
    <Work />
    <About />
    <Github />
    <Blog />
    <CTA />
    <Journey />
  </Container>;
}