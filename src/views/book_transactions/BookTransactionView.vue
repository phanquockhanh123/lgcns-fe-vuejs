<template>
  <a-card title="List book transactions" class="w-100">
    <!-- Form search -->
    <div class="d-flex mb-3 w-100">
      <div class="mb-3 me-3" v-if="roleUser !== 'USER'">
        <label for="userName" class="form-label">User name</label>
        <a-select
          v-model:value="search.userId"
          show-search
          placeholder="Select a users"
          style="width: 150px"
          :options="listUsers"
          :filter-option="filterOption"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
        ></a-select>
      </div>
      <div class="mb-3 me-3">
        <label for="Status" class="form-label">Status</label>
        <a-select
          v-model:value="search.status"
          style="width: 200px"
          :allowClear="true"
        >
          <a-select-option :value="0">BORROWING</a-select-option>
          <a-select-option :value="1">RETURNED</a-select-option>
          <a-select-option :value="2">OVERDATED</a-select-option>
        </a-select>
      </div>
      <div class="mb-3 me-3 button-css-search">
        <a-button class="btn btn-primary" @click.prevent="getBookTransList(1)"
          >Search</a-button
        >
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <a-table
          :dataSource="listBookTrans"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          :scroll="{ x: 1500, y: 650 }"
          rowKey="id"
          :rowSelection="null"
        >
          <template #headerCell="{ column }"> </template>
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status == 0" :color="'geekblue'">
                BORROWING
              </a-tag>
              <a-tag v-if="record.status == 1" :color="'green'">
                RETURNED
              </a-tag>
              <a-tag v-if="record.status == 2" :color="'volcano'">
                OVERDATED
              </a-tag>
            </template>
            <template v-if="column.key === 'bonus'">
              <span>
                {{ formatPrice(record.bonus) }}
              </span>
            </template>
            <template v-if="column.key === 'amount'">
              <span>
                {{ formatPrice(record.amount) }}
              </span>
            </template>
            <template v-if="column.key === 'total'">
              <span>
                {{ formatPrice(record.amount + record.bonus) }}
              </span>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button
                  type="primary"
                  @click="showCheckout(record.id)"
                  v-if="roleUser === 'USER' && record.status != 1"
                >
                  <UndoOutlined />
                </a-button>
                <p v-if="roleUser === 'USER' && record.status == 1">
                  <CheckCircleTwoTone />
                </p>
                <a-button
                  type="primary"
                  @click="sendMailNotice(record.id)"
                  v-if="
                    roleUser === 'MANAGER' ||
                    (roleUser === 'ADMIN' && record.status != 1)
                  "
                >
                  <SendOutlined title="Send mail notice" />
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
          title="Returned book"
          @ok="returnBook"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to returned books ?</p>
        </a-modal>
        <a-modal
          v-model:visible="isModalVisibleSendNotice"
          title="Send mail notice"
          @ok="sendMail"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to send mail notice transactions ?</p>
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
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UndoOutlined,
  SendOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons-vue";
import axiosInterceptor from "../../service/AxiosInteceptorToken";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import moment from "moment";

