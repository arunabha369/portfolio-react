import React from 'react';
import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import ChatBubble from '@/components/common/ChatBubble';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import OnekoCat from '@/components/common/OnekoCat';
import { Quote } from '@/components/common/Quote';
import { ThemeProvider } from '@/components/common/ThemeProviders';
import ReactLenis from 'lenis/react';

import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactLenis root options={{ duration: 0.5 }}>
        <div className="font-hanken-grotesk antialiased min-h-screen bg-background text-foreground">
          <Navbar />
          {children}
          <Toaster />
          <OnekoCat />
          <Quote />
          <Footer />
          <ChatBubble />
          <UmamiAnalytics />
        </div>
      </ReactLenis>
    </ThemeProvider>
  );
}