<template>
  <div>
    <h1>Update Category</h1>
    <form>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          v-model="book.title"
          id="title"
          aria-describedby="title"
          value="{{ book.title }}"
        />
      </div>
      <div class="mb-3">
        <label for="categoryId" class="form-label">Category</label>
        <select class="form-select" aria-label="Select category" v-model="book.categoryId" @change="handleSelectionChange">
          <option v-for="item in this.listCategory" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input
          type="text"
          class="form-control"
          v-model="book.price"
          id="price"
          aria-describedby="price"
          value="{{ book.price }}"
        />
      </div>
      <div class="mb-3">
        <label for="author" class="form-label">Author</label>
        <input
          type="text"
          class="form-control"
          v-model="book.author"
          id="author"
          aria-describedby="author"
          value="{{ book.author }}"
        />
      </div>
      <div class="mb-3">
        <label for="isbn" class="form-label">Isbn</label>
        <input
          type="text"
          class="form-control"
          v-model="book.isbn"
          id="isbn"
          aria-describedby="isbn"
          value="{{ book.isbn }}"
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input
          type="text"
          class="form-control"
          v-model="book.description"
          id="description"
          aria-describedby="description"
          value="{{ book.description }}"
        />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="updateBook">
        Submit
      </button>
      <router-link to="/books">
        <button type="submit" class="btn ms-2">Back</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import axiosInterceptor from "../../service/AxiosInteceptorToken";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "UpdateBookView",
  components: {},
  data() {
    return {
      book: {
        categoryId: "",
        price: "",
        isbn: "",
        author: "",
        title: "",
        description: "",
      },
      token: "",
      listCategory: []
    };
  },
  mounted() {
    this.getBook();
    this.getCategories();
  },
  methods: {
    getBook() {
      this.token = localStorage.getItem("token");
      let id = this.$route.params.id;

      if (this.token != "") {
        axiosInterceptor
          .get(`/admin/books/${id}`)
          .then((response) => {
            // JSON responses are automatically parsed.
            this.book.title = response.data.title;
            this.book.author = response.data.author;
            this.book.price = response.data.price;
            this.book.isbn = response.data.isbn;
            this.book.price = response.data.price;
            this.book.categoryId = response.data.categoryId;
            this.book.description = response.data.description;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async updateBook() {
      let id = this.$route.params.id;

      await axiosInterceptor
        .put(`/admin/books/${id}`, this.book)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log(response.data);
          toast.success("Update book success!", {
            autoClose: 1000,
          });

          if (response.data != "") {
            setTimeout(() => {
              this.$router.push("/books");
            }, 2000);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getCategories() {
      await axiosInterceptor
        .get("/admin/categories")
        .then((response) => {
          // JSON responses are automatically parsed.
          if (response.data != "") {
            this.listCategory = response.data.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
};
</script>
