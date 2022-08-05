<template>
  <q-page id="ddd-carousel-testing" class="flex">
    <ddd-carousel></ddd-carousel>
  </q-page>
</template>

<script>

  export default {
    name: 'DddCarouselTesting',
    components: {
      dddCarousel: () => import('@iy4u/common-client-lib').then(module => module.dddCarousel),
    },
  };
</script>

<style scoped lang="scss">
  #ddd-carousel-testing {
  }
</style>
