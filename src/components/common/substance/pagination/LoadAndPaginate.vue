<template>
  <div class="fill_size">
    <div class="row justify-end q-my-sm" v-if="paginatorTop">
      <btn-paginator :dark="dark"
                     :pages="itemsPages"
                     :value="itemsCurrentPage"
                     @input="setPage"></btn-paginator>
    </div>
    <div :class="searchClass" v-if="search">
      <div style="width: 600px; max-width: 100%">
        <search-item
          v-bind="searchAttrs"
          v-model="searchInput"
          @input="emitSearch"
        ></search-item>
      </div>
    </div>
    <slot name="list" :items="useItems"></slot>
    <div class="row justify-end q-my-sm" v-if="paginator && !paginatorTop && (total > itemsLimit)">
      <btn-paginator :dark="dark"
                     :pages="itemsPages"
                     :value="itemsCurrentPage"
                     @input="setPage"></btn-paginator>
    </div>
    <slot name="bottom" :total="total"></slot>
  </div>
</template>
<script>
  import BtnPaginator from './BtnPaginator';
  import SearchItem from './SearchItem';
  import makeFindPaginateMixin from '../../../../mixins/makeFindPaginateMixin';


  export default {
    name: 'LoadAndPaginate',
    mixins: [
      makeFindPaginateMixin({
        name: 'items',
        service() {
          return this.loadService;
        },
        query() {
          let text = this.searchInput;
          let query = {};
          if (text && typeof (text) === 'string' && text.length) {
            let nameSearch = {
              $regex: `${text}`,
              $options: 'igm',
            };
            if (this.tagSearch) {
              let nameObj = {};
              nameObj[this.filterName] = nameSearch;
              let tagObj = {};
              let patternExp = new RegExp(text, 'igm');
              tagObj[this.useTagPath] = {$in: [patternExp]};
              query.$or = [nameObj, tagObj];
            } else {
              query[this.filterName] = nameSearch;
            }
          }
          // console.log('change in query', { ...query, ...this.queryAdders });
          return {...query, ...this.queryAdders};
        },
        params() {
          return {...this.paramsAdders, qid: this.qidIn};
        },
      }),
    ],
    components: {SearchItem, BtnPaginator},
    props: {
      dark: Boolean,
      filter: Function,
      qidIn: {type: String, default: 'items'},
      searchAttrs: Object,
      limit: {type: Number, default: 10},
      searchInputIn: String,
      pageIn: Number,
      paginator: {
        type: Boolean,
        default: false,
      },
      queryAdders: {
        type: Object,
        default: () => {
          return {};
        },
      },
      paramsAdders: {
        type: Object,
        default: () => {
          return {};
        },
      },
      filterByName: String,
      tagSearch: Boolean,
      loadOnMount: Boolean,
      paginatorTop: Boolean,
      search: Boolean,
      showSearch: Boolean,
      searchClass: {
        type: String,
        default: 'q-my-sm',
      },
      useTagPath: {type: String, default: 'tags'},
      loadService: String,
      //you can simply increment the load event to trigger new load
      loadWatch: {
        required: false,
      },
    },
    mounted() {
      // this.$watch('qidIn', (newVal) => {
      //   // if (newVal) this.itemsQid = newVal;
      // }, { immediate: true });
    },
    data() {
      return {
        searchInput: '',
        // itemsQid: 'items'
      };
    },
    watch: {
      limit: {
        immediate: true,
        handler(newVal, oldVal){
          // console.log('new limit', newVal);
          if((newVal || newVal === 0) && newVal !== oldVal){
            // console.log('in limit', newVal);
            this.itemsLimit = newVal;
          }
        }
      },
      // pageIn: {
      //   immediate: true,
      //   handler(newVal, oldVal){
      //     if((newVal || newVal === 0) && newVal !== oldVal){
      //       this.itemsHandlePageChange(newVal - 1);
      //     }
      //   }
      // },
      searchInputIn: {
        immediate: true,
        handler(newVal) {
          if (typeof newVal === 'string') {
            this.searchInput = newVal;
          }
        },
      },
      paginateLoading: {
        immediate: true,
        handler(newVal) {
          this.$emit('loading', newVal);
        },
      },
      useItems: {
        immediate: true,
        handler(newVal) {
          this.$emit('options', newVal);
        },
      },
      total: {
        immediate: true,
        handler(newVal) {
          let val = newVal ? newVal : 0;
          this.$emit('total', val);
        },
      },
    },
    computed: {
      useItems() {
        if (this.filter) {
          return this.filter(this.items);
        } else return this.items;
      },
      qid() {
        return this.qidIn ? this.qidIn : 'items';
      },
      total() {
        return this.$lget(this.itemsPaginationData, [this.qid, 'mostRecent', 'total'], 0);
      },
      paginateLoading() {
        return this.$store.state[this.loadService]['isFindPending'];
      },
      // stateItems(){
      //   return this[$lcamelCase(this.name)].map(a => a.clone());
      // },
      filterName() {
        return this.filterByName ? this.filterByName : 'name';
      },
    },
    methods: {
      setPage(val) {
        // console.log('setting page', val);
        this.itemsCurrentPage = val;
      },
      emitSearch(val) {
        this.$emit('search', val);
      },
      newPage(i) {
        this.$emit('page', i);
      },
    },
  };
</script>
