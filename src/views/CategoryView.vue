<template>
  <nav-bar></nav-bar>
  <a-card title="List categories" class="w-100">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <router-link to="/categories/create"
          ><a-button>Create</a-button></router-link
        >
      </div>
    </div>
    <div class="row">
      <div class="col-12 table-responsive">
        <a-table :dataSource="listCategories" :columns="columns" class="table">
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'created'">
              <a-space>
                {{ formattedDatetime(record.created) }}
              </a-space>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <router-link :to="{path: '/categories/update/' + record.id}">
                <a-button type="primary">
                  <EditOutlined />
                  
                </a-button>
                </router-link>
                <a-button
                  type="primary"
                  danger
                  @click.prevent="confirmDelete(record.id)"
                >
                  <DeleteOutlined />
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
        <a-modal
          v-model:visible="isModalVisible"
          title="Delete Category"
          @ok="deleteCategory"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to delete this category?</p>
        </a-modal>
      </div>
    </div>
  </a-card>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import NavBar from "../components/NavBar.vue";
import axios from "axios";
import moment from "moment";

export default {
  name: "CategoryView",
  components: {
    NavBar,
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
          title: "Created",
          dataIndex: "created",
          key: "created",
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
        },
      ],
      token: localStorage.getItem("token"),
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    formattedDatetime(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    async getCategoriesList() {
      this.loading = true;

      try {
        const response = await axios.get(
          "http://localhost:8081/api/v1/admin/categories",
          {
            params: {
              page: 0,
              size: 10,
            },
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.listCategories = response.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteCategory() {
      try {
        await axios.delete(
          `http://localhost:8081/api/v1/admin/categories/${this.categoryIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
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
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>
