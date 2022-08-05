<template>
  <div
    :class="hover ? {'AccountCard': true, 'hover-on-desktop': $q.platform.is.desktop} : {'AccountCard': true}">
    <!--    Above class could probably be written better-->
    <q-card :square="square" class="main-card"
            :style="cardCssVars">
      <q-avatar class="profile-pic bg-secondary">
        <img v-if="$lget(account, 'avatar.raw.file')" :src="$lget(account, ['avatar','raw','file'])">
      </q-avatar>
      <div class="flex items-center">
        <h3 class="account-name q-ma-none q-mb-sm ellipsis text-white q-pr-xs"
            style="flex: 1; text-shadow: 1px 1px 3px black">{{ $lget(account, 'name', 'No Name Found') }}</h3>
        <q-btn
          flat
          dense
          class="q-mx-md text-white"
          style="text-shadow: 1px 1px 3px black"
          @click="openDialog=true">
          <span class="edit-label">edit account</span>
          <q-icon name="edit" style="margin-left: 5px"/>
        </q-btn>
      </div>
      <q-btn-dropdown v-if="$q.screen.lt.sm"
                      color="primary"
                      :label="tab ? tab.split('-').join(' ') : 'Account Settings'">
        <q-tabs class="bg-primary text-white"
                v-model="selectedTab"
                align="left"
                vertical
                switch-indicator
                inline-label>
          <q-tab v-for="tab in tabs" :name="$lget(tab,'name')" :key="$lget(tab,'name')">
            <q-icon class="q-mr-sm" :name="$lget(tab,'icon')"/>
            <span>{{ $lget(tab, 'label') }}</span>
          </q-tab>
        </q-tabs>
      </q-btn-dropdown>
      <q-tabs v-else
              class="bottom-bar bg-primary text-white"
              v-model="selectedTab"
              align="left"
              inline-label>
        <q-tab v-for="tab in tabs" :name="$lget(tab,'name')" :key="$lget(tab,'name')">
          <q-icon class="q-mr-sm" :name="$lget(tab,'icon')"/>
          <span>{{ $lget(tab, 'label') }}</span>
        </q-tab>
      </q-tabs>
    </q-card>
    <q-slide-transition>
      <div v-show="selectedTab !== null">
        <q-tab-panels
          v-model="selectedTab"
          animated>
          <q-tab-panel class="q-px-none" v-for="tab in tabs" :name="$lget(tab,'name')" :key="$lget(tab,'name')">
            <slot :name="$lget(tab,'name')" v-bind="value">

            </slot>
          </q-tab-panel>

        </q-tab-panels>

      </div>
    </q-slide-transition>

    <account-form-dialog v-model="openDialog" :account="$lget(value,'account')" @saved="notifySaved"
                         @close="openDialog=false"/>
  </div>
</template>

<script>
  // import {models} from '@feathersjs/vuex';
  import {routerMixin} from '../../../';
  import AccountFormDialog from './AccountFormDialog';

  export default {
    name: 'AccountCard',
    components: {
      AccountFormDialog,

    },
    props: {
      value: {
        type: Object,
        required: true,
      },
      hover: {
        type: Boolean,
        required: false,
        default: false,
      },
      square: {
        type: Boolean,
        default: false,
      },
      routerMixinRun: {
        type: Boolean,
        default: false,
      },
      tabs: {
        type: Array,
        required: true,
      },
      tab: {
        type: [Number, String, null, undefined],
        default: null,
      },
    },
    mixins: [
      routerMixin({
        name: 'AccountCard',
        runWhen() {
          return this.routerMixinRun;
        },
        query() {
          return {
            selectedTab: this.selectedTab,
          };
        },
      }),
    ],
    data() {
      return {
        openDialog: false,
        selectedTab: undefined,
      };
    },

    watch: {
      tab: {
        immediate: true,
        handler(newVal){
          this.selectedTab = newVal;
        }
      }
    },

    computed: {
      cardCssVars() {
        const backgroundImage = this.$lget(this.account, ['banner', 'raw', 'file'], '');
        console.log(backgroundImage);
        return `background-image: url(${backgroundImage}); --card-bg-color: ${this.$q.dark.mode ? '#2f2f2f' : 'var(--q-color-accent)'}`;
      },
      account() {
        return this.$lget(this.value, 'account', {});
      },


    },
    methods: {
      notifySaved(value) {
        this.$q.notify({
          type: 'positive',
          message: `Successfully Saved "${value.name}"`,
          timeout: 10000,
          actions: [
            {
              icon: 'close', color: 'white', handler: () => {
                /* ... */
              },
            },
          ],
        });
      },
    },
  };
</script>

<style scoped lang="scss" src="./_AccountCard.scss">

</style>
