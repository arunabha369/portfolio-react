import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FaLock, FaGoogle } from 'react-icons/fa';

const AdminRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            // TODO: Replace with your actual email or add a more robust role-based check
            if (session?.user?.email === 'arunabhabanerjee5@gmail.com') {
                setAuthorized(true);
            }
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.email === 'arunabhabanerjee5@gmail.com') {
                setAuthorized(true);
            } else {
                setAuthorized(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}${window.location.pathname}`
            }
        });
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
                <div style={{ border: '2px solid #333', borderTop: '2px solid #fff', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!session || !authorized) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#050505',
                padding: '1rem'
            }}>
                <div style={{
                    maxWidth: '400px',
                    width: '100%',
                    backgroundColor: '#111',
                    padding: '3rem 2rem',
                    borderRadius: '24px',
                    border: '1px solid #222',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <FaLock size={24} color="#666" />
                    </div>

                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff', fontWeight: '700' }}>Admin Access</h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        This area is restricted to authorized personnel only.
                    </p>

                    {session && !authorized ? (
                        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Access Denied for {session.user.email}
                        </div>
                    ) : null}

                    <button
                        onClick={handleLogin}
                        style={{
                            width: '100%',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <FaGoogle /> Sign in with Google
                    </button>

                    {session && (
                        <button
                            onClick={() => supabase.auth.signOut()}
                            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
