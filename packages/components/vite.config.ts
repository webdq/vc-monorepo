import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: [
        'vue',
        'cesium',
        'vue-cesium',
        'ant-design-vue',
        '@ant-design/icons-vue',
        '@iconify/vue',
        '@vueuse/core',
        '@webdq/vc-draw-helper',
        '@webdq/vc-materials',
        'dayjs',
        'gl-matrix',
        'lodash-es',
        'nanoid',
        'vue-accessible-color-picker'
      ],
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
      name: 'VcComponents',
      fileName: 'vc-components'
    }
  }
})
