import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/HomeView.vue";
import FormLogin from "../views/auth/FormLogin.vue";
import FormRegister from "../views/auth/FormRegister.vue";
import BookView from "../views/books/BookView.vue";
import CategoryView from "../views/categories/CategoryView.vue";
import Layout from "../layouts/Layout.vue";
import UserView from "../views/users/UserView.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard",
        name: "home",
        component: HomeView,
        meta: { requiresAuth: true },
      },
      {
        path: "/books",
        name: "books",
        component: BookView,
        meta: { requiresAuth: true },
      },
      {
        path: "/users",
        name: "users",
        component: UserView,
        meta: { requiresAuth: true },
      },
      {
        path: "/categories",
        name: "categories",
        component: CategoryView,
        meta: { requiresAuth: true },
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: FormLogin
  },
  {
    path: "/register",
    name: "register",
    component: FormRegister,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
