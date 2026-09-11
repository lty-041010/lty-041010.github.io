import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  /**
   * 默认 Hash 模式：GitHub Pages 刷新不会 404。
   * 想换成 History 模式：把下面这行换成
   *   createWebHistory(import.meta.env.BASE_URL)
   * 并在构建后把 dist/index.html 复制为 dist/404.html。
   */
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/posts', name: 'posts', component: () => import('@/views/PostsView.vue') },
    {
      path: '/posts/:slug',
      name: 'post',
      component: () => import('@/views/PostView.vue'),
      props: true,
    },
    { path: '/tags', name: 'tags', component: () => import('@/views/TagsView.vue') },
    {
      path: '/tags/:tag',
      name: 'tag',
      component: () => import('@/views/PostsView.vue'),
      props: true,
    },
    { path: '/archive', name: 'archive', component: () => import('@/views/ArchiveView.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 88 }
    return { top: 0 }
  },
})

export default router