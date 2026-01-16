import Container from '@/components/common/Container';
import { ProjectList } from '@/components/projects/ProjectList';
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
            All Projects
          </h1>
        </div>

        <Separator />

        {/* Projects */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              All Projects
              {filteredProjects.length > 0 && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  ({filteredProjects.length}{' '}
                  {filteredProjects.length === 1 ? 'project' : 'projects'})
                </span>
              )}
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === 'all'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                  }`}
              >
                Clear filter
              </button>
              <button
                onClick={() => setFilter('working')}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === 'working'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                  }`}
              >
                working ({workingCount})
              </button>
              <button
                onClick={() => setFilter('building')}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === 'building'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                  }`}
              >
                building ({buildingCount})
              </button>
            </div>
          </div>

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