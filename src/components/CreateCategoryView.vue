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
        />
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
      <button
        type="submit"
        class="btn ms-2"
        @click.prevent="backHome"
      >
        Back
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar.vue";

export default {
  name: "CreateCategoryView",
  components: {
    NavBar
  },
  data() {
    return {
      category: {
        name: "",
        description: "",
      },
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    async createCategory() {
      this.token = localStorage.getItem("token");

      if (this.token != "") {
        axios
          .post(
            "http://localhost:8081/api/v1/admin/categories",
            this.category,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            // JSON responses are automatically parsed.
            if (response.data.code == 1000) {
              this.$router.push("/categories");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    backHome() {
      this.$router.push("/categories");
    },
   
  },
};
</script>
