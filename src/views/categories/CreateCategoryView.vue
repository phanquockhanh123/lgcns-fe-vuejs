<template>
  <div>
    <h1>Create Category</h1>
    <form>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          v-model="category.name"
          id="firnamestName"
          aria-describedby="name"
          @blur="validateField('name')"
        />
        <span class="text-error" v-if="errors.name">{{ errors.name }}</span>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input
          type="text"
          class="form-control"
          v-model="category.description"
          id="description"
          aria-describedby="description"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="createCategory"
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
  name: "CreateCategoryView",
  components: {},
  data() {
    return {
      category: {
        name: "",
        description: "",
      },
      errors: {
        name: "",
      },
    };
  },
  methods: {
    async createCategory() {
      this.errors = [];
      this.validateField("name");

      if (this.errors.name == "") {
        axiosInterceptor
          .post("/admin/categories", this.category)
          .then((response) => {
            // JSON responses are automatically parsed.
            if (response.data.code == 1000) {
              toast.success("Create category successfully!", {
                autoClose: 1000,
              });

              setTimeout(() => {
                this.$router.push("/categories");
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        alert("You must handle all error!")
        console.log("Form has validation errors. Please correct them.");
      }
    },
    backHome() {
      this.$router.push("/categories");
    },
    validateField(field) {
      if (field === "name") {
        if (!this.category.name) {
          this.errors.name = "Category name is required";
        } else {
          this.errors.name = "";
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
