<template>
  <q-select
    @update:model-value="$emit('update:modelValue', $lget($event,'modelValue'))"
    @input-value="filterFn"
    v-bind="attrs"
  >

    <template #after-options>
      <slot name="after-options" :loadMore="loadMore" :more="hasMore">
        <div v-if="infinite && hasMore" class="row justify-end">
          <q-btn @click="loadMore()" flat icon-right="mdi-dots-horizontal" label="More"></q-btn>
        </div>
      </slot>
    </template>

    <template  v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-select>

</template>

<script>
  import {v4 as uuidv4} from 'uuid';
  // import DefaultItem from '../../common/atoms/avatars/DefaultItem';
  import {isEmpty} from '../../../utils';
  import {useFindPaginate} from '../../../';
  import {computed, toRef} from 'vue';

  export default {
    name: 's-select',
    // components: {DefaultItem},
    props:{
      modelValue: {
        type: [Array , String , Number],
      },
      queryProps: {
        type: Object,
        default(){
          return {};
        }
      },
      infinite: {
        type: Boolean,
        default: false
      },
      defaults: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      },
      emitValue: {
        type: Boolean,
        default: true
      },
      mapOptions: {
        type: Boolean,
        default: true
      },
      model: {
        type: Object,
        required: true,
      },
      params: {
        type: Object,
        default: () => {
          return {};
        },
      },
      qid: { type: String, default: uuidv4 },
      optionProps: {
        type: Object,
        default(){
          return {
            valuePath: '_id',
            labelPath: 'name',
            disableCondition:false
          };
        }
      },
    },
    emits: [
      'update:modelValue',
    ],

    setup(props) {
      const params = computed(() => {
        return {
          ...props.params,
          qid: props.qid,
        };
      });
      const {items: options, isPending, pagination, toPage, latestQuery, paginationData} = useFindPaginate({
        infinite: toRef(props, 'infinite'),
        model: props.model,
        query: toRef(props, 'queryProps'),
        params,
      });
      return {
        options,
        isPending,
        pagination,
        toPage,
        latestQuery,
        paginationData
      };
    },
    data(){
      return {
        query: this.queryProps,
      };
    },

    computed: {
      hasMore() {
        return this.optionsTotal > (this.optionsSkip + this.options.length);
      },
      hasValue() {
        if (this.multiple) return this.modelValue && this.modelValue.length;
        else return !isEmpty(this.modelValue);
      },

      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.modelValue', this.$lget(newVal, 'attrs.modelValue', this.modelValue));
        this.$lset(newVal, 'attrs.multiple', this.$lget(newVal, 'attrs.multiple', this.multiple));
        this.$lset(newVal, 'attrs.use-chips', this.$lget(newVal, 'attrs.use-chips', this.multiple));
        this.$lset(newVal, 'attrs.options', this.$lget(newVal, 'attrs.options', this.options));
        this.$lset(newVal, 'attrs.emit-value', this.$lget(newVal, 'attrs.emit-value', this.emitValue));
        this.$lset(newVal, 'attrs.map-options', this.$lget(newVal, 'attrs.map-options', this.mapOptions));
        this.$lset(newVal, 'attrs.use-input', this.$lget(newVal, 'attrs.use-input', true));
        this.$lset(newVal, 'attrs.input-debounce', this.$lget(newVal, 'attrs.input-debounce', 0));

        const optValue = opt => this.optionProps&&Object(opt) === opt && this.optionProps.valuePath in opt ? opt[this.optionProps.valuePath] : opt['value'];
        this.$lset(newVal, 'attrs.option-value', this.$lget(newVal, 'attrs.option-value', optValue));

        const optLabel = opt => this.optionProps&&Object(opt) === opt && this.optionProps.labelPath in opt ? this.$capitalize(opt[this.optionProps.labelPath]): this.$capitalize(opt['label']);
        this.$lset(newVal, 'attrs.option-label', this.$lget(newVal, 'attrs.option-label', optLabel));

        const optDisable = opt => this.optionProps&&Object(opt) === opt && this.optionProps.disableCondition in opt ? opt[this.optionProps.disableCondition] : opt['disable'];
        this.$lset(newVal, 'attrs.option-disable', this.$lget(newVal, 'attrs.option-disable', optDisable));

        return newVal;
      },
    },
    methods: {

      loadMore() {
        if (this.optionsTotal > (this.optionsSkip + this.options.length)) {
          console.log('loading more', this.optionsCurrentPage);
          this.itemsCurrentPage++;
        }
      },
      filterFn(val){
        if(!val){
          this.query =  this.queryProps;
        }else {
          this.query[this.optionProps.labelPath] = { $regex: new RegExp(val) };
        }
      }
    }
  };
</script>
