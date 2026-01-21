import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BlogList from '../components/blog/BlogList';
import Container from '../components/common/Container';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogBg, setBlogBg] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch Blog Banner
        const { data: latestBlog } = await supabase
          .from('blogs')
          .select('cover_image')
          .eq('is_published', true)
          .not('cover_image', 'is', null)
          .neq('cover_image', '')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (latestBlog?.cover_image) setBlogBg(latestBlog.cover_image);

        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        // Ensure tags is an array
        const processedData = (data || []).map(blog => ({
          ...blog,
          tags: Array.isArray(blog.tags) ? blog.tags : []
        }));
        setBlogs(processedData);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Extract all unique tags
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags || []))).sort();

  // Filter logic
  const filteredBlogs = selectedTag
    ? blogs.filter(blog =>
      blog.tags && blog.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
    )
    : blogs;

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSearchParams({});
    } else {
      setSearchParams({ tag });
    }
  };

  const getTagPostCount = (tag) => {
    return blogs.filter((blog) =>
      blog.tags.some((blogTag) => blogTag.toLowerCase() === tag.toLowerCase())
    ).length;
  };

  return (
    <Container className="py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Blogs
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Thoughts, tutorials, and insights on engineering, and programming.
          </p>
        </div>

        <Separator />

        {/* Tags */}
        {!loading && allTags.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Popular Tags</h2>
              {selectedTag && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-muted-foreground hover:text-foreground text-sm underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const postCount = getTagPostCount(tag);
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="transition-colors"
                  >
                    <Badge
                      variant={isSelected ? 'default' : 'outline'}
                      className="hover:bg-accent hover:text-accent-foreground tag-inner-shadow cursor-pointer capitalize"
                    >
                      {tag} ({postCount})
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse mt-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {selectedTag ? `Posts tagged "${selectedTag}"` : 'Latest Posts'}
                {filteredBlogs.length > 0 && (
                  <span className="text-muted-foreground ml-2 text-sm font-normal">
                    ({filteredBlogs.length}{' '}
                    {filteredBlogs.length === 1 ? 'post' : 'posts'})
                  </span>
                )}
              </h2>
            </div>

            <BlogList posts={filteredBlogs} />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Blog;