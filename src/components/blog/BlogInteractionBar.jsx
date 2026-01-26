import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Heart, MessageSquare, Share2, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BlogInteractionBar = ({ blog, visitorId }) => {
    const [likes, setLikes] = useState(0);
    const [celebrates, setCelebrates] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);

    // User states
    const [hasLiked, setHasLiked] = useState(false);
    const [hasCelebrated, setHasCelebrated] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!blog?.id) return;

            // 1. Fetch Like Counts
            const { count: likeCount } = await supabase
                .from('blog_likes')
                .select('*', { count: 'exact', head: true })
                .eq('blog_id', blog.id)
                .eq('reaction_type', 'like');

            // 2. Fetch Celebrate Counts
            const { count: celebrateCount } = await supabase
                .from('blog_likes')
                .select('*', { count: 'exact', head: true })
                .eq('blog_id', blog.id)
                .eq('reaction_type', 'celebrate');

            // 3. Fetch Comment Counts
            const { count: commentCount } = await supabase
                .from('blog_comments')
                .select('*', { count: 'exact', head: true })
                .eq('blog_id', blog.id);

            setLikes(likeCount || 0);
            setCelebrates(celebrateCount || 0);
            setCommentsCount(commentCount || 0);

            // 4. Check User Reactions
            if (visitorId) {
                const { data: reactions } = await supabase
                    .from('blog_likes')
                    .select('reaction_type')
                    .eq('blog_id', blog.id)
                    .eq('visitor_id', visitorId);

                if (reactions) {
                    reactions.forEach(r => {
                        if (r.reaction_type === 'like') setHasLiked(true);
                        if (r.reaction_type === 'celebrate') setHasCelebrated(true);
                    });
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [blog?.id, visitorId]);

    const handleReaction = async (type, e) => {
        if (!visitorId) return;

        const isLike = type === 'like';
        const hasReacted = isLike ? hasLiked : hasCelebrated;
        const setReacted = isLike ? setHasLiked : setHasCelebrated;
        const setCount = isLike ? setLikes : setCelebrates;

        // ANIMATION LOGIC
        if (!hasReacted) {
            if (type === 'celebrate') {
                // Trigger Confetti
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { x, y },
                    colors: ['#eab308', '#ca8a04', '#fde047'], // Gold/Yellow shades
                    disableForReducedMotion: true
                });
            } else if (type === 'like') {
                // Trigger Red Confetti for Heart
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { x, y },
                    colors: ['#ef4444', '#dc2626', '#b91c1c'], // Red shades
                    disableForReducedMotion: true
                });
            }
        }

        // Optimistic Update
        setReacted(!hasReacted);
        setCount(prev => hasReacted ? prev - 1 : prev + 1);

        try {
            if (hasReacted) {
                // Remove reaction
                await supabase
                    .from('blog_likes')
                    .delete()
                    .eq('blog_id', blog.id)
                    .eq('visitor_id', visitorId)
                    .eq('reaction_type', type);
            } else {
                // Add reaction
                await supabase
                    .from('blog_likes')
                    .insert({
                        blog_id: blog.id,
                        visitor_id: visitorId,
                        reaction_type: type
                    });
            }
        } catch (error) {
            console.error('Error updating reaction:', error);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.description,
                    url: url,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(url);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const scrollToComments = () => {
        document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 border-y border-zinc-800 my-8 gap-4 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-14 right-0 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium shadow-lg pointer-events-none z-10"
                    >
                        Link copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left: Date */}
            <div className="text-muted-foreground text-sm font-medium">
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            {/* Right: Actions */}
            <div className="flex gap-2">
                {/* Like */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleReaction('like', e)}
                    className={cn(
                        "rounded-full gap-2 transition-all duration-300",
                        hasLiked && "border-red-500/50 bg-red-500/10 text-red-500 hover:text-red-500 hover:bg-red-500/20"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {hasLiked ? (
                            <motion.div
                                key="liked"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                            >
                                <Heart className="fill-current w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Heart className="w-4 h-4" />
                        )}
                    </AnimatePresence>
                    <span>{likes}</span>
                </Button>

                {/* Celebrate */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleReaction('celebrate', e)}
                    className={cn(
                        "rounded-full gap-2 transition-all duration-300",
                        hasCelebrated && "border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:text-yellow-500 hover:bg-yellow-500/20"
                    )}
                >
                    <PartyPopper className={cn("w-4 h-4", hasCelebrated && "fill-current")} />
                    <span>{celebrates}</span>
                </Button>

                {/* Comment */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToComments}
                    className="rounded-full gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>{commentsCount}</span>
                </Button>

                {/* Share */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="rounded-full gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                </Button>
            </div>
        </div>
    );
};

export default BlogInteractionBar;
