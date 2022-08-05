<template>
  <div id="media">
    <media></media>
  </div>
</template>

<script>
  export default {
    name: 'media',
    components: {
      media: () => import('@iy4u/common-client-lib').then(module => module.media),
    },
    props: {},
    data() {
      return {
        text: '',
      };
    },
  };
</script>

<style scoped lang="scss">
  #media {

  }
</style>
