import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import Loading from '@/components/common/Loading';
import AuthRedirectHandler from '@/components/auth/AuthRedirectHandler';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const Resume = lazy(() => import('@/pages/Resume'));
const Setup = lazy(() => import('@/pages/Setup'));
const Journey = lazy(() => import('@/pages/Journey'));
const WorkExperience = lazy(() => import('@/pages/WorkExperience'));
const Gears = lazy(() => import('@/pages/Gears'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Books = lazy(() => import('@/pages/Books'));
const Movies = lazy(() => import('@/pages/Movies'));
const Youtubers = lazy(() => import('@/pages/Youtubers'));
const SocialPresence = lazy(() => import('@/pages/SocialPresence'));

// Admin Imports (Lazy loaded as well)
const AdminRoute = lazy(() => import('@/components/admin/AdminRoute'));
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));
const BlogEditor = lazy(() => import('@/components/admin/BlogEditor'));


import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthRedirectHandler />
            <ScrollToTop />
            <RootLayout>
                <Suspense fallback={<Loading />}>
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
                </Suspense>
            </RootLayout>
        </BrowserRouter>
    );
}

export default App;