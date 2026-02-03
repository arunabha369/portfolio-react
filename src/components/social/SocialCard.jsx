
import React from 'react';
import Link from '@/components/ui/Link';
import { Instagram, Youtube, Linkedin, Github, Twitter, Terminal, Code, Brain, Facebook } from 'lucide-react';

const SocialCard = ({ social }) => {
    const isYoutube = social.type === 'youtube';
    const isTwitter = social.type === 'x';
    const isLinkedin = social.type === 'linkedin';
    const isGithub = social.type === 'github';
    const isCodolio = social.type === 'codolio';
    const isLeetcode = social.type === 'leetcode';
    const isGFG = social.type === 'geeksforgeeks';
    const isTUF = social.type === 'takeuforward';
    const isFacebook = social.type === 'facebook';

    // Styles based on platform
    let hoverBorderColor = 'group-hover:border-pink-300 dark:group-hover:border-pink-700'; // Default Instagram
    let hoverTextColor = 'group-hover:text-pink-600'; // Default Instagram
    let bgGradient = 'from-yellow-200 via-orange-300 to-pink-400 dark:from-yellow-900 dark:via-orange-800 dark:to-pink-900'; // Default Instagram

    if (isYoutube) {
        hoverBorderColor = 'group-hover:border-red-500/50 dark:group-hover:border-red-500/50';
        hoverTextColor = 'group-hover:text-red-600';
        bgGradient = 'from-red-500 via-red-600 to-red-700';
    } else if (isTwitter) {
        hoverBorderColor = 'group-hover:border-zinc-800 dark:group-hover:border-zinc-200';
        hoverTextColor = 'group-hover:text-black dark:group-hover:text-white';
        bgGradient = 'from-gray-700 via-gray-900 to-black';
    } else if (isLinkedin) {
        hoverBorderColor = 'group-hover:border-blue-500/50 dark:group-hover:border-blue-400/50';
        hoverTextColor = 'group-hover:text-blue-600';
        bgGradient = 'from-blue-400 via-blue-600 to-blue-800';
    } else if (isGithub) {
        hoverBorderColor = 'group-hover:border-gray-500/50 dark:group-hover:border-gray-400/50';
        hoverTextColor = 'group-hover:text-gray-900 dark:group-hover:text-gray-100';
        bgGradient = 'from-gray-600 via-gray-800 to-gray-900';
    } else if (isCodolio) {
        hoverBorderColor = 'group-hover:border-purple-500/50 dark:group-hover:border-purple-400/50';
        hoverTextColor = 'group-hover:text-purple-600';
        bgGradient = 'from-indigo-500 via-purple-500 to-pink-500';
    } else if (isLeetcode) {
        hoverBorderColor = 'group-hover:border-yellow-500/50 dark:group-hover:border-yellow-400/50';
        hoverTextColor = 'group-hover:text-yellow-600';
        bgGradient = 'from-yellow-400 via-orange-500 to-orange-600';
    } else if (isGFG) {
        hoverBorderColor = 'group-hover:border-green-500/50 dark:group-hover:border-green-400/50';
        hoverTextColor = 'group-hover:text-green-600';
        bgGradient = 'from-green-400 via-green-600 to-green-800';
    } else if (isTUF) {
        hoverBorderColor = 'group-hover:border-red-600/50 dark:group-hover:border-red-500/50';
        hoverTextColor = 'group-hover:text-red-700';
        bgGradient = 'from-red-600 via-red-700 to-black';
    } else if (isFacebook) {
        hoverBorderColor = 'group-hover:border-blue-600/50 dark:group-hover:border-blue-500/50';
        hoverTextColor = 'group-hover:text-blue-700';
        bgGradient = 'from-blue-600 via-blue-700 to-blue-900';
    }

    const renderIcon = () => {
        if (isYoutube) return <Youtube className="size-8 text-white drop-shadow-md" />;
        if (isTwitter) return <Twitter className="size-8 text-white drop-shadow-md" />; // Lucide usually has Twitter
        if (isLinkedin) return <Linkedin className="size-8 text-white drop-shadow-md" />;
        if (isGithub) return <Github className="size-8 text-white drop-shadow-md" />;
        if (isCodolio) return <Terminal className="size-8 text-white drop-shadow-md" />;
        if (isLeetcode) return <Code className="size-8 text-white drop-shadow-md" />;
        if (isGFG) return <Terminal className="size-8 text-white drop-shadow-md" />;
        if (isTUF) return <Brain className="size-8 text-white drop-shadow-md" />;
        if (isFacebook) return <Facebook className="size-8 text-white drop-shadow-md" />;
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
                {social.image ? (
                    <img
                        src={social.image}
                        alt={social.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${bgGradient}`}>
                        <span className="text-4xl font-bold text-white opacity-80 mix-blend-overlay">
                            {social.name.charAt(0)}
                        </span>
                    </div>
                )}

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
