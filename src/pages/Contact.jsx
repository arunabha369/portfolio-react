import Container from '@/components/common/Container';
import ContactForm from '@/components/contact/ContactForm';
import { Separator } from '@/components/ui/separator';
import { contactConfig } from '@/config/Contact';
import { generateMetadata as getMetadata } from '@/config/Meta';
import React from 'react';
import { Helmet } from 'react-helmet-async';
export const metadata = {
  ...getMetadata('/contact'),
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
export default function ContactPage() {
  return <Container className="py-16">
    <Helmet>
      <title>Contact | Arunabha Banerjee</title>
    </Helmet>
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          {contactConfig.title}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {contactConfig.description}
        </p>
      </div>
      <Separator />

      {/* Contact Form */}
      <div className="mx-auto max-w-2xl">
        <ContactForm />
      </div>
    </div>
  </Container>;
}