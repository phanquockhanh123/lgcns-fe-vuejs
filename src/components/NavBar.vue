<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link to="/" class="nav-link active">DASH BOARD</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link active">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/users" class="nav-link">User</router-link>
                    </li>
                     <li class="nav-item">
                        <router-link to="/books" class="nav-link">Books</router-link>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <router-link to="/login" class="nav-link">Login</router-link>
                    </li>
                    <li class="nav-item" v-else>
                        <router-link to="/logout" @click.prevent="logout" class="nav-link">Logout</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import axios from 'axios';

export default {
    name: 'NavBar',
    data() {
        return {

        }
    },
    methods: {
        async logout() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    console.log(localStorage.getItem('token'));
                    const res = await axios.post('http://localhost:8081/api/v1/auth/logout', {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (res.data.status != 403) {
                        localStorage.removeItem('token');
                        console.log('Register successful:', res.data);
                        this.$router.push('/login');
                    }
                } catch (error) {
                    this.error = 'Invalid input.';
                    console.error('An error occurred:', error);
                }
            }
        }
    },
    computed: {
        isLoggedIn() {
            return !localStorage.getItem('token');
        }
    },
}
</script>
