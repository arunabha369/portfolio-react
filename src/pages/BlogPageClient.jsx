import { BlogList } from '@/components/blog/BlogList';
import Container from '@/components/common/Container';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const getBlogPostsByTagClient = (posts, tag) => {
  return posts.filter(post => post.frontmatter.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase()));
};

export function BlogPageClient({
  initialPosts,
  initialTags
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    triggerHaptic,
    isMobile
  } = useHapticFeedback();
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  // Get tag from URL params on mount
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
      const filtered = getBlogPostsByTagClient(initialPosts, tagParam);
      setFilteredPosts(filtered);
    } else {
      setSelectedTag(null);
      setFilteredPosts(initialPosts);
    }
  }, [searchParams, initialPosts]);

  // Handle tag click
  const handleTagClick = tag => {
    if (isMobile()) {
      triggerHaptic('light');
    }
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredPosts(initialPosts);
      // Remove tag param
      setSearchParams({}, { replace: true });
    } else {
      setSelectedTag(tag);
      const filtered = getBlogPostsByTagClient(initialPosts, tag);
      setFilteredPosts(filtered);
      // Set tag param
      setSearchParams({ tag }, { replace: true });
    }
  };

  const getTagPostCount = tag => {
    return initialPosts.filter(post => post.frontmatter.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())).length;
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
        {initialTags.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Popular Tags</h2>
              {selectedTag && (
                <button onClick={() => handleTagClick(selectedTag)} className="text-muted-foreground hover:text-foreground text-sm underline">
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {initialTags.map(tag => {
                const postCount = getTagPostCount(tag);
                const isSelected = selectedTag === tag;
                return (
                  <button key={tag} onClick={() => handleTagClick(tag)} className="transition-colors">
                    <Badge variant={isSelected ? 'default' : 'outline'} className="hover:bg-accent hover:text-accent-foreground tag-inner-shadow cursor-pointer capitalize">
                      {tag} ({postCount})
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {selectedTag ? `Posts tagged "${selectedTag}"` : 'Latest Posts'}
              {filteredPosts.length > 0 && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  ({filteredPosts.length}{' '}
                  {filteredPosts.length === 1 ? 'post' : 'posts'})
                </span>
              )}
            </h2>
          </div>

          <BlogList posts={filteredPosts} />
        </div>
      </div>
    </Container>
  );
}
