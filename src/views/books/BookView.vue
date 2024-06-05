<template>
  <a-card title="List books" class="w-100">
    <!-- Form search -->
    <div class="d-flex mb-3 w-100">
      <div class="mb-3 me-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          v-model="search.title"
          id="tile"
          aria-describedby="title"
          required
        />
      </div>
      <div class="mb-3 me-3">
        <label for="author" class="form-label">Author</label>
        <input
          type="text"
          class="form-control"
          v-model="search.author"
          id="author"
          aria-describedby="author"
        />
      </div>
      <div class="mt-4 mb-3">
        <a-button class="btn btn-primary" @click.prevent="getBooksList"
          >Search</a-button
        >
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <router-link to="/books/create"
          ><a-button>Create</a-button></router-link
        >
      </div>
    </div>
    <div class="row">
      <div class="col-12 table-responsive">
        <a-table
          :dataSource="listBooks"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <router-link :to="{ path: '/books/update/' + record.id }">
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
          @ok="deleteBook"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to delete this books?</p>
        </a-modal>
        <a-pagination
          v-model:current="pageInfo.pageIndex"
          v-model:pageSize="pageInfo.pageSize"
          :total="pageInfo.totalElements"
          show-size-changer
          :page-size-options="['5', '10', '20', '50']"
          :locale="{ items_per_page: '/ trang' }"
          @show-size-change="onShowSizeChange"
          @change="updatePageSize"
        />
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
import axios from "axios";
import moment from "moment";

export default {
  name: "BookView",
  components: {
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
      search: {
        title: "",
        author: "",
      },
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
      },
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

      let dataParams = {
        page: this.pageInfo.pageIndex - 1,
        size: this.pageInfo.pageSize,
      };

      if (this.search.title != "" && this.search.title != null) {
        dataParams.title = this.search.title;
      }

      if (this.search.author != "" && this.search.author != null) {
        dataParams.author = this.search.author;
      }

      console.log(dataParams);
      try {
        const response = await axios.get("/admin/books", {
          params: dataParams,
        });
        this.listBooks = response.data.data;
        this.pageInfo.totalElements = response.data.totalElements;
        this.pageInfo.totalPages = response.data.totalPages;
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        });
      }
    },
    async deleteBook() {
      try {
        await axios.delete(`/admin/books/${this.bookIdToDelete}`);
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
