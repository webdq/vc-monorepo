import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: ['cesium'],
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
      name: 'VcMaterials',
      fileName: 'vc-materials'
    }
  }
})
