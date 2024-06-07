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
        <label for="categoryId" class="form-label">Category</label>
        <select
          class="form-select"
          aria-label="Select category"
          v-model="book.categoryId"
          @change="handleSelectionChange"
        >
          <option
            v-for="item in this.listCategory"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
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
        <label for="description" class="form-label">Description</label>
        <input
          type="text"
          class="form-control"
          v-model="book.description"
          id="description"
          aria-describedby="description"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="createBook"
        :disabled="isSubmitting"
      >
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
        author: "",
        title: "",
        description: "",
      },
      errors: {
        price: "",
        isbn: "",
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
      if (this.isSubmitting) {
        return;
      }

      this.errors = [];
      this.isSubmitting = true;

      this.validateField("price");
      this.validateField("title");
      this.validateField("author");

      if (
        this.errors.title == "" ||
        this.errors.author == "" ||
        this.errors.price == ""
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
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        alert("You must handle all error!");
        console.log("Form has validation errors. Please correct them.");
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
  },
  mounted() {
    this.getCategories();
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