export default {
  name: "BookTransactionView",
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    VerticalAlignBottomOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    UndoOutlined,
    SendOutlined,
    CheckCircleTwoTone,
  },
  data() {
    return {
      selectedDate: null,
      bookIdToDelete: null,
      isModalVisible: false,
      stompClient: null,
      socket: null,
      connected: false,
      isModalVisibleSendNotice: false,
      loading: false,
      dateFormat: "YYYY/MM/DD HH:mm:ss",
      listBookTrans: [],
      listCategory: [],
      listCategoriesTag: [],
      selectedRowKeys: [],
      selectedYear: null,
      years: [],
      isSubmitting: false,
      search: {
        status: "",
        userId: "",
      },
      book: {
        price: "",
        author: "",
        title: "",
        description: "",
        year: "",
        quantity: "",
        quantityAvail: "",
        cateIds: "",
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
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: "100px",
        },
        {
          title: "TransactionId",
          dataIndex: "transactionId",
          key: "transactionId",
          width: "200px",
        },
        {
          title: "BookIsbn",
          dataIndex: "bookIsbn",
          key: "bookIsbn",
        },
        {
          title: "BookTitle",
          dataIndex: "bookTitle",
          key: "bookTitle",
        },

        {
          title: "BookAuthor",
          dataIndex: "bookAuthor",
          key: "bookAuthor",
        },
        {
          title: "BookPrice",
          dataIndex: "bookPrice",
          key: "bookPrice",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Phone",
          dataIndex: "phone",
          key: "phone",
        },
        ,
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
          key: "quantity",
        },
        {
          title: "StartDate",
          dataIndex: "startDate",
          key: "startDate",
        },
        {
          title: "EndDate",
          dataIndex: "endDate",
          key: "endDate",
        },
        {
          title: "ReturnDate",
          dataIndex: "returnDate",
          key: "returnDate",
        },
        {
          title: "Bonus",
          dataIndex: "bonus",
          key: "bonus",
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
        },
        {
          title: "Total",
          dataIndex: "total",
          key: "total",
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
      id: "",
      bookTransId: "",
      listUsers: [],
    };
  },
  computed: {
    roleUser() {
      return localStorage.getItem("role");
    },
    roleId() {
      return localStorage.getItem("userId");
    },
  },
  mounted() {
    this.getBookTransList();
    this.getUsersList();
  },
  methods: {
    disabledDate(current) {
      // Disable dates before yesterday
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      return current && current < yesterday;
    },
    moment() {
      return moment;
    },
    onClose() {
      this.isSubmitting = false;
      this.errors.message = "";
      this.errors.data = "";
      // borrow book
      this.dateRangeVal = null;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log("Selected Row Keys: ", selectedRowKeys);
      console.log("Selected Rows: ", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      const selectedIds = selectedRows.map((row) => row.id);
      console.log("Selected Book IDs: ", selectedIds);
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

      this.getBookTransList();
    },
    tableScroll() {
      return this.screenWidth > 1300 ? { x: 1300 } : {};
    },
    async getBookTransList(pageIndex) {
      this.loading = true;

      let dataParams = {
        page: pageIndex ? pageIndex : this.pageInfo.pageIndex,
        limit: this.pageInfo.pageSize,
        get_total_count: 1,
      };
      if (this.search.status != "") {
        dataParams.status = this.search.status;
      }

      if (this.search.userId != "") {
        dataParams.userId = this.search.userId;
      } else {
        dataParams.userId =
          localStorage.getItem("role") === "USER"
            ? localStorage.getItem("userId")
            : "";
      }

      try {
        const response = await axiosInterceptor.get(
          "/admin/book_transactions",
          {
            params: dataParams,
          }
        );

        this.listBookTrans = response.data.data.data;

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
    handleCancel() {
      this.isModalVisible = false;
      this.isModalVisibleSendNotice = false;
      this.bookTransId = "";
    },
    async returnBook() {
      try {
        if (this.bookTransId != "") {
          const response = await axiosInterceptor.post(
            `/admin/book_transactions/return-book/${this.bookTransId}`
          );

          this.isModalVisible = false;
          this.getBookTransList();

          toast.success("Returned book successfully", {
            autoClose: 1000,
          });
        } else {
          alert("id not exists");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
          this.bookTransId = "";
        });
      }
    },
    showCheckout(id) {
      this.bookTransId = id;
      this.isModalVisible = true;
    },
    sendMailNotice(id) {
      this.bookTransId = id;
      this.isModalVisibleSendNotice = true;
    },
    async sendMail() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;
      try {
        if (this.bookTransId != "") {
          const response = await axiosInterceptor.post(
            `/admin/book_transactions/send-mail-notice/${this.bookTransId}`
          );

          this.isModalVisibleSendNotice = false;
          this.getBookTransList();

          toast.success("Send mail notice book transaction successfully", {
            autoClose: 1000,
          });
        } else {
          alert("id not exists");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
          this.bookTransId = "";
          this.isSubmitting = false;
        }, 1000);
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

        this.cardData = response.data.data.data;

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
    async getUsersList(pageIndex) {
      this.loading = true;

      let dataParams = {
        page: pageIndex ? pageIndex : this.pageInfo.pageIndex,
        limit: this.pageInfo.pageSize,
        get_total_count: 0,
      };

      try {
        const response = await axiosInterceptor.get("/admin/users/search", {
          params: dataParams,
        });
        let rs = response.data.data.data;
         this.listUsers = rs.map((item) => ({
              value: item.id,
              label: item.firstName + " " + item.lastName,
            }));
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        });
      }
    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    handleChange(value) {
      console.log(value);
    },
    filterOption(input, option) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
  margin-left: 50px;
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
</style>
