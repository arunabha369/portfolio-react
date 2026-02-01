
import React from 'react';
import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';
import { youtubers } from '@/config/Youtubers';
import { Youtube } from 'lucide-react';
import YoutuberCard from '@/components/youtubers/YoutuberCard';
import { Helmet } from 'react-helmet-async';

export default function Youtubers() {
    return (
        <Container className="py-16">
            <Helmet>
                <title>Youtubers | Arunabha Banerjee</title>
            </Helmet>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Youtubers
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        Tech channels that keep me updated and inspired.
                    </p>
                </div>
                <Separator />

                {/* Youtubers Grid Section */}
                <div className="space-y-6 pt-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted flex items-center justify-center rounded-md border border-black/10 p-2 text-[#FF0000] dark:border-white/10">
                            <Youtube className="size-4" />
                        </div>
                        <h2 className="text-2xl font-semibold">Favorite Channels</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {youtubers.map((youtuber) => (
                            <YoutuberCard key={youtuber.name} youtuber={youtuber} />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
