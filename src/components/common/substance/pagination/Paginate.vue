<template>
  <div class="fill_size">
    <div class="row justify-end q-my-sm" v-if="paginatorTop && (total > limit)">
      <btn-paginator :dark="dark"
                     :pages="pages"
                     v-model="page"
                     @input="$emit('page', $event)"></btn-paginator>
    </div>
    <div :class="searchClass" v-if="search">
      <div style="width: 600px; max-width: 100%">
        <search-item :dark="dark"
                     :rounded="rounded"
                     :outlined="outlined"
                     v-model="searchInput"
                     :label="searchLabel"
                     :placeholder="searchPlaceholder"></search-item>
      </div>
    </div>
    <slot name="list" :items="useItems"></slot>
    <div class="row justify-end q-my-sm" v-if="paginator && !paginatorTop && (total > limit)">
      <btn-paginator :dark="dark"
                     :pages="pages"
                     v-model="page"
                     @input="$emit('page', $event)"></btn-paginator>
    </div>
    <slot name="bottom" :total="total"></slot>
  </div>
</template>
<script>
  import BtnPaginator from './BtnPaginator';
  import SearchItem from './SearchItem';


  export default {
    name: 'Paginate',
    mixins: [],
    components: {SearchItem, BtnPaginator},
    props: {
      pageIn: Number,
      filter: Function,
      qidIn: String,
      dark: Boolean,
      searchInputIn: String,
      paginator: {
        type: Boolean,
        default: false,
      },
      optionsIn: Array,
      rounded: Boolean,
      tagSearch: Boolean,
      loadOnMount: Boolean,
      paginatorTop: Boolean,
      outlined: Boolean,
      search: Boolean,
      filterByName: String,
      searchLabel: String,
      searchPlaceholder: String,
      showSearch: Boolean,
      searchClass: {
        type: String,
        default: 'q-my-sm',
      },
      limit: {type: Number, default: 15},
      useTagPath: {type: String},
    },
    mounted() {
      // this.$watch('qidIn', (newVal) => {
      //   // if (newVal) this.itemsQid = newVal;
      // }, { immediate: true });
    },
    data() {
      return {
        searchInput: '',
        page: 0,
        // itemsQid: 'items'
      };
    },
    watch: {
      pageIn: {
        immediate: true,
        handler(newVal) {
          if ((newVal || newVal === 0) && newVal !== this.page) {
            this.page = newVal;
          }
        },
      },
      searchInputIn: {
        immediate: true,
        handler(newVal) {
          if (typeof newVal === 'string') {
            this.searchInput = newVal;
          }
        },
      },
      watch: {
        useItems: {
          immediate: true,
          handler(newVal) {
            this.$emit('options', newVal);
          },
        },
      },
    },
    computed: {
      pages() {
        return Math.ceil(this.total / this.limit);
      },
      useItems() {
        let list = this.optionsIn ? this.optionsIn : [];
        let filteredList = this.total > this.limit ? list.filter((a, i) => {
          return i >= this.limit * this.page && i < (this.limit * (this.page + 1));
        }) : list;
        let keyList = [this.filterName];
        if (this.useTagPath) keyList.push(this.useTagPath);
        return this.searchAndMatch(filteredList, this.searchInput, keyList);
      },
      total() {
        return this.optionsIn ? this.optionsIn.length : 0;
      },
      // stateItems(){
      //   return this[$lcamelCase(this.name)].map(a => a.clone());
      // },
      filterName() {
        return this.filterByName ? this.filterByName : 'name';
      },
    },
    methods: {
      searchAndMatch(item_list, search_query, keys_list) {
        let self = this;
        if (!search_query) return item_list;

        let low_search_list = search_query.toLowerCase().trim().split(/[ ,]+/);
        let searchRegex = '(?=.*' + low_search_list.join(')(?=.*') + ')';
        let keys = keys_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.$lget(item, key, '')).toLowerCase().match(searchRegex),
          );
        });
      },
      newPage(i) {
        this.$emit('page', i);
        this.reloadItems(i);
      },
    },
  };
</script>
