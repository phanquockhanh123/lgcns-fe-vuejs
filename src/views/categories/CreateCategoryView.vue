<template>
  <div>
    <h1>Category</h1>
    <form>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" :class="['form-control', { 'is-invalid': errors.name }]" v-model="category.name"
          id="firnamestName" aria-describedby="name" @blur="validateField('name')" value="{{ category.name }}" />
        <span class="text-error" v-if="errors.name">{{ errors.name }}</span>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input type="text" class="form-control" v-model="category.description" id="description"
          aria-describedby="description" value="{{ category.description }}" />
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createCategory" :disabled="isSubmitting">
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
      isSubmitting: false
    };
  },
  methods: {
    async createCategory() {
      this.errors = [];
      this.validateField("name");

      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      if (this.errors.name == "") {
        let id = this.$route.params.id;

        if (id == "") {
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
            })
            .finally(() => {
              setTimeout(() => {
                this.isSubmitting = false;
              }, 2000)
            });
        } else {
          axiosInterceptor
            .put(`/admin/categories/${id}`, this.category)
            .then((response) => {
              // JSON responses are automatically parsed.
              if (response.data.code == 1000) {
                toast.success("Update category successfully!", {
                  autoClose: 1000,
                });

                setTimeout(() => {
                  this.$router.push("/categories");
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
        }
      } else {
        alert("You must handle all error!")
        console.log("Form has validation errors. Please correct them.");
        this.isSubmitting = false;
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
    getCategory() {
      let id = this.$route.params.id;
      console.log(id)
      if (id != "") {
        axiosInterceptor
          .get(`/admin/categories/${id}`)
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
  },
  mounted() {
    this.getCategory();
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
