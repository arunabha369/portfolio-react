import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BlogCard from '../components/blog/BlogCard';

// Categories (Visual only for now, can be wired up to tags later or filtered if data permits)
const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Tech", value: "tech" },
  { label: "Projects", value: "projects" },
  { label: "Life", value: "life" },
];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Simple filter logic - for now "all" shows everything. 
  // If user has 'category' column, use it. If not, use first tag?
  // User's DB has 'tags' array.
  const filteredBlogs = selectedCategory === "all"
    ? blogs
    : blogs.filter(blog => blog.tags && blog.tags.some(tag => tag.toLowerCase() === selectedCategory));

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center overflow-x-hidden text-white font-sans">

      {/* --- PROFESSIONAL BACKGROUND (Grid + Glow) --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[500px] w-[500px] rounded-full bg-accent/20 opacity-40 blur-[100px]"></div>
      </div>

      {/* Navigation / Header Area */}
      <div className="w-full max-w-7xl px-6 mt-10 mb-8 flex items-center justify-between z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Hero Header */}
      <div className="text-center mt-10 px-4 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">Logs</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Deep dives into Engineering, Projects, and everything in between.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-16 w-full max-w-5xl z-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`
              px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-sm
              ${selectedCategory === cat.value
                ? "bg-accent text-black shadow-lg shadow-accent/25 scale-105"
                : "bg-zinc-900/50 border border-zinc-800/40 text-zinc-400 hover:border-accent/50 hover:text-white hover:bg-zinc-800"}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="mt-20 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-32 z-10">

          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-500">
              <p className="text-xl font-medium">No articles found.</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-4 text-accent hover:underline font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;