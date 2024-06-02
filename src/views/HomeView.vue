
<template>
  <div class="wrapper">
    <nav-bar></nav-bar>
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
.wrapper {
    background: url("../assets/images/719756-beautiful-background-images-1920x1200-for-tablet.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    overflow: hidden;
    min-height: 110vh;
    /* background: rgba(39, 39, 39, 0.4); */
}
</style>


