import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        {
          src: 'public/icon*.png',
          dest: '.',
        },
        {
          src: 'node_modules/.pnpm/monaco-editor@0.52.2/node_modules/monaco-editor/min/vs/**/*',
          dest: 'assets/vs/',
        }
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        popup: './index.html',
        background: './src/background/background.ts',
        content: './src/content/content.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          if (chunkInfo.name === 'content') {
            return 'content.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    target: 'esnext',
    minify: false,
  },
  define: {
    global: 'globalThis',
  },
});