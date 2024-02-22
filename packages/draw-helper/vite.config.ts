import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: ['cesium', 'dayjs', 'decimal.js', 'gl-matrix'],
      output: {
        exports: 'named',
        globals: {
          cesium: 'Cesium'
        }
      }
    },
    lib: {
      formats: ['es', 'cjs'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VcDrawHelper',
      fileName: 'vc-draw-helper'
    }
  }
})
