<template>

  <table-template
    :data="data"
    v-bind="$attrs"
    row-key="_id"
    :loading="this['isFindDataPending']"
    :rows-per-page-options="[5, 10, 25, 50, 100, 200, 0]"
    @filter="filter=$event"
    v-model:pagination="pagination"
    @request="setPagination"
    :visible-columns="visibleColumns"
    selection="multiple"
    v-model:selected="selected"
    :grid="viewType!=='table'"
    :hide-header="viewType!=='table'"
  >

    <template #top-left>
      <core-header
        :label="$capitalize(service)"
        :icon="icon"
        @click="openNew"
      />
    </template>

    <template v-if=" viewType==='table' " #header-cell="props">
      <q-th v-if="props.col.name==='__v'" :props="props">
        Actions
      </q-th>
      <q-th v-else :props="props">
        {{
          capitalize(kebabize(props.col.name).replace('-', ' '))
        }}
      </q-th>
    </template>
    <template v-if=" viewType==='table' " #body-cell="props">
      <q-td v-if="props.col.name==='createdAt'|| props.col.name==='updatedAt' || props.col.name==='deletedAt'"  size="18px" :props="props">
        <q-badge outline color="dark" :label="formatDate(props.value)"/>
      </q-td>
      <q-td v-else-if="props.col.name==='__v'" size="18px" :props="props">
        <div class="row justify-end q-gutter-sm">

          <q-btn
            icon-right="edit"
            no-caps
            flat
            dense
            class="q-mr-sm"
            @click="edit(props.row)"
          />

          <q-btn
            icon-right="delete"
            no-caps
            flat
            dense
            @click="remove(props.row)"
          />
        </div>
      </q-td>

      <q-td v-else-if="!Object.keys(fastJoinResolverQuery).includes(props.col.name)" size="18px" :props="props">
        <q-chip>
          {{ props.value }}
        </q-chip>
      </q-td>
      <q-td v-else>
        <q-chip v-if="props.row._fastjoin[props.col.name].name">{{ props.row._fastjoin[props.col.name].name }}</q-chip>
        <q-chip v-if="props.row._fastjoin[props.col.name].title">{{ props.row._fastjoin[props.col.name].title }}</q-chip>
      </q-td>
    </template>

    <template v-else #item="props">

      <div v-if="viewType==='grid'" class=" q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
           :style="props.selected ? 'transform: scale(0.95);' : ''">

        <q-card flat bordered :class="props.selected ? 'bg-grey-1' : ''">
          <q-card-section class="flex">
            <q-checkbox dense class="text-bold" :value="selected.some(item => item._id === props.row._id)"
                        :label="$capitalize(props.row.name)" @input="handleSelected(props.row)"/>

            <q-space></q-space>

            <q-btn
              icon-right="edit"
              no-caps
              flat
              dense
              class="q-mr-sm"
              @click="edit(props.row)"
            />

            <q-btn
              icon-right="delete"
              no-caps
              flat
              dense
              @click="remove(props.row)"
            />
          </q-card-section>
          <q-separator/>

          <q-list dense>
            <template
              v-for="(key) in Object.keys(props.colsMap).filter(k=>(k!=='__v') && k!=='_fastjoin' && k!=='name' && k!=='_id'&& k!=='title') " :key="key">
              <q-item>
                <q-item-section>
                  <q-item-label header class="text-bold">{{ capitalize(kebabize(key).replace('-', ' ')) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label v-if="key==='createdAt'|| key==='updatedAt' || key==='deletedAt'" caption>
                    <q-badge outline color="dark" :label="formatDate(props.row[key])"/>
                  </q-item-label>

                  <q-item-label caption v-else-if="!Object.keys(fastJoinResolverQuery).includes(key)" size="18px" :props="props">
                    <q-chip>
                      {{ props.value }}
                    </q-chip>
                  </q-item-label>
                  <q-item-label caption v-else>
                    <q-chip v-if="props.row._fastjoin[key].name">{{ props.row._fastjoin[key].name }}</q-chip>
                    <q-chip v-if="props.row._fastjoin[key].title">{{ props.row._fastjoin[key].title }}</q-chip>
                  </q-item-label>

                </q-item-section>
              </q-item>
            </template>

          </q-list>
        </q-card>
      </div>
      <core-expansion-item
        v-else-if=" viewType === 'tree' "
        :class="expandedItem!==props.row._id ?'text-grey-9': '' "
        :style="expandedItem!==props.row._id ? 'transform: scale(0.95);' : ''"
        :icon="props.row.icon"
        :title="props.row.name || props.row.title"
        :service="$capitalize(singularize(service))"
        :value="expandedItem===props.row._id"
        @input="expandSection(props.row)"
      >
        <div class="column q-px-md">
          <q-list dense>
            <template
              v-for="(key) in Object.keys(props.colsMap).filter(k=>(k!=='__v') && k!=='_fastjoin' && k!=='name' && k!=='_id'&& k!=='title')" :key="key">
              <q-item>
                <q-item-section>
                  <q-item-label header class="text-bold">{{ capitalize(kebabize(key).replace('-', ' ')) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label v-if="key==='createdAt'|| key==='updatedAt' || key==='deletedAt'" caption>
                    <q-badge outline color="dark" :label="formatDate(props.row[key])"/>
                  </q-item-label>

                  <q-item-label caption v-else-if="!Object.keys(fastJoinResolverQuery).includes(key)" size="18px" :props="props">
                    <q-chip>
                      {{ props.value }}
                    </q-chip>
                  </q-item-label>
                  <q-item-label caption v-else-if="!Array.isArray(props.row._fastjoin[key])">
                    <q-chip v-if="props.row._fastjoin[key].name">{{ props.row._fastjoin[key].name }}</q-chip>
                    <q-chip v-if="props.row._fastjoin[key].title">{{ props.row._fastjoin[key].title }}</q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

          </q-list>
          <!-- Children slot pass on parents data-->
          <slot name="joins" v-bind="props.row">

          </slot>
          <template
            v-for="(key) in Object.keys(props.colsMap).filter(k=>Object.keys(fastJoinResolverQuery).includes(k))" :key="key">
           <div class="column q-px-md q-gutter-xs full-width">

          </div>
          </template>
          <!-- End Children -->
          <div class="column q-px-md q-gutter-xs full-width">
            <div v-if="openForm&&$lget(recordToEdit,'_id')===$lget(props.row,'_id')">
                <div class="column q-px-md q-gutter-xs full-width">
                  <div class="text-bold text-uppercase">{{ $capitalize(singularize(service)) }} Form</div>
                  <core-form
                    class="q-mt-none"
                    @close="closeForm"
                    @save="save"
                    :service-name="service"
                    :record-to-edit="recordToEdit"
                    :inputAttrs="{
              outlined:true,
              dense:true,
            }"
                    :extra-controls="[
                            ...Object.keys(fastJoinResolverQuery).filter(key => !Array.isArray(props.row['_fastjoin'][key])).map(value =>( {
                                name: 's-select',
                                label: $capitalize(value),
                                value,
                                $attrs:{service: `${value}s`}
                            })),
                            ...extraControls
                            ]"
                  />
                </div>
            </div>
          <div v-else class="row width full justify-between q-my-md">

            <q-btn @click="edit(props.row)" no-caps outline icon="edit"
                   :label="`Edit ${$capitalize($lget(props.row,'name'))} ${$capitalize(singularize(service))}`"/>
            <q-btn no-caps outline icon="close"
                   :label="`Delete ${$capitalize($lget(props.row,'name'))} ${$capitalize(singularize(service))}`"
                   @click="remove(props.row)"/>
          </div>
        </div>
        </div>
      </core-expansion-item>
    </template>


    <template #top-right-controls="scope">
      <slot name="top-right-controls" v-bind="scope">

      </slot>
      <slot name="top-right-controls" v-bind="scope">

      </slot>
      <q-btn-toggle v-model="viewType"
                    v-bind="$attrs.viewToggleBtns"
                    no-caps
                    rounded
                    flat
                    class="q-mr-lg"
                    :options="[
                        {icon: 'account_tree', value: 'tree', slot: 'tree'},
                        {icon: 'fas fa-th-large', value: 'grid', slot: 'grid'},
                        {icon: 'fas fa-th-list', value: 'table', slot: 'table'}
                      ]">
        <template #tree>
          <q-tooltip content-style="font-size: 10pt">Tree</q-tooltip>
        </template>
        <template #grid>
          <q-tooltip content-style="font-size: 10pt">Grid</q-tooltip>
        </template>

        <template #table>
          <q-tooltip content-style="font-size: 10pt">Table</q-tooltip>
        </template>
      </q-btn-toggle>
      <q-select
        v-if="showHideColumns && viewType !=='tree' "
        v-model="visibleColumns"
        transition-show="flip-up"
        transition-hide="flip-down"
        menu-anchor="bottom middle"
        multiple
        outlined
        dense
        options-dense
        class="text-caption"
        display-value="Hide"
        emit-value
        map-options
        :options="columns"
        :options-selected-class="`bg-dark text-${$attrs.color || 'primary'}`"
        options-cover
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-filter"/>
          <q-tooltip content-style="font-size: 10pt">Hide Columns</q-tooltip>
        </template>
      </q-select>
    </template>

    <template v-for="(_, slot) of $slots" :key="slot" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </table-template>

</template>

<script>
  import TableTemplate from '../../molecules/tables/TableTemplate';

  import {makeFindPaginateMixin} from '../../../../mixins';
  import {capitalize, kebabize, singularize} from '../../../../utils';
  import {date} from 'quasar';
  import CoreExpansionItem from '../../../core/substances/CoreExpansionItem';
  import CoreForm from '../../../core/substances/CoreForm';
  import CoreHeader from '../../../core/substances/CoreHeader';

  export default {
    name: 'data-table-template',
    components: {
      CoreHeader,
      CoreForm,
      CoreExpansionItem,
      TableTemplate,
    },
    props:{
      service: {
        type: String,
        required: true,
      },
      query: {
        type: Object,
        default() {
          return {};
        },
      },
      params: {
        type: Object,
        default() {
          return {};
        },
      },
      limit: {
        type: Number,
        defaultValue: 10
      },
      qid: String,
      searchByProps: {
        type: Array,
        default(){
          return ['title'];
        }
      },
      showHideColumns: {
        type: Boolean,
        default: true
      },
      columnsToShowFirst: {
        type: Array,
      },
      columnsToExclude: {
        type: Array,
        default() {
          return [];
        }
      },
      fastJoinResolverQuery: {
        type: Object,
        default() {
          return {};
        }
      },

      extraControls: {
        type: Array,
        default() {
          return [];
        },
      },
      title: String,
      icon: String
    },
    mixins: [
      makeFindPaginateMixin(
        {
          name: 'data',

          service() {
            return this.service;
          },
          query() {
            return {
              ...this.query,

            };
          },
          params() {
            return {
              ...this.params,
              qid: this.qid,
              [`${this.service}_fJoinHookResolversQuery`]: this.fastJoinResolverQuery
            };
          },
        },
      ),
    ],
    data () {
      return {
        expandedItem: undefined,
        recordToEdit: undefined,
        viewType: 'tree',
        showRow:false,
        openForm: false,
        filter:'',
        visibleColumns:[],
        selected: [],
        columns:[],
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 1,
        }
      };
    },
    watch: {
      limit: {
        immediate: true,
        handler(newVal, oldVal) {
          if ((newVal || newVal === 0) && newVal !== oldVal) {
            this.dataLimit = newVal;
          }
        },
      },
      columns(newVal){
        const cols = this.columnsToShowFirst || newVal;
        this.visibleColumns= ['__v', ...cols];
      },
      data: {
        immediate: false,
        handler(newVal){
          if(!Array.isArray(newVal) || Array.isArray(newVal)&&!newVal[0]){
            this.columns = [];
          }
          const columnsToExclude =[ ...this.columnsToExclude,'_id','updatedByHistory'];
          this.columns = Object.keys(newVal[0]).filter(column => !columnsToExclude.includes(column));
        }
      },
      dataTotal: {
        immediate: true,
        handler(newVal, oldVal){
          if(newVal!==oldVal){
            this.pagination.rowsPerPage=this.dataLimit;
            this.pagination.rowsNumber = newVal;
          }
        }
      }
    },
    computed: {
      searchQueries() {
        return this.searchByProps.map(key=>({
          [key]: {$regex: `${this.filter}`, $options: 'igm'},
        }));
      },

    },
    methods: {
      capitalize,
      kebabize,
      singularize,
      formatDate(value) {
        return date.formatDate(value, 'DD-MM-YYYY hh:mm A');
      },
      expandSection(item) {
        if (!this.expandedItem) {
          this.expandedItem = item._id;
        } else {
          this.expandedItem = undefined;
        }
      },
      handleSelected(value) {

        if (this.selected.some(item => item._id === this.$lget(value, '_id'))) {
          /* vendors contains the element we're looking for */
          this.selected = this.selected.filter(item => item._id !== value._id);
          this.expandedItem = undefined;
        } else {
          this.selected.push(value);
          this.expandedItem = value._id;
        }

      },
      setPagination(newVal) {
        this.dataLimit = newVal.pagination.rowsPerPage === 0 ? this['dataTotal'] : newVal.pagination.rowsPerPage;
        this.dataCurrentPage = newVal.pagination.page;
        this.pagination = newVal.pagination;

        if (newVal.pagination.sortBy) {
          this.sort = {[newVal.pagination.sortBy]: newVal.pagination.descending ? -1 : 1};
        } else {
          this.sort = {
            name: 1,
            updatedAt: -1,
          };
        }
      },
      remove(val) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to remove "${val.name || val.title}" ${singularize(this.service)}?`,
          ok: {
            push: true,
            color: 'dark',
            size: 'xs',
          },
          cancel: {
            color: 'dark',
            push: true,
            outline: true,
            size: 'xs',
          },
          persistent: true,
        }).onOk(() => {
          val.remove()
            .then(result => {
              this.$q.notify({
                type: 'positive',
                message: `Successfully removed "${result.name}"`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            })
            .catch(error => {
              this.$q.notify({
                type: 'negative',
                message: error.message,
                timeout: 30000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            });
        });
      },
      openNew() {
        this.recordToEdit = undefined;
        this.openForm = true;
        this.$emit('add-new');
      },
      async save(form) {
        this.recordToEdit = undefined;
        this.$emit('edit',form);
        this.closeForm();
      },
      edit(recordToEdit) {
        this.viewType = 'tree';
        this.recordToEdit = recordToEdit;
        this.expandedItem = recordToEdit._id;
        this.openForm = true;
      },
      closeForm() {
        this.recordToEdit = undefined;
        this.openForm = false;
      },
    },
  };
</script>
