import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import Container from '../components/common/Container';
import BlogInteractionBar from '../components/blog/BlogInteractionBar';
import CommentSection from '../components/blog/CommentSection';
// UI Components
// Note: Assuming these exist based on user's project structure scan
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    // Visitor ID logic
    const [visitorId, setVisitorId] = useState(null);
    useEffect(() => {
        let vid = localStorage.getItem('visitor_id');
        if (!vid) {
            vid = crypto.randomUUID();
            localStorage.setItem('visitor_id', vid);
        }
        setVisitorId(vid);
    }, []);

    useEffect(() => {
        const fetchBlogAndSections = async () => {
            try {
                // 1. Fetch Blog by Slug
                const { data: blogData, error: blogError } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (blogError) throw blogError;
                setBlog(blogData);

                // 2. Fetch Sections
                if (blogData) {
                    const { data: sectionsData, error: sectionsError } = await supabase
                        .from('blog_sections')
                        .select('*')
                        .eq('blog_id', blogData.id)
                        .order('order', { ascending: true });

                    if (sectionsError) throw sectionsError;
                    setSections(sectionsData || []);
                }
            } catch (error) {
                console.error('Error fetching blog details:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogAndSections();
        window.scrollTo(0, 0);
    }, [slug]);

    // --- SCROLL HELPERS for Timeline ---
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const scrollTimeline = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // --- MARKDOWN STYLES ---
    const markdownComponents = {
        h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-extrabold mt-10 mb-5 text-zinc-100 tracking-tight scroll-m-20" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-zinc-100 tracking-tight scroll-m-20" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-bold mt-8 mb-3 text-zinc-100 tracking-tight" {...props} />,
        p: ({ node, ...props }) => <p className="leading-7 text-base text-zinc-300 mb-5" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-5 space-y-2 text-zinc-400 text-base" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-5 space-y-2 text-zinc-400 text-base" {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
                return <code className="bg-zinc-800/50 px-1.5 py-0.5 rounded text-sm font-mono text-accent font-semibold border border-zinc-700/50" {...props}>{children}</code>
            }
            return (
                <div className="relative my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0d1117]">
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-zinc-800/10">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <div className="ml-auto text-xs text-zinc-500 font-mono flex items-center gap-1">
                            <Terminal className="w-3 h-3" /> Source
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <code className={`${className} text-sm font-mono leading-relaxed text-gray-300`} {...props}>
                            {children}
                        </code>
                    </div>
                </div>
            );
        },
        a: ({ node, ...props }) => (
            <a className="text-accent font-medium underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all" target="_blank" rel="noopener noreferrer" {...props} />
        ),
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                    <p className="text-zinc-500 font-medium">Loading Article...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4 text-zinc-400">
                <h2 className="text-xl">Blog not found</h2>
                <Link to="/blog" className="text-accent underline">Back to Blogs</Link>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen w-full flex flex-col selection:bg-accent/20 selection:text-accent font-sans">

            {/* Header / Navbar Replacement */}
            {/* Keeping it simple or relying on Layout. Adding 'Back' button for UX */}
            <div className="fixed top-6 left-6 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/50 backdrop-blur border border-zinc-800 text-zinc-400 hover:text-white"
                    onClick={() => navigate('/blog')}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* --- MAIN CONTAINER --- */}
            <div className="max-w-3xl mx-auto w-full px-6 py-20 relative">

                <article className="w-full animate-in fade-in duration-700 slide-in-from-bottom-8">

                    {/* Header */}
                    <header className="mb-12 text-center space-y-6 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-accent/20 blur-[100px] rounded-full -z-10 opacity-40" />

                        {/* Tags / Category */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 text-xs font-semibold text-accent border border-accent/20 backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                {blog.tags[0]}
                            </div>
                        )}

                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
                            {blog.title}
                        </h1>

                        {/* Author & Meta Data */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-zinc-500 pt-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-zinc-800">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>KK</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-zinc-200">Author</p>
                                    <p className="text-[10px] md:text-xs">@portfolio</p>
                                </div>
                            </div>

                            <div className="hidden md:block w-px h-8 bg-zinc-800" />

                            <div className="flex flex-wrap justify-center items-center gap-4 text-xs md:text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                                    <span className="whitespace-nowrap">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                                    <span className="whitespace-nowrap">5 min read</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12 opacity-50" />

                    {/* Sections */}
                    <div className="flex flex-col space-y-16">
                        {sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={`section-${index}`}
                                className="group"
                            >
                                {section.heading && (
                                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-6">
                                        {section.heading}
                                    </h2>
                                )}

                                {/* Main Content (Markdown) */}
                                {section.content && (
                                    <div className="prose prose-invert max-w-none ml-0 md:ml-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {section.content}
                                        </ReactMarkdown>
                                    </div>
                                )}

                                {/* Images */}
                                {section.image && section.image.length > 0 && (
                                    <div className={`mt-8 ml-0 md:ml-4 grid gap-4 ${section.image.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                                        {section.image.map((imgUrl, imgIndex) => (
                                            <div key={imgIndex} className="relative rounded-xl overflow-hidden border border-zinc-800/40 shadow-lg bg-zinc-900/20 group/image">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Section Visual ${imgIndex + 1}`}
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover/image:scale-[1.02]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Explicit Code Blocks (Legacy support for 'code' array) */}
                                {section.code && section.code.length > 0 && (
                                    <div className="mt-6 ml-0 md:ml-4 space-y-4">
                                        {section.code.map((codeBlock, idx) => (
                                            <div key={idx} className="relative my-6 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0d1117]">
                                                <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-zinc-800/10">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                                    <div className="ml-auto text-xs text-zinc-500 font-mono flex items-center gap-1">
                                                        <Terminal className="w-3 h-3" />
                                                        {section.code_language?.[idx] || 'Code'}
                                                    </div>
                                                </div>
                                                <div className="p-4 overflow-x-auto">
                                                    <pre className="text-sm font-mono leading-relaxed text-gray-300">
                                                        <code>{codeBlock}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>

                    {/* Footer / Interaction */}
                    <div className="mt-20 pt-10 border-t border-zinc-800 flex flex-col gap-8 pb-32">
                        <BlogInteractionBar blog={blog} visitorId={visitorId} />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-left">
                                <h4 className="text-lg font-bold text-white">Thanks for reading!</h4>
                                <p className="text-zinc-500 text-sm">Check out my other articles.</p>
                            </div>
                            <Button
                                variant="outline"
                                size="lg"
                                className="group gap-2 rounded-full px-6 border-zinc-700 text-zinc-300 hover:text-white hover:border-accent hover:bg-zinc-900"
                                onClick={() => navigate('/blog')}
                            >
                                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Back to Articles
                            </Button>
                        </div>

                        {/* Comment Section */}
                        <CommentSection blogId={blog.id} />
                    </div>

                </article>

                {/* === FLOATING BOTTOM TIMELINE === */}
                {sections.length > 1 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] animate-in slide-in-from-bottom-10 duration-1000">

                        <div className="bg-black/80 backdrop-blur-xl border border-zinc-700/50 shadow-2xl rounded-full p-2 flex items-center gap-2 ring-1 ring-white/10">

                            <button
                                onClick={() => scrollTimeline('left')}
                                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-accent transition-colors flex-shrink-0"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div
                                ref={scrollRef}
                                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 max-w-[250px] sm:max-w-[400px]"
                            >
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-black focus:bg-accent focus:text-black whitespace-nowrap border border-zinc-800 bg-zinc-900/50 text-zinc-400"
                                >
                                    Intro
                                </button>
                                {sections.map((section, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => scrollToSection(`section-${idx}`)}
                                        className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-black focus:bg-accent focus:text-black whitespace-nowrap border border-zinc-800 bg-zinc-900/50 text-zinc-400"
                                    >
                                        {section.heading ? section.heading.split('•')[0] : `Part ${idx + 1}`}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollTimeline('right')}
                                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-accent transition-colors flex-shrink-0"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                        </div>
                    </div>
                )}

                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

            </div>
        </div>
    );
};

export default BlogDetail;
