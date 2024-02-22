import type { App } from 'vue'
import VcEarth from './earth'
import VcToolbar from './toolbar'
import VcDrawingPlus from './drawing-plus'
import VcGraphicsAttr from './graphics-attr'

const components = [VcEarth, VcToolbar, VcDrawingPlus, VcGraphicsAttr]

// import * as components from './components'

const install = (app: App) => {
  // Object.keys(components).forEach((key) => {
  //   const component = components[key as keyof typeof components]
  //   if (component.install) {
  //     app.use(component)
  //   }
  // })
  components.forEach((component) => {
    if (component.install) {
      app.use(component)
    }
  })
}

export default {
  install
}

export * from './earth'
export * from './toolbar'
export * from './drawing-plus'
export * from './graphics-attr'
