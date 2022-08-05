<template>
  <div id="videos" v-bind="$attrs['div-attrs']">
    <video id="video"
           ref="video"
           v-bind="$attrs['attrs']"/>
  </div>
</template>

<script>
  export default {
    name: 'Videos',
    inheritAttrs: false,
    props: {},
    data() {
      return {
        source: null,
        canvas: null,
        camerasListEmitted: false,
        cameras: [],
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.width', this.$lget(newVal, 'attrs.width', '100%'));
          this.$lset(newVal, 'attrs.height', this.$lget(newVal, 'attrs.height', '100%'));
          this.$lset(newVal, 'attrs.autoplay', this.$lget(newVal, 'attrs.autoplay', true));
          this.$lset(newVal, 'attrs.playsinline', this.$lget(newVal, 'attrs.playsinline', true));
          this.$lset(newVal, 'attrs.muted', this.$lget(newVal, 'attrs.muted', true));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', ''));
        },
      },
    },
    methods: {},
  };
</script>

<style scoped lang="scss" src="./_videos.scss">

</style>
