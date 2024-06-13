<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/dashboard" class="nav-link active"
        >DASH BOARD</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li v-for="(item, i) in MainNavLinks" :key="i">
            <router-link
              class="nav-link"
              :to="item.link"
              v-if="isLoggedIn && item.roles.includes(role)"
              >{{ item.name }}</router-link
            >
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-else>
            <a href="" @click.prevent="logout" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="col-sm-12 p-2">
    <router-view></router-view>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "NavBar",
  data() {
    return {
      role: localStorage.getItem("role"),
      MainNavLinks: [
        {
          name: "Category",
          link: "/categories",
          roles: ["ADMIN"],
        },{
          name: "Books",
          link: "/books",
          roles: ["ADMIN", "USER", "MANAGER"],
        },
        {
          name: "Users",
          link: "/users",
          roles: ["ADMIN", "MANAGER"],
        }
      ],
    };
  },
  methods: {
    logout() {
      toast.success("You will logout after 3 seconds!!", {
        autoClose: 1000,
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        this.$router.push("/login");
      }, 2000);
    },
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem("token");
    },
  },
};
</script>
