import React from 'react';
import { Eye } from 'lucide-react';
import useViewCounter from '@/hooks/use-view-counter';

export default function ViewCounter({ slug = 'portfolio-main' }) {
    const { views, loading } = useViewCounter(slug);

    if (loading) return <span className="text-xs text-muted-foreground animate-pulse">Loading views...</span>;

    return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 bg-secondary/30 px-2 py-1 rounded-full w-fit mx-auto">
            <Eye className="size-3" />
            <span>{views !== null ? views.toLocaleString() : '0'} views</span>
        </div>
    );
}
