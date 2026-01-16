import Container from '@/components/common/Container';
import { ProjectNavigation } from '@/components/projects/ProjectNavigation';
import ArrowLeft from '@/components/svgs/ArrowLeft';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getProjectCaseStudyBySlug, getProjectNavigation, getRelatedProjectCaseStudies } from '@/lib/project';
import Link from '@/components/ui/Link';
import NotFound from '@/pages/NotFound';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function ProjectCaseStudyPage() {
  const { slug } = useParams();
  const caseStudy = getProjectCaseStudyBySlug(slug);
  const [readmeContent, setReadmeContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!caseStudy) {
    return <NotFound />;
  }

  const { frontmatter } = caseStudy;
  const navigation = getProjectNavigation(slug);
  const relatedProjects = getRelatedProjectCaseStudies(slug, 2);

  useEffect(() => {
    const fetchReadme = async () => {
      if (!frontmatter.github) {
        setLoading(false);
        return;
      }

      try {
        const repoUrl = new URL(frontmatter.github);
        const pathParts = repoUrl.pathname.split('/').filter(Boolean);

        if (pathParts.length < 2) {
          console.error("Invalid GitHub URL format:", frontmatter.github);
          setLoading(false);
          return;
        }

        const owner = pathParts[0];
        const repo = pathParts[1];
        console.log(`Fetching README for ${owner}/${repo}`);

        // 1. Fetch Repo Details to get default branch
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const repoData = await repoRes.json();

        if (repoData && !repoData.message) {
          const branch = repoData.default_branch || 'main';

          // 2. Fetch README using correct branch
          const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
          const contentRes = await fetch(readmeUrl);

          if (!contentRes.ok) {
            throw new Error(`Failed to fetch README (${contentRes.status})`);
          }

          const text = await contentRes.text();
          setReadmeContent(text);
          setError(null);
        } else {
          throw new Error(repoData.message || 'Failed to fetch repository details');
        }
      } catch (error) {
        console.error("Error fetching README:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [frontmatter.github]);

  return (
    <Container className="py-16">
      <div className="space-y-12">
        {/* Back Button */}
        <div>
          <Button variant="ghost" asChild className="group">
            <Link href="/projects" className="flex items-center space-x-2">
              <ArrowLeft className="size-4" />
              <span>Back to Projects</span>
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{frontmatter.title}</h1>
          <p className="text-xl text-muted-foreground">{frontmatter.description}</p>

          <div className="flex flex-wrap gap-4">
            {frontmatter.github && (
              <Button asChild variant="outline">
                <Link href={frontmatter.github} target="_blank">View Code</Link>
              </Button>
            )}
            {frontmatter.live && (
              <Button asChild>
                <Link href={frontmatter.live} target="_blank">Live Demo</Link>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {frontmatter.technologies && frontmatter.technologies.map((tech) => (
              <div key={tech.name || tech} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                {tech.icon}
                <span>{tech.name || tech}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Project Content / README */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
              <p>Failed to load documentation: {error}</p>
              <Button variant="link" onClick={() => window.location.reload()} className="mt-2 text-red-600 dark:text-red-400">
                Retry
              </Button>
            </div>
          ) : readmeContent ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ node, ...props }) => <img {...props} className="rounded-lg shadow-md max-w-full h-auto mx-auto" />,
                a: ({ node, ...props }) => <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />
              }}
            >
              {readmeContent}
            </ReactMarkdown>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p>No detailed documentation available.</p>
            </div>
          )}
        </div>

        {/* Project Navigation */}
        <ProjectNavigation previous={navigation.previous} next={navigation.next} />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="space-y-6">
            <Separator />
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Related Projects</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedProjects.map(project => (
                  <div key={project.slug} className="group bg-card hover:bg-muted/50 rounded-lg border p-6 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="group-hover:text-primary text-lg font-semibold">
                            {project.frontmatter.title}
                          </h3>
                          <div className="text-xs">
                            <div className={`inline-block rounded px-2 py-1 text-xs font-medium ${project.frontmatter.isWorking ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                              }`}>
                              {project.frontmatter.isWorking ? 'Operational' : 'In Progress'}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {project.frontmatter.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.frontmatter.technologies.slice(0, 3).map(tech => (
                            <span key={tech.name || tech} className="bg-muted rounded px-2 py-1 text-xs">
                              {tech.name || tech}
                            </span>
                          ))}
                          {project.frontmatter.technologies.length > 3 && (
                            <span className="bg-muted rounded px-2 py-1 text-xs">
                              +{project.frontmatter.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Projects CTA */}
        <div className="text-center">
          <Separator className="mb-8" />
          <Button asChild size="lg">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}