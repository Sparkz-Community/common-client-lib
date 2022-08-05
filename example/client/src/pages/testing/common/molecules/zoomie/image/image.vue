<template>
  <q-page>
    <div id="image-demo" class="flex flex-center q-mt-md">
      <zoomie class="zoomie" v-bind="props"></zoomie>
    </div>
  </q-page>
</template>

<script>
  export default {
    components: {
      Zoomie: () => import('@iy4u/common-client-lib').then(module => module.Zoomie),
    },
    name: 'image',
    data() {
      return {
        props: {
          scale: 3,
          width: 300,
          height: 300,
          url: require('./Country-Side-Landscape-minimal.jpeg'),
          highUrl: require('./Country-Side-Landscape.jpeg'),
          type: 'square',
          selector: true,
          releaseSelector: false,
          outZoomer: false,
          stickyOutZoomer: false,
          disabled: false,
          disabledReactive: false,
          mask: false,
          maskColor: 'rgba(255,255,255,0.2)',
        },
      };
    },
  };
</script>

<style scoped lang="scss">
  #image-demo {
    .zoomie {
      display: block;
      max-width: 80vw;
    }
  }
</style>
