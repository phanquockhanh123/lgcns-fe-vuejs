import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateUserView from '../components/CreateUserView.vue'
import FormLogin from '../components/FormLogin.vue'
import FormRegister from '../components/FormRegister.vue'
import UserView from '../views/UserView.vue'
import BookView from '../views/BookView.vue'
import CategoryView from '../views/CategoryView.vue'
import CreateCategoryView from '../components/CreateCategoryView.vue'
import UpdateCategoryView from '../components/UpdateCategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: FormLogin,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/create',
      name: 'CreateUser',
      component: CreateUserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: FormRegister,
      meta: { requiresAuth: false }
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/books',
      name: 'books',
      component: BookView,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/create',
      name: 'create_categories',
      component: CreateCategoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/update/:id',
      name: 'update_categories',
      component: UpdateCategoryView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
