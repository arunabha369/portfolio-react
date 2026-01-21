import React from 'react';
import BlogCard from './BlogCard';

export default function BlogList({ posts, className = '' }) {
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-semibold">No blog posts found</h2>
        <p className="text-muted-foreground">
          Check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-2 ${className}`}>
      {posts.map((post) => (
        <BlogCard key={post.slug || post.id} post={post} /> /* Supporting both slug and id for compatibility */
      ))}
    </div>
  );
}