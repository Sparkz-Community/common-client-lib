<template>
  <div id="addOrUpdatePayment">
    <slot name="dialogBtn">
      <q-btn rounded color="accent" text-color="black" icon="add" @click="addDialog">
        Add Payment
      </q-btn>
    </slot>

    <q-dialog v-model="dialogForm" position="right" full-height>
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                :style="`width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;`">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-accent text-uppercase" style="font-weight: 700;">
              {{ $lget(formData, 'payment._id') ? $lget(formData, 'payment.memo') : 'Create Payment' }}
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
            <q-btn color="accent" text-color="black" :disable="!valid" @click="savePayment">Save</q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from 'feathers-vuex';

  export default {
    name: 'addOrUpdatePayment',
    props: {
      value: {
        type: Object,
        // required: true,
      },
    },
    data() {
      return {
        valid: false,
        dialogForm: false,
        formData: {
          payment: new models.api.Payments().clone(),
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
            fieldType: 'TextInput',
            path: 'payment.account',
            attrs: {
              label: 'Account',
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
            fieldType: 'NumberInput',
            path: 'payment.amount',
            label: 'Amount',
            attrs: {
              min: 0,
            },
          },
          {
            fieldType: 'CtkDatePicker',
            path: 'payment.paidDate',
            attrs: {
              label: 'Paid Date',
              formatted: 'MMM DD, YYYY - h:mm A',
              rules: [
                (input) => {
                  return !!input;
                },
              ],
            },
            slots: ['prepend'],
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'payment.status',
            attrs: {
              label: 'Select Status',
              'hide-selected': false,
              'fill-input': false,
              color: 'accent',
              'bg-color': 'secondary',
              'label-color': 'white',
              'options-selected-class': 'text-accent',
              'popup-content-style': 'background-color: var(--q-color-secondary)',
              'dropdown-icon': 'fas fa-chevron-down',
              options: ['TBD'],
              // rules: [val => !!val || 'Must Select Status'],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'payment.memo',
            attrs: {
              label: 'Memo',
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
          {
            fieldType: 'TextInput',
            path: 'payment.referenceNumber',
            attrs: {
              label: 'Reference Number',
              type: 'text',
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

          {
            fieldType: 'TextInput',
            path: 'payment.transferredToExternal',
            attrs: {
              label: 'Transferred to External',
              type: 'text',
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
          {
            fieldType: 'CtkDatePicker',
            path: 'payment.transferredToExternalDate',
            attrs: {
              label: 'Transferred to External Date',
              formatted: 'MMM DD, YYYY - h:mm A',
              rules: [
                (input) => {
                  return !!input;
                },
              ],
            },
            slots: ['prepend'],
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'payment.receivedFromExternal',
            attrs: {
              label: 'Received from External',
              type: 'text',
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
          {
            fieldType: 'CtkDatePicker',
            path: 'payment.receivedFromExternalDate',
            attrs: {
              label: 'Received from External Date',
              formatted: 'MMM DD, YYYY - h:mm A',
              rules: [
                (input) => {
                  return !!input;
                },
              ],
            },
            slots: ['prepend'],
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
          payment: new models.api.Payments().clone(),
        };
      },
      async savePayment() {
        let self = this;
        if (self.formData.payment && Object.keys(self.formData.payment).length) {
          try {
            let payment = await self.formData.payment.save({
              data: {
                account: self.$lget(self.formData, 'payment.account'),
                amount: self.$lget(self.formData, 'payment.amount'),
                paidDate: self.$lget(self.formData, 'payment.paidDate'),
                status: self.$lget(self.formData, 'payment.status'),
                memo: self.$lget(self.formData, 'payment.memo'),
                referenceNumber: self.$lget(self.formData, 'payment.referenceNumber'),

                transferredToExternal: self.$lget(self.formData, 'payment.transferredToExternal'),
                transferredToExternalDate: self.$lget(self.formData, 'payment.transferredToExternalDate'),
                receivedFromExternal: self.$lget(self.formData, 'payment.receivedFromExternal'),
                receivedFromExternalDate: self.$lget(self.formData, 'payment.receivedFromExternalDate'),
              },
              userJoin: true,
            });
            self.formData = {
              payment: new models.api.Payments().clone(),
            };
            self.dialogForm = false;
            self.$emit('saved', payment);

            self.$q.notify({
              type: 'positive',
              message: 'Successfully Saved Payment',
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

<style scoped lang="scss" src="./_addOrUpdatePayment.scss">

</style>
