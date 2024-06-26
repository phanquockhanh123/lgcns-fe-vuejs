<template>
  <div class="row">
    <div class="col-12">
      <a-row :gutter="24">
        <a-col :span="24">
          <h3>Best seller</h3>
          <a-table
            :dataSource="listBookSeller"
            :loading="loading"
            :columns="columns"
            class="table"
            :pagination="false"
            rowKey="id"
            size="small"
          >
            <template #headerCell="{ column }"> </template>
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'totalMoney'">
                <span>
                  {{ formatPrice(record.totalMoney) }}
                </span>
              </template>

              <template v-if="column.key === 'price'">
                <span>
                  {{ formatPrice(record.price) }}
                </span>
              </template>

              <template v-if="column.key === 'filePath'">
                <img
                  :alt="record.title"
                  :src="getImageUrl(record.id, record.filePath)"
                  height="100px"
                />
              </template>
            </template>
          </a-table>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <h3>Best customer</h3>
          <a-table
            :dataSource="listBookCustomer"
            :loading="loading"
            :columns="columnsCustomer"
            class="table"
            rowKey="id"
            size="small"
            :pagination="false"
          >
            <template #headerCell="{ column }"> </template>
            <template #bodyCell="{ column, index, record }">
              <template v-if="column.key === 'totalMoneyBuy'">
                <span>
                  {{ formatPrice(record.totalMoneyBuy) }}
                </span>
              </template>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import axiosInterceptor from "../../service/AxiosInteceptorToken";

export default {
  name: "ReportView",
  data() {
    return {
      loading: false,
      book: {
        id: "",
        price: "",
        author: "",
        title: "",
        filePath: "",
        totalSale: "",
        totalMoney: "",
        isbn: "",
      },
      listBookSeller: [],
      listBookCustomer: [],
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: "100px",
        },
        {
          title: "Book cover",
          dataIndex: "filePath",
          key: "filePath",
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
          title: "Total sale",
          dataIndex: "totalSale",
          key: "totalSale",
        },
        {
          title: "Total money",
          dataIndex: "totalMoney",
          key: "totalMoney",
        },
      ],
      columnsCustomer: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: "100px",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          width: "300px",
        },
        {
          title: "Phone",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "Addess",
          dataIndex: "addess",
          key: "addess",
        },
        {
          title: "Book bought",
          dataIndex: "totalBookBuy",
          key: "totalBookBuy",
        },
        {
          title: "Money bought",
          dataIndex: "totalMoneyBuy",
          key: "totalMoneyBuy",
        },
      ],
    };
  },
  methods: {
    async getBooksBestSellerList() {
      this.loading = true;
      try {
        const response = await axiosInterceptor.get(
          "/admin/reports/book-best-sellers"
        );
        if (response.data.success) {
          this.listBookSeller = response.data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getBestCustomerList() {
      this.loading = true;
      try {
        const response = await axiosInterceptor.get(
          "/admin/reports/best-customers"
        );
        if (response.data.success) {
          this.listBookCustomer = response.data.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    getImageUrl(id, imagePath) {
      if (imagePath && id) {
        return `http://localhost:8081/static/public/book-images/${id}/${imagePath}`;
      } else {
        return "default-book-cover.jpg"; // or any other default image URL
      }
    },
  },
  mounted() {
    this.getBooksBestSellerList();
    this.getBestCustomerList();
  },
};
</script>

<style scoped></style>
