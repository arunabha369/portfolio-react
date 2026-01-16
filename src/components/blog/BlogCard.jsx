import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Pin } from 'lucide-react';

const BlogCard = ({ blog }) => {
  // Use first tag as category, fallback to "Tech"
  const category = blog.tags && blog.tags.length > 0 ? blog.tags[0] : "Tech";

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group relative flex flex-col bg-card/50 backdrop-blur-sm rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer border border-zinc-800/40 hover:border-accent/30 shadow-sm hover:shadow-2xl hover:shadow-accent/5 no-underline"
    >
      {/* --- Image Section with "Cutting" look --- */}
      <div className="relative w-full h-64 overflow-hidden">
        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent z-10 opacity-60" />

        {/* Main Image */}
        {blog.cover_image ? (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-medium">
            No Preview
          </div>
        )}

        {/* Glass Date Badge */}
        <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md text-white/90 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* Professional Pinned Badge (Mock logic if needed, currently checking a non-existent prop but ready for future) */}
        {blog.is_pinned && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-accent/90 backdrop-blur-md text-black px-3 py-1.5 rounded-full shadow-lg shadow-accent/20 animate-in fade-in zoom-in duration-300">
            <Pin className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Featured</span>
          </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="p-6 pt-4 flex flex-col flex-grow relative z-20 -mt-8">
        {/* Category Pill - Floating slightly over image */}
        <div className="mb-4">
          <span className="inline-block bg-black/80 backdrop-blur-md border border-zinc-700/50 text-zinc-300 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-lg shadow-sm group-hover:bg-accent group-hover:text-black transition-colors duration-300">
            {category}
          </span>
        </div>

        <h2 className="text-xl font-bold leading-snug text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
          {blog.title}
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {blog.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-dashed border-zinc-800 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-[10px] text-black font-bold">
              K
            </div>
            <span className="text-zinc-500 text-xs font-medium">Author</span>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
            Read Article
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;