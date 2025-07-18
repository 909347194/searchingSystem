//路由规则设置
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
    ,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/DashboardView.vue'),
    children: [
      {
        path: 'query',
        name: 'query',
        component: () => {
          return import('../components/Query.vue')
        }
      },
      {
        path: 'userinfo',
        name: 'userinfo',
        component: () => import('../components/UserInfo.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../components/Settings.vue'),

      },
      {
        path: 'filemanagement',
        name: 'filemanagement',
        component: () => import('../components/FileManagement.vue'),
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => {
      return import('../views/LoginView.vue')
    }
  },

]

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


export default router
