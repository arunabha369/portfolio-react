import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import dynamic from '@/components/ui/dynamic';
import Link from '@/components/ui/Link';
import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import GithubIcon from '../svgs/Github';
import { Button } from '../ui/button';

const ActivityCalendar = dynamic(() => import('react-activity-calendar'));

// "2025-26" when the window straddles new year, "2026" otherwise.
function rangeLabel(contributions) {
  const first = contributions[0]?.date.slice(0, 4);
  const last = contributions.at(-1)?.date.slice(0, 4);
  if (!first || !last) return String(new Date().getFullYear());
  return first === last ? first : `${first}-${last.slice(2)}`;
}

function dayLabel(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Tag each cell with its data so one delegated hover handler can read it.
const renderBlock = (block, activity) => cloneElement(block, {
  'data-date': activity.date,
  'data-count': activity.count
});

export default function Github() {
  const [contributions, setContributions] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hovered, setHovered] = useState(null);
  const wrapperRef = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const response = await fetch(`${githubConfig.apiUrl}/${githubConfig.username}?y=last`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        if (!Array.isArray(data?.contributions) || data.contributions.length === 0) {
          setHasError(true);
          return;
        }
        setContributions(data.contributions);
        setTotalContributions(data.total?.lastYear ?? data.contributions.reduce((sum, day) => sum + day.count, 0));
      } catch (err) {
        console.error('Failed to fetch GitHub contributions:', err);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleHover = useCallback(event => {
    const { date, count } = event.target.dataset ?? {};
    if (!date || count === undefined || !wrapperRef.current) {
      setHovered(null);
      return;
    }
    // Measured against the non-scrolling wrapper so the tooltip stays aligned when the graph scrolls sideways.
    const cell = event.target.getBoundingClientRect();
    const box = wrapperRef.current.getBoundingClientRect();
    setHovered({
      count: Number(count),
      label: dayLabel(date),
      x: cell.left + cell.width / 2 - box.left,
      y: cell.top - box.top
    });
  }, []);

  return <Container className="mt-20">
    <div className="space-y-6">
      <SectionHeading subHeading="Featured" heading={githubConfig.title} />
      <p className="text-muted-foreground text-left text-sm">
        <b>{githubConfig.username}</b>&apos;s {githubConfig.subtitle}
      </p>

      {isLoading ? <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">
            {githubConfig.loadingState.description}
          </p>
        </div>
      </div> : hasError ? <div className="text-muted-foreground border-border rounded-xl border-2 border-dashed p-8 text-center">
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <GithubIcon className="h-8 w-8" />
        </div>
        <p className="mb-2 font-medium">{githubConfig.errorState.title}</p>
        <p className="mb-4 text-sm">
          {githubConfig.errorState.description}
        </p>
        <Button variant="outline" asChild>
          <Link href={`https://github.com/${githubConfig.username}`} className="inline-flex items-center gap-2">
            <GithubIcon className="h-4 w-4" />
            {githubConfig.errorState.buttonText}
          </Link>
        </Button>
      </div> : <div ref={wrapperRef} className="relative rounded-lg border border-black/10 px-4 py-5 sm:px-6 dark:border-white/10" onMouseOver={handleHover} onMouseLeave={() => setHovered(null)}>
        {hovered && <div role="status" className="bg-foreground text-background pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap shadow-md" style={{ left: hovered.x, top: hovered.y - 6 }}>
          {hovered.count === 1 ? '1 contribution' : `${hovered.count} contributions`} on {hovered.label}
        </div>}
        <ActivityCalendar
          data={contributions}
          totalCount={totalContributions}
          blockSize={9}
          blockMargin={3}
          blockRadius={2}
          fontSize={11}
          colorScheme={resolvedTheme === 'light' ? 'light' : 'dark'}
          theme={githubConfig.theme}
          renderBlock={renderBlock}
          labels={{ totalCount: `{{count}} contributions in ${rangeLabel(contributions)}` }}
          style={{ margin: '0 auto', color: 'var(--muted-foreground)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
        />
      </div>}
    </div>
  </Container>;
}
