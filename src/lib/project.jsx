import { projects } from '@/config/Projects';
const projectModules = import.meta.glob('/src/data/projects/*.mdx', { eager: true });

/**
 * Get all project case study files from the projects directory
 */
export function getProjectCaseStudySlugs() {
  return Object.keys(projectModules).map(path => path.split('/').pop().replace('.mdx', ''));
}

/**
 * Get project case study by slug with full content
 */
export function getProjectCaseStudyBySlug(slug) {
  const path = `/src/data/projects/${slug}.mdx`;
  const module = projectModules[path];
  if (!module) {
    return null;
  }

  // Validate frontmatter
  let frontmatter = module.frontmatter || {};

  // Merge with config data
  const configProject = projects.find(p => p.projectDetailsPageSlug === `/projects/${slug}`);
  if (configProject) {
    frontmatter = {
      ...configProject,
      ...frontmatter,
      technologies: frontmatter.technologies || configProject.technologies?.map(t => t.name) || [],
      // Ensure github link is preserved if missing in MDX but present in config
      github: frontmatter.github || configProject.github,
      live: frontmatter.live || configProject.live
    };
  }

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
 * Get all project case studies with frontmatter only (for listing)
 */
export function getAllProjectCaseStudies() {
  const slugs = getProjectCaseStudySlugs();
  const caseStudies = slugs.map(slug => {
    const caseStudy = getProjectCaseStudyBySlug(slug);
    if (!caseStudy) return null;
    return {
      slug: caseStudy.slug,
      frontmatter: caseStudy.frontmatter
    };
  }).filter(caseStudy => caseStudy !== null).sort((a, b) => {
    // Sort by featured first, then by title
    if (a.frontmatter.featured && !b.frontmatter.featured) return -1;
    if (!a.frontmatter.featured && b.frontmatter.featured) return 1;
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
  return caseStudies;
}

/**
 * Get all published project case studies
 */
export function getPublishedProjectCaseStudies() {
  const allCaseStudies = getAllProjectCaseStudies();
  return allCaseStudies.filter(caseStudy => caseStudy.frontmatter.isPublished);
}

/**
 * Get project case studies by technology
 */
export function getProjectCaseStudiesByTechnology(technology) {
  const publishedCaseStudies = getPublishedProjectCaseStudies();
  return publishedCaseStudies.filter(caseStudy => caseStudy.frontmatter.technologies.some(tech => tech.toLowerCase() === technology.toLowerCase()));
}

/**
 * Get all unique technologies from published case studies
 */
export function getAllTechnologies() {
  const publishedCaseStudies = getPublishedProjectCaseStudies();
  const technologiesSet = new Set();
  publishedCaseStudies.forEach(caseStudy => {
    caseStudy.frontmatter.technologies.forEach(tech => {
      technologiesSet.add(tech.toLowerCase());
    });
  });
  return Array.from(technologiesSet).sort();
}

/**
 * Get project navigation (next/previous) based on config Projects order
 */
export function getProjectNavigation(currentSlug) {
  // Find current project in config
  const currentProjectIndex = projects.findIndex(project => project.projectDetailsPageSlug === `/projects/${currentSlug}`);
  if (currentProjectIndex === -1) {
    return {
      previous: null,
      next: null
    };
  }
  const previousProject = currentProjectIndex > 0 ? projects[currentProjectIndex - 1] : null;
  const nextProject = currentProjectIndex < projects.length - 1 ? projects[currentProjectIndex + 1] : null;
  return {
    previous: previousProject ? {
      title: previousProject.title,
      slug: previousProject.projectDetailsPageSlug.replace('/projects/', '')
    } : null,
    next: nextProject ? {
      title: nextProject.title,
      slug: nextProject.projectDetailsPageSlug.replace('/projects/', '')
    } : null
  };
}

/**
 * Get related project case studies based on technologies (excluding the current one)
 */
export function getRelatedProjectCaseStudies(currentSlug, maxProjects = 2) {
  const currentCaseStudy = getProjectCaseStudyBySlug(currentSlug);
  if (!currentCaseStudy || !currentCaseStudy.frontmatter.isPublished) {
    return [];
  }
  const allCaseStudies = getPublishedProjectCaseStudies();
  const currentTechnologies = currentCaseStudy.frontmatter.technologies.map(tech => tech.toLowerCase());

  // Calculate relevance score based on shared technologies
  const caseStudiesWithScore = allCaseStudies.filter(caseStudy => caseStudy.slug !== currentSlug).map(caseStudy => {
    const sharedTechnologies = caseStudy.frontmatter.technologies.filter(tech => currentTechnologies.includes(tech.toLowerCase()));
    return {
      caseStudy,
      score: sharedTechnologies.length
    };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
  return caseStudiesWithScore.slice(0, maxProjects).map(item => item.caseStudy);
}