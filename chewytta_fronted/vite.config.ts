import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 假设后端运行在8080端口
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:8080', // 代理静态文件访问
        changeOrigin: true
      },
      '/admin-content': {
        target: 'http://localhost:8080', // 代理管理员内容访问
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
