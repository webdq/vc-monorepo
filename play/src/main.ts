import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import VueCesium from 'vue-cesium'
import '@webdq/vc-materials'
import VcComponents from '@webdq/vc-components'
import App from './App.vue'
import router from './router'

import 'ant-design-vue/dist/antd.variable.css'
import 'vue-cesium/dist/index.css'
import '@webdq/vc-components/dist/style.css'
import '@webdq/vc-draw-helper/dist/style.css'
import './style.css'

const app = createApp(App)
app.use(router)
app.use(Antd as any)
app.use(VueCesium)
app.use(VcComponents)
app.mount('#app')
