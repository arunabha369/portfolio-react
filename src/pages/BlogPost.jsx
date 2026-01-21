import { BlogContent } from '@/components/blog/BlogContent';
import { BlogList } from '@/components/blog/BlogList';
import Container from '@/components/common/Container';
import FontSizeControls from '@/components/common/FontSizeControls';
import ArrowLeft from '@/components/svgs/ArrowLeft';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blog';
import Link from '@/components/ui/Link';
import NotFound from '@/pages/NotFound';
import { useParams } from 'react-router-dom';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post || !post.frontmatter.isPublished) {
    return <NotFound />;
  }
  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <>
      <Container className="py-16">
        <div className="space-y-12">
          {/* Back Button */}
          <div>
            <Button variant="ghost" asChild className="group">
              <Link href="/blog" className="flex items-center space-x-2">
                <ArrowLeft className="size-4" />
                <span>Back to Blog</span>
              </Link>
            </Button>
          </div>

          {/* Blog Content */}
          <BlogContent frontmatter={post.frontmatter} content={post.content} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6">
              <Separator />
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Related Posts</h2>
                <BlogList posts={relatedPosts} />
              </div>
            </div>
          )}

          {/* Back to Blog CTA */}
          <div className="text-center">
            <Separator className="mb-8" />
            <Button asChild size="lg">
              <Link href="/blog">View All Blogs</Link>
            </Button>
          </div>
        </div>
      </Container>
      <FontSizeControls />
    </>
  );
}