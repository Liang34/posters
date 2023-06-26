import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/index.vue';
import Home from '../views/Home.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            children: [
                { path: '', name: 'home', component: Home, meta: { title: '欢迎来到海报大师' } },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
            meta: { redirectAlreadyLogin: true, title: '登录到海报大师', disableLoading: true }
        }
    ],
});
export default router;