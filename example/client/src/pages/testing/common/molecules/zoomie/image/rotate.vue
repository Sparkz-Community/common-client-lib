<template>
  <q-page class="flex flex-center">
    <div id="image-rotate-demo">
      <zoomie>
        <canvas-preview v-bind="propsPreview"></canvas-preview>
        <template slot="zoomer">
          <canvas-zoomer v-bind="propsZoomer"></canvas-zoomer>
        </template>
        <q-btn class="rotate-icon" icon="rotate_90_degrees_cw" @click="handleRotate"></q-btn>
      </zoomie>
    </div>
  </q-page>
</template>

<script>
  export default {
    components: {
      Zoomie: () => import('@iy4u/common-client-lib').then(module => module.Zoomie),
      canvasPreview: () => import('@iy4u/common-client-lib').then(module => module.CanvasPreview),
      canvasZoomer: () => import('@iy4u/common-client-lib').then(module => module.CanvasZoomer),
    },
    name: 'rotate',
    data: function () {
      return {
        rotate: 0,
        propsPreview: {
          url: require('./image.jpg'),
          width: 960,
          height: 480,
          rotate: this.rotate,
        },
        propsZoomer: {
          url: require('./image-high.jpg'),
          width: 960,
          height: 480,
          rotate: this.rotate,
        },
      };
    },
    watch: {
      // eslint-disable-next-line no-unused-vars
      rotate(newValue, oldValue) {
        this.propsPreview.rotate = newValue;
        this.propsZoomer.rotate = newValue;
      },
    },
    methods: {
      handleRotate() {
        this.rotate += 90;
      },
    },
  };
</script>

<style scoped lang="scss">
  #image-rotate-demo {
    .cavans1,
    .cavans2 {
      display: block;
      width: 1000px;
    }

    .rotate-icon {
      display: inline-block;
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 999;
      background-color: #ffd843;
    }
  }
</style>
