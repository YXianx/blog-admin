const users = () => import('@/views/main/user/users/users.vue')

export default {
  path: '/main/users',
  name: 'users',
  component: users,
  children: []
}
