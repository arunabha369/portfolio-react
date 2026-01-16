import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FaGoogle, FaPaperPlane, FaUserCircle, FaRegComment, FaTrash } from 'react-icons/fa';

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

        if (blogId) {
            fetchComments();
        }

        return () => subscription.unsubscribe();
    }, [blogId]);

    const handleLogin = async () => {
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
        <div className="mt-16 text-white max-w-2xl mx-auto">
            <h3 className="flex items-center gap-3 text-2xl font-bold mb-8">
                <FaRegComment /> Comments ({comments.length})
            </h3>

            {/* Comment Logic Area */}
            {!session ? (
                // Sign In Prompt
                <div className="bg-[#111] rounded-2xl p-8 py-12 text-center border border-zinc-800 shadow-xl">
                    <div className="mb-6 flex justify-center">
                        <FaUserCircle size={48} className="text-zinc-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-white">Sign in to comment</h4>
                    <p className="text-zinc-400 mb-8 max-w-sm mx-auto">Join the conversation by signing in with your Google account. It's quick and easy.</p>

                    <button
                        onClick={handleLogin}
                        className="bg-white text-black border-none px-6 py-3 rounded-xl text-base font-semibold cursor-pointer inline-flex items-center gap-3 hover:bg-zinc-200 transition-colors"
                    >
                        <FaGoogle /> Sign in with Google
                    </button>
                </div>
            ) : (
                // Input Form
                <div className="mb-12">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="flex gap-4 items-start">
                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                                <img
                                    src={session.user.user_metadata.avatar_url}
                                    alt={session.user.user_metadata.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add to the discussion..."
                                    className="w-full min-h-[100px] bg-[#111] border border-zinc-800 rounded-xl p-4 text-white text-base resize-y font-inherit focus:outline-none focus:border-zinc-600 transition-colors"
                                />
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="bg-white text-black border-none px-6 py-2 rounded-full font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                                    >
                                        Post <FaPaperPlane size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Comments List */}
            <div className="flex flex-col gap-8 mt-12">
                {comments.length === 0 && (
                    <div className="text-center text-zinc-600 py-8">
                        <FaRegComment size={32} className="mb-4 opacity-50 mx-auto" />
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                )}

                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 border-b border-zinc-800 pb-8 last:border-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                            {comment.profiles?.avatar_url ? (
                                <img
                                    src={comment.profiles.avatar_url}
                                    alt={comment.profiles.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                                    {comment.profiles?.full_name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-semibold text-white">
                                    {comment.profiles?.full_name || 'Anonymous'}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {timeAgo(comment.created_at)}
                                </span>
                            </div>
                            <p className="text-zinc-300 leading-relaxed text-[0.95rem]">
                                {comment.content}
                            </p>

                            <div className="mt-3 flex gap-4">
                                {session && session.user.id === comment.user_id && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Delete comment?')) {
                                                await supabase.from('blog_comments').delete().eq('id', comment.id);
                                                setComments(prev => prev.filter(c => c.id !== comment.id));
                                            }
                                        }}
                                        className="bg-transparent border-none text-red-500 text-xs cursor-pointer p-0 hover:text-red-400 flex items-center gap-1"
                                    >
                                        <FaTrash size={10} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
