<template>
  <a-result status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
    <template #extra>
      <router-link to="/dashboard" class="nav-link"><a-button type="primary" >Back Dashboard</a-button></router-link>
    </template>
  </a-result>
</template>