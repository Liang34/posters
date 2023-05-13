import { createRouter, createWebHistory} from 'vue-router';
import Index from '../view/index.vue';
import Home from '../view/Home.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/',
            name: 'index',
            component: Index,
            children: [
                { path: '', name: 'home', component: Home, meta: { title: '欢迎来到海报编辑器' } },
            ]
        }
    ],
});
export default router;