import Appwrite from '@/components/technologies/Appwrite';
import Bun from '@/components/technologies/Bun';
import CSS from '@/components/technologies/CSS';
import ExpressJs from '@/components/technologies/ExpressJs';
import Github from '@/components/technologies/Github';
import Html from '@/components/technologies/Html';
import JavaScript from '@/components/technologies/JavaScript';
import MDXIcon from '@/components/technologies/MDXIcon';
import MongoDB from '@/components/technologies/MongoDB';
import Motion from '@/components/technologies/Motion';
import Netlify from '@/components/technologies/Netlify';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Prisma from '@/components/technologies/Prisma';
import ReactIcon from '@/components/technologies/ReactIcon';
import Sanity from '@/components/technologies/Sanity';
import Shadcn from '@/components/technologies/Shadcn';
import SocketIo from '@/components/technologies/SocketIo';
import TailwindCss from '@/components/technologies/TailwindCss';
import ThreeJs from '@/components/technologies/ThreeJs';
import TypeScript from '@/components/technologies/TypeScript';
import Vercel from '@/components/technologies/Vercel';

export const projects = [
    {
        title: "HRSphere",
        description: "A scalable Human Resource Management System that streamlines core HR processes — from employee records and attendance to recruitment, payroll, and performance.",
        image: '/project/hrsphere.png',
        link: 'https://hrsphere.arunabha.dev/',
        github: 'https://github.com/arunabha369/HRSphere',
        live: 'https://hrsphere.arunabha.dev/',
        technologies: [
            { name: 'React', icon: <ReactIcon key="react" /> },
            { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
            { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
            { name: 'Express', icon: <ExpressJs key="express" /> },
            { name: 'Tailwind CSS', icon: <TailwindCss key="tailwind" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/hrsphere',
        isWorking: false
    },
    {
        title: "Puja Parikrama Planner",
        description: "An interactive web app to plan and optimize your Durga Puja pandal-hopping journey with smart routes, maps, and personalized itineraries.",
        image: '/project/pujaparikrama.png',
        link: 'https://pujaparikrama.online',
        github: 'https://github.com/arunabha369/puja-parikrama',
        live: 'https://pujaparikrama.online',
        technologies: [
            { name: 'HTML', icon: <Html key="html" /> },
            { name: 'CSS', icon: <CSS key="css" /> },
            { name: 'JavaScript', icon: <JavaScript key="js" /> },
            { name: 'Netlify', icon: <Netlify key="netlify" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/puja-parikrama',
        isWorking: true
    },
    {
        title: "CodeMate",
        description: "A MERN-based developer matchmaking platform that helps programmers discover collaborators though swipe-based matching.",
        image: '/project/codemate.png',
        link: 'https://codemate.arunabha.dev/',
        github: 'https://github.com/arunabha369/CodeMate',
        live: 'https://codemate.arunabha.dev/',
        technologies: [
            { name: 'React', icon: <ReactIcon key="react" /> },
            { name: 'Tailwind CSS', icon: <TailwindCss key="tailwind" /> },
            { name: 'shadcn/ui', icon: <Shadcn key="shadcn" /> },
            { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
            { name: 'Express', icon: <ExpressJs key="express" /> },
            { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
            { name: 'Socket.io', icon: <SocketIo key="socketio" /> },
            { name: 'Motion', icon: <Motion key="motion" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/codemate',
        isWorking: false
    },
    {
        title: "Bharat-Darshan",
        description: "A comprehensive travel platform showcasing the diverse cultural and natural heritage of India.",
        image: '/project/bharatdarshan.png',
        link: '#',
        github: 'https://github.com/arunabha369/Bharat-Darshan',
        technologies: [
            { name: 'React', icon: <ReactIcon key="react" /> },
            { name: 'JavaScript', icon: <JavaScript key="js" /> },
            { name: 'HTML', icon: <Html key="html" /> },
            { name: 'CSS', icon: <CSS key="css" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/bharat-darshan',
        isWorking: false
    },
    {
        title: "Puja Parikrama v2",
        description: "Plan your perfect Durga Puja journey! 🎉 Puja Parikrama Planner is a web app that helps you discover pandals, generate smart itineraries, explore interactive maps, and save/share your personalized Puja plan.",
        image: '/project/pujaparikrama.png',
        link: 'https://pujaparikrama.in',
        github: 'https://github.com/arunabha369/puja-parikrama-v2',
        live: 'https://pujaparikrama.in',
        technologies: [
            { name: 'React', icon: <ReactIcon key="react" /> },
            { name: 'JavaScript', icon: <JavaScript key="js" /> },
            { name: 'Netlify', icon: <Netlify key="netlify" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/puja-parikrama-v2',
        isWorking: false
    },
    {
        title: "Portfolio Chatbot",
        description: "AI-powered portfolio chatbot backend built with Node.js, Express, LangChain, and Groq (Llama 3). Uses RAG to answer questions about my skills and projects.",
        image: '/project/portfolio-chatbot.png',
        link: 'https://github.com/arunabha369/portfolio-chatbot',
        github: 'https://github.com/arunabha369/portfolio-chatbot',
        technologies: [
            { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
            { name: 'Express', icon: <ExpressJs key="express" /> },
            { name: 'JavaScript', icon: <JavaScript key="js" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/portfolio-chatbot',
        isWorking: true
    },
    {
        title: "Portfolio Website",
        description: "A modern, high-performance portfolio website designed to showcase my journey as a Full Stack Developer. Built with a focus on speed, aesthetics, and user experience.",
        image: '/project/portfolio-website.png',
        link: 'https://arunabha.dev',
        github: 'https://github.com/arunabha369/portfolio-react',
        live: 'https://arunabha.dev',
        technologies: [
            { name: 'React', icon: <ReactIcon key="react" /> },
            { name: 'Tailwind CSS', icon: <TailwindCss key="tailwind" /> },
            { name: 'shadcn/ui', icon: <Shadcn key="shadcn" /> },
            { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
            { name: 'Express', icon: <ExpressJs key="express" /> },
            { name: 'Motion', icon: <Motion key="motion" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/portfolio-website',
        isWorking: true
    },
    {
        title: "Aahar Sathi",
        description: "AI-Powered Nutrition & Budget Meal Companion (India-First). Aahar Sathi is an AI-driven nutrition tracking and food recommendation platform designed specifically for Indian users.",
        image: '/project/aahar-sathi.png',
        link: 'https://aaharsathi.in/',
        github: 'https://github.com/arunabha369/aahar-sathi',
        live: 'https://aaharsathi.in/',
        technologies: [
            { name: 'Next.js', icon: <NextJs key="nextjs" /> },
            { name: 'Tailwind CSS', icon: <TailwindCss key="tailwind" /> },
            { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
            { name: 'Express', icon: <ExpressJs key="express" /> },
            { name: 'MongoDB', icon: <MongoDB key="mongodb" /> }
        ],
        details: true,
        projectDetailsPageSlug: '/projects/aahar-sathi',
        isWorking: false
    }
];