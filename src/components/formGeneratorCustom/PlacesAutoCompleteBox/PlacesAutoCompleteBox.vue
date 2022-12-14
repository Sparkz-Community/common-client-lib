<template>
  <div id="PlacesAutoCompleteBox" v-bind="attrs['div-attrs']">
    <q-expansion-item v-bind="attrs['expansion-attrs']">
      <template v-slot:header="{}">
        <div style="width: 100%; display: grid; align-items: center;" @[ifClick].stop>
          <places-auto-complete :model-value="newEditedAddress"
                                @update:model-value="newEditedAddress = { ...modelValue, ...$event }"
                                @error="searchInput = ''"
                                :path="path"
                                v-bind="attrs['attrs']"></places-auto-complete>
        </div>
      </template>

      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div v-if="!hideFields.includes('address1')" class="col-12 col-sm-6">
              <q-input label="Address"
                       :model-value="newEditedAddress.address1"
                       disable></q-input>
            </div>
            <div v-if="!hideFields.includes('city')" class="col-12 col-sm-6">
              <q-input label="City"
                       :model-value="newEditedAddress.city"
                       disable></q-input>
            </div>
            <div v-if="!hideFields.includes('region')" class="col-12 col-sm-6">
              <q-input label="Region"
                       :model-value="newEditedAddress.region"
                       disable></q-input>
            </div>
            <div v-if="!hideFields.includes('postal')" class="col-12 col-sm-6">
              <q-input label="Postal Code"
                       :model-value="newEditedAddress.postal"
                       disable></q-input>
            </div>
            <div v-if="!hideFields.includes('country')" class="col-12 col-sm-6">
              <q-input label="Country"
                       :model-value="newEditedAddress.country"
                       disable></q-input>
            </div>
            <div v-if="!hideFields.includes('latitude')" class="col-12 col-sm-6">
              <q-input label="Latitude"
                       :model-value="newEditedAddress.latitude"
                       disable></q-input>
            </div>
            <div v-if="!hideFields.includes('longitude')" class="col-12 col-sm-6">
              <q-input label="Longitude"
                       :model-value="newEditedAddress.longitude"
                       disable></q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
  import PlacesAutoComplete from './PlacesAutoComplete';

  export default {
    name: 'PlacesAutoCompleteBox',
    components: {
      PlacesAutoComplete,
    },
    props: {
      modelValue: {
        type: Object,
        required: false,
        default: function () {
          return {
            name: '',
            formatted: '',
            address1: '',
            address2: '',
            region: '',
            route: '',
            city: '',
            postal: '',
            country: '',
            latitude: 0,
            longitude: 0,
          };
        },
      },
      path: {
        required: true,
      },
      hideFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    emits: [
      'update:modelValue'
    ],
    data() {
      return {
        newEditedAddress: {},
      };
    },
    watch: {
      newEditedAddress: {
        deep: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // console.log('Old: ', oldVal,'New: ', newVal);
          if (JSON.stringify(this.modelValue) !== JSON.stringify(newVal)) {
            this.$emit('update:modelValue', newVal);
          }
        },
      },
      modelValue: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.newEditedAddress = newVal;
          }
        },
      },
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.attrs.filled', this.$lget(newVal, 'attrs.attrs.filled', false));
        this.$lset(newVal, 'attrs.attrs.borderless', this.$lget(newVal, 'attrs.attrs.borderless', true));
        this.$lset(newVal, 'attrs.attrs.dense', this.$lget(newVal, 'attrs.attrs.dense', true));
        this.$lset(newVal, 'attrs.attrs.popup-content-style', this.$lget(newVal, 'attrs.attrs.popup-content-style', ''));

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));

        // expansion-attrs defaults
        this.$lset(newVal, 'expansion-attrs.header-class', this.$lget(newVal, 'expansion-attrs.header-class', 'bg-primary text-white'));
        this.$lset(newVal, 'expansion-attrs.expand-icon-class', this.$lget(newVal, 'expansion-attrs.expand-icon-class', 'text-white'));
        this.$lset(newVal, 'expansion-attrs.style', this.$lget(newVal, 'expansion-attrs.style', 'border-radius: 30px'));
        this.$lset(newVal, 'expansion-attrs.icon', this.$lget(newVal, 'expansion-attrs.icon', 'explore'));
        this.$lset(newVal, 'expansion-attrs.class', this.$lget(newVal, 'expansion-attrs.class', 'shadow-1 overflow-hidden'));
        return newVal;
      },
      ifClick() {
        return this.$lget(this.attrs, 'attrs.readonly') ? null : 'click';
      },
    },
  };
</script>

<style scoped lang="scss" src="./_PlacesAutoCompleteBox.scss">
</style>
