<template>
  <div id="toggle-me-testing" class="q-ma-xl">
    <div>{{ theModel }}</div>
    <toggle-me mode="acs-toggle" checkedText="YES" uncheckedText="NO" size="xl" :attrs-label="{style: 'font-size: 30px;'}" toggle-indeterminate v-model="theModel" val="red" leftLabel label="Did you eat lunch today?"></toggle-me>
  </div>
</template>

<script>

  export default {
    name: 'ToggleMeTesting',
    components: {
      ToggleMe: () => import('@iy4u/common-client-lib').then(module => module.ToggleMe)
    },
    data() {
      return {
        theModel: null,
      };
    },
    watch: {
      theModel: {
        immediate: true,
        handler(newVal) {
          console.log(newVal);
        }
      }
    },
    methods: {
      reset () {
        this.theModel = null;
      }
    }
  };
</script>

<style scoped>
  #toggle-me-testing {
  }
</style>
