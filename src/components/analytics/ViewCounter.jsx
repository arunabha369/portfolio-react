import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react'; // Assuming you have lucide-react or similar

export default function ViewCounter() {
    const [views, setViews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // You need to set these in your .env
    const WEBSITE_ID = import.meta.env.VITE_UMAMI_ID;
    const API_KEY = import.meta.env.VITE_UMAMI_API_KEY;
    const API_URL = 'https://api.umami.is/v1';

    useEffect(() => {
        if (!WEBSITE_ID || !API_KEY) {
            setLoading(false);
            return;
        }

        const fetchViews = async () => {
            try {
                // Fetch stats for all time (starting from 2020 to now)
                const startAt = new Date('2020-01-01').getTime();
                const endAt = Date.now();

                const response = await fetch(
                    `${API_URL}/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const data = await response.json();
                // data usually looks like { pageviews: { value: 123, ... }, visitors: { ... } } 
                // OR flattened depending on endpoint versions. 
                // Standard v1 stats returns { pageviews: { value: 123, change: 0 }, ... }

                // Let's inspect the structure safely
                const pageviews = data.pageviews?.value || data.pageviews || 0;
                setViews(pageviews);
            } catch (err) {
                // Silently fail if blocked (e.g., by ad blockers)
                // console.error('ViewCounter Error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchViews();
    }, [WEBSITE_ID, API_KEY]);

    if (!API_KEY) return null; // Don't show if no key configured
    if (error) return null; // Hide on error
    if (loading) return <span className="text-xs text-muted-foreground animate-pulse">Loading views...</span>;

    return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 bg-secondary/30 px-2 py-1 rounded-full w-fit mx-auto">
            {/* Fallback to simple SVG if lucide not available, but user seems to have it */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{views !== null ? views.toLocaleString() : '0'} views</span>
        </div>
    );
}
