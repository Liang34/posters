import { createApp } from 'vue'
import axios from 'axios'
// import Antd from 'ant-design-vue'
import Antd from './configAntD'
import PosterComponents from 'poster-components'
import 'ant-design-vue/dist/antd.less'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'
import router from './router'
import store, { ICustomAxiosConfig } from './store'


const app = createApp(App)

app.use(store).use(router).use(Antd).use(PosterComponents)
app.mount('#app')
