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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio', '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible', '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar', '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress', '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip', 'lucide-react', 'react-icons'],
          utils: ['date-fns', 'axios', 'clsx', 'tailwind-merge'],
          syntax: ['react-syntax-highlighter', 'refractor']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
})
