<template>
<q-select
     v-bind="$attrs"
     :value="value"
     :multiple="multiple"
     :use-chips="multiple"
     @input="$emit('input', $lget($event,'value'))"
     :options="options"
     :emit-value="emitValue"
     :map-options="mapOptions"
     use-input
     input-debounce="0"
     @input-value="filterFn"
     :option-value="opt => optionProps&&Object(opt) === opt && optionProps.valuePath in opt ? opt[optionProps.valuePath] : opt['value']"
     :option-label="opt => optionProps&&Object(opt) === opt && optionProps.labelPath in opt ? $capitalize(opt[optionProps.labelPath]): $capitalize(opt['label'])"
     :option-disable="opt => optionProps&&Object(opt) === opt && optionProps.disableCondition in opt ? opt[optionProps.disableCondition] : opt['disable']"
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
  import {makeFindPaginateMixin, /*queryMixin*/} from '../../../mixins';
  import {v4 as uuidv4} from 'uuid';
  // import DefaultItem from '../../common/atoms/avatars/DefaultItem';
  import {isEmpty} from '../../../utils';
  import {useFindPaginate} from '@';
  import {toRef} from 'vue/dist/vue';

  export default {
    name: 's-select',
    // components: {DefaultItem},
    props:{
      value: {
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
      service: {
        type: String,
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
    mixins:[

      /*queryMixin({
        name: 'selectQ',
        log: true,
        query() {
          return this.query;
        },
        search() {
          return this.searchInput;
        }
      }),*/
      makeFindPaginateMixin({
        name: 'options',

        query() {
          console.log('hehe....',this.query);
          return this.query;
        },
        params() {
          return { ...this.params, qid: this.qid };
        },
        makeFindMixinOptions:{
          // $environments:['$regex']
        }
      })
    ],
    setup(props) {
      return {
        options: useFindPaginate({
          limit: toRef(props, 'limit'),
          skip: toRef(props, 'skip'),
          model: props.model,
          query: toRef(props, 'query'),
          params: toRef(props, 'skip'),
          qid: toRef(props, 'qid'),
          infinite: toRef(props, 'infinite'),
        })
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
        if (this.multiple) return this.value && this.value.length;
        else return !isEmpty(this.value);
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
