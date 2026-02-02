
import React from 'react';
import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { instagramLinks, youtubeLinks, developerLinks } from '@/config/SocialPresence';
import { Instagram, Youtube, Code, Users } from 'lucide-react';
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
                        Connect with me across my different social islands.
                    </p>
                </div>
                <Separator />

                <div className="space-y-16 pt-10">
                    {/* Developer Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-primary dark:border-white/10">
                                <Code className="size-4" />
                            </div>
                            <h2 className="text-2xl font-semibold">Professional & Coding Profiles</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {developerLinks.map((social) => (
                                <SocialCard key={social.name} social={social} />
                            ))}
                        </div>
                    </div>

                    {/* YouTube Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#FF0000] dark:border-white/10">
                                <Youtube className="size-4" />
                            </div>
                            <h2 className="text-2xl font-semibold">YouTube</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {youtubeLinks.map((social) => (
                                <SocialCard key={social.name} social={social} />
                            ))}
                        </div>
                    </div>

                    {/* Instagram Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#E1306C] dark:border-white/10">
                                <Users className="size-4" />
                            </div>
                            <h2 className="text-2xl font-semibold">Socials</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {instagramLinks.map((social) => (
                                <SocialCard key={social.name} social={social} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
