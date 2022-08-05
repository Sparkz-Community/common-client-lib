<template>
  <q-page class="q-pa-xl">
    <div id="TogglerPage" class="q-mt-xl">
<!--      <toggler-->
<!--        :acs="{'&#45;&#45;size-ratio': .2}"-->
<!--        mode="acs"-->
<!--        v-model="val"-->
<!--        @click="handler"-->
<!--      ></toggler>-->
      <toggle></toggle>
    </div>
    <div>
      <togg mode="acs"
            @input="handler"
            v-model="val"
      ></togg>
      <q-toggle></q-toggle>
    </div>
  </q-page>
</template>

<script>
  // import Toggler from 'components/common/atoms/Toggler/Toggler';
  import Toggle from 'components/common/atoms/Toggle';
  import Togg from 'components/common/atoms/Togg';

  export default {
    name: 'TogglerPage',
    components: {Togg, Toggle, /*Toggler*/},
    props: {},
    data() {
      return {
        val: null,
      };
    },
    methods: {
      handler(val) {
        console.log(val);
        console.log('text', this.val);
      }
    }
  };
</script>

<style scoped lang="scss">
  #TogglerPage {

  }
</style>
