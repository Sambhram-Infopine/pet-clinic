import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.API_PROXY_TARGET;

  if (!apiTarget) {
    throw new Error(
      'Missing API_PROXY_TARGET. Copy .env.example to .env.local and set your backend URL.'
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/login': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
