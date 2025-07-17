import './assets/main.css'
//有时候 ElMessage 实际已经创建，但因为样式丢失（如未正确引入 CSS）导致看不见提示。确认你是否正确引入了 Element Plus 的样式
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
const app = createApp(App)
/* 
全局注册组件
1、引入组件
import ... from "...."
2、注册组件
app.component("name",Component)

可在此应用任何任意组件的模板中使用该组件
*/
app.use(createPinia())
app.use(router)

app.mount('#app')
