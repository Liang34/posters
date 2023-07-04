import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less'
import router from './router';
import store from './store/index';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import PosterComponent from 'poster-components'

createApp(App).use(Antd).use(PosterComponent).use(router).use(store).mount('#app')