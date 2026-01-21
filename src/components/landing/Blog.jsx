import Link from '@/components/ui/Link';
import React, { useEffect, useState } from 'react';
import BlogCard from '../blog/BlogCard';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('pinned', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(2);

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching blogs for homepage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container className="mt-20">
      <SectionHeading subHeading="Featured" heading="Blogs" />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {loading ? (
          // Simple skeleton or loading state
          <>
            <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />
            <div className="h-[400px] bg-muted/20 animate-pulse rounded-xl" />
          </>
        ) : (
          posts.map(post => <BlogCard key={post.slug || post.id} post={post} />)
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/blog">Show all blogs</Link>
        </Button>
      </div>
    </Container>
  );
}