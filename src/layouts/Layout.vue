<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="nav-link active">DASH BOARD</router-link>
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
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link active"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link"
              >Categories</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/books" class="nav-link">Books</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/users" class="nav-link">Users</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
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
    return {};
  },
  methods: {
    logout() {

      toast.success("You will logout after 3 seconds!!", {
        autoClose: 1000,
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        this.$router.push("/login");
      }, 2000);
    },
  },
  computed: {
    isLoggedIn() {
      return !localStorage.getItem("token");
    },
  },
};
</script>
