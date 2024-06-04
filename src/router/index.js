import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import FormLogin from '../views/auth/FormLogin.vue'
import FormRegister from '../views/auth/FormRegister.vue'
import BookView from '../views/books/BookView.vue'
import CategoryView from '../views/categories/CategoryView.vue'
import CreateCategoryView from '../views/categories/CreateCategoryView.vue'
import UpdateCategoryView from '../views/categories/UpdateCategoryView.vue'
import CreateBookView from '../views/books/CreateBookView.vue'
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
      path: '/register',
      name: 'register',
      component: FormRegister,
      meta: { requiresAuth: false }
    },
    {
      path: '/books',
      name: 'books',
      component: BookView,
      meta: { requiresAuth: true }
    },
    {
      path: '/books/create',
      name: 'createBooks',
      component: CreateBookView,
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
      name: 'createCategories',
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
