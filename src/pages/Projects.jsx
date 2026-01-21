import Container from '@/components/common/Container';
import { ProjectList } from '@/components/projects/ProjectList';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { projects } from '@/config/Projects';
import { useState } from 'react';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');

  // Calculate counts
  const workingCount = projects.filter(p => p.isWorking).length;
  const buildingCount = projects.filter(p => !p.isWorking).length;

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (filter === 'working') return p.isWorking;
    if (filter === 'building') return !p.isWorking;
    return true;
  });

  return (
    <Container className="py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Projects
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            My projects and work across different technologies and domains.
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          {/* Filter Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter by Status</h2>
              {(filter === 'working' || filter === 'building') && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-muted-foreground hover:text-foreground text-sm underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter(filter === 'working' ? 'all' : 'working')}
                className="transition-colors"
                title="Filter by Working"
              >
                <Badge
                  variant={filter === 'working' ? 'default' : 'outline'}
                  className="hover:bg-accent hover:text-accent-foreground tag-inner-shadow cursor-pointer capitalize"
                >
                  Working ({workingCount})
                </Badge>
              </button>
              <button
                onClick={() => setFilter(filter === 'building' ? 'all' : 'building')}
                className="transition-colors"
                title="Filter by Building"
              >
                <Badge
                  variant={filter === 'building' ? 'default' : 'outline'}
                  className="hover:bg-accent hover:text-accent-foreground tag-inner-shadow cursor-pointer capitalize"
                >
                  Building ({buildingCount})
                </Badge>
              </button>
            </div>
          </div>

          {/* All Projects Header */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">
              All Projects <span className="text-muted-foreground text-lg font-normal">({filteredProjects.length} projects)</span>
            </h2>
          </div>

          {/* Project List */}
          <ProjectList projects={filteredProjects} />

          {filteredProjects.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No projects found in this category.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}