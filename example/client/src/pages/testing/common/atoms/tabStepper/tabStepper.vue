<template>
  <div id="tab-stepper-testing">
    <tab-stepper v-model="tab" :tabs="tabs" :progress="false"></tab-stepper>

    <div class="q-pa-xl flex flex-center">
      <q-btn color="primary" @click="routerRun = !routerRun">Toggle Save Route</q-btn>
    </div>
  </div>
</template>

<script>
  import {routerMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'TabStepperTesting',
    mixins: [
      routerMixin({
        name: 'tab',
        runWhen() {
          return this.routerRun;
        },
        parseQuery(val, key) {
          if (['tab'].indexOf(key) !== -1) {
            return JSON.parse(val);
          } else {
            return val;
          }
        },
        query() {
          return {
            tab: this.tab,
          };
        },
      }),
    ],
    components: {
      tabStepper: () => import('@iy4u/common-client-lib').then(module => module.tabStepper),
    },
    data() {
      return {
        tab: 0,
        routerRun: false,
      };
    },
    // watch: {
    //   tab(newVal) {
    //     this.routerRun = newVal === 2;
    //   },
    // },
    computed: {
      tabs() {
        return [
          {
            label: 'Site Navigation',
            icon: 'mdi-navigation',
          },
          {
            label: 'Pages',
            icon: 'mdi-page-layout-body',
          },
          {
            label: 'Forms',
            icon: 'mdi-file-document',
          },
        ];
      },
    },
  };
</script>

<style scoped>
  #tab-stepper-testing {
  }
</style>
