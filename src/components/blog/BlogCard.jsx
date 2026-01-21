import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Link from '@/components/ui/Link';
import Image from '@/components/ui/Image';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogCard({ post }) {
  // Accommodate different data structures (Supabase vs local MDX)
  // Assuming 'post' object structure from Supabase for now based on previous Blog.jsx, 
  // but mapping to reference structure where possible.

  const data = post.frontmatter ? { ...post.frontmatter, slug: post.slug } : post;
  const { slug, title, description, image, cover_image, tags, created_at, date } = data;
  const displayImage = image || cover_image;

  // Handle Date
  const dateString = date || created_at;
  const formattedDate = dateString ? new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'No Date';

  // Handle Tags
  const displayTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group h-full w-full overflow-hidden border-gray-100 p-0 shadow-none transition-all dark:border-gray-800">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Link href={`/blog/${slug}`}>
            <Image
              src={displayImage || '/assets/new-logo.png'} // Use logo as default if no image
              alt={title || 'Blog Post'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/assets/new-logo.png'; // Fallback to logo on error
              }}
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Link href={`/blog/${slug}`}>
            <h3 className="group-hover:text-primary line-clamp-2 text-xl leading-tight font-semibold transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-muted-foreground mt-4 line-clamp-3 text-sm">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex w-full flex-col space-y-3">
          <div className="flex flex-wrap gap-2">
            {displayTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs uppercase tracking-wider">
                {tag}
              </Badge>
            ))}
            {displayTags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{displayTags.length - 3} more
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <time
              className="text-muted-foreground flex items-center gap-2 text-sm"
              dateTime={dateString}
            >
              <Calendar className="size-4" /> {formattedDate}
            </time>
            <Link
              href={`/blog/${slug}`}
              className="text-muted-foreground flex items-center justify-end gap-2 text-sm underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Read More <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}