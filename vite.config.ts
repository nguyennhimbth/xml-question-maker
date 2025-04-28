
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true, // Listen on all addresses, including network
    strictPort: true, // Throw if port is already in use
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://ktvjsxucoigarjgqchza.supabase.co wss://ktvjsxucoigarjgqchza.supabase.co ws://localhost:* https://*.lovableproject.com https://*.lovable.app;",
    },
    fs: {
      strict: true,
      allow: ['..'],
    },
  },
  preview: {
    port: 8080,
    host: true, // Listen on all addresses
    strictPort: true, // Throw if port is already in use
  },
}));
