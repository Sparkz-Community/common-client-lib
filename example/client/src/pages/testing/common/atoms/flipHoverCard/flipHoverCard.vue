<template>
  <div id="flip-hover-card-testing">
    <flip-hover-card></flip-hover-card>
  </div>
</template>

<script>

  export default {
    name: 'FlipHoverCardTesting',
    components: {
      flipHoverCard: () => import('@iy4u/common-client-lib').then(module => module.flipHoverCard)
    },
  };
</script>

<style scoped>
  #flip-hover-card-testing {
  }
</style>
