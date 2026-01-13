import { createRouter, createWebHistory } from 'vue-router'
import WidgetList from '../views/WidgetList.vue'
import WidgetDetail from '../views/WidgetDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WidgetList
    },
    {
      path: '/widget/:id',
      name: 'widget-detail',
      component: WidgetDetail
    }
  ]
})

export default router

