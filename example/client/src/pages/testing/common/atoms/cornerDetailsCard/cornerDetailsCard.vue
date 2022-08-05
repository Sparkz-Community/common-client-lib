<template>
  <div id="corner-details-card-testing">
    <corner-details-card></corner-details-card>
  </div>
</template>

<script>

  export default {
    name: 'CornerDetailsCardTesting',
    components: {
      cornerDetailsCard: () => import('@iy4u/common-client-lib').then(module => module.cornerDetailsCard)
    },
  };
</script>

<style scoped>
  #corner-details-card-testing {
  }
</style>
