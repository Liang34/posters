import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
import MyWork from '../views/MyWork.vue'
import Setting from '../views/Setting.vue'
import store from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      { path: '', name: 'Home', component: Home, meta: { title: '欢迎来到海报大师' } },
      { path: 'mywork', name: 'MyWork', component: MyWork, meta: { requiredLogin: true, title: '我的设计列表' } },
      { path: 'setting', name: 'Setting', component: Setting, meta: { requiredLogin: true, title: '我的信息' } }
    ]
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue'),
    meta: { requiredLogin: true, title: '编辑我的设计' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { redirectAlreadyLogin: true, title: '登录到海报大师' }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return Promise.resolve({ left: 0, top: 0 })
    }
  }
})

router.beforeEach((to, from, next) => {
  const { user } = store.state
  const { token, isLogin } = user
  const { requiredLogin, redirectAlreadyLogin, title } = to.meta
  console.log('token', token)
  if (title) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    document.title = title
  }
  if (!isLogin) {
    if (token) {
      store.dispatch('fetchCurrentUser').then((data: any) => {
        next();
      }).catch(e => {
        console.error(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
