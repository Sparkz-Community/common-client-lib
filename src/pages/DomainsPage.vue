<template>

  <f-data-table title="Domains"
                service="domains"
                qid="domains"
                :limit="12"
                :query="{}"
                :params="{
                     'domains_fJoinHookResolversQuery': {
                                vInstance: [['_id','name']],
                                hosts: true // [['_id','name','email','avatar']]
                              },
                    userJoin: true,
                    }"
                :columns="columns"
                :form-fields="formFields"
                create-title="Domain"
                @pagination-changed="setPagination">

    <template v-slot:expand="props">

      <template v-if="props.colName === 'hosts'">

        <q-table dense
                 flat
                 :data="$lget(props,['row','_fastjoin','hosts'])"
                 :visible-columns="['name','domain','createdAt','updatedAt']"
        >
          <template #header-cell="props">
            <q-th :props="props">
              {{
                capitalize(kebabize(props.col.name).replace('-', ' '))
              }}
            </q-th>
          </template>

          <template #body-cell="scope">

            <q-td v-if="$lget(scope,['col','name'])==='createdAt' || $lget(scope,['col','name'])==='updatedAt'">
              {{ formatDate($lget(scope, ['row', scope.col.name])) }}
            </q-td>
            <q-td v-else-if="$lget(scope,['col','name'])==='domain' ">
              {{ $lget(props, ['row', 'name']) }}
            </q-td>
            <q-td v-else>
              {{ $lget(scope, ['row', scope.col.name]) }}
            </q-td>

          </template>
        </q-table>

      </template>

    </template>
    <template v-slot:dialog-card-section="props">
      <q-table
        grid
        dense
        flat
        :data="$lget(props,['row','_fastjoin','hosts'])"
        :visible-columns="['name','domain','createdAt','updatedAt']"
      >

        <template #item="scope">
          <q-card class="q-ma-md" bordered>
            <q-card-section>
              <q-list dense>
                <template v-for="(key) in Object.keys(scope.colsMap)" :key="key">
                  <q-item>
                    <q-item-section>
                      <q-item-label header class="text-bold text-capitalize">{{ capitalize(kebabize(key).replace('-', ' ')) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>

                      <q-item-label v-if="key ==='createdAt' || key ==='updatedAt'">
                        {{ formatDate($lget(scope, ['row', key])) }}
                      </q-item-label>
                      <q-item-label v-if="key === 'domain' ">
                        {{ $lget(props, ['row', 'name']) }}
                      </q-item-label>
                      <q-item-label v-if="key==='name'">
                        {{ $lget(scope, ['row', key]) }}
                      </q-item-label>

                    </q-item-section>
                  </q-item>

                </template>
              </q-list>
            </q-card-section>
          </q-card>
        </template>
      </q-table>
    </template>
  </f-data-table>
</template>

<script>
  // import DataTableTemplate from '../components/common/substance/tables/DataTableTemplate';
  import {date} from 'quasar';
  import FDataTable from '../components/common/molecules/feathers/FDataTable/FDataTable';
  import {capitalize, kebabize} from '../utils';
  import {useFindPaginate} from '../';
  import {computed, ref} from 'vue';
  import useVInstances from '../stores/services/vInstances';

  export default {
    name: 'domains-page',
    components: {
      FDataTable,
      // DataTableTemplate
    },
    setup() {
      const vInstancesStore = useVInstances();

      const params = computed(() => {
        return {
          debounce: 500,
        };
      });
      const {items: vInstances, pagination} = useFindPaginate({
        limit: ref(12),
        model: vInstancesStore.Model,
        qid: ref('vInstances'),
        params,
      });

      return {
        vInstances,
        pagination,
      };
    },
    computed: {
      columns() {
        return [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: row => this.$lget(row, 'name'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'vInstance',
            label: 'Virtual Instance',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','vInstance','name']),
            format: val => val || '',
            sortable: true,
          },
          {
            name: 'hosts',
            label: 'Hosts',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'hosts'], []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'createdAt',
            label: 'Created At',
            align: 'left',
            field: row => this.formatDate(row.createdAt),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'updatedAt',
            label: 'Updated At',
            align: 'left',
            field: row => this.formatDate(row.updatedAt),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'actions',
            label: 'Actions',
            align: 'center',
            required: true,
          },
        ];
      },
      formFields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'vInstance',
            attrs: {
              label: 'Virtual Instance',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              // 'use-chips': true,
              'bottom-slots': true,
              options: this.vInstances,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },

    },
    methods: {
      capitalize, kebabize,
      setPagination(newVal) {
        console.log('working: ', newVal.pagination);
        this[`${this.$lget(newVal, 'service')}Limit`] = newVal.pagination.rowsPerPage === 0 ? this[`${this.$lget(newVal, 'service')}Total`] : newVal.pagination.rowsPerPage;
        this[`${this.$lget(newVal, 'service')}CurrentPage`] = newVal.pagination.page;
        this.pagination = newVal.pagination;

        if (newVal.pagination.sortBy) {
          this.sort = {[newVal.pagination.sortBy]: newVal.pagination.descending ? -1 : 1};
        } else {
          this.sort = {
            createdAt: -1,
          };
        }
      },
      formatDate(yourDate) {
        return date.formatDate(yourDate, 'DD-MM-YYYY hh:mm A');
      },

    },
  };
</script>
