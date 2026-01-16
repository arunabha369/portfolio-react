import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ScrollToTop from '@/components/common/ScrollToTop';

import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
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

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <RootLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </RootLayout>
        </BrowserRouter>
    );
}

export default App;