import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaEye, FaThumbtack } from 'react-icons/fa';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [stats, setStats] = useState({ total: 0, published: 0, views: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBlogs(data);
            setStats({
                total: data.length,
                published: data.filter(b => b.is_published).length,
                views: 0 // Placeholder as we don't have view counting yet
            });
        }
        setLoading(false);
    };

    const togglePublish = async (id, currentStatus) => {
        const { error } = await supabase
            .from('blogs')
            .update({ is_published: !currentStatus })
            .eq('id', id);

        if (!error) {
            setBlogs(blogs.map(b => b.id === id ? { ...b, is_published: !currentStatus } : b));
            setStats(prev => ({
                ...prev,
                published: !currentStatus ? prev.published + 1 : prev.published - 1
            }));
        }
    };

    const togglePin = async (id, currentStatus) => {
        const { error } = await supabase
            .from('blogs')
            .update({ pinned: !currentStatus })
            .eq('id', id);

        if (!error) {
            setBlogs(blogs.map(b => b.id === id ? { ...b, pinned: !currentStatus } : b));
        }
    };

    const deleteBlog = async (id) => {
        if (!confirm('Are you sure you want to delete this blog? This cannot be undone.')) return;

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (!error) {
            setBlogs(blogs.filter(b => b.id !== id));
            setStats(prev => ({ ...prev, total: prev.total - 1 }));
        }
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>Loading dashboard...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', paddingTop: '100px', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                        <p style={{ color: '#888' }}>Manage your content and view performance.</p>
                    </div>
                    <Link
                        to="/admin/create"
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            padding: '1rem 2rem',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 20px rgba(255,255,255,0.2)'
                        }}
                    >
                        <FaPlus /> Create New Post
                    </Link>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    <StatCard label="Total Posts" value={stats.total} />
                    <StatCard label="Published" value={stats.published} />
                    <StatCard label="Total Views" value="--" />
                </div>

                {/* Blogs List */}
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Your Posts</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {blogs.map(blog => (
                        <div key={blog.id} style={{
                            backgroundColor: '#111',
                            border: '1px solid #222',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'border-color 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#222' }}>
                                    {blog.cover_image && <img src={blog.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', fontWeight: '600' }}>{blog.title}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                        <span style={{
                                            color: blog.is_published ? '#22c55e' : '#eab308',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            {blog.is_published ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                                            {blog.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button
                                    onClick={() => togglePublish(blog.id, blog.is_published)}
                                    title={blog.is_published ? "Unpublish" : "Publish"}
                                    style={{
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: blog.is_published ? '#eab308' : '#22c55e',
                                        padding: '0.8rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    {blog.is_published ? <FaTimesCircle /> : <FaCheckCircle />}
                                </button>

                                <button
                                    onClick={() => togglePin(blog.id, blog.pinned)}
                                    title={blog.pinned ? "Unpin" : "Pin"}
                                    style={{
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: blog.pinned ? '#a855f7' : '#666',
                                        padding: '0.8rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    <FaThumbtack />
                                </button>

                                <Link
                                    to={`/blog/${blog.slug}`}
                                    title="View Live"
                                    target="_blank"
                                    style={{
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: '#fff',
                                        padding: '0.8rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    <FaEye />
                                </Link>

                                <Link
                                    to={`/admin/edit/${blog.id}`}
                                    title="Edit"
                                    style={{
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: '#3b82f6',
                                        padding: '0.8rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    <FaEdit />
                                </Link>

                                <button
                                    onClick={() => deleteBlog(blog.id)}
                                    title="Delete"
                                    style={{
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: '#ef4444',
                                        padding: '0.8rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}

                    {blogs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#666', border: '1px dashed #333', borderRadius: '16px' }}>
                            No blogs found. Create your first post!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{value}</h3>
        <p style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{label}</p>
    </div>
);

export default AdminDashboard;
