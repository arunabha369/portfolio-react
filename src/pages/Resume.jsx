import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { resumeConfig } from '@/config/Resume';
import React from 'react';
import { Helmet } from 'react-helmet-async';
export const metadata = {
  ...getMetadata('/resume'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};
export default function ResumePage() {
  return <Container className="py-16">
    <Helmet>
      <title>Resume | Arunabha Banerjee</title>
    </Helmet>
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Resume
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          My resume.
        </p>
      </div>
      <Separator />
      <div className="mx-auto max-w-2xl">
        <iframe src={resumeConfig.url} className="min-h-screen w-full"></iframe>
      </div>
    </div>
  </Container>;
}