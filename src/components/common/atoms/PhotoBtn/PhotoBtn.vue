<template>
  <div id="PhotoBtn" :style="{...styleVars, width, height}" @click="$emit('click', $event)">
    <div class="circle"></div>
    <div class="ring"></div>
  </div>
</template>

<script>
  export default {
    name: 'PhotoBtn',
    props: {
      width: {
        type: String,
        default: '100px'
      },
      height: {
        type: String,
        default: '100px'
      },
      circleColor: {
        type: String,
        default: '#ffffff',
      },
      ringColor: {
        type: String,
        default: '#ffffff',
      }
    },
    emits: [
      'click'
    ],
    data() {
      return {};
    },
    computed: {
      styleVars() {
        return {
          '--circle-background-color': this.circleColor,
          '--ring-color': this.ringColor,
        };
      }
    }
  };
</script>

<style scoped lang="scss" src="./_PhotoBtn.scss">

</style>
