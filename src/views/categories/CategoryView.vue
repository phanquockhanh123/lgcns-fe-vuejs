<template>
  <a-card title="List categories" class="w-100">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <a-button type="primary" @click="showDrawer">
          <PlusOutlined />
          New category
        </a-button>
      </div>
    </div>
    <div class="row">
      <div>
        <a-table
          :dataSource="listCategories"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          class="table"
          rowKey="id"
          :scroll="{ x: 1500, y: 650 }"
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
          @ok="deleteCategory"
          @cancel="handleCancel"
        >
          <p>Are you sure you want to delete this category?</p>
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
  <a-drawer
    title="Create a new category"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form :model="category" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Name" name="name">
            <a-input
              v-model:value="category.name"
              placeholder="Please enter category name"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" description="description">
            <a-textarea
              v-model:value="category.description"
              :rows="4"
              placeholder="please enter url description"
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
      <a-button type="primary" @click="createCategory" :disabled="isSubmitting"
        >Submit</a-button
      >
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axiosInterceptor from "@/service/AxiosInteceptorToken";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import moment from "moment";
interface Category {
  id?: number;
  name: string;
  description: string;
}

interface PageInfo {
  content: Category[];
  pageIndex: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

interface Errors {
  message: string;
  data: any;
}

const router = useRouter();

const isModalVisible = ref(false);
const categoryIdToDelete = ref<string | null>(null);
const loading = ref(false);
const listCategories = ref<Category[]>([]);
const selectedRowKeys = ref<string[]>([]);
const visible = ref(false);
const isSubmitting = ref(false);
const category = ref<Category>({
  name: "",
  description: "",
});
const id = ref(0);
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
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
];
const token = localStorage.getItem("token");

const pageInfo = ref<PageInfo>({
  content: [],
  pageIndex: 1,
  pageSize: 20,
  totalElements: 0,
  totalPages: 0,
});
const rules = {
  name: {
    required: true,
    message: "Please enter category name",
    trigger: "blur",
  },
};
const errors = ref<Errors>({
  message: "",
  data: "",
});

const createCategory = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  if (id.value !== 0) {
    try {
      const response = await axiosInterceptor.put(
        `/admin/categories/${id.value}`,
        category.value
      );
      if (response.data.success) {
        toast.success("Update category successfully!", {
          autoClose: 1000,
        });

        setTimeout(() => {
          router.push("/categories");
          onClose();
          getCategoriesList();
        }, 2000);
      }
    } catch (e: any) {
      console.log(e);
      errors.value.message = e.response.data.message;
      errors.value.data = e.response.data.data;
      console.log(errors.value);
    } finally {
      setTimeout(() => {
        isSubmitting.value = false;
      }, 2000);
    }
  } else {
    try {
      const response = await axiosInterceptor.post(
        "/admin/categories",
        category.value
      );
      if (response.data.success) {
        toast.success("Create category successfully!", {
          autoClose: 1000,
        });

        setTimeout(() => {
          router.push("/categories");
          onClose();
          getCategoriesList();
        }, 2000);
      }
    } catch (e: any) {
      console.log(e);
      errors.value.message = e.response.data.message;
      errors.value.data = e.response.data.data;
    } finally {
      setTimeout(() => {
        isSubmitting.value = false;
      }, 2000);
    }
  }
};

const getCategory = (id: any) => {
  if (id !== "") {
    axiosInterceptor
      .get(`/admin/categories/${id}`)
      .then((response: any) => {
        console.log(response.data);
        category.value.name = response.data.data.name;
        category.value.description = response.data.data.description;
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
};

const showDrawer = (cateId: any) => {
  visible.value = true;

  if (cateId !== "" && !isNaN(cateId)) {
    id.value = cateId;
    getCategory(id.value);
  }
};

const onClose = () => {
  visible.value = false;
  isSubmitting.value = false;
  category.value.name = "";
  category.value.description = "";
  errors.value.message = "";
  errors.value.data = "";
};

const formattedDatetime = (date: string) => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

const onSelectChange = (
  selectedRowKeys: string[],
  selectedRows: Category[]
) => {
  console.log("Selected Row Keys: ", selectedRowKeys);
  console.log("Selected Rows: ", selectedRows);
  selectedRowKeys.value = selectedRowKeys;
  const selectedIds = selectedRows.map((row) => row.id);
  console.log("Selected Book IDs: ", selectedIds);
};

const onShowSizeChange = () => {
  handleChange(pageInfo.value.pageIndex, pageInfo.value.pageSize);
};

const updatePageSize = () => {
  handleChange(pageInfo.value.pageIndex, pageInfo.value.pageSize);
};

const handleChange = (pageIndex: number, pageSize: number) => {
  pageInfo.value.pageIndex = pageIndex;
  pageInfo.value.pageSize = pageSize;

  getCategoriesList();
};

const isSelected = (book: Category) => {
  return false; // Implement your own logic here
};

const getCategoriesList = async () => {
  loading.value = true;

  try {
    let params = {
      page: pageInfo.value.pageIndex - 1,
      size: pageInfo.value.pageSize,
    };
    const response = await axiosInterceptor.get("/admin/categories", {
      params: params,
    });
    listCategories.value = response.data.data.data;
    pageInfo.value.totalElements = response.data.data.totalElements;
    pageInfo.value.totalPages = response.data.data.totalPages;
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  }
};

const deleteCategory = async () => {
  try {
    await axiosInterceptor.delete(
      `/admin/categories/${categoryIdToDelete.value}`
    );

    toast.success(
      `Delete category successfully with category id ! ${categoryIdToDelete.value}`,
      {
        autoClose: 1000,
      }
    );
    getCategoriesList();
    isModalVisible.value = false;
  } catch (error) {
    console.error(error);
  }
};

const confirmDelete = (id: string) => {
  categoryIdToDelete.value = id;
  isModalVisible.value = true;
};

const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  getCategoriesList();
});
</script>

<style scoped>
span.text-error {
  font-size: small;
  color: red;
  margin-left: 15px;
}
</style>
