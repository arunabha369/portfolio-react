import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const useViewCounter = (slug = 'portfolio-main') => {
    const [views, setViews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const incrementView = async () => {
            try {
                // 1. Check if user has already viewed this page in this session
                const storageKey = `viewed_${slug}`;
                const hasViewed = sessionStorage.getItem(storageKey);

                if (!hasViewed) {
                    // 2. Increment view count in Supabase
                    // Using RPC or raw SQL is possible, but upsert with on_conflict is cleaner if table structure supports it
                    // Assuming 'counter' table: id (text), count (int)

                    // Fetch current count first (simplest approach without RPC for atomic increment if not high concurrency)
                    // Or better, use an RPC function if available. 
                    // Since user provided simple table schema, we'll try to upsert or read-then-update.
                    // Atomic increment is best done via RPC. Let's try to query first.

                    const { data: currentData, error: fetchError } = await supabase
                        .from('counter')
                        .select('count')
                        .eq('id', slug)
                        .single();

                    let newCount = 1;
                    if (currentData) {
                        newCount = currentData.count + 1;
                    }

                    const { error: upsertError } = await supabase
                        .from('counter')
                        .upsert({ id: slug, count: newCount }, { onConflict: 'id' });

                    if (!upsertError) {
                        sessionStorage.setItem(storageKey, 'true');
                        setViews(newCount);
                    }
                } else {
                    // Just fetch existing count
                    const { data, error } = await supabase
                        .from('counter')
                        .select('count')
                        .eq('id', slug)
                        .single();

                    if (data) {
                        setViews(data.count);
                    }
                }
            } catch (error) {
                console.error('Error updating view count:', error);
            } finally {
                setLoading(false);
            }
        };

        incrementView();
    }, [slug]);

    return { views, loading };
};

export default useViewCounter;
