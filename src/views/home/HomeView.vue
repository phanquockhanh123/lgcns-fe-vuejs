<template>
  <div class="wrapper">
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
    <div>
      <div v-for="(chunk, index) in cardChunks" :key="index" class="card-list">
        <a-card
          v-for="card in chunk"
          :key="card.title"
          hoverable
          style="width: 240px"
        >
          <template #cover>
            <img
              :alt="card.title"
              :src="getImageUrl(card.id, card.filePath)"
              height="200px"
            />
          </template>
          <a-card-meta>
            <template #title>
              <div>{{ card.title }}</div>
              <div>by {{ card.author }}</div>
            </template>
            <template #description>
              <div>Price: {{ formatPrice(card.price) }}</div>
              <div>Quantity: {{ card.quantityAvail }}</div>
              <a-button
                type="primary"
                @click="showBorrowDrawer(card.id)"
                v-if="roleUser === 'USER'"
                >Borrow Book</a-button
              >
            </template>
          </a-card-meta>
        </a-card>
      </div>
      <div class="pagination">
        <a-pagination
          v-model:current="pageInfo.pageIndex"
          v-model:pageSize="pageInfo.pageSize"
          :total="pageInfo.totalElements"
          show-size-changer
          :page-size-options="['5', '10', '15']"
          :locale="{ items_per_page: '/ trang' }"
          @show-size-change="onShowSizeChange"
          @change="updatePageSize"
        />
      </div>
    </div>
  </div>

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
              :disabled-date="disabledDate"
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
  name: "HomeView",
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
      cardData: [],
      years: [],
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
      pageInfo: {
        content: [],
        pageIndex: 1,
        pageSize: 15,
        totalElements: 0,
        totalPages: 0,
      },
      search: {
        title: "",
        author: "",
        yearFrom: "",
        yearTo: "",
      },
      errors: {
        message: "",
        data: "",
        search: "",
      },
      borrowVisible: false,
      borrowBookData: {
        quantity: "",
        startDate: "",
        endDate: "",
        bookId: "",
      },
      id: "",
      rules: {
        quantity: {
          required: true,
          message: "Please enter quantity",
          trigger: "blur",
        },
      },
      dateRangeValDefault: [
        moment().startOf("day").format("YYYY/MM/DD HH:mm:ss"),
        moment().endOf("day").format("YYYY/MM/DD HH:mm:ss"),
      ],
      dateRangeVal: [],
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    };
  },
  computed: {
    cardChunks() {
      const chunkSize = 5;
      const cardData = this.cardData;
      const chunks = [];

      for (let i = 0; i < cardData.length; i += chunkSize) {
        chunks.push(cardData.slice(i, i + chunkSize));
      }

      return chunks;
    },
    roleUser() {
      return localStorage.getItem("role");
    },
  },
  methods: {
    generateYearList() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 20; // Adjust the range as needed

      for (let year = currentYear; year >= startYear; year--) {
        this.years.push(year);
      }
    },
    getBookTitleAndAuthor(title, author) {
      return `${title} by \n ${author}`;
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
    getImageUrl(id, imagePath) {
      if (imagePath && id) {
        return `http://localhost:8081/static/public/book-images/${id}/${imagePath}`;
      } else {
        return "default-book-cover.jpg"; // or any other default image URL
      }
    },
    showBorrowDrawer(id = "") {
      this.borrowVisible = true;
      console.log(123);
      if (id != "" && !isNaN(id)) {
        this.id = id;
        this.getBook(id);
      }
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
              this.$router.push("/dashboard");
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
    disabledDate(current) {
      // Disable dates before yesterday
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      return current && current < yesterday;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  mounted() {
    this.getBooksList();
    this.generateYearList();
  },
};
</script>
<style scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.card-list > * {
  flex: 0 0 calc(15% - 100px);
}

.d-flex.mb-3.w-100 {
  justify-content: center;
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

.pagination {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 10px 0;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
</style>
