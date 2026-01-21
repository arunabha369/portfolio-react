import { BlogComponents } from '@/components/blog/BlogComponents';
import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
// import { generateMetadata as getMetadata } from '@/config/Meta'; 
import JourneyContent from '@/data/journey/journey.mdx';
import React from 'react';

// Metadata export is not supported in Vite this way, disabling it for now or needs to be handled via react-helmet-async
/*
export const metadata = {
  ...getMetadata('/journey'),
  robots: {
    index: true,
    follow: true
  }
};
*/

export default function JourneyPage() {
  // Using direct import, data is always present if the file exists.
  // If we needed to handle missing file, we'd need a different build-time check or error boundary.

  return (
    <Container className="py-16">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Journey
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            A timeline of my learning, projects, and milestones.
          </p>
        </div>
        <Separator />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <JourneyContent components={BlogComponents} />
        </div>
      </div>
    </Container>
  );
}