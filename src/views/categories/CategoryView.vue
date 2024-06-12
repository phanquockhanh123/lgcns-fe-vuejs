<template>
  <a-card title="List categories" class="w-100">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary" @click="showDrawer">
          <PlusOutlined />
        </a-button>
      </div>
    </div>
    <div class="row">
      <div>
        <a-table :dataSource="listCategories" :loading="loading" :pagination="false" :columns="columns" class="table" size="small"
           rowKey="id">
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" @click="showDrawer(record.id)">
                  <EditOutlined />
                </a-button>
                <a-button type="primary" danger @click.prevent="confirmDelete(record.id)">
                  <DeleteOutlined />
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
        <a-modal v-model:visible="isModalVisible" title="Delete Category" @ok="deleteCategory" @cancel="handleCancel">
          <p>Are you sure you want to delete this category?</p>
        </a-modal>
        <a-pagination v-model:current="pageInfo.pageIndex" v-model:pageSize="pageInfo.pageSize"
          :total="pageInfo.totalElements" show-size-changer :page-size-options="['5', '10', '20', '50']"
          :locale="{ items_per_page: '/ trang' }" @show-size-change="onShowSizeChange" @change="updatePageSize" />
      </div>
    </div>
  </a-card>
  <a-drawer title="Create a new category" :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }"
    @close="onClose">
    <a-form :model="category" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Name" name="name">
            <a-input v-model:value="category.name" placeholder="Please enter category name" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" description="description">
            <a-textarea v-model:value="category.description" :rows="4" placeholder="please enter url description" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <span class="text-error" v-if="errors">{{ errors }}</span>

    <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="createCategory" :disabled="isSubmitting">Submit</a-button>
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
  name: "CategoryView",
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  data() {
    return {
      isModalVisible: false,
      categoryIdToDelete: null,
      loading: false,
      listCategories: [],
      selectedRowKeys: [],
      visible: false,
      isSubmitting: false,
      category: {
        name: "",
        description: "",
      },
      id: "",
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
        },
      ],
      token: localStorage.getItem("token"),
      pageInfo: {
        content: [],
        pageIndex: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      rules: {
        name: {
          required: true,
          message: "Please enter category name",
          trigger: "blur",
        },
      },
      errors: "",
    };
  },
  methods: {
    async createCategory() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      if (this.id != "") {
        axiosInterceptor
          .put(`/admin/categories/${this.id}`, this.category)
          .then((response) => {
            // JSON responses are automatically parsed.
            if (response.data.success) {
              toast.success("Update category successfully!", {
                autoClose: 1000,
              });

              setTimeout(() => {
                this.$router.push("/categories");
                this.onClose();
                this.getCategoriesList();
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errors = e.response.data.message;
            console.log(this.erros);
          })
          .finally(() => {
            setTimeout(() => {
              this.isSubmitting = false;
            }, 2000);
          });
      } else {
        axiosInterceptor
          .post("/admin/categories", this.category)
          .then((response) => {
            // JSON responses are automatically parsed.
            if (response.data.success) {
              toast.success("Create category successfully!", {
                autoClose: 1000,
              });

              setTimeout(() => {
                this.$router.push("/categories");
                this.onClose();
                this.getCategoriesList();
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errors = e.response.data.message;
          })
          .finally(() => {
            setTimeout(() => {
              this.isSubmitting = false;
            }, 2000);
          });
      }
    },
    getCategory(id) {
      if (id != "") {
        axiosInterceptor
          .get(`/admin/categories/${id}`)
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log(response.data);
            this.category.name = response.data.data.name;
            this.category.description = response.data.data.description;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    showDrawer(id = "") {
      this.visible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getCategory(id);
      }
    },
    onClose() {
      this.visible = false;
      this.isSubmitting = false;
      this.category.name = "";
      this.category.description = "";
    },
    formattedDatetime(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("Selected Row Keys: ", selectedRowKeys);
      console.log("Selected Rows: ", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      const selectedIds = selectedRows.map((row) => row.id);
      console.log("Selected Book IDs: ", selectedIds);
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

      this.getCategoriesList();
    },
    isSelected(book) {
      return this.selectedBook && this.selectedBook.id === book.id;
    },
    async getCategoriesList() {
      this.loading = true;

      try {
        let params = {
          page: this.pageInfo.pageIndex - 1,
          size: this.pageInfo.pageSize,
        };
        const response = await axiosInterceptor.get("/admin/categories", {
          params: params,
        });
        this.listCategories = response.data.data.data;
        this.pageInfo.totalElements = response.data.data.totalElements;
        this.pageInfo.totalPages = response.data.data.totalPages;
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }
    },
    async deleteCategory() {
      try {
        await axiosInterceptor.delete(
          `/admin/categories/${this.categoryIdToDelete}`
        );

        toast.success(
          `Delete category successfully with category id ! ${this.categoryIdToDelete}`,
          {
            autoClose: 1000,
          }
        );
        this.getCategoriesList();
        this.isModalVisible = false;
      } catch (error) {
        console.error(error);
      }
    },
    confirmDelete(id) {
      this.categoryIdToDelete = id;
      this.isModalVisible = true;
    },
    handleCancel() {
      this.isModalVisible = false;
    },
  },
  mounted() {
    this.getCategoriesList();
  },
  computed() { },
};
</script>

<style scoped>
span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}


</style>
