import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeShiki from '@shikijs/rehype'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    {
        enforce: 'pre',
        ...mdx({
            remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
            rehypePlugins: [[rehypeShiki, { theme: 'github-dark' }]] 
        })
    },
    react(), 
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['react-icons/fa', 'react-icons/fa6', 'react-icons/io5', 'react-icons/bs', 'react-icons/md', 'react-icons/gi', 'react-icons/si']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://portfolio-chatbot-3pee.onrender.com',
        changeOrigin: true,
      },
      '/api/contact': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {},
    global: 'window',
  },
})
