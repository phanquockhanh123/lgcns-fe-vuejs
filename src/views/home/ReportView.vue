<template>
  <a-card title="Report books best seller" class="w-100">
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

      <div class="mb-3 me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getBooksList(1)"
          >Search</a-button
        >
      </div>
    </div>

    <div class="row">
      <span class="text-error" v-if="errors.search">{{ errors.search }}</span>
      <div class="col-12">
        <a-table
          :dataSource="sortedBooks"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          :scroll="{ x: 1500, y: 400 }"
          rowKey="id"
          :rowSelection="null"
          size="small"
          @change="onChange"
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
          </template>
        </a-table>
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
          width: "150px",
        },
        {
          title: "Isbn",
          dataIndex: "isbn",
          key: "isbn",
          width: "300px",
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
          width: "300px",
        },
        {
          title: "Price",
          dataIndex: "price",
          key: "price",
          width: "200px",
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
          key: "quantity",
          width: "200px",
        },
        {
          title: "Quantity Avail",
          dataIndex: "quantityAvail",
          key: "quantityAvail",
          width: "200px",
        },
        {
          title: "YearOfPublish",
          dataIndex: "yearOfPublish",
          key: "yearOfPublish",
        },
        {
          title: "Total Sale",
          dataIndex: "totalSale",
          key: "totalSale",
          sorter: true
        },
        {
          title: "Total Money",
          dataIndex: "totalMoney",
          key: "totalMoney",
          sorter: true
        },
      ],
      pageInfo: {
        content: [],
        pageIndex: 1,
        pageSize: 5,
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
      previewVisible: false,
      previewImage: "",
      filePath: "",
      sortOrder: null,
      sortField: null,
      sortedBooks: [],
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
    moment() {
      return moment;
    },
    onClose() {
      this.visible = false;
      this.borrowVisible = false;
      this.isSubmitting = false;

      this.previewImage = "";
      this.errors.message = "";
      this.errors.data = "";
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
        const response = await axiosInterceptor.get("/admin/books/book-reports", {
          params: dataParams,
        });

        this.listBooks = response.data.data.data;

        this.pageInfo.totalElements =
          response.data.data.pagination.total_record;
        this.pageInfo.totalPages = response.data.data.pagination.total_page;

        // sorted
        this.sortedBooks = [...this.listBooks];
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.errors.search = "";
        }, 10000);
      }
    },
    onChange(pagination, filters, sorter) {
      this.sortOrder = sorter.order;
      this.sortField = sorter.field;

      if (this.sortOrder && this.sortField) {
        this.sortedBooks = [...this.listBooks].sort((a, b) => {
          const fieldA = a[this.sortField];
          const fieldB = b[this.sortField];

          if (this.sortOrder === 'ascend') {
            return fieldA > fieldB ? 1 : -1;
          } else {
            return fieldA < fieldB ? 1 : -1;
          }
        });
      } else {
        this.sortedBooks = [...this.listBooks];
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
