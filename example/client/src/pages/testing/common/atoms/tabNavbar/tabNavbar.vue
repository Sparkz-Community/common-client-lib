<template>
  <div id="tab-navbar-testing">
    <tab-navbar></tab-navbar>
  </div>
</template>

<script>

  export default {
    name: 'TabNavbarTesting',
    components: {
      tabNavbar: () => import('@iy4u/common-client-lib').then(module => module.tabNavbar)
    },
  };
</script>

<style scoped>
  #tab-navbar-testing {
  }
</style>
