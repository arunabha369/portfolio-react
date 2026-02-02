
import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import dynamic from '@/components/ui/dynamic';
import Link from '@/components/ui/Link';
import { useEffect, useState } from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import GithubIcon from '../svgs/Github';
import { Button } from '../ui/button';
const ActivityCalendar = dynamic(() => import('react-activity-calendar'), {
  ssr: false
});
// Helper function to filter contributions to start from April
function filterLastYear(contributions) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear - 1, 7, 1); // August 1st of previous year
  const endDate = new Date(currentYear, 3, 30); // April 30th of current year

  return contributions.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
}
export default function Github() {
  const [contributions, setContributions] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const {
    theme
  } = useTheme();
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(`${githubConfig.apiUrl}/${githubConfig.username}.json`);
        const data = await response.json();
        if (data?.contributions && Array.isArray(data.contributions)) {
          // Flatten the nested array structure
          const flattenedContributions = data.contributions.flat();

          // Convert contribution levels to numbers
          const contributionLevelMap = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4
          };

          // Transform to the expected format
          const validContributions = flattenedContributions.filter(item => typeof item === 'object' && item !== null && 'date' in item && 'contributionCount' in item && 'contributionLevel' in item).map(item => ({
            date: String(item.date),
            count: Number(item.contributionCount || 0),
            level: contributionLevelMap[item.contributionLevel] || 0
          }));
          if (validContributions.length > 0) {
            // Calculate total contributions
            const total = validContributions.reduce((sum, item) => sum + item.count, 0);
            setTotalContributions(total);

            // Filter to show only the past year
            const filteredContributions = filterLastYear(validContributions);
            setContributions(filteredContributions);
          } else {
            setHasError(true);
          }
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.error('Failed to fetch GitHub contributions:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  return <Container className="mt-20">
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <SectionHeading subHeading="Featured" heading={githubConfig.title} />
      <div className="flex flex-col items-start text-left">
        <p className="text-muted-foreground text-sm">
          <b>{githubConfig.username}</b>&apos;s {githubConfig.subtitle}
        </p>
        {!isLoading && !hasError && totalContributions > 0 && <p className="text-primary mt-1 text-sm font-medium">
          Total:{' '}
          <span className="font-black">
            {totalContributions.toLocaleString()}
          </span>{' '}
          contributions
        </p>}
      </div>

      {/* Content */}
      {isLoading ? <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">
            {githubConfig.loadingState.description}
          </p>
        </div>
      </div> : hasError || contributions.length === 0 ? <div className="text-muted-foreground border-border rounded-xl border-2 border-dashed p-8 text-center">
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
      </div> : <div className="relative overflow-hidden">
        <div className="bg-background/50 relative rounded-lg border border-dashed border-black/20 p-6 backdrop-blur-sm dark:border-white/10">
          <div className="w-full overflow-x-auto">
            <ActivityCalendar data={contributions} blockSize={12} blockMargin={4} fontSize={githubConfig.fontSize} colorScheme={theme === 'dark' ? 'dark' : 'light'} maxLevel={githubConfig.maxLevel} hideTotalCount={true} hideColorLegend={false} hideMonthLabels={false} theme={githubConfig.theme} labels={{
              months: githubConfig.months,
              weekdays: githubConfig.weekdays,
              totalCount: githubConfig.totalCountLabel
            }} style={{
              color: 'rgb(139, 148, 158)'
            }} />
          </div>
        </div>
      </div>}
    </div>
  </Container>;
}