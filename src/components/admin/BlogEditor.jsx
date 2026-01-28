import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaImage, FaCode, FaHeading, FaAlignLeft, FaChevronUp, FaChevronDown } from 'react-icons/fa';

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
        if (window.confirm("Are you sure you want to delete this section?")) {
            setSections(sections.filter((_, i) => i !== index));
        }
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

    // Auto-resize textarea helper
    const adjustTextareaHeight = (element) => {
        if (element) {
            element.style.height = 'auto'; // Reset height
            element.style.height = `${element.scrollHeight}px`; // Set to scroll height
        }
    };

    // Effect to resize textareas when sections change (e.g. initial load or add/move)
    useEffect(() => {
        const textareas = document.querySelectorAll('textarea.auto-resize');
        textareas.forEach(textarea => {
            adjustTextareaHeight(textarea);
        });
    }, [sections]);


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

    if (loading) return <div className="min-h-screen bg-[#050505] text-white p-24 text-center">Loading Editor...</div>;

    // Helper to safely get value from potential array or string state
    const getStringVal = (val) => Array.isArray(val) ? val[0] || '' : val || '';

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24">
            <div className="container max-w-[900px] mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/admin" className="text-[#888] flex items-center gap-2 hover:text-white transition-colors">
                        <FaArrowLeft /> Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`bg-white text-black px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 ${saving ? 'cursor-wait' : 'cursor-pointer'}`}
                    >
                        <FaSave /> {saving ? 'Saving...' : 'Save Blog'}
                    </button>
                </div>

                {/* Metadata Card */}
                <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-[#222] mb-8 shadow-sm">
                    <h2 className="text-xl mb-6 text-[#888]">Metadata</h2>

                    <div className="grid gap-6">
                        <div>
                            <label className="block mb-2 text-sm text-[#ccc]">Title</label>
                            <input
                                name="title"
                                value={blogData.title}
                                onChange={handleBlogChange}
                                className="w-full p-4 bg-[#050505] border border-[#333] rounded-lg text-white text-lg focus:border-white focus:outline-none transition-colors"
                                placeholder="Enter blog title..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm text-[#ccc]">Slug (URL)</label>
                                <input
                                    name="slug"
                                    value={blogData.slug}
                                    onChange={handleBlogChange}
                                    className="w-full p-3 bg-[#050505] border border-[#333] rounded-lg text-[#888] focus:border-[#666] focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm text-[#ccc]">Tags (comma separated)</label>
                                <input
                                    name="tags"
                                    value={blogData.tags}
                                    onChange={handleBlogChange}
                                    placeholder="React, CSS, Tutorial"
                                    className="w-full p-3 bg-[#050505] border border-[#333] rounded-lg text-white focus:border-white focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-[#ccc]">Cover Image URL</label>
                            <div className="flex gap-4">
                                <input
                                    name="cover_image"
                                    value={blogData.cover_image}
                                    onChange={handleBlogChange}
                                    placeholder="https://..."
                                    className="flex-1 p-3 bg-[#050505] border border-[#333] rounded-lg text-white focus:border-white focus:outline-none transition-colors"
                                />
                                {blogData.cover_image && (
                                    <div className="w-[60px] h-[45px] rounded border border-[#333] overflow-hidden flex-shrink-0">
                                        <img src={blogData.cover_image} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-[#ccc]">Short Description</label>
                            <textarea
                                name="description"
                                value={blogData.description}
                                onChange={handleBlogChange}
                                rows="3"
                                className="w-full p-3 bg-[#050505] border border-[#333] rounded-lg text-white font-inherit focus:border-white focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={blogData.is_published}
                                    onChange={(e) => setBlogData(prev => ({ ...prev, is_published: e.target.checked }))}
                                    className="w-5 h-5 accent-white"
                                />
                                <span>Publish immediately</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sections Editor */}
                <h2 className="text-2xl mb-6 pl-2">Content Sections</h2>

                <div className="flex flex-col gap-8">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-[#111] rounded-2xl border border-[#333] overflow-hidden shadow-sm">
                            {/* Section Toolbar */}
                            <div className="bg-[#1a1a1a] px-6 py-3 border-b border-[#333] flex justify-between items-center">
                                <span className="font-semibold text-[#666]">Section {index + 1}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="text-white bg-transparent border-0 p-2 cursor-pointer hover:bg-[#333] rounded disabled:opacity-30 disabled:hover:bg-transparent"><FaChevronUp /></button>
                                    <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="text-white bg-transparent border-0 p-2 cursor-pointer hover:bg-[#333] rounded disabled:opacity-30 disabled:hover:bg-transparent"><FaChevronDown /></button>
                                    <button onClick={() => removeSection(index)} className="text-red-500 bg-transparent border-0 p-2 ml-4 cursor-pointer hover:bg-[#333] rounded transition-colors"><FaTrash /></button>
                                </div>
                            </div>

                            <div className="p-6 grid gap-6">
                                {/* Heading */}
                                <div className="flex gap-4 items-center">
                                    <FaHeading className="text-[#444] text-xl flex-shrink-0" />
                                    <input
                                        value={section.heading}
                                        onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                                        placeholder="Section Heading"
                                        className="flex-1 p-3 bg-transparent border-b border-[#333] text-white text-lg font-semibold placeholder-[#444] focus:border-white focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex gap-4 items-start">
                                    <FaAlignLeft className="text-[#444] text-xl mt-3 flex-shrink-0" />
                                    <textarea
                                        className="auto-resize w-full flex-1 p-3 bg-[#050505] border border-[#333] rounded-lg text-[#ccc] leading-relaxed resize-none overflow-hidden min-h-[150px] focus:border-[#666] focus:outline-none transition-colors"
                                        value={section.content}
                                        onChange={(e) => {
                                            handleSectionChange(index, 'content', e.target.value);
                                            adjustTextareaHeight(e.target);
                                        }}
                                        placeholder="Section content (supports basic markdown)..."
                                        rows="1"
                                    />
                                </div>

                                {/* Extra Media: Image & Code */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-dashed border-[#222]">
                                    {/* Image */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-[#666] text-sm">
                                            <FaImage /> Image URL
                                        </div>
                                        <input
                                            value={getStringVal(section.image)}
                                            onChange={(e) => handleSectionChange(index, 'image', [e.target.value])}
                                            placeholder="https://..."
                                            className="w-full p-2.5 bg-[#050505] border border-[#333] rounded-md text-white focus:border-[#666] focus:outline-none transition-colors"
                                        />
                                        {getStringVal(section.image) && (
                                            <img src={getStringVal(section.image)} className="mt-2 max-h-[100px] rounded border border-[#333]" alt="Section" />
                                        )}
                                    </div>

                                    {/* Code */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-[#666] text-sm">
                                            <FaCode /> Code Snippet
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                value={getStringVal(section.code_language)}
                                                onChange={(e) => handleSectionChange(index, 'code_language', [e.target.value])}
                                                placeholder="Language (e.g. javascript)"
                                                className="w-full p-2 bg-[#050505] border border-[#333] rounded-md text-[#888] text-sm focus:border-[#666] focus:outline-none transition-colors"
                                            />
                                            <textarea
                                                className="auto-resize w-full p-2.5 bg-[#050505] border border-[#333] rounded-md text-[#d4d4d4] font-mono text-sm resize-none overflow-hidden min-h-[80px] focus:border-[#666] focus:outline-none transition-colors"
                                                value={getStringVal(section.code)}
                                                onChange={(e) => {
                                                    handleSectionChange(index, 'code', [e.target.value]);
                                                    adjustTextareaHeight(e.target);
                                                }}
                                                placeholder="Paste code here..."
                                                rows="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addSection}
                        className="w-full py-8 border-2 border-dashed border-[#333] rounded-2xl bg-transparent text-[#666] text-lg font-semibold cursor-pointer flex items-center justify-center gap-3 transition-colors hover:border-[#666] hover:text-white"
                    >
                        <FaPlus /> Add New Section
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
