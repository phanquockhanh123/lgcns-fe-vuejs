<template>
    <nav-bar></nav-bar>
    <a-card title="List books" class="w-100">
        <div class="row mb-3">
            <div class="d-flex ml-3">
                <a-form-item label="Title" name="title">
                    <a-input v-model:value="title" placeholder="Title" autocomplete="off" />
                </a-form-item>
                <a-form-item label="Author" name="author">
                    <a-input v-model:value="author" placeholder="Author" autocomplete="off" />
                </a-form-item>
                <a-button type="primary" @click.prevent="getBooksList">
                    Search
                </a-button>
            </div>
            <div class="col-12 d-flex justify-content-end">
                <a-button type="primary">
                    Create
                </a-button>
            </div>
        </div>
        <div class="row">
            <div class="col-12 table-responsive">
                <a-table :dataSource="listBooks" :columns="columns" class="table">
                    <template #headerCell="{ column }">
                    </template>
                    <template #bodyCell="{ column, index, record }">
                        <template v-if="column.key === 'action'">
                            <a-space>
                                <a-button type="primary">
                                    <EditOutlined />
                                </a-button>
                                <a-button type="primary" danger>
                                    <DeleteOutlined />
                                </a-button>
                            </a-space>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </a-card>
</template>

<script>
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import NavBar from '../components/NavBar.vue';
import axios from 'axios';

export default {
    name: 'UserView',
    components: {
        NavBar,
        EditOutlined,
        DeleteOutlined,
        PlusOutlined,
        SearchOutlined
    },
    data() {
        return {
            title: "",
            author: "",
            listBooks: [],
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    title: 'Author',
                    dataIndex: 'authorName',
                    key: 'authorName',
                },
                {
                    title: 'Isbn',
                    dataIndex: 'isbn',
                    key: 'isbn',
                },
                {
                    title: 'Synopsis',
                    dataIndex: 'synopsis',
                    key: 'synopsis',
                },
                {
                    title: 'BookCover',
                    dataIndex: 'bookCover',
                    key: 'bookCover',
                }
            ],
        };
    },
    created() {
        this.getBooksList()
    },
    methods: {
        async getBooksList() {
            this.token = localStorage.getItem("token");
            console.log(this)
            if (this.token != "") {
                await axios
                    .get("http://localhost:8081/api/v1/admin/books", {
                        params: {
                            author: this.author,
                            title: this.title,
                            page: 0,
                            size: 5
                        },
                        headers: {
                            Authorization: "Bearer " + this.token,
                        },
                    })
                    .then((response) => {
                        this.listBooks = response.data.data;
                        // this.totalItems = response.data.totalElements;
                        // this.currentPage = response.data.number;
                        // this.itemsPerPage = response.data.size;
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => (this.loading = false));
            }
        }
    }
}
</script>