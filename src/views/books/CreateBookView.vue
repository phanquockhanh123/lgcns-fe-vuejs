<template>
  <div>
    <h1>Create Book</h1>
    <form>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          :class="['form-control', { 'is-invalid': errors.title }]"
          v-model="book.title"
          id="tile"
          aria-describedby="title"
          @blur="validateField('title')"
        />
        <span class="text-error" v-if="errors.title">{{ errors.title }}</span>
      </div>
      <div class="mb-3">
        <label for="categoryId" class="form-label">Category ID</label>
        <input
          type="text"
          :class="['form-control', { 'is-invalid': errors.categoryId }]"
          v-model="book.categoryId"
          id="categoryId"
          aria-describedby="categoryId"
          @blur="validateField('categoryId')"
        />
        <span class="text-error" v-if="errors.categoryId">{{
          errors.categoryId
        }}</span>
      </div>
      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input
          type="text"
          :class="['form-control', { 'is-invalid': errors.price }]"
          v-model="book.price"
          id="price"
          aria-describedby="price"
          @blur="validateField('price')"
        />
        <span class="text-error" v-if="errors.price">{{ errors.price }}</span>
      </div>
      <div class="mb-3">
        <label for="author" class="form-label">Author</label>
        <input
          type="text"
          :class="['form-control', { 'is-invalid': errors.author }]"
          v-model="book.author"
          id="author"
          aria-describedby="author"
          @blur="validateField('author')"
        />
        <span class="text-error" v-if="errors.author">{{ errors.author }}</span>
      </div>
      <div class="mb-3">
        <label for="isbn" class="form-label">Isbn</label>
        <input
          type="text"
          :class="['form-control', { 'is-invalid': errors.isbn }]"
          v-model="book.isbn"
          id="isbn"
          aria-describedby="isbn"
          @blur="validateField('isbn')"
        />
        <span class="text-error" v-if="errors.isbn">{{ errors.isbn }}</span>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input
          type="text"
          class="form-control"
          v-model="book.description"
          id="description"
          aria-describedby="description"
        />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createBook">
        Submit
      </button>
      <button type="submit" class="btn ms-2" @click.prevent="backHome">
        Back
      </button>
    </form>
  </div>
</template>

<script>
import axiosInterceptor from "../../service/AxiosInteceptorToken";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "CreateBookView",
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
      errors: {
        categoryId: "",
        price: "",
        isbn: "",
        author: "",
        title: "",
      },
      token: "",
    };
  },
  methods: {
    async createBook() {
      this.errors = [];
      this.validateField("categoryId");
      this.validateField("price");
      this.validateField("title");
      this.validateField("author");
      this.validateField("isbn");
      if (
        this.errors.title == "" ||
        this.errors.author == "" ||
        this.errors.price == "" ||
        this.errors.isbn == "" ||
        this.errors.categoryId == ""
      ) {
        axiosInterceptor
          .post("/admin/books", this.book)
          .then((response) => {
            // JSON responses are automatically parsed.
            if (response.data != "") {
              toast.success("Create books successfully!", {
                autoClose: 1000,
              });

              setTimeout(() => {
                this.$router.push("/books");
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        alert("You must handle all error!");
        console.log("Form has validation errors. Please correct them.");
      }
    },
    backHome() {
      this.$router.push("/books");
    },
    validateField(field) {
      if (field === "title") {
        if (!this.book.title) {
          this.errors.title = "Title is required";
        } else {
          this.errors.title = "";
        }
      } else if (field === "author") {
        if (!this.book.author) {
          this.errors.author = "Author name is required";
        } else {
          this.errors.author = "";
        }
      } else if (field === "categoryId") {
        if (!this.book.categoryId) {
          this.errors.categoryId = "Category ID is required";
        } else if (isNaN(this.book.categoryId)) {
          this.errors.categoryId = "Category ID is number";
        } else {
          this.errors.categoryId = "";
        }
      } else if (field === "price") {
        if (!this.book.price) {
          this.errors.price = "Price is required";
        } else if (isNaN(this.book.price)) {
          this.errors.price = "Price is number";
        } else {
          this.errors.price = "";
        }
      } else if (field === "isbn") {
        if (!this.book.isbn) {
          this.errors.isbn = "Isbn is required";
        } else {
          this.errors.isbn = "";
        }
      }
    },
  },
};
</script>

<style scoped>
span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}
</style>
