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
        <a-input v-model:value="search.author" placeholder="Author" />
      </div>
      <div class="mb-3 me-3">
        <label for="yearOfPublish" class="form-label">Year From</label>
        <a-select
          v-model:value="search.yearFrom"
          placeholder="Select a year"
          class="w-full d-flex"
        >
          <a-select-option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </a-select-option>
        </a-select>
      </div>

      <div class="mb-3 me-3">
        <label for="yearOfPublish" class="form-label">Year To</label>
        <a-select
          v-model:value="search.yearTo"
          placeholder="Select a year"
          class="w-full d-flex"
        >
          <a-select-option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </a-select-option>
        </a-select>
      </div>

      <div class="mb-3 me-3">
        <label for="categoryId" class="form-label">Category</label>
        <a-select
          v-model:value="searchCateIds"
          mode="tags"
          style="width: 100%; margin-right: 30px"
          placeholder="Tags Category"
          :options="listCategoriesTag"
          :max-tag-count="1"
        ></a-select>
      </div>
      <div class="mb-3 me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getBooksList(1)"
          >Search</a-button
        >
      </div>
      <div
        class="mb-3 me-3 button-css d-flex justify-content-end"
        v-if="['ADMIN', 'MANAGER'].includes(this.roleUser)"
      >
        <a-button type="primary" class="me-3" @click="showDrawer">
          <PlusOutlined />
          New book
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
          :scroll="{ x: 1500, y: 650 }"
          rowKey="id"
          :rowSelection="this.roleUser == 'USER' ? null : rowSelection"
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button
                  type="primary"
                  @click="showDrawer(record.id)"
                  v-if="['ADMIN', 'MANAGER'].includes(this.roleUser)"
                >
                  <EditOutlined />
                </a-button>
                <a-button
                  type="primary"
                  danger
                  @click="confirmDelete(record.id)"
                  v-if="['ADMIN', 'MANAGER'].includes(this.roleUser)"
                >
                  <DeleteOutlined />
                </a-button>
                <a-button
                  type="primary"
                  @click="showBorrowDrawer(record.id)"
                  v-if="this.roleUser === 'USER'"
                >
                  <VerticalAlignBottomOutlined />
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
          title="Delete book"
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
        <a-col :span="12">
          <a-form-item label="Title" name="title">
            <a-input
              v-model:value="book.title"
              placeholder="Please enter title"
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
        <a-col :span="12">
          <a-form-item label="yearOfPublish" name="year">
            <a-select
              placeholder="Please a-s an year of publish"
              v-model:value="book.year"
            >
              <a-select-option
                v-for="year in years"
                :key="year"
                :value="year"
                >{{ year }}</a-select-option
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
          <a-form-item label="quantity" name="quantity">
            <a-input
              v-model:value="book.quantity"
              placeholder="Please enter quantity"
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
      <a-button type="primary" @click.prevent="createBook">Submit</a-button>
    </div>
  </a-drawer>

  <!-- A drawer borrow book view -->
  <a-drawer
    title="Borrow book"
    :width="720"
    :visible="borrowVisible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="book" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Title" name="title">
            <a-input v-model:value="book.title" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Isbn" name="isbn">
            <a-input v-model:value="book.isbn" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Author" name="Author">
            <a-input v-model:value="book.author" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Price" name="Price">
            <a-input v-model:value="book.price" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Quantity" name="Quantity">
            <a-input-number
              id="inputNumber"
              v-model:value="borrowBook.quantity"
              :min="1"
              :max="100"
            >
              <template #upIcon>
                <ArrowUpOutlined />
              </template>
              <template #downIcon>
                <ArrowDownOutlined />
              </template>
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Date Borrow" name="Date borrow">
            <a-range-picker v-model:value="dateRangeVal" :format="dateFormat" />
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
      <h3 style="margin-top: 20px" class="d-flex">Amount</h3>
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click.prevent="createBook">Submit</a-button>
    </div>
  </a-drawer>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
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
    VerticalAlignBottomOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
  },
  data() {
    return {
      isModalVisible: false,
      bookIdToDelete: null,
      loading: false,
      dateFormat: "YYYY/MM/DD",
      listBooks: [],
      listCategory: [],
      listCategoriesTag: [],
      selectedRowKeys: [],
      selectedYear: null,
      years: [],
      search: {
        title: "",
        author: "",
        yearFrom: "",
        yearTo: "",
      },
      book: {
        price: "",
        author: "",
        title: "",
        description: "",
        year: "",
        quantity: "",
      },
      borrowBook: {
        quantity: "",
        startDate: "",
        endDate: "",
        status: 0,
        bonus: 0,
        amount: 0,
        id: localStorage.getItem("userId"),
        bookId: 0,
      },
      dateRangeVal: "",
      errors: {
        message: "",
        data: "",
      },
      roleUser: localStorage.getItem("role"),
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
        },
        ,
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
          title: "Quantity Avail",
          dataIndex: "quantityAvail",
          key: "quantityAvail",
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
      borrowVisible: false,
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
        year: {
          required: true,
          message: "Please enter year of publish",
          trigger: "blur",
        },
        quantity: {
          required: true,
          message: "Please enter quantity",
          trigger: "blur",
        },
      },
    };
  },
  mounted() {
    this.getBooksList();
    this.getCategories();
    this.generateYearList();
  },
  methods: {
    showDrawer(id = "") {
      this.visible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getBook(id);
      }
    },
    showBorrowDrawer(id = "") {
      this.borrowVisible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getBook(id);
      }
    },
    onClose() {
      this.visible = false;
      this.borrowVisible = false;
      this.isSubmitting = false;
      this.book.title = "";
      this.book.author = "";
      this.book.categoryId = "";
      this.book.price = "";
      this.book.description = "";
      this.book.year = "";
      this.book.quantity = "";
      this.errors.message = "";
      this.errors.data = "";
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
              value: item.id,
              label: item.name,
            }));
          }
        })
        .catch((e) => {
          console.log(e.response.status);
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
    async getBooksList(pageIndex) {
      this.loading = true;

      let dataParams = {
        page: pageIndex ? pageIndex - 1 : this.pageInfo.pageIndex - 1,
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

      if (this.search.yearFrom != "" && this.search.yearFrom != null) {
        dataParams.yearFrom = this.search.yearFrom;
      }

      if (this.search.yearTo != "" && this.search.yearTo != null) {
        dataParams.yearTo = this.search.yearTo;
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
    borowBook(id) {
      this.selectedRowKeys = [id];
      this.isBorowBookModalVisible = true;
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

      console.log(this.id);
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
            this.errors.data = e.response.data.data;
            this.errors.message = e.response.data.message;
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
            this.errors.data = e.response.data.data;
            this.errors.message = e.response.data.message;
          })
          .finally(() => {});
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
            this.book.quantity = response.data.data.quantity;
            this.book.year = response.data.data.yearOfPublish;
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
.mb-3.me-3.button-css.d-flex.justify-content-end {
  margin-top: 29px;
}

.mb-3.me-3 {
  width: 140px;
}

.mb-3.me-3.button-css.d-flex.justify-content-end[data-v-36410294] {
  margin-top: 29px;
  margin-left: 1000px;
}
</style>
