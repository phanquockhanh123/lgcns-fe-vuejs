import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/HomeView.vue";
import FormLogin from "../views/auth/FormLogin.vue";
import FormRegister from "../views/auth/FormRegister.vue";
import BookView from "../views/books/BookView.vue";
import CategoryView from "../views/categories/CategoryView.vue";
import Layout from "../layouts/Layout.vue";
import UserView from "../views/users/UserView.vue";
import ForbiddenPage from "../views/pageStatus/403.vue"
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
        meta: {
          requiresAuth: true,
          roles: ["USER", "ADMIN", "MANAGER"],
        },
      },
      {
        path: "/books",
        name: "books",
        component: BookView,
        meta: { requiresAuth: true, roles: ["USER", "ADMIN", "MANAGER"] },
      },
      {
        path: "/users",
        name: "users",
        component: UserView,
        meta: { requiresAuth: true, roles: ["ADMIN", "MANAGER"] },
      },
      {
        path: "/categories",
        name: "categories",
        component: CategoryView,
        meta: { requiresAuth: true, roles: ["ADMIN"] },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: FormLogin,
  },
  {
    path: "/register",
    name: "register",
    component: FormRegister,
    meta: { requiresAuth: false },
  },
  {
    path: "/403",
    name: "403",
    component: ForbiddenPage,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  const role = JSON.parse(localStorage.getItem("profile"))?.role || "";

  const id = JSON.parse(localStorage.getItem("profile"))?.id || "";

  const firstName = JSON.parse(localStorage.getItem("profile"))?.firstName || "";
  const lastName = JSON.parse(localStorage.getItem("profile"))?.lastName || "";

  localStorage.setItem("role", role);
  localStorage.setItem("userId", id);
  localStorage.setItem("fullName", firstName + " " + lastName);
  

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: "login" });
    } else {
      const requiredRoles = to.meta.roles || [];
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        // Redirect to a "not authorized" page or home
        next({ name: "403" });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
