import { developmentItems, personalItems } from '@/config/Journey';
import { ArrowRight } from 'lucide-react';
import Link from '@/components/ui/Link';
import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Card } from '../ui/card';

export default function Journey() {
  const renderItems = (items) => (
    <div className="mt-8 flex flex-col gap-4">
      {items.map(item => <Link className="group" href={item.href} key={item.name}>
        <Card className="flex flex-row items-start justify-between gap-4 px-4 py-2">
          <div className="bg-muted flex items-center justify-center rounded-md p-2 mt-1">
            {(() => {
              const Icon = item.icon;
              return <Icon className="size-4" />;
            })()}
          </div>
          <div className="flex flex-1 flex-col text-left">
            <h3 className="text-base font-semibold">{item.name}</h3>
            <p className="text-muted-foreground text-sm">
              {item.description}
            </p>
          </div>
          <ArrowRight className="hidden size-4 transition-all duration-300 group-hover:block mt-2" />
        </Card>
      </Link>)}
    </div>
  );

  return <Container className="mt-10">
    <div className="mb-10">
      <SectionHeading subHeading="Development" heading="Setup" />
      {renderItems(developmentItems)}
    </div>

    <div>
      <SectionHeading subHeading="Personal" heading="Life" />
      {renderItems(personalItems)}
    </div>
  </Container>;
}