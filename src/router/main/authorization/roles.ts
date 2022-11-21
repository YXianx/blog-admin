const roles = () => import('@/views/main/authorization/roles/roles.vue')
export default {
  path: '/main/roles',
  name: 'roles',
  component: roles,
  children: []
}
