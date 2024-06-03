<template>
  <main>
    <nav-bar></nav-bar>
    <div>
      <h1>List Books</h1>
      <button class="btn btn-outline-primary">
        <router-link to="/books/create">Create</router-link>
      </button>
      <!-- Form search -->
      <div class="form-search">
        <div class="input-box">
          <input
            type="text"
            class="input-field"
            v-model="title"
            placeholder="Title"
          />
          <input
            type="text"
            class="input-field"
            v-model="author"
            placeholder="Author"
          />
          <input
            type="submit"
            class="submit"
            @click.prevent="searchBook"
            value="Search"
          />
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Author</th>
          <th scope="col">Isbn</th>
          <th scope="col">Synopsis</th>
          <th scope="col">BookCover</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="book in listBooks" v-bind:key="book.id">
          <th scope="row">{{ book.id }}</th>
          <td>{{ book.title }}</td>
          <td>{{ book.authorName }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.synopsis }}</td>
          <td>{{ book.bookCover }}</td>
          <th></th>
        </tr>
      </tbody>
    </table>
    <!-- Add the Bootstrap-Vue pagination component -->
    <b-pagination
      v-model="currentPage"
      :total-rows="totalItems"
      :per-page="itemsPerPage"
    ></b-pagination>
  </main>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar.vue";

export default {
  name: "BookView",
  components: { NavBar},
  data() {
    return {
      listBooks: [],
      title: "",
      author: "",
      token: "",
      currentPage: 0,
      totalItems: 0,
      itemsPerPage: 20,
    };
  },
  methods: {
    async searchBook() {
      this.token = localStorage.getItem("token");

      if (this.token != "") {
        await axios
          .get("http://localhost:8081/api/v1/admin/books", {
            params: {
              title: this.title,
              author: this.author,
            },
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((response) => {
            this.listBooks = response.data.data;
            this.totalItems = response.data.totalElements;
            this.currentPage = response.data.number;
            this.itemsPerPage = response.data.size;
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => (this.loading = false));
      }
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");

    if (this.token != "") {
      axios
        .get("http://localhost:8081/api/v1/admin/books", {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.listBooks = response.data.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    }
  },
};
</script>
