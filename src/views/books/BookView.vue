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
          :options="listCategoriesTag"
          :max-tag-count="1"
        ></a-select>
      </div>
      <div class="mb-3 me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getBooksList"
          >Search</a-button
        >
      </div>
      <div class="mb-3 me-3 button-css d-flex justify-content-end">
        <a-button type="primary" class="me-3" @click="showDrawer">
          <PlusOutlined />
          New account
        </a-button>
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

  <!-- A drawer create book view -->
  <a-drawer
    title="Create a new book"
    :width="720"
    
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="book" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Title" name="title">
            <a-input
              v-model:value="book.title"
              placeholder="Please enter title"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Category Id" name="categoryId">
            <a-select
              placeholder="Please a-s an category"
              v-model:value="book.categoryId"
            >
              <a-select-option
                v-for="item in listCategory"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="price" name="price">
            <a-input
              v-model:value="book.price"
              placeholder="Please enter price"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Author" name="author">
            <a-input
              v-model:value="book.author"
              placeholder="Please enter author"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" name="description">
            <a-textarea
              v-model:value="book.description"
              :rows="4"
              placeholder="please enter description"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <span class="text-error" v-if="errors.message">{{ errors.message }}</span>

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
      <a-button type="primary" @click="createBook">Submit</a-button>
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
      listCategoriesTag: [],
      selectedRowKeys: [],
      search: {
        title: "",
        author: "",
      },
      book: {
        price: "",
        author: "",
        title: "",
        description: "",
      },
      errors: {
        message: "",
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
          title: "Title",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "Category",
          dataIndex: "categoryName",
          key: "categoryName",
        },,
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
      visible: false,
      id: "",
      rules: {
        title: {
          required: true,
          message: "Please enter book title",
          trigger: "blur",
        },
        author: {
          required: true,
          message: "Please enter book author",
          trigger: "blur",
        },
        price: {
          required: true,
          message: "Please enter book price",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    this.getBooksList();
    this.getCategories();
  },
  methods: {
    showDrawer(id = "") {
      this.visible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getBook(id);
      }
    },
    onClose() {
      this.visible = false;
      this.book.title = "";
      this.book.author = "";
      this.book.categoryId = "";
      this.book.price = "";
      this.book.description = "";
      this.id = "";
      this.errors.message= "";
    },
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
          if (response.data.data != "") {
            const rs = response.data.data.data;

            this.listCategory = rs.map((item) => ({
              id: item.id,
              name: item.name,
            }));

            this.listCategoriesTag = rs.map((item) => ({
              name: item.id,
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
    async createBook() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      console.log(this.id)
      if (this.id == "") {
        axiosInterceptor
          .post("/admin/books", this.book)
          .then((response) => {
            // JSON responses are automatically parsed.

            if (response.data.success == true) {
              toast.success("Create books successfully!", {
                autoClose: 1000,
              });

              setTimeout(() => {
                this.$router.push("/books");
                this.onClose();
                this.getBooksList();
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errors.message = e.response.data.data;
          })
          .finally(() => {
            setTimeout(() => {
              this.isSubmitting = false;
            }, 2000);
          });
      } else {
        await axiosInterceptor
          .put(`/admin/books/${this.id}`, this.book)
          .then((response) => {
            // JSON responses are automatically parsed.
            console.log(response.data.data);
            toast.success("Update book success!", {
              autoClose: 1000,
            });

            if (response.data.success == true) {
              setTimeout(() => {
                this.$router.push("/books");
                this.onClose();
                this.getBooksList();
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            this.errors.message = e.response.data.data;
            this.errors.message = e.response.data.message;
          });
      }
    },
    getBook(id) {
      if (id != "") {
        axiosInterceptor
          .get(`/admin/books/${id}`)
          .then((response) => {
            // JSON responses are automatically parsed.
            this.book.title = response.data.data.title;
            this.book.author = response.data.data.author;
            this.book.price = response.data.data.price;
            this.book.isbn = response.data.data.isbn;
            this.book.price = response.data.data.price;
            this.book.categoryId = response.data.data.categoryId;
            this.book.description = response.data.data.description;
          })
          .catch((e) => {
            console.log(e);
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
</style>
