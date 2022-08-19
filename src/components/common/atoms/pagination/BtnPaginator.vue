<template>
  <div style="display: flex">
    <q-btn size="sm" v-if="tab - 1 > 0" flat @click="tab = 0"  :label="1"/>
    <q-btn size="sm" flat v-if="tab > 0" @click="tab > 0 ? tab-- : ''" label="..."/>
    <div v-for="(page, i) in showPages.list" :key="`page-${i}`"
         v-show="shouldItShow(page)">
      <q-btn :class="tab === (i) ? `bg-${color} text-dark` : ''" size="sm" class="pagination" @click="tab = page - 1" flat :label="page"/>
    </div>
    <q-btn flat v-if="pages - 1 > tab" @click="(tab + 1) < pages ? tab++ : ''" label="..."/>
    <q-btn dense v-if="tab + 2 < pages" flat @click="tab = pages - 1" :label="pages"/>
    <q-btn-dropdown size="sm" dense flat>
      <q-list separator>
        <q-item>
          <q-input dense :hint="pages + ' pages'" style="width: 80px" v-if="true" v-model.number="searchFilter" autofocus>
            <template v-slot:prepend>
              <q-icon size="14px" name="mdi-magnify"/>
            </template>
          </q-input>
          <q-item-section v-else>
            <q-item-label>Pages</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-for="(page, i) in pageList" :key="`page-${i}`" clickable @click="tab = page">
          <div style="width: 100%" class="row justify-center">
            <div class="pagination">{{page + 1}}</div>
          </div>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script>
  export default {
    name: 'BtnPaginator',
    props: {
      color: {
        type: String,
        default: 'ir-blue-grey-1'
      },
      modelValue: Number,
      pages: Number,
      showCount: {
        type: Number,
        default: 5
      }
    },
    emits: [
      'update:modelValue',
    ],
    data(){
      return {
        tab: 0,
        searchFilter: null
      };
    },
    watch: {
      modelValue: {
        immediate: true,
        handler(newVal){
          if((newVal || newVal === 0) && newVal !== this.tab && typeof newVal === 'number'){
            // console.log('paginate value change', newVal);
            this.tab = newVal;
          }
        }
      },
      tab: {
        immediate: true,
        handler(newVal, oldVal){
          if((newVal || newVal === 0) && typeof newVal === 'number' && newVal !== oldVal && typeof oldVal === 'number') {
            // console.log('got tab', newVal, oldVal);
            this.$emit('update:modelValue', newVal);
          }
        }
      }
    },
    computed: {
      pageList(){
        let list = [];
        for(let i = 0; i < this.pages; i++){
          if(this.searchFilter){
            if(i === this.searchFilter) list.push(i - 1);
          } else {
            list.push(i);
          }
        }
        return list;
      },
      showPages() {
        let base = this.tab + 1;
        let obj;
        if (this.pages < this.showCount + 1) {
          let end = this.pages;
          let start = 1;
          obj = { total: (end - start) + 1, start: 1, end: this.pages, more: false, less: false };
        } else {
          let end = Math.min(base + (this.showCount - 2), this.pages);
          let start = Math.max(base - this.showCount - 2, 1);
          obj = { total: (end - start) + 1, start: 1, end: this.pages, more: base < end, less: base > start };
        }
        let list = [];
        for (let i = 1; i <= this.pages; i++) {
          list.push(i);
        }
        obj.list = list;
        return obj;
      }
    },
    methods: {
      shouldItShow(page) {
        if(this.tab < 1) {
          return page >= this.tab - 1 && page <= this.tab + 3;
        } else if (this.tab === this.pages - 1) {
          return page >= this.tab - 1;
        } else {
          return page > this.tab - 1 && page <= this.tab + 2;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .pagination {
    font-size: 1em;
    font-weight: inherit;
  }
</style>
