import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ScrollToTop from '@/components/common/ScrollToTop';

import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail'; // Changed from BlogPost to BlogDetail to match new file
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Contact from '@/pages/Contact';
import Resume from '@/pages/Resume';
import Setup from '@/pages/Setup';
import Journey from '@/pages/Journey';
import WorkExperience from '@/pages/WorkExperience';
import Gears from '@/pages/Gears';
import NotFound from '@/pages/NotFound';
import Books from '@/pages/Books';
import Movies from '@/pages/Movies';
import Youtubers from '@/pages/Youtubers';
import SocialPresence from '@/pages/SocialPresence';

// Admin Imports
import AdminRoute from '@/components/admin/AdminRoute';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BlogEditor from '@/components/admin/BlogEditor';
import AuthRedirectHandler from '@/components/auth/AuthRedirectHandler';


import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthRedirectHandler />
            <ScrollToTop />
            <RootLayout>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Public Blog Routes */}
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    <Route path="/admin/create" element={
                        <AdminRoute>
                            <BlogEditor />
                        </AdminRoute>
                    } />
                    <Route path="/admin/edit/:id" element={
                        <AdminRoute>
                            <BlogEditor />
                        </AdminRoute>
                    } />

                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/setup" element={<Setup />} />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/work-experience" element={<WorkExperience />} />
                    <Route path="/gears" element={<Gears />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/youtubers" element={<Youtubers />} />
                    <Route path="/social-presence" element={<SocialPresence />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </RootLayout>
        </BrowserRouter>
    );
}

export default App;