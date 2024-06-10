<template>
  <a-card title="List books" class="w-100">
    <!-- Form search -->
    <div class="d-flex mb-3 w-100">
      <div class="mb-3 me-3">
        <label for="title" class="form-label">Title</label>
        <a-input v-model:value="search.title" placeholder="Title" />
      </div>
      <div class="mb-3 me-3">
        <label for="author" class="form-label">Author</label>
        <a-input v-model:value="search.author" placeholder="Title" />
      </div>
      <div class="mb-3 me-3">
        <label for="categoryId" class="form-label">Category</label>
        <a-select
          v-model:value="searchCateIds"
          mode="tags"
          style="width: 100%"
          placeholder="Tags Category"
          :options="listCategory"
          :max-tag-count="1"
        ></a-select>
      </div>
      <div class="mb-3 me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getBooksList"
          >Search</a-button
        >
      </div>
      <div class="mb-3 me-3 button-css">
        <router-link to="/books/create" class="btn"
          ><a-button>Create</a-button></router-link
        >
        <a-button
          class="btn btn-danger"
          @click="confirmDeleteIds"
          :disabled="selectedRowKeys.length === 0"
          >Delete Books</a-button
        >
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <a-table
          :dataSource="listBooks"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          :scroll="{ x: 1500, y: 850 }"
          rowKey="id"
          :rowSelection="rowSelection"
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <router-link :to="{ path: '/books/create/' + record.id }">
                  <a-button type="primary">
                    <EditOutlined />
                  </a-button>
                </router-link>
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
          </template>
        </a-table>
        <a-modal
          v-model:visible="isModalVisible"
          title="Delete Category"
          @ok="deleteListBookIds"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to delete this books ?</p>
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
      listCategory: [],
      selectedRowKeys: [],
      search: {
        title: "",
        author: "",
      },
      searchCateIds: [],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Isbn",
          dataIndex: "isbn",
          key: "isbn",
        },
        {
          title: "Category",
          dataIndex: "categoryName",
          key: "categoryName",
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
      pageInfo: {
        content: [],
        pageIndex: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },
      rowSelection: {
        onChange: this.onSelectChange,
      },
    };
  },
  mounted() {
    this.getBooksList();
    this.getCategories();
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("Selected Row Keys: ", selectedRowKeys);
      console.log("Selected Rows: ", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      const selectedIds = selectedRows.map((row) => row.id);
      console.log("Selected Book IDs: ", selectedIds);
    },
    async getCategories() {
      await axiosInterceptor
        .get("/admin/categories")
        .then((response) => {
          // JSON responses are automatically parsed.
          if (response.data != "") {
            const rs = response.data.data;
            this.listCategory = rs.map((item) => ({
              value: item.id,
              label: item.name,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
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

      this.getBooksList();
    },
    tableScroll() {
      return this.screenWidth > 1300 ? { x: 1300 } : {};
    },
    async getBooksList() {
      this.loading = true;

      let dataParams = {
        page: this.pageInfo.pageIndex - 1,
        size: this.pageInfo.pageSize,
      };

      if (this.search.title != "" && this.search.title != null) {
        dataParams.title = this.search.title.trim();
      }

      if (this.search.author != "" && this.search.author != null) {
        dataParams.author = this.search.author.trim();
      }

      if (this.searchCateIds != "" && this.searchCateIds.length > 0) {
        dataParams.cateIds = this.searchCateIds.join(",");
      }

      try {
        const response = await axiosInterceptor.get("/admin/books/search", {
          params: dataParams,
        });
        this.listBooks = response.data.data.data;

        this.pageInfo.totalElements = response.data.data.totalElements;
        this.pageInfo.totalPages = response.data.data.totalPages;
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
    confirmDeleteIds() {
      this.isModalVisible = true;
    },
    handleCancel() {
      this.isModalVisible = false;
    },
    async deleteListBookIds() {
      try {
        const response = await axiosInterceptor.delete("/admin/books", {
          data: {
            ids: this.selectedRowKeys,
          },
        });

        this.isModalVisible = false;
        this.getBooksList();

        toast.success(
          `Delete list books successfully with ids{} ${this.selectedRowKeys}`,
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
</style>
