import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Terminal } from 'lucide-react';
import ArrowLeft from '@/components/svgs/ArrowLeft';
import { supabase } from '../lib/supabase';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import githubDark from '@/lib/prism-github-dark'; // Custom GitHub Dark theme
import { CodeCopyButton } from '@/components/blog/CodeCopyButton';
import Container from '../components/common/Container';
import BlogInteractionBar from '../components/blog/BlogInteractionBar';
import CommentSection from '../components/blog/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Image from '@/components/ui/Image';

// Helper to extract text content from React nodes for the copy button
const getTextContent = (node) => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (React.isValidElement(node) && node.props) {
        return getTextContent(node.props.children);
    }
    if (Array.isArray(node)) {
        return node.map(getTextContent).join('');
    }
    return '';
};

// Helper to clean code content (remove backticks and excessive whitespace)
const cleanCodeContent = (content) => {
    if (!content) return '';
    // Use getTextContent to handle both strings and React nodes (arrays)
    let cleaned = getTextContent(content).trim();

    // Split into lines to safely inspect first/last lines for fences
    const lines = cleaned.split(/\r?\n/);

    // Check first line for fence pattern (e.g. ```javascript or `)
    // Matches start of line, 1+ backticks, optional whitespace, optional alphanumeric identifier, end of line
    if (lines.length > 0 && /^\s*`{1,}\s*([a-zA-Z0-9-]*)?\s*$/.test(lines[0])) {
        lines.shift(); // Remove the first line
    }

    // Check last line for closing fence pattern (e.g. ``` or `)
    // Matches start of line, optional whitespace, 1+ backticks, optional whitespace, end of line
    if (lines.length > 0 && /^\s*`{1,}\s*$/.test(lines[lines.length - 1])) {
        lines.pop(); // Remove the last line
    }

    return lines.join('\n').trim();
};

// --- MARKDOWN STYLES ---
const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-extrabold mt-10 mb-5 text-zinc-100 tracking-tight scroll-m-20" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-zinc-100 tracking-tight scroll-m-20" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-bold mt-8 mb-3 text-zinc-100 tracking-tight" {...props} />,
    p: ({ node, ...props }) => <p className="leading-7 text-base text-muted-foreground mb-5" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 mb-5 space-y-2 text-muted-foreground text-base" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 mb-5 space-y-2 text-muted-foreground text-base" {...props} />,
    // pre is handled by code component or default behavior mixed with code logic above
    // pre: ({ children, ...props }) => <div {...props}>{children}</div>,
    code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        const codeContent = cleanCodeContent(children);

        if (inline) {
            return (
                <code
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground font-medium"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <div className="group relative mb-6">
                <div className="bg-[#0d1117] overflow-x-auto rounded-lg border border-border p-4 text-sm font-mono text-zinc-300">
                    <SyntaxHighlighter
                        style={githubDark}
                        language={language}
                        PreTag="div"
                        className="!bg-transparent !p-0 !m-0"
                        showLineNumbers={false}
                        customStyle={{ background: 'transparent' }}
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                </div>
                <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <CodeCopyButton code={codeContent} />
                </div>
            </div>
        );
    },
    a: ({ node, ...props }) => (
        <a className="text-primary font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" target="_blank" rel="noopener noreferrer" {...props} />
    ),
};

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

    if (loading) {
        return (
            <Container className="py-16 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </Container>
        );
    }

    if (error || !blog) {
        return (
            <Container className="py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
                <Button asChild>
                    <Link to="/blog">Back to Blogs</Link>
                </Button>
            </Container>
        );
    }

    const formattedDate = new Date(blog.date || blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Container className="py-16">
            <article className="mx-auto max-w-4xl space-y-12">
                {/* Back Button */}
                <div>
                    <Button variant="ghost" asChild className="group">
                        <Link to="/blog" className="flex items-center space-x-2">
                            <ArrowLeft className="size-4" />
                            <span>Back to Blogs</span>
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <header className="space-y-6">
                    {/* Hero Image */}
                    {blog.cover_image && (
                        <div className="relative aspect-video overflow-hidden rounded-lg border border-border/50 shadow-sm">
                            <Image
                                src={blog.cover_image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {blog.tags && blog.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="capitalize">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl leading-tight">
                            {blog.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {blog.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <time dateTime={blog.date || blog.created_at}>{formattedDate}</time>
                            </div>
                            {blog.read_time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4" />
                                    <span>{blog.read_time} min read</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />
                </header>

                {/* Content Sections */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {sections.map((section, index) => (
                        <section key={section.id} id={`section-${index}`} className="mb-12 last:mb-0">
                            {section.heading && (
                                <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                            )}

                            {section.content && (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {section.content}
                                </ReactMarkdown>
                            )}

                            {/* Images in Section */}
                            {(() => {
                                const validImages = section.image ? section.image.filter(img => img && img.trim() !== '') : [];
                                if (validImages.length === 0) return null;

                                return (
                                    <div className={`my-8 grid gap-4 ${validImages.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                                        {validImages.map((imgUrl, imgIndex) => (
                                            <div key={imgIndex} className="relative rounded-lg overflow-hidden border border-border/50">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Section Visual ${imgIndex + 1}`}
                                                    className="w-full h-auto object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* Code Blocks in Section */}
                            {section.code && section.code.length > 0 && (
                                <div className="my-6 space-y-4">
                                    {section.code.map((rawCodeBlock, idx) => {
                                        const codeBlock = cleanCodeContent(rawCodeBlock);
                                        if (!codeBlock) return null;
                                        return (
                                            <div key={idx} className="group relative mb-6">
                                                <div className="bg-[#0d1117] overflow-x-auto rounded-lg border border-border p-4 text-sm font-mono text-zinc-300">
                                                    <SyntaxHighlighter
                                                        style={githubDark}
                                                        language={section.code_language?.[idx] || 'javascript'} // Fallback or explicit language
                                                        PreTag="div"
                                                        className="!bg-transparent !p-0 !m-0"
                                                        showLineNumbers={false}
                                                        customStyle={{ background: 'transparent' }}
                                                    >
                                                        {codeBlock}
                                                    </SyntaxHighlighter>
                                                </div>
                                                <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <CodeCopyButton code={codeBlock} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                <Separator />

                {/* Interaction & Comments */}
                <div className="space-y-8 pb-12">
                    <BlogInteractionBar blog={blog} visitorId={visitorId} />

                    <div className="rounded-lg bg-card border border-border p-6 md:p-8">
                        <h3 className="text-xl font-bold mb-6">Comments</h3>
                        <CommentSection blogId={blog.id} />
                    </div>
                </div>

            </article>
        </Container>
    );
};

export default BlogDetail;
