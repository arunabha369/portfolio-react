
import React from 'react';
import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { socialPresence } from '@/config/SocialPresence';
import { Instagram } from 'lucide-react';
import SocialCard from '@/components/social/SocialCard';
import { Helmet } from 'react-helmet-async';

export default function SocialPresence() {
    return (
        <Container className="py-16">
            <Helmet>
                <title>Social Presence | Arunabha Banerjee</title>
            </Helmet>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Social Presence
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        Connect with me across my different Instagram pages.
                    </p>
                </div>
                <Separator />

                {/* Grid Section */}
                <div className="space-y-6 pt-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#E1306C] dark:border-white/10">
                            <Instagram className="size-4" />
                        </div>
                        <h2 className="text-2xl font-semibold">Instagram</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {socialPresence.map((social) => (
                            <SocialCard key={social.name} social={social} />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
