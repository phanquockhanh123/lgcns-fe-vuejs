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
          :allowClear="true"
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
          :allowClear="true"
        >
          <a-select-option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </a-select-option>
        </a-select>
      </div>

      <!-- <div class="mb-3 me-3 category-input">
        <label for="categoryId" class="form-label">Category</label>
        <a-select
          v-model:value="searchCateIds"
          mode="tags"
          style="width: 100%; margin-right: 30px"
          placeholder="Tags Category"
          :options="listCategoriesTag"
          :max-tag-count="1"
        ></a-select>
      </div> -->
      <div class="mb-3 me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getBooksList(1)"
          >Search</a-button
        >
      </div>
      <div
        class="mb-3 me-3 button-css d-flex justify-content-end"
        v-if="['ADMIN', 'MANAGER'].includes(roleUser)"
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
      <span class="text-error" v-if="errors.search">{{ errors.search }}</span>
      <div class="col-12">
        <a-table
          :dataSource="listBooks"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          :scroll="{ x: 1500, y: 650 }"
          rowKey="id"
          :rowSelection="roleUser == 'USER' ? null : rowSelection"
          size="small"
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'cateNames'">
              <span>
                <a-tag
                  v-for="cateName in convertToArray(record.cateNames)"
                  :key="cateName"
                  :color="getRandomColor()"
                >
                  {{ cateName.toUpperCase() }}
                </a-tag>
              </span>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button
                  type="primary"
                  @click="showDrawer(record.id)"
                  v-if="['ADMIN', 'MANAGER'].includes(roleUser)"
                >
                  <EditOutlined />
                </a-button>
                <a-button
                  type="primary"
                  danger
                  @click="confirmDelete(record.id)"
                  v-if="['ADMIN', 'MANAGER'].includes(roleUser)"
                >
                  <DeleteOutlined />
                </a-button>
                <a-button
                  type="primary"
                  @click="showBorrowDrawer(record.id)"
                  v-if="roleUser === 'USER'"
                >
                  <CopyOutlined />
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
          :page-size-options="['#', '20', '50', '100']"
          :locale="{ items_per_page: '/ trang' }"
          @show-size-change="onShowSizeChange"
          @change="updatePageSize"
        />
      </div>
    </div>
  </a-card>

  <!-- A drawer create book view -->
  <a-drawer
    title="Book"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form
      :model="book"
      :rules="rules"
      layout="vertical"
      enctype="multipart/form-data"
    >
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
          <a-form-item label="Category" name="categoryId">
            <a-select
              v-model:value="saveBookCateIds"
              mode="tags"
              style="width: 100%; margin-right: 30px"
              placeholder="Tags Category"
              :options="listCategoriesTag"
              :max-tag-count="1"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="YearOfPublish" name="year">
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
          <a-form-item label="Price" name="price">
            <a-input
              v-model:value="book.price"
              placeholder="Please enter price"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Quantity" name="quantity">
            <a-input v-model:value="book.quantity" :value="book.quantity" />
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
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Image" name="image">
            <img
              :src="previewImage"
              class="uploading-image"
              width="300px"
              height="300px"
            />
            <input type="file" accept="image/jpeg" @change="uploadImage" />
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
          <a-form-item label="Author" name="author">
            <a-input v-model:value="book.author" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Price" name="price">
            <a-input v-model:value="book.price" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Quantity" name="quantity">
            <a-input-number
              id="inputNumber"
              v-model:value="borrowBookData.quantity"
              :min="1"
              :max="book.quantityAvail"
              :default="1"
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
            <a-range-picker
              v-model:value="dateRangeVal"
              :format="dateFormat"
              :default-value="dateRangeValDefault"
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
      <a-button type="primary" @click.prevent="borrowBook">Submit</a-button>
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
  CopyOutlined,
} from "@ant-design/icons-vue";
import axiosInterceptor from "../../service/AxiosInteceptorToken";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import moment from "moment";

