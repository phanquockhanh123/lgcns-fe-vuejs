<template>
  <div>
    <h1>Update Category</h1>
    <form>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          v-model="category.name"
          id="firnamestName"
          aria-describedby="name"
          value="{{ category.name }}"
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
          value="{{ category.description }}"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        @click.prevent="updateCategory"
      >
        Submit
      </button>
      <router-link to="/categories">
        <button type="submit" class="btn ms-2">Back</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "../../components/NavBar.vue";

export default {
  name: "UpdateCategoryView",
  components: {
    NavBar,
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
  mounted() {
    this.getCategory();
  },
  methods: {
    getCategory() {
      this.token = localStorage.getItem("token");
      let id = this.$route.params.id;

      if (this.token != "") {
        axios
          .get(`http://localhost:8081/api/v1/admin/categories/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log(response.data);
            this.category.name = response.data.name;
            this.category.description = response.data.description;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async updateCategory() {
      this.token = localStorage.getItem("token");

      if (this.token != "") {
        let id = this.$route.params.id;
        await axios
          .put(
            `http://localhost:8081/api/v1/admin/categories/${id}`,
            this.category,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log(response.data);
            if (response.data.code == 1000) {
              this.$router.push("/categories");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
};
</script>
