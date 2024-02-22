import DrawingPlus from './src/drawing-plus.vue'
import { withInstall } from '../utils/with-install'

export * from './src/drawing-plus'

export const VcDrawingPlus = withInstall(DrawingPlus)

export default VcDrawingPlus

declare module 'vue' {
  export interface GlobalComponents {
    VcDrawingPlus: typeof VcDrawingPlus
  }
}
