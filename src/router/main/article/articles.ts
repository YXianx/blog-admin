const articles = () => import('@/views/main/article/articles/articles.vue')
const articleList = () => import('@/views/main/article/articles/article-list.vue')
export default {
  path: '/main/articles',
  name: 'articles',
  component: articles,
  children: [
    {
      path: '/main/articles/:id',
      name: 'articles-update',
      component: articleList,
      children: []
    }
  ]
}
