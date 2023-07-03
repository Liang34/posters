import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/index.vue';
import Home from '../views/Home.vue';
import Works from '../views/Works.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            children: [
                { path: '', name: 'home', component: Home, meta: { title: '欢迎来到海报大师' } },
                { path: 'works', name: 'works', component: Works, meta: { title: '我的作品', requiredLogin: true, } }
            ]
        },
        {
            path: '/editor/:id',
            name: 'editor',
            component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue'),
            meta: { requiredLogin: true, title: '编辑我的设计' }
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