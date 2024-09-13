import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchResults.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue')
    },
    {
      path: '/categories/:category',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue')
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/components/ViewProduct.vue')
    },
    {
      path: '/:catchAll(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

router.afterEach(() => {
  // Scroll to the top of the page after navigation
  window.scrollTo(0, 0)
})

export default router
