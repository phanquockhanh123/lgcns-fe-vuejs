
<template>
  <div class="wrapper">
    <nav-bar></nav-bar>
    <h1>This is dashboard page</h1>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
    components: { NavBar },
    name: 'HomeView',
    component: {
        NavBar
    }
}
</script>
<style scoped>
</style>


