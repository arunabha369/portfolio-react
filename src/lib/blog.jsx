const blogModules = import.meta.glob('/src/data/blog/*.mdx', { eager: true });

/**
 * Get all blog post files from the blog directory
 */
export function getBlogPostSlugs() {
  return Object.keys(blogModules).map(path => path.split('/').pop().replace('.mdx', ''));
}

/**
 * Get blog post by slug with full content
 */
export function getBlogPostBySlug(slug) {
  const path = `/src/data/blog/${slug}.mdx`;
  const module = blogModules[path];
  if (!module) {
    return null;
  }

  // Validate frontmatter (module.frontmatter comes from remark-mdx-frontmatter)
  const frontmatter = module.frontmatter || {};
  if (!frontmatter.title || !frontmatter.description) {
    console.warn(`Invalid frontmatter in ${slug}.mdx`);
  }

  return {
    slug,
    frontmatter,
    content: module.default // Component
  };
}

/**
 * Get all blog posts with frontmatter only (for listing page)
 */
export function getAllBlogPosts() {
  const slugs = getBlogPostSlugs();
  const posts = slugs.map(slug => {
    const post = getBlogPostBySlug(slug);
    if (!post) return null;
    return {
      slug: post.slug,
      frontmatter: post.frontmatter
    };
  }).filter(post => post !== null).sort((a, b) => {
    // Sort by date, newest first
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
  return posts;
}

/**
 * Get all published blog posts
 */
export function getPublishedBlogPosts() {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.frontmatter.isPublished);
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag) {
  const publishedPosts = getPublishedBlogPosts();
  return publishedPosts.filter(post => post.frontmatter.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase()));
}

/**
 * Get all unique tags from published posts
 */
export function getAllTags() {
  const publishedPosts = getPublishedBlogPosts();
  const tagsSet = new Set();
  publishedPosts.forEach(post => {
    post.frontmatter.tags.forEach(tag => {
      tagsSet.add(tag.toLowerCase());
    });
  });
  return Array.from(tagsSet).sort();
}

/**
 * Get related posts based on tags (excluding the current post)
 */
export function getRelatedPosts(currentSlug, maxPosts = 3) {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost || !currentPost.frontmatter.isPublished) {
    return [];
  }
  const allPosts = getPublishedBlogPosts();
  const currentTags = currentPost.frontmatter.tags.map(tag => tag.toLowerCase());

  // Calculate relevance score based on shared tags
  const postsWithScore = allPosts.filter(post => post.slug !== currentSlug).map(post => {
    const sharedTags = post.frontmatter.tags.filter(tag => currentTags.includes(tag.toLowerCase()));
    return {
      post,
      score: sharedTags.length
    };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
  return postsWithScore.slice(0, maxPosts).map(item => item.post);
}