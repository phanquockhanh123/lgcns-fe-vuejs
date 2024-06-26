<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/dashboard" class="nav-link active"
        >DASH BOARD</router-link
      >
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
          <li v-for="(item, i) in MainNavLinks" :key="i">
            <router-link
              class="nav-link"
              :to="item.link"
              v-if="isLoggedIn && item.roles.includes(role)"
              >{{ item.name }}</router-link
            >
          </li>
          <li class="nav-item d-flex justify-content-end" v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item d-flex justify-content-end" v-else>
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                {{ fullName }}
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="#" class="nav-link" @click="showDrawer"
                      >Change password</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a href="" @click.prevent="logout" class="nav-link"
                      >Logout</a
                    >
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <a-drawer
    title="Change password"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Current Password" name="curPass">
            <a-input
              type="password"
              v-model:value="form.curPass"
              placeholder="Please enter Current Password"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="New Password" name="newPass">
            <a-input
              type="password"
              v-model:value="form.newPass"
              placeholder="Please enter new password"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="confirmPass" name="confirmPass">
            <a-input
              type="password"
              v-model:value="form.confirmPass"
              placeholder="Please enter confirm password"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <span class="text-error" v-if="errors">{{ errors }}</span>

    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="changePassword" :disabled="isSubmitting"
        >Submit</a-button
      >
    </div>
  </a-drawer>
  <div class="col-sm-12 p-2">
    <router-view></router-view>
  </div>
  
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { DownOutlined } from "@ant-design/icons-vue";
import axiosInterceptor from "../service/AxiosInteceptorToken";

export default {
  name: "NavBar",
  components: {
    DownOutlined,
  },
  data() {
    return {
      visible: false,
      isSubmitting: false,
      role: localStorage.getItem("role"),
      MainNavLinks: [
        {
          name: "Category",
          link: "/categories",
          roles: ["ADMIN"],
        },
        {
          name: "Books",
          link: "/books",
          roles: ["ADMIN", "MANAGER"],
        },
        {
          name: "BookTransaction",
          link: "/book_transactions",
          roles: ["ADMIN", "USER", "MANAGER"],
        },
        {
          name: "Users",
          link: "/users",
          roles: ["ADMIN", "MANAGER"],
        },
        {
          name: "Reports",
          link: "/reports",
          roles: ["ADMIN"],
        },
      ],
      fullName: localStorage.getItem("fullName"),
      form: {
        curPass: "",
        newPass: "",
        confirmPass: "",
      },
      errors: "",
      rules: {
        curPass: [
          {
            required: true,
            message: "Please enter current password",
            trigger: "blur",
          },
        ],
        newPass: [
          {
            required: true,
            message: "Please enter new password",
            trigger: "blur",
          },
        ],
        confirmPass: [
          {
            required: true,
            message: "Please enter confirm password",
            trigger: "blur",
          },
          () => ({
            validator: (_, value) => {
              if (!value || value === this.form.newPass) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("New password and confirm password must be the same")
              );
            },
            message: "New password and confirm password must be the same",
            trigger: "blur",
          }),
        ],
      },
    };
  },
  methods: {
    logout() {
      toast.success("You will logout after 3 seconds!!", {
        autoClose: 1000,
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        this.$router.push("/login");
      }, 2000);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.form.curPass = "";
      this.form.newPass = "";
      this.form.confirmPass = "";
    },
    changePassword() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      axiosInterceptor
        .post("/admin/users/change_password", this.form)
        .then((response) => {
          // JSON responses are automatically parsed.
          if (response.data.success) {
            toast.success("Change password successfully!", {
              autoClose: 1000,
            });

            setTimeout(() => {
              this.onClose();
            }, 2000);
          }
        })
        .catch((e) => {
          console.log(e);
          this.errors = e.response.data.message;
          console.log(this.errors);
        })
        .finally(() => {
          setTimeout(() => {
            this.isSubmitting = false;
          }, 2000);
        });
    },
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem("token");
    },
  }
};
</script>
<style scoped>
a.ant-dropdown-link.ant-dropdown-trigger {
  text-decoration: none;
  color: black;
  display: flex;
}
span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}
.navbar-nav {
  align-items: center;
}

.nav-item.d-flex.justify-content-end {
  margin-left: auto;
}

.ant-dropdown-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.ant-dropdown-link:hover {
  background-color: #f5f5f5;
}

.ant-dropdown {
  position: absolute;
  right: 0;
  z-index: 1000;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #333;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.ant-dropdown-menu {
  padding: 0;
  margin: 0;
  list-style: none;
}

.ant-dropdown-menu-item {
  padding: 0.5rem 1rem;
  color: #333;
  cursor: pointer;
}

.ant-dropdown-menu-item:hover {
  background-color: #f5f5f5;
}


</style>
