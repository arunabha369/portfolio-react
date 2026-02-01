
import React from 'react';
import Link from '@/components/ui/Link';
import { Youtube } from 'lucide-react';

const YoutuberCard = ({ youtuber }) => {
    return (
        <Link
            href={youtuber.href}
            target="_blank"
            className="group flex flex-col gap-3 p-0 no-underline"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                {/* Channel Avatar */}
                <img
                    src={youtuber.image}
                    alt={youtuber.name}
                    className="h-full w-full object-cover rounded-full"
                />

                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px] rounded-full">
                    <Youtube className="size-8 text-white drop-shadow-md" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="font-semibold text-foreground leading-tight group-hover:text-red-600 transition-colors">
                    {youtuber.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {youtuber.description}
                </p>

                <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {youtuber.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default YoutuberCard;
