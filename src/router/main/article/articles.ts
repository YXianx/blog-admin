const articles = () => import('@/views/main/article/articles/articles.vue')
export default {
  path: '/main/articles',
  name: 'articles',
  component: articles,
  children: [
    {
      path: '/main/articles/:id',
      name: 'articlesUpdate',
      component: articles,
      children: []
    }
  ]
}
