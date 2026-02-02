
import React from 'react';
import Link from '@/components/ui/Link';
import { Instagram, Youtube } from 'lucide-react';

const SocialCard = ({ social }) => {
    const isYoutube = social.type === 'youtube';

    // Styles based on platform
    const hoverBorderColor = isYoutube
        ? 'group-hover:border-red-500/50 dark:group-hover:border-red-500/50'
        : 'group-hover:border-pink-300 dark:group-hover:border-pink-700';

    const hoverTextColor = isYoutube
        ? 'group-hover:text-red-600'
        : 'group-hover:text-pink-600';

    const bgGradient = isYoutube
        ? 'from-red-500 via-red-600 to-red-700'
        : 'from-yellow-200 via-orange-300 to-pink-400 dark:from-yellow-900 dark:via-orange-800 dark:to-pink-900';

    const renderIcon = () => {
        if (isYoutube) {
            return <Youtube className="size-8 text-white drop-shadow-md" />;
        }
        return <Instagram className="size-8 text-white drop-shadow-md" />;
    };

    return (
        <Link
            href={social.href}
            target="_blank"
            className="group flex flex-col gap-3 p-0 no-underline"
        >
            <div className={`relative aspect-square w-full overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${hoverBorderColor}`}>
                {/* Fallback pattern or Initial */}
                <div className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${bgGradient}`}>
                    <span className="text-4xl font-bold text-white opacity-80 mix-blend-overlay">
                        {social.name.charAt(0)}
                    </span>
                </div>

                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px] rounded-full">
                    {renderIcon()}
                </div>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className={`font-semibold text-foreground leading-tight transition-colors ${hoverTextColor}`}>
                    {social.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {social.description}
                </p>

                <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {social.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default SocialCard;
