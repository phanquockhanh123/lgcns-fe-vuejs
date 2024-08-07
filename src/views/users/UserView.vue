<template>
  <a-card title="List users" class="w-100">
    <div class="d-flex mb-3 w-100">
      <div class="mb-3 me-3">
        <label for="email" class="form-label">Email</label>
        <a-input
          v-model:value="search.email"
          placeholder="Email"
          style="width: 200px"
        />
      </div>
      <div class="mb-3 me-3">
        <label for="Role" class="form-label">Role</label>
        <a-select
          v-model:value="search.role"
          style="width: 200px"
          :allowClear="true"
        >
          <a-select-option :value="'ADMIN'">ADMIN</a-select-option>
          <a-select-option :value="'MANAGER'">MANAGER</a-select-option>
          <a-select-option :value="'USER'">USER</a-select-option>
        </a-select>
      </div>
      <div class="me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getUsersList(1)"
          >Search</a-button
        >
      </div>
      <div class="col-9 d-flex justify-content-end">
        <a-button type="primary" class="me-3" @click="showDrawer">
          <PlusOutlined />
          New users
        </a-button>
        <a-button
          class="btn btn-danger"
          @click="confirmDeleteIds"
          :disabled="selectedRowKeys.length === 0"
          >Delete Users</a-button
        >
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table
          :dataSource="listUsers"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          :scroll="{ x: 1500, y: 650 }"
          rowKey="id"
          :rowSelection="rowSelection"
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'role'">
              <a-tag v-if="record.role == 'ADMIN'" :color="'volcano'">
                ADMIN
              </a-tag>
              <a-tag v-if="record.role == 'MANAGER'" :color="'green'">
                MANAGER
              </a-tag>
              <a-tag v-if="record.role == 'USER'" :color="'geekblue'">
                USER
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" @click="showDrawer(record.id)">
                  <EditOutlined />
                </a-button>
                <a-button
                  type="primary"
                  danger
                  @click="confirmDelete(record.id)"
                >
                  <DeleteOutlined />
                </a-button>
              </a-space>
            </template>
            <template v-if="column.key === 'created'">
              <a-space>
                {{ formattedDatetime(record.created) }}
              </a-space>
            </template>
            <template v-if="column.key === 'fullName'">
              {{ record.firstName }} {{ record.lastName }}
            </template>
          </template>
        </a-table>
        <a-modal
          v-model:visible="isModalVisible"
          title="Delete user"
          @ok="deleteListUserIds"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to delete this users ?</p>
        </a-modal>
        <a-pagination
          v-model:current="pageInfo.pageIndex"
          v-model:pageSize="pageInfo.pageSize"
          :total="pageInfo.totalElements"
          show-size-changer
          :page-size-options="['10', '20', '50', '100']"
          :locale="{ items_per_page: '/ trang' }"
          @show-size-change="onShowSizeChange"
          @change="updatePageSize"
        />
      </div>
    </div>
  </a-card>

  <!-- A drawer create user view -->
  <a-drawer
    title="Create a new user"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="user" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="First Name" name="firstName">
            <a-input
              v-model:value="user.firstName"
              placeholder="Please enter first name"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Last Name" name="lastName">
            <a-input
              v-model:value="user.lastName"
              placeholder="Please enter last name "
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Email" name="email">
            <a-input
              v-model:value="user.email"
              placeholder="Please enter email"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Address" name="address">
            <a-input
              v-model:value="user.address"
              placeholder="Please enter address"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Phone" name="phone">
            <a-input
              v-model:value="user.phone"
              placeholder="Please enter phone"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Role" name="role">
            <a-select
              placeholder="Please a-s an role"
              v-model:value="user.role"
            >
              <a-select-option v-if="roleUser === 'ADMIN'" value="ADMIN"
                >ADMIN</a-select-option
              >
              <a-select-option v-if="roleUser === 'ADMIN'" value="MANAGER"
                >MANAGER</a-select-option
              >
              <a-select-option value="USER">USER</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <span class="text-error" v-if="errors.message">{{ errors.message }}</span>
    <span class="text-error" v-if="errors.data">{{ errors.data }}</span>
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
      <a-button type="primary" @click="createUser">Submit</a-button>
    </div>
  </a-drawer>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import axiosInterceptor from "../../service/AxiosInteceptorToken";
