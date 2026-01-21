import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Send, User, Trash2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const CommentSection = ({ blogId }) => {
    const [session, setSession] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check Auth Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // 2. Fetch Comments
        const fetchComments = async () => {
            if (!blogId) return;

            const { data, error } = await supabase
                .from('blog_comments')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles ( full_name, avatar_url )
                `)
                .eq('blog_id', blogId)
                .order('created_at', { ascending: false });

            if (!error) {
                setComments(data || []);
            }
            setLoading(false);
        };

        fetchComments();

        return () => subscription.unsubscribe();
    }, [blogId]);

    const handleLogin = async () => {
        // Store current path to return after login
        localStorage.setItem('return_to', window.location.pathname);

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}${window.location.pathname}`
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !session) return;

        const { error } = await supabase
            .from('blog_comments')
            .insert({
                blog_id: blogId,
                user_id: session.user.id,
                content: newComment.trim()
            });

        if (!error) {
            setNewComment('');
            // Refetch to update list
            const { data } = await supabase
                .from('blog_comments')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles ( full_name, avatar_url )
                `)
                .eq('blog_id', blogId)
                .order('created_at', { ascending: false });

            setComments(data || []);
        } else {
            console.error(error);
        }
    };

    // Helper to format "time ago"
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div id="comments-section" className="mt-8 max-w-3xl mx-auto">
            {/* Comment Logic Area */}
            {!session ? (
                // Sign In Prompt
                <div className="bg-card rounded-lg p-8 text-center border border-border shadow-sm mb-12">
                    <div className="mb-4 flex justify-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Join the conversation</h4>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Sign in to share your thoughts and connect with others.
                    </p>

                    <Button onClick={handleLogin} className="gap-2">
                        <LogIn className="w-4 h-4" /> Sign in with Google
                    </Button>
                </div>
            ) : (
                // Input Form
                <div className="mb-12">
                    <div className="flex gap-4">
                        <Avatar className="w-10 h-10 border border-border">
                            <AvatarImage src={session.user.user_metadata.avatar_url} />
                            <AvatarFallback>{session.user.user_metadata.full_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add to the discussion..."
                                className="w-full min-h-[100px] bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!newComment.trim()}
                                    className="gap-2"
                                >
                                    Post Comment <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <Avatar className="w-10 h-10 border border-border">
                                <AvatarImage src={comment.profiles?.avatar_url} />
                                <AvatarFallback>{comment.profiles?.full_name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">
                                            {comment.profiles?.full_name || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {timeAgo(comment.created_at)}
                                        </span>
                                    </div>

                                    {session && session.user.id === comment.user_id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                            onClick={async () => {
                                                if (confirm('Delete comment?')) {
                                                    await supabase.from('blog_comments').delete().eq('id', comment.id);
                                                    setComments(prev => prev.filter(c => c.id !== comment.id));
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>

                                <p className="text-sm leading-relaxed text-foreground/90">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
