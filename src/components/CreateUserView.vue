<template>
  <div>
    <h1>Create User</h1>
    <form>
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <input type="text" class="form-control" v-model="user.firstName" id="firstName" aria-describedby="firstName">
      </div>
      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <input type="text" class="form-control" v-model="user.lastName" id="lastName" aria-describedby="lastName">
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" v-model="user.email" id="email" aria-describedby="email">
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <input type="text" class="form-control" v-model="user.address" id="address" aria-describedby="address">
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createUser">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CreateUserView",
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        address: ''
      }
    }
  },
  methods: {
    createUser() {
      axios.post('localhost:8081/api/v1/users', this.user)
      .then(response => {
        // JSON responses are automatically parsed.
        console.log(response.data)
      })
      .catch(e => {
        this.errors.push(e)
      })
      console.log(13)
    }
  }
}
</script>