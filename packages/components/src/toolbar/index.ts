import Toolbar from './src/toolbar.vue'
import { withInstall } from '../utils/with-install'

export * from './src/toolbar'

export const VcToolbar = withInstall(Toolbar)

export default VcToolbar

declare module 'vue' {
  export interface GlobalComponents {
    VcToolbar: typeof VcToolbar
  }
}
