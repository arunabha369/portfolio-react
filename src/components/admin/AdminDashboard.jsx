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
                views: data.reduce((sum, blog) => sum + (blog.views || 0), 0)
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
        return (
            <div className="min-h-screen bg-[#050505] text-white pt-24 flex justify-center">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16">
            <div className="container max-w-[1200px] mx-auto px-4 sm:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-[#888]">Manage your content and view performance.</p>
                    </div>
                    <Link
                        to="/admin/create"
                        className="bg-white text-black px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-transform hover:scale-105 shadow-[0_4px_20px_rgba(255,255,255,0.2)] w-full md:w-auto justify-center md:justify-start"
                    >
                        <FaPlus /> Create New Post
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                    <StatCard label="Total Posts" value={stats.total} />
                    <StatCard label="Published" value={stats.published} />
                    <StatCard label="Total Views" value={stats.views} />
                </div>

                {/* Blogs List */}
                <h2 className="text-2xl mb-8 font-semibold">Your Posts</h2>
                <div className="flex flex-col gap-4">
                    {blogs.map(blog => (
                        <div
                            key={blog.id}
                            className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-colors hover:border-[#333] gap-6"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                                <div className="w-full sm:w-[80px] h-[200px] sm:h-[60px] rounded-lg overflow-hidden bg-[#222] flex-shrink-0">
                                    {blog.cover_image && (
                                        <img
                                            src={blog.cover_image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold mb-2 leading-tight">{blog.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-[#666]">
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                        <span className={`flex items-center gap-2 ${blog.is_published ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {blog.is_published ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                                            {blog.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto justify-end border-t border-[#222] pt-4 md:border-0 md:pt-0">
                                <button
                                    onClick={() => togglePublish(blog.id, blog.is_published)}
                                    title={blog.is_published ? "Unpublish" : "Publish"}
                                    className={`p-3 rounded-full border border-[#333] bg-transparent transition-colors hover:bg-[#222] ${blog.is_published ? 'text-yellow-500' : 'text-green-500'}`}
                                >
                                    {blog.is_published ? <FaTimesCircle /> : <FaCheckCircle />}
                                </button>

                                <button
                                    onClick={() => togglePin(blog.id, blog.pinned)}
                                    title={blog.pinned ? "Unpin" : "Pin"}
                                    className={`p-3 rounded-full border border-[#333] bg-transparent transition-colors hover:bg-[#222] ${blog.pinned ? 'text-purple-500' : 'text-[#666]'}`}
                                >
                                    <FaThumbtack />
                                </button>

                                <Link
                                    to={`/blog/${blog.slug}`}
                                    title="View Live"
                                    target="_blank"
                                    className="p-3 rounded-full border border-[#333] bg-transparent text-white transition-colors hover:bg-[#222]"
                                >
                                    <FaEye />
                                </Link>

                                <Link
                                    to={`/admin/edit/${blog.id}`}
                                    title="Edit"
                                    className="p-3 rounded-full border border-[#333] bg-transparent text-blue-500 transition-colors hover:bg-[#222]"
                                >
                                    <FaEdit />
                                </Link>

                                <button
                                    onClick={() => deleteBlog(blog.id)}
                                    title="Delete"
                                    className="p-3 rounded-full border border-[#333] bg-transparent text-red-500 transition-colors hover:bg-[#222]"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}

                    {blogs.length === 0 && (
                        <div className="text-center py-16 text-[#666] border border-dashed border-[#333] rounded-2xl">
                            No blogs found. Create your first post!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
        <h3 className="text-4xl font-extrabold mb-2">{value}</h3>
        <p className="text-[#888] uppercase text-xs tracking-widest">{label}</p>
    </div>
);

export default AdminDashboard;
