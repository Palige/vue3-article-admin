import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'   //注册 element icon图标
import '@/assets/main.scss'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia)
app.use(router)
app.use(ElementPlusIconsVue)
app.mount('#app')