export default {
  name: "BookView",
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    VerticalAlignBottomOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CopyOutlined,
  },
  data() {
    return {
      previewImage: null,
      selectedDate: null,
      isModalVisible: false,
      bookIdToDelete: null,
      loading: false,
      dateFormat: "YYYY/MM/DD HH:mm:ss",
      listBooks: [],
      listCategory: [],
      listCategoriesByBookId: [],
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
        cateIds: "",
        filePath: "",
      },
      borrowBookData: {
        quantity: "",
        startDate: "",
        endDate: "",
        bookId: "",
      },
      dateRangeValDefault: [
        moment().startOf("day").format("YYYY/MM/DD HH:mm:ss"),
        moment().endOf("day").format("YYYY/MM/DD HH:mm:ss"),
      ],
      dateRangeVal: [],
      errors: {
        message: "",
        data: "",
        search: "",
      },
      searchCateIds: [],
      saveBookCateIds: [],
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
          dataIndex: "cateNames",
          key: "cateNames",
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
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
      },
      rs: [],
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
      previewVisible: false,
      previewImage: "",
      fileList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
      ],
      filePath: "",
    };
  },
  computed: {
    roleUser() {
      return localStorage.getItem("role");
    },
  },
  mounted() {
    this.getBooksList();
    this.getCategories();
    this.generateYearList();
  },
  methods: {
    convertToArray(data) {
      return data == null ? "" : data.split(",").map((name) => name.trim());
    },
    disabledDate(current) {
      // Disable dates before yesterday
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      return current && current < yesterday;
    },
    showDrawer(id = "") {
      this.visible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getBook(id);
        this.getCategoriesByBookId(id);
      }
    },
    showBorrowDrawer(id = "") {
      this.borrowVisible = true;
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getBook(id);
      }
    },
    moment() {
      return moment;
    },
    onClose() {
      this.visible = false;
      this.borrowVisible = false;
      this.isSubmitting = false;
      // book
      this.book.title = "";
      this.book.author = "";
      this.book.categoryId = "";
      this.book.price = "";
      this.book.description = "";
      this.book.year = "";
      this.previewImage = "";
      this.errors.message = "";
      this.errors.data = "";
      // borrow book
      this.borrowBookData.quantity = "";
      this.borrowBookData.startDate = "";
      this.borrowBookData.endDate = "";
      this.dateRangeVal = null;
      this.id = "";
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
    async getCategoriesByBookId(id) {
      await axiosInterceptor
        .get(`/admin/books/cates/${id}`)
        .then((response) => {
          console.log(response.data.data);
          // JSON responses are automatically parsed.
          if (response.data.success) {
            const rs = response.data.data;
            this.saveBookCateIds = rs.map((item) => ({
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
        page: pageIndex ? pageIndex : this.pageInfo.pageIndex,
        limit: this.pageInfo.pageSize,
        get_total_count: 1,
      };

      if (this.search.title != "" && this.search.title != null) {
        dataParams.title = this.search.title.trim();
      }

      if (this.search.author != "" && this.search.author != null) {
        dataParams.author = this.search.author.trim();
      }

      if (this.search.yearFrom != "" && this.search.yearFrom != null) {
        dataParams.yearFrom = this.search.yearFrom;
      }

      if (this.search.yearTo != "" && this.search.yearTo != null) {
        dataParams.yearTo = this.search.yearTo;
      }

      if (this.search.yearTo < this.search.yearFrom) {
        this.errors.search = "Year from less than year to";
      }

      if (this.errors.search != "") {
        dataParams.yearFrom = "";
        dataParams.yearTo = "";
        dataParams.title = "";
        dataParams.author = "";
      }
      try {
        const response = await axiosInterceptor.get("/admin/books", {
          params: dataParams,
        });

        this.listBooks = response.data.data.data;

        this.pageInfo.totalElements =
          response.data.data.pagination.total_record;
        this.pageInfo.totalPages = response.data.data.pagination.total_page;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.errors.search = "";
        }, 10000);
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
    getRandomColor() {
      const minHex = 0xcc0000; // Minimum hex value for a "hot" color
      const maxHex = 0xffcc00; // Maximum hex value for a "hot" color
      let color;

      do {
        const randomHex =
          Math.floor(Math.random() * (maxHex - minHex + 1)) + minHex;
        color = "#" + randomHex.toString(16).padStart(6, "0");
      } while (color === "#FFFFFF");

      return color;
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
      this.book.filePath = this.filePath;

      const formData = new FormData();

      if (this.id == "") {
        this.book.cateIds = this.saveBookCateIds;
      } else {
        this.book.cateIds = this.saveBookCateIds.map((item) => item.value);
      }

      formData.append("title", this.book.title);
      formData.append("author", this.book.author);
      formData.append("cateIds", this.book.cateIds);
      formData.append("price", this.book.price);
      formData.append("quantity", this.book.quantity);
      formData.append("year", this.book.year);
      formData.append("filePath", this.book.filePath);
      formData.append("description", this.book.description);

      if (this.id == "") {
        axiosInterceptor
          .post("/admin/books", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
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
                this.searchCateIds = [];
                this.saveBookCateIds = [];
              }, 2000);
            }
          })
          .catch((e) => {
            console.log(e);
            //this.errors.data = e.response.data.data;
            this.errors.message = e.response.data.message;
          })
          .finally(() => {
            setTimeout(() => {
              this.isSubmitting = false;
            }, 2000);
          });
      } else {
        await axiosInterceptor
          .put(`/admin/books/${this.id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
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
                this.saveBookCateIds = [];
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
      }
    },
    async borrowBook() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;
      this.borrowBookData.startDate = this.dateRangeVal[0].format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.borrowBookData.endDate = this.dateRangeVal[1].format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.borrowBookData.bookId = this.id ?? "";
      this.borrowBookData.quantity = this.borrowBookData.quantity;

      await axiosInterceptor
        .post("/admin/book_transactions", this.borrowBookData)
        .then((response) => {
          // JSON responses are automatically parsed.
          console.log(response.data.data);
          toast.success("Borrow book success!", {
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
        .finally(() => {
          setTimeout(() => {
            this.isSubmitting = false;
          }, 2000);
        });
    },
    getBook(id) {
      if (id != "") {
        axiosInterceptor
          .get(`/admin/books/${id}`)
          .then((response) => {
            console.log(response.data.data);
            // JSON responses are automatically parsed.
            this.book.title = response.data.data.title;
            this.book.author = response.data.data.author;
            this.book.price = response.data.data.price;
            this.book.isbn = response.data.data.isbn;
            this.book.price = response.data.data.price;
            this.book.categoryId = "";
            this.book.description = response.data.data.description;
            this.book.quantity = response.data.data.quantity;
            this.book.quantityAvail = response.data.data.quantityAvail;
            this.book.year = response.data.data.yearOfPublish;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        this.filePath = image;
        console.log(this.filePath);
      };
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
  margin-left: 200px;
}

.mb-3.me-3 {
  width: 140px;
}

.mb-3.me-3.button-css.d-flex.justify-content-end[data-v-36410294] {
  margin-top: 29px;
  margin-left: 1500px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
