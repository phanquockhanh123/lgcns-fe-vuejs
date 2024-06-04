<template>
  <nav-bar></nav-bar>
  <a-card title="List books" class="w-100">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <router-link to="/books/create"><a-button>Create</a-button></router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-12 table-responsive">
        <a-table :dataSource="listBooks" :loading="loading" :pagination="false" :columns="columns" class="table">
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'created'">
              <a-space>
                {{ formattedDatetime(record.created) }}
              </a-space>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <router-link :to="{ path: '/books/update/' + record.id }">
                  <a-button type="primary">
                    <EditOutlined />

                  </a-button>
                </router-link>
                <a-button type="primary" danger @click.prevent="confirmDelete(record.id)">
                  <DeleteOutlined />
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
        <a-modal v-model:visible="isModalVisible" title="Delete Category" @ok="deleteBook" @cancel="handleCancel">
          <p>Are you sure you want to delete this books?</p>
        </a-modal>
        <a-pagination v-model:current="pageInfo.pageIndex" v-model:pageSize="pageInfo.pageSize"
          :total="pageInfo.totalElements" show-size-changer :page-size-options="['5', '10', '20', '50']"
          :locale="{ items_per_page: '/ trang' }" @show-size-change="onShowSizeChange" @change="updatePageSize" />
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
import NavBar from "../../components/NavBar.vue";
import axios from "axios";
import moment from "moment";

export default {
  name: "BookView",
  components: {
    NavBar,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  data() {
    return {
      isModalVisible: false,
      bookIdToDelete: null,
      loading: false,
      listBooks: [],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Category ID",
          dataIndex: "categoryId",
          key: "categoryId",
        },
        {
          title: "Title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "Author",
          dataIndex: "author",
          key: "author",
        },
        {
          title: "Price",
          dataIndex: "price",
          key: "price",
        },
        {
          title: "Isbn",
          dataIndex: "isbn",
          key: "isbn",
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
      pageInfo: {
        content: [],
        pageIndex: 1,
        pageSize: 3,
        totalElements: 0,
        totalPages: 0,
      }
    };
  },
  created() {
    this.getBooksList();
  },
  mounted() {
    this.getBooksList();
  },
  methods: {
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
      this.getBooksList();
    },
    async getBooksList() {
      this.loading = true;

      try {
        const response = await axios.get(
          "http://localhost:8081/api/v1/admin/books",
          {
            params: {
              page: this.pageInfo.pageIndex - 1,
              size: this.pageInfo.pageSize,
            },
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.listBooks = response.data.data;
        this.pageInfo.totalElements = response.data.totalElements;
        this.pageInfo.totalPages = response.data.totalPages;
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        })
      }
    },
    async deleteBook() {
      try {
        await axios.delete(
          `http://localhost:8081/api/v1/admin/books/${this.bookIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.getBooksList();
        this.isModalVisible = false;
      } catch (error) {
        console.error(error);
      }
    },
    confirmDelete(id) {
      this.bookIdToDelete = id;
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
