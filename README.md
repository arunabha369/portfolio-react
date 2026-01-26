# ⚡ Arunabha's Portfolio

A modern, high-performance developer portfolio built with the latest web technologies. This project features a dynamic blog system, AI-powered chat assistant, admin dashboard, and a highly responsive UI with smooth animations.

## 🚀 Features

- **🎨 Modern UI/UX:** Built with React 18, TailwindCSS v4, and Shadcn/UI for a premium aesthetic. Includes dark mode support.
- **📝 Dynamic Blog:** Full-featured blog system supporting MDX, code highlighting, and admin management.
- **🤖 AI Assistant:** Integrated AI chatbot powered by [portfolio-chatbot](https://github.com/arunabha369/portfolio-chatbot) to answer visitor questions. Uses RAG (Retrieval-Augmented Generation) with Groq (GPT-OSS 120B) and LangChain to provide context-aware responses based on your portfolio data.
- **🔐 Admin Dashboard:** Secure route for creating and editing blog posts directly from the UI.
- **📬 Smart Contact:** Contact form integrated with Telegram for instant notifications on your phone.
- **⚡ Super Fast:** Powered by Vite, with smooth page transitions using Lenis and Framer Motion.
- **📊 Comprehensive:** Sections for Projects, Work Experience, Tech Stack, Gear, Books, and more.

## 🛠️ Tech Stack

### Frontend
- **Core:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** Phosphor Icons, Lucide React

### Backend & Services
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Server:** Node.js / Express (for API proxying & AI integration)
- **Chatbot Backend:** [Portfolio Chatbot](https://github.com/arunabha369/portfolio-chatbot)
  - **Runtime:** Node.js, Express
  - **LLM:** Groq (GPT-OSS 120B)
  - **Orchestration:** LangChain.js
  - **Context:** Local RAG with HNSWLib & Xenova embeddings
- **Notifications:** Telegram Bot API
- **Forms:** [Formspree](https://formspree.io/) for contact submissions, [Zod](https://zod.dev/) for schema validation


## 🏗️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase project
- A Telegram Bot (for contact form notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio-react.git
cd portfolio-react
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Server Configuration
PORT=3001

# Supabase (for Frontend)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


# Telegram Notifications (for Contact Form)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 4. Run Locally
To run both the frontend and the backend server concurrently:

```bash
npm run dev
```
- Frontend will run on `http://localhost:5173`
- Backend API will run on `http://localhost:3001`

## 📂 Project Structure

```
portfolio-react/
├── server/                 # Express backend for Contact form
│   └── index.js           # Main server entry point
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── auth/          # Authentication handlers
│   │   ├── blog/          # Blog rendering & cards
│   │   └── ui/            # Shadcn UI primitives
│   ├── pages/             # Main route pages (Home, Projects, Blog...)
│   ├── config/            # Static configuration files
│   ├── hooks/             # Custom React hooks
│   └── App.jsx            # Main application router
├── public/                # Static assets
└── package.json           # Project dependencies & scripts
```

## 🔒 Admin Access
The admin routes (`/admin`) are protected. You need to be authenticated via Supabase to access the dashboard for creating or editing blog posts.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
