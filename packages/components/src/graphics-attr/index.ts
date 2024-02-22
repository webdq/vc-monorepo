import GraphicsAttr from './src/graphics-attr.vue'
import { withInstall } from '../utils/with-install'

export * from './src/graphics-attr'

export const VcGraphicsAttr = withInstall(GraphicsAttr)

export default VcGraphicsAttr

declare module 'vue' {
  export interface GlobalComponents {
    VcGraphicsAttr: typeof VcGraphicsAttr
  }
}
