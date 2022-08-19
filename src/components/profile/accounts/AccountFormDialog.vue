<template>
  <q-dialog :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
    <q-card style="min-width: 30vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
      <q-card-section>
        <account-search v-if="selectExisting" v-model="formData" :filter-out="filterOut"/>
        <form-generator v-else v-model="formData" :fields="fields" useQform v-model:valid="valid"></form-generator>
        <p class="q-ma-none text-caption" style="opacity: 0.7">
          {{ $lget(formData, 'description') ? $lget(formData, 'description').length : 0 }}/255
        </p>
      </q-card-section>
      <q-card-actions align="right" class="q-mt-md">
        <q-btn label="Cancel" @click="close" color="red"/>
        <q-btn label="Save Account"
               :disable="!valid"
               v-close-popup
               color="primary"
               @click="saveAccount"/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<script>
  import {models} from 'feathers-pinia';
  import AccountSearch from './AccountSearch';
  import isEmpty from '../../../utils/isEmpty';

  export default {
    name: 'AccountFormDialog',
    components: {AccountSearch},
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      account: {
        type: Object,
        default() {
          return {};
        },
      },
      selectExisting: {
        type: Boolean,
        default: false,
      },
      filterOut: {
        type: Array,
        data() {
          return [];
        },
      },
    },
    emits: [
      'update:modelValue',
      'close',
      'save',
    ],
    data() {
      return {
        formData: undefined,
        valid: false,
      };
    },
    watch: {
      account: {
        immediate: true,
        deep: true,
        handler: function (newVal) {
          this.formData = newVal;
        },
      },
      formData: {
        immediate: true,
        handler: function (newVal) {
          this.valid = !isEmpty(newVal) && !!this.$lget(newVal, 'name');
        },
      },
    },
    computed: {
      fields() {
        return [
          {
            fieldType: 'ImageSelect',
            path: 'avatar',
            attrs: {
              stylePanelLayout: null,
              maxParallelUploads: 1,
              allowMultiple: false,
              maxFiles: 1,
              allowReplace: false,
              checkValidity: true,
              credits: '',
              labelIdle: '<span class="column text-grey-7"><a style="font-size:0.8rem;"  class="q-mt-sm q-mb-xs">DRAG & DROP OR</a>  <a style="border-radius:1rem; font-size:0.6rem;" class="q-pa-sm text-primary text-xs bg-white q-pa-xs"> browse photo</a> </span>',
            },
            'label-attrs': {
              'v-text': 'Account Avatar',
              class: 'text-bold q-my-sm',
            },
            'div-attrs': {
              class: 'col-6 gt-xs text-caption column items-center q-pa-none text-center',
            },
          },
          {
            fieldType: 'ImageSelect',
            path: 'banner',
            attrs: {
              stylePanelLayout: null,
              maxParallelUploads: 1,
              allowMultiple: false,
              allowReplace: false,
              checkValidity: true,
              credits: '',
              labelIdle: '<span class="column text-grey-7"><a style="font-size:0.8rem;"  class="q-mt-sm q-mb-xs">DRAG & DROP OR</a>  <a style="border-radius:1rem; font-size:0.6rem;" class="q-pa-sm text-primary text-xs bg-white q-pa-xs"> browse photo</a> </span>',
            },
            'label-attrs': {
              'v-text': 'Account Banner',
              class: 'text-bold q-my-sm',
            },
            'div-attrs': {
              class: 'col-6 gt-xs  text-caption column items-center q-pa-none text-center',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              color: 'primary',
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'description',
            attrs: {
              label: 'Description',
              type: 'textarea',
              filled: true,
              color: 'primary',
              clearable: true,
              'clear-icon': 'close',
              maxlength: 255,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      isEmpty,
      close() {
        this.formData = {};
        this.$emit('close');
      },
      async saveAccount() {

        try {
          let account = this.formData;
          if (!this.selectExisting) {
            this.$lset(this.formData, 'email', this.$authUser.email); // could be a problem if users can edit other user's accounts
            this.$lget(this.formData, 'logins.ownedBy', []).push(this.$activeLogin._id);

            const ownedBy = [...this.$lget(this.account, 'logins.ownedBy', [])];

            if (this.$lget(this.$activeLogin, '_id')) {
              ownedBy.push(this.$lget(this.$activeLogin, '_id'));
            }

            const modifiedFormData = Object.assign(this.formData, {
              avatar: this.$lget(this.formData, ['avatar', '0'], this.$lget(this.account, 'avatar', null)),
              banner: this.$lget(this.formData, ['banner', '0'], this.$lget(this.account, 'banner', null)),
              email: this.$lget(this.account, 'email', this.$lget(this.$authUser, 'email', null)),
              logins: {
                ownedBy,
              },
            });
            account = await new models.api['Accounts'](modifiedFormData).save({
              data: modifiedFormData,
            });
          }
          this.$emit('saved', account);
          // this.formData = this.account;
          this.$emit('update:modelValue', this.modelValue);

        } catch (err) {
          this.$q.notify({
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

      },
    },
  };
</script>
