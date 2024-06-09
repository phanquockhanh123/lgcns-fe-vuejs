<template>
  <div>
    <h1>Book</h1>
    <form>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" :class="['form-control', { 'is-invalid': errors.title }]" v-model="book.title" id="tile"
          aria-describedby="title" @blur="validateField('title')" value="{{ book.title }}" />
        <span class="text-error" v-if="errors.title">{{ errors.title }}</span>
      </div>
      <div class="mb-3">
        <label for="categoryId" class="form-label">Category</label>
        <select class="form-select" aria-label="Select category" v-model="book.categoryId"
          @change="handleSelectionChange">
          <option disabled value="">Select a category</option>
          <option v-for="item in this.listCategory" :key="item.id" :value="item.id" >
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input type="text" :class="['form-control', { 'is-invalid': errors.price }]" v-model="book.price" id="price"
          aria-describedby="price" @blur="validateField('price')" value="{{ book.price }}" />
        <span class="text-error" v-if="errors.price">{{ errors.price }}</span>
      </div>
      <div class="mb-3">
        <label for="author" class="form-label">Author</label>
        <input type="text" :class="['form-control', { 'is-invalid': errors.author }]" v-model="book.author" id="author"
          aria-describedby="author" @blur="validateField('author')" value="{{ book.author }}" />
        <span class="text-error" v-if="errors.author">{{ errors.author }}</span>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input type="text" class="form-control" v-model="book.description" id="description"
          aria-describedby="description" value="{{ book.description }}" />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createBook" :disabled="isSubmitting">
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
        price: "",
        author: "",
        title: "",
        description: "",
      },
      errors: {
        price: "",
        author: "",
        title: "",
      },
      token: "",
      listCategory: [],
      isSubmitting: false,
    };
  },
  methods: {
    async createBook() {
      let id = this.$route.params.id;

      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      if (
        this.errors.title == "" &&
        this.errors.author == "" &&
        this.errors.price == "" &&
        this.book.title != "" &&
        this.book.author != "" &&
        this.book.price != ""
      ) {
        if (id == "") {
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
            })
            .finally(() => {
              setTimeout(() => {
                this.isSubmitting = false;
              }, 2000)
            });
        } else {
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
        }

      } else {
        alert("You must handle all error!");
        console.log("Form has validation errors. Please correct them.");
        this.isSubmitting = false;
      }
    },
    handleSelectionChange() {
      console.log("Selected Category ID:", this.book.categoryId);
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
      } else if (field === "price") {
        if (!this.book.price) {
          this.errors.price = "Price is required";
        } else if (isNaN(this.book.price)) {
          this.errors.price = "Price is number";
        } else {
          this.errors.price = "";
        }
      }
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
    },
    getBook() {
      let id = this.$route.params.id;

      if (id != "") {
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
  },
  mounted() {
    this.getCategories();
    this.getBook();
  },
};
</script>

<style scoped>
span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}

.btn-loading {
  pointer-events: none;
  opacity: 0.7;
  position: relative;
}

.btn-loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  transform: translate(-50%, -50%);
}
</style>
