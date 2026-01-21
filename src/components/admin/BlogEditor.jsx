import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaImage, FaCode, FaHeading, FaAlignLeft } from 'react-icons/fa';

const BlogEditor = () => {
    const { id } = useParams(); // If ID exists, we are editing
    const navigate = useNavigate();
    const isEditing = !!id;

    // Blog Metadata State
    const [blogData, setBlogData] = useState({
        title: '',
        slug: '',
        description: '',
        cover_image: '',
        tags: '', // Comma separated string for input
        is_published: false
    });

    // Sections State
    const [sections, setSections] = useState([]);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchBlogData();
        }
    }, [id]);

    const fetchBlogData = async () => {
        // Fetch Blog
        const { data: blog, error: blogError } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (blogError) {
            console.error(blogError);
            return;
        }

        // Fetch Sections
        const { data: sectionData, error: sectionError } = await supabase
            .from('blog_sections')
            .select('*')
            .eq('blog_id', id)
            .order('order', { ascending: true });

        setBlogData({
            ...blog,
            tags: blog.tags.join(', ')
        });

        if (sectionData) {
            setSections(sectionData);
        }
        setLoading(false);
    };

    const handleBlogChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from title if slug is empty or currently matches old title slug
        if (name === 'title' && !isEditing) {
            setBlogData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }));
        }
    };

    const handleSectionChange = (index, field, value) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setSections(newSections);
    };

    const addSection = () => {
        setSections([
            ...sections,
            {
                id: crypto.randomUUID(), // Temp ID
                heading: '',
                content: '',
                image: [],
                code: [],
                code_language: [],
                order: sections.length + 1
            }
        ]);
    };

    const removeSection = (index) => {
        setSections(sections.filter((_, i) => i !== index));
    };

    const moveSection = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newSections = [...sections];
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
            setSections(newSections);
        }
        if (direction === 'down' && index < sections.length - 1) {
            const newSections = [...sections];
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
            setSections(newSections);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Upsert Blog
            const tagsArray = blogData.tags.split(',').map(t => t.trim()).filter(Boolean);

            const blogPayload = {
                title: blogData.title,
                slug: blogData.slug,
                description: blogData.description,
                cover_image: blogData.cover_image,
                tags: tagsArray,
                is_published: blogData.is_published,
                updated_at: new Date()
            };

            let savedBlogId = id;

            if (isEditing) {
                await supabase.from('blogs').update(blogPayload).eq('id', id);
            } else {
                const { data, error } = await supabase.from('blogs').insert(blogPayload).select().single();
                if (error) throw error;
                savedBlogId = data.id;
            }

            // 2. Handle Sections
            if (isEditing) {
                await supabase.from('blog_sections').delete().eq('blog_id', savedBlogId);
            }

            const sectionsPayload = sections.map((s, idx) => ({
                blog_id: savedBlogId,
                heading: s.heading,
                content: s.content,
                image: (Array.isArray(s.image) ? s.image : (s.image ? [s.image] : [])).filter(img => img && img.trim() !== ''),
                code: (Array.isArray(s.code) ? s.code : (s.code ? [s.code] : [])).filter(c => c && c.trim() !== ''),
                code_language: Array.isArray(s.code_language) ? s.code_language : (s.code_language ? [s.code_language] : []),
                "order": idx + 1
            }));

            if (sectionsPayload.length > 0) {
                const { error: secError } = await supabase.from('blog_sections').insert(sectionsPayload);
                if (secError) throw secError;
            }

            alert('Blog Saved Successfully!');
            navigate('/admin');

        } catch (error) {
            console.error(error);
            alert('Error saving blog: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', padding: '100px', textAlign: 'center' }}>Loading Editor...</div>;

    // Helper to safely get value from potential array or string state
    const getStringVal = (val) => Array.isArray(val) ? val[0] || '' : val || '';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', paddingTop: '100px', paddingBottom: '100px' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <Link to="/admin" style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaArrowLeft /> Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            padding: '0.8rem 2rem',
                            borderRadius: '50px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: saving ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        <FaSave /> {saving ? 'Saving...' : 'Save Blog'}
                    </button>
                </div>

                {/* Metadata Card */}
                <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#888' }}>Metadata</h2>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Title</label>
                            <input
                                name="title"
                                value={blogData.title}
                                onChange={handleBlogChange}
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.1rem' }}
                                placeholder="Enter blog title..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Slug (URL)</label>
                                <input
                                    name="slug"
                                    value={blogData.slug}
                                    onChange={handleBlogChange}
                                    style={{ width: '100%', padding: '0.8rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', color: '#888' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tags (comma separated)</label>
                                <input
                                    name="tags"
                                    value={blogData.tags}
                                    onChange={handleBlogChange}
                                    placeholder="React, CSS, Tutorial"
                                    style={{ width: '100%', padding: '0.8rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Cover Image URL</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    name="cover_image"
                                    value={blogData.cover_image}
                                    onChange={handleBlogChange}
                                    placeholder="https://..."
                                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                />
                                {blogData.cover_image && (
                                    <div style={{ width: '60px', height: '45px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #333' }}>
                                        <img src={blogData.cover_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Short Description</label>
                            <textarea
                                name="description"
                                value={blogData.description}
                                onChange={handleBlogChange}
                                rows="3"
                                style={{ width: '100%', padding: '0.8rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={blogData.is_published}
                                    onChange={(e) => setBlogData(prev => ({ ...prev, is_published: e.target.checked }))}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span>Publish immediately</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sections Editor */}
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>Content Sections</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {sections.map((section, index) => (
                        <div key={index} style={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid #333', overflow: 'hidden' }}>
                            {/* Section Toolbar */}
                            <div style={{ backgroundColor: '#1a1a1a', padding: '0.8rem 1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', color: '#666' }}>Section {index + 1}</span>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => moveSection(index, 'up')} disabled={index === 0} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                                    <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', opacity: index === sections.length - 1 ? 0.3 : 1 }}>▼</button>
                                    <button onClick={() => removeSection(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem' }}><FaTrash /></button>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', display: 'grid', gap: '1.5rem' }}>
                                {/* Heading */}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <FaHeading color="#444" size={20} />
                                    <input
                                        value={section.heading}
                                        onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                                        placeholder="Section Heading"
                                        style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', fontSize: '1.1rem', fontWeight: '600', outline: 'none' }}
                                    />
                                </div>

                                {/* Content */}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <FaAlignLeft color="#444" size={20} style={{ marginTop: '0.8rem' }} />
                                    <textarea
                                        value={section.content}
                                        onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                        placeholder="Section content (supports basic markdown)..."
                                        rows="6"
                                        style={{ flex: 1, padding: '0.8rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', color: '#ccc', fontFamily: 'inherit', lineHeight: '1.6', resize: 'vertical' }}
                                    />
                                </div>

                                {/* Extra Media: Image & Code */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #222' }}>
                                    {/* Image */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                                            <FaImage /> Image URL
                                        </div>
                                        <input
                                            value={getStringVal(section.image)}
                                            onChange={(e) => handleSectionChange(index, 'image', [e.target.value])}
                                            placeholder="https://..."
                                            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
                                        />
                                        {getStringVal(section.image) && (
                                            <img src={getStringVal(section.image)} style={{ marginTop: '0.5rem', maxHeight: '100px', borderRadius: '4px', border: '1px solid #333' }} />
                                        )}
                                    </div>

                                    {/* Code */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                                            <FaCode /> Code Snippet
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input
                                                value={getStringVal(section.code_language)}
                                                onChange={(e) => handleSectionChange(index, 'code_language', [e.target.value])}
                                                placeholder="Language (e.g. javascript)"
                                                style={{ width: '100%', padding: '0.4rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '6px', color: '#888', fontSize: '0.85rem' }}
                                            />
                                            <textarea
                                                value={getStringVal(section.code)}
                                                onChange={(e) => handleSectionChange(index, 'code', [e.target.value])}
                                                placeholder="Paste code here..."
                                                rows="3"
                                                style={{ width: '100%', padding: '0.6rem', backgroundColor: '#050505', border: '1px solid #333', borderRadius: '6px', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.85rem' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addSection}
                        style={{
                            padding: '2rem',
                            border: '2px dashed #333',
                            borderRadius: '16px',
                            background: 'transparent',
                            color: '#666',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666' }}
                    >
                        <FaPlus /> Add New Section
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
