<template>
  <div id="addOrUpdateUser">
    <slot name="dialogBtn">
      <q-btn rounded color="accent" text-color="black" icon="add" @click="addDialog">
        Add User
      </q-btn>
    </slot>

    <q-dialog v-model="dialogForm" position="right" full-height>
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                :style="`width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;`">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-accent text-uppercase" style="font-weight: 700;">
              {{ $lget(formData, 'user._id') ? $lget(formData, 'user.name') : 'Create User' }}
            </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="q-pa-sm">
            <formGenerator v-model="formData" :fields="fields" useQform :valid.sync="valid"></formGenerator>
          </q-page>
        </q-page-container>

        <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
          <q-toolbar>
            <q-btn color="accent" text-color="black" :disable="!valid" @click="saveUser">Save</q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from 'feathers-vuex';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'addOrUpdateUser',
    props: {
      value: {
        type: Object,
        // required: true,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'ir-roles-roles',
        name: 'ir-roles-roles',
        qid: 'usersRolesAdmin',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
    ],
    data() {
      return {
        valid: false,
        dialogForm: false,
        formData: {
          user: new models.api.Users().clone(),
        },
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length) {
            this.formData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    computed: {
      fields() {
        return [
          {
            fieldType: 'ImageSelect',
            path: 'user.avatar',
            attrs: {
              // stylePanelLayout: null,
              imageCropAspectRatio: null,
            },
            'label-attrs': {
              'v-text': 'User avatar',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'ImageSelect',
            path: 'user.banner',
            attrs: {
              stylePanelLayout: null,
              imageCropAspectRatio: null,
            },
            'label-attrs': {
              'v-text': 'User banner',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'user.name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'user.roles',
            attrs: {
              label: 'Roles',
              color: 'accent',
              'hide-selected': false,
              'fill-input': false,
              'bg-color': 'secondary',
              'label-color': 'white',
              'input-class': 'text-white',
              'options-selected-class': 'text-accent',
              'popup-content-style': 'background-color: var(--q-color-secondary)',
              multiple: true,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.irRolesRoles,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'TextInput',
            path: 'user.about',
            attrs: {
              label: 'About',
              type: 'textarea',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      addDialog() {
        this.dialogForm = true;
        this.formData = {
          user: new models.api.Users().clone(),
        };
      },
      async saveUser() {
        let self = this;
        if (self.formData.user && Object.keys(self.formData.user).length) {
          try {
            self.$lset(self.formData, 'user.avatar', self.$lget(self.formData, 'user.avatar.0'));
            self.$lset(self.formData, 'user.banner', self.$lget(self.formData, 'user.banner.0'));
            let user = await self.formData.user.save({
              data: {
                avatar: self.$lget(self.formData, 'user.avatar'),
                banner: self.$lget(self.formData, 'user.banner'),
                name: self.$lget(self.formData, 'user.name'),
                roles: self.$lget(self.formData, 'user.roles'),
                about: self.$lget(self.formData, 'user.about'),
              },
              userJoin: true,
              rolesJoin: true,
            });
            self.formData = {
              user: new models.api.Users().clone(),
            };
            self.dialogForm = false;
            self.$emit('saved', user);

            self.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${user.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          } catch (err) {
            self.$q.notify({
              type: 'negative',
              message: err.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_addOrUpdateUser.scss">

</style>
