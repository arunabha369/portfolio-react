import React from 'react';
import { ExperienceCard } from './ExperienceCard';
export function ExperienceList({
  experiences
}) {
  if (experiences.length === 0) {
    return <div className="py-8 text-center">
        <p className="text-muted-foreground">No work experiences found.</p>
      </div>;
  }
  return <div className="flex flex-col gap-8">
      {experiences.map(experience => <ExperienceCard key={experience.company} experience={experience} />)}
    </div>;
}