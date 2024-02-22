import Earth from './src/earth.vue'
import { withInstall } from '../utils/with-install'

export * from './src/earth'

export const VcEarth = withInstall(Earth)

export default VcEarth

declare module 'vue' {
  export interface GlobalComponents {
    VcEarth: typeof VcEarth
  }
}
