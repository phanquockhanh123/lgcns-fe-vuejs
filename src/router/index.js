import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateUserView from '../components/CreateUserView.vue'
import FormLogin from '../components/FormLogin.vue'
import FormRegister from '../components/FormRegister.vue'
import UserView from '../views/UserView.vue'

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
