import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthRedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check for return URL
        const returnUrl = localStorage.getItem('return_to');

        if (returnUrl) {
            // Check if user is authenticated
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    // Clear the stored URL and navigate
                    localStorage.removeItem('return_to');
                    navigate(returnUrl);
                    // Add small timeout to allow new page to render before scrolling
                    setTimeout(() => {
                        const commentsSection = document.getElementById('comments-section');
                        if (commentsSection) {
                            commentsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 500);
                }
            });
        }

        // Also listen for auth state changes (in case of immediate redirect back)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && returnUrl) {
                localStorage.removeItem('return_to');
                navigate(returnUrl);
                setTimeout(() => {
                    const commentsSection = document.getElementById('comments-section');
                    if (commentsSection) {
                        commentsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    return null;
};

export default AuthRedirectHandler;