import moment from "moment";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "userView",
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  data() {
    return {
      search: {
        status: "",
        role: "",
      },
      isModalVisible: false,
      userIdToDelete: null,
      loading: false,
      listUsers: [],
      selectedRowKeys: [],
      selectedYear: null,
      years: [],
      user: {
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
        role: "",
      },
      errors: {
        message: "",
        data: "",
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Full Name",
          dataIndex: "fullName",
          key: "fullName",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
        },
      ],
      pageInfo: {
        content: [],
        pageIndex: 1,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
      },
      rowSelection: {
        onChange: this.onSelectChange,
      },
      visible: false,
      id: "",
      rules: {
        firstName: {
          required: true,
          message: "Please enter first name",
          trigger: "blur",
        },
        lastName: {
          required: true,
          message: "Please enter last name",
          trigger: "blur",
        },
        email: [
          {
            required: true,
            message: "Please enter your email",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please enter a valid email address",
            trigger: "blur",
          },
        ],
        address: {
          required: true,
          message: "Please enter address",
          trigger: "blur",
        },
        phone: {
          required: true,
          message: "Please enter phone",
          trigger: "blur",
        },
      },
    };
  },
  computed: {
    roleUser() {
      return localStorage.getItem("role");
    },
  },
  mounted() {
    this.getUsersList();
    this.generateYearList();
  },
  methods: {
    showDrawer(id = "") {
      this.visible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getUser(id);
      }
    },
    onClose() {
      this.visible = false;
      this.isSubmitting = false;
      this.user.firstName = "";
      this.user.lastName = "";
      this.user.email = "";
      this.user.address = "";
      this.user.phone = "";
      this.errors.message = "";
      this.errors.data = "";
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("Selected Row Keys: ", selectedRowKeys);
      console.log("Selected Rows: ", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      const selectedIds = selectedRows.map((row) => row.id);
      console.log("Selected user IDs: ", selectedIds);
    },
    formattedDatetime(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    onShowSizeChange() {
      this.handleChange(this.pageInfo.pageIndex, this.pageInfo.pageSize);
    },
    updatePageSize() {
      this.handleChange(this.pageInfo.pageIndex, this.pageInfo.pageSize);
    },
    handleChange(pageIndex, pageSize) {
      this.pageInfo.pageIndex = pageIndex;
      this.pageInfo.pageSize = pageSize;

      this.getUsersList();
    },
    generateYearList() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 20; // Adjust the range as needed

      for (let year = currentYear; year >= startYear; year--) {
        this.years.push(year);
      }
    },
    tableScroll() {
      return this.screenWidth > 1300 ? { x: 1300 } : {};
    },
    confirmDeleteIds() {
      this.isModalVisible = true;
    },
    async getUsersList(pageIndex) {
      this.loading = true;

      let dataParams = {
        page: pageIndex ? pageIndex : this.pageInfo.pageIndex,
        limit: this.pageInfo.pageSize,
        get_total_count: 1,
      };

      if ( this.search.role != null && this.search.role != "" ) {
        dataParams.role = this.search.role;
      }

      if ( this.search.email != null && this.search.email != "") {
        dataParams.email = this.search.email;
      }

      try {
        const response = await axiosInterceptor.get("/admin/users/search", {
          params: dataParams,
        });
        this.listUsers = response.data.data.data;

        this.pageInfo.totalElements =
          response.data.data.pagination.total_record;
        this.pageInfo.totalPages = response.data.data.pagination.total_page;
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        });
      }
    },
    confirmDelete(id) {
      this.selectedRowKeys = [id];
      this.isModalVisible = true;
    },
    handleCancel() {
      this.isModalVisible = false;
    },
    async createUser() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;
      console.log(this.isSubmitting);

      if (this.id == "") {
        axiosInterceptor
          .post("/admin/users", this.user)
          .then((response) => {
            // JSON responses are automatically parsed.

            if (response.data.success == true) {
              toast.success("Create users successfully!", {
                autoClose: 1000,
              });

              setTimeout(() => {
                this.$router.push("/users");
                this.onClose();
                this.getUsersList();
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errors.message = e.response.data.message;
            this.errors.data = e.response.data.data;
          })
          .finally(() => {
            setTimeout(() => {
              this.isSubmitting = false;
            }, 2000);
          });
      } else {
        await axiosInterceptor
          .put(`/admin/users/${this.id}`, this.user)
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log(response.data.data);
            toast.success("Update user success!", {
              autoClose: 1000,
            });

            if (response.data.success == true) {
              setTimeout(() => {
                this.$router.push("/users");
                this.onClose();
                this.getUsersList();
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errors.message = e.response.data.message;
            this.errors.data = e.response.data.data;
          })
          .finally(() => {
            setTimeout(() => {
              this.isSubmitting = false;
            }, 2000);
          });
      }
    },
    getUser(id) {
      if (id != "") {
        axiosInterceptor
          .get(`/admin/users/${id}`)
          .then((response) => {
            // JSON responses are automatically parsed.
            this.user.firstName = response.data.data.firstName;
            this.user.lastName = response.data.data.lastName;
            this.user.email = response.data.data.email;
            this.user.address = response.data.data.address;
            this.user.phone = response.data.data.phone;
            this.user.role = response.data.data.role;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async deleteListUserIds() {
      try {
        const response = await axiosInterceptor.delete("/admin/users", {
          data: {
            ids: this.selectedRowKeys,
          },
        });

        this.isModalVisible = false;
        this.getUsersList();

        toast.success(
          `Delete list users successfully with ids{} ${this.selectedRowKeys}`,
          {
            autoClose: 1000,
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style scoped>
/* Add any scoped styles here */
.custom-scroll {
  max-height: 800px;
  /* set the maximum height */
  overflow-y: auto;
  /* enable vertical scrolling */
  width: 200px;
  /* set a fixed width */
}

.mb-3.me-3.button-css {
  margin-top: 23px;
}

.mb-3.me-3.button-css-search {
  margin-top: 30px;
}
span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}
/* .mb-3.me-3.button-css.d-flex.justify-content-end {
  margin-top: 29px;
} */
</style>
