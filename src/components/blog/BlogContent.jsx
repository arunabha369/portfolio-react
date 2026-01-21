import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from '@/components/ui/Image';
import Calender from '../svgs/Calender';
import { BlogComponents } from './BlogComponents';

export function BlogContent({
  frontmatter,
  content: Content
}) {
  const {
    title,
    description,
    image,
    tags,
    date
  } = frontmatter;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return <article className="mx-auto max-w-4xl">
    {/* Hero Section */}
    <header className="mb-8 space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image src={image} alt={title} className="object-cover w-full h-full" priority />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => <Badge key={tag} variant="secondary">
            {tag}
          </Badge>)}
        </div>

        <h1 className="text-4xl leading-tight font-bold lg:text-5xl">
          {title}
        </h1>

        <p className="text-muted-foreground text-xl">{description}</p>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calender className="size-6" />
          <time dateTime={date}>{formattedDate}</time>
        </div>
      </div>

      <Separator />
    </header>

    {/* Content */}
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Content components={BlogComponents} />
    </div>
  </article>;
}