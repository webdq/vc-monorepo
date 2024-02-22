import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  server: {
    watch: {
      ignored: [
        '!**/node_modules/@webdq/vc-components/**',
        '!**/node_modules/@webdq/vc-draw-helper/**',
        '!**/node_modules/@webdq/vc-materials/**'
      ]
    }
  },
  optimizeDeps: {
    exclude: [
      '@webdq/vc-components',
      '@webdq/vc-draw-helper',
      '@webdq/vc-materials'
    ]
  }
})
