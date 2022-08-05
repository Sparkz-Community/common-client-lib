<template>
  <div id="addOrUpdate">
    <slot name="dialogBtn" :addDialog="addDialog">
      <q-btn rounded color="primary" icon="add" @click="addDialog">
        Add {{ createTitle }}
      </q-btn>
    </slot>

    <q-dialog id="addOrUpdateDialog" v-model="dialogForm" position="right" full-height>
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                :style="`width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;`">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-uppercase" style="font-weight: 700;">
              {{ $lget(formData, 'data._id') ? $lget(formData, `data.${rootFieldPath}`) : `Create ${createTitle}` }}
            </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="q-pa-sm">
            <formGenerator v-model="formData.data" :fields="fields" useQform v-model:valid="valid">
              <template v-for="slot in Object.keys($slots)"
                        v-slot:[slot]="slotProps">
                <slot :name="slot" v-bind="slotProps"></slot>
              </template>
            </formGenerator>
          </q-page>
        </q-page-container>

        <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
          <q-toolbar>
            <q-btn color="primary" :disable="!valid" @click="saveData">Save</q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';

  export default {
    name: 'addOrUpdate',
    props: {
      value: {
        type: Object,
        // required: true,
      },
      service: {
        type: String,
        required: true,
      },
      serviceClass: {
        type: String,
      },
      fields: {
        type: Array,
        default() {
          return [];
        },
      },
      params: {
        type: [Function, Object],
        default() {
          return {};
        },
      },
      rootFieldPath: {
        type: String,
        default: 'name',
        // required: true,
      },
      createTitle: {
        type: String,
      },
    },
    data() {
      return {
        valid: false,
        dialogForm: false,
        formData: {
          data: this.model,
        },
        oldFormData: {
          data: this.model,
        }
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
      formData: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length && JSON.stringify(newVal) !== JSON.stringify(this.oldFormData)) {
            // console.log('addOrUpdate > formData', newVal);
            this.$emit('input', newVal);
            this.oldFormData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    computed: {
      className() {
        return this.serviceClass ? this.serviceClass : this.$changeCase.pascalCase(this.service);
      },
      model() {
        return new models.api[`${this.className}`]().clone();
      },
    },
    methods: {
      addDialog() {
        this.dialogForm = true;
        this.formData = {
          data: this.model,
        };
      },
      async saveData() {
        let self = this;
        if (self.formData.data && Object.keys(self.formData.data).length) {
          try {
            let data = await self.formData.data.save({
              ...(typeof this.params === 'function' ? this.params() : this.params),
              data: self.fields.reduce((acc, curr) => {
                self.$lset(acc, curr.path, self.$lget(self.formData, `data.${curr.path}`));
                return acc;
              }, {}),
            });
            self.formData = {
              data: this.model,
            };
            self.dialogForm = false;
            self.$emit('saved', data);

            self.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${this.$lget(data, this.rootFieldPath, '')}"`,
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

<style lang="scss">
  #addOrUpdateDialog {
    .q-layout,
    .q-page {
      position: unset;
    }
  }
</style>

<style scoped lang="scss" src="./_addOrUpdate.scss">

</style>
