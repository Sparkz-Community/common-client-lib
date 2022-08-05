<template>
  <div v-bind="{class: 'fullwidth', ...$attrs.divAttrs}">

    <slot
      :items="items"
      name="top"
      :setSearch="setSearch"
      :changePage="itemsHandlePageChange"
      :page="itemsCurrentPage"
      :pages="itemsPages"
      :limit="itemsLimit"
      :total="itemsTotal"
      @virtual-scroll="handleScroll"
    ></slot>
    <div class="row justify-end q-pa-md" v-if="paginationTop && itemsTotal > itemsLimit">
      <btn-paginator :pages="itemsPages" v-model="itemsCurrentPage"/>
    </div>
    <q-select
      :options="items"
      v-if="select"
      v-bind="{
        placeholder,
        useInput: true,
        ...$attrs.selectAttrs
      }"
      :value="value"
      :multiple="multiple"
      :emit-value="emitValue"
      @input-value="searchInput = $event"
    >
      <template v-slot:prepend v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template v-slot:append v-if="$slots.append">
        <slot name="append"></slot>
      </template>
      <template v-slot:before v-if="$slots.before">
        <slot name="before"></slot>
      </template>
      <template v-slot:after v-if="$slots.after">
        <slot name="after"></slot>
      </template>
      <template v-slot:before-options v-if="$slots.beforeOptions">
        <slot name="before-options">
        </slot>
      </template>
      <template v-slot:after-options>
        <slot name="after-options" :loadMore="loadMore" :more="hasMore">
          <div v-if="infinite && hasMore" class="row justify-end">
            <q-btn @click="loadMore()" flat icon-right="mdi-dots-horizontal" label="More"></q-btn>
          </div>
        </slot>
      </template>
      <template v-slot:no-option>
        <slot name="no-option">
          <div class="font-14 text-italic q-pa-sm">No Options...</div>
        </slot>
      </template>
      <template v-slot:option="scope">
        <slot name="option" :item="scope.opt" :handleInput="handleInput" :index="scope.index">
          <template v-if="defaults">
            <default-item
              @input="handleInput(scope.opt)"
              v-bind="{
                value: scope.opt,
                ...$attrs.defaultItemAttrs
              }"
            >
              <template v-slot:side>
                <slot name="option-side" :item="scope.opt"></slot>
              </template>
            </default-item>
          </template>
        </slot>
      </template>
      <template v-slot:selected-item="scope" :item="scope.opt" :index="scope.index">
        <slot name="selected-item">
          <template v-if="defaults">
            <default-chip
              v-if="hasValue && !!scope.opt"
              :value="scope.opt"
              @remove="handleInput(scope.opt)"
              v-bind="{
                service: emitValue ? service : undefined,
                value: scope.opt,
                chipAttrs: {
                removable: true,
                },
                ...$attrs.defaultChipAttrs
              }"
            >
            </default-chip>
          </template>
        </slot>
      </template>
    </q-select>
    <div class="row justify-end q-pa-md" v-if="pagination && !infinite && itemsTotal > itemsLimit">
      <btn-paginator :pages="itemsPages" v-model="itemsCurrentPage"/>
    </div>
    <slot
      :items="items"
      name="bottom"
      :changePage="itemsHandlePageChange"
      :page="itemsCurrentPage"
      :pages="itemsPages"
      :limit="itemsLimit"
      :total="itemsTotal"
    >
    </slot>
  </div>
</template>

<script>
  import {inputMixin,queryMixin,makeFindPaginateMixin} from '../../../../mixins';
  import BtnPaginator from '../pagination/BtnPaginator';
  import DefaultItem from '../avatars/DefaultItem';
  import DefaultChip from '../avatars/DefaultChip';

  const { v4: uuidv4 } = require('uuid');

  export default {
    name: 'DbSelect',
    components: { DefaultChip, DefaultItem, BtnPaginator },
    mixins: [
      inputMixin({
        name: 'handleInput',
        multiple() {
          return this.multiple;
        },
        log: true,
        emitValue() {
          return this.emitValue;
        },
        idPath() {
          return this.optionValue ? this.optionValue : '_id';
        }
      }),
      queryMixin({
        name: 'selectQ',
        log: true,
        query() {
          return this.query;
        },
        search() {
          return this.searchInput;
        }
      }),
      makeFindPaginateMixin({
        name: 'items',
        infinite() {
          return this.infinite;
        },
        service() {
          return this.service;
        },
        query() {
          return this.selectQStatic;
        },
        params() {
          return { ...this.params, qid: this.qid };
        }
      })
    ],
    props: {
      select: { type: Boolean, default: true },
      placeholder: { type:String, default: ''},
      defaults: Boolean,
      pagination: { type: Boolean, default: true },
      paginationTop: { type: Boolean },
      value: { required: true },
      limit: { type: Number, default: 5 },
      infinite: Boolean,
      multiple: Boolean,
      emitValue: Boolean,
      optionValue: { type: String, default: '_id' },
      service: { type: String },
      options: Array,
      query: {
        type: Object,
        default: () => {
          return {};
        },
      },
      params: {
        type: Object,
        default: () => {
          return {};
        },
      },
      qid: { type: String, default: uuidv4 },
    },
    data() {
      return {
        searchInput: undefined,
        itemsLimit: 5,
      };
    },
    watch: {
      limit: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.itmesLimit = newVal;
          }
        }
      },
      itemsTotal: {
        immediate: true,
        handler(newVal) {
          this.$emit('total', newVal);
        }
      },
      isFindItemsPending: {
        immediate: true,
        handler(newVal) {
          this.$emit('loading', newVal);
        }
      }
    },
    computed: {
      hasValue() {
        if (this.multiple) return this.value && this.value.length;
        else return !this.$lisEmpty(this.value);
      },
      hasMore() {
        return this.itemsTotal > (this.itemsSkip + this.items.length);
      }
    },
    methods: {
      loadMore() {

        if (this.itemsTotal > (this.itemsSkip + this.items.length)) {
          console.log('loading more', this.itemsCurrentPage);
          this.itemsCurrentPage++;
        }
      },
      handleScroll(evt) {
        if (this.infinite) {
          // console.log('handle scroll', evt);
          let mostRecent = this.$lget(this.itemsPaginationData, ['items', 'mostRecent']);
          if (evt.direction === 'increase' && this.items.length - 1 <= evt.index && !this.isItemsFindPending) {
            if (mostRecent.total > this.items.length) {
              this.itemsHandlePageChange(this.itemsCurrentPage + 1);
            }
          }
        }
      },
      setSearch(val) {
        console.log('kKkKkK',this.itemsTotal);
        this.searchInput = val;
      }
    }
  };
</script>

<style scoped>

</style>
