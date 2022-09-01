<template>

  <f-data-table title="Virtual Instances"
                service="v-instances"
                qid="vInstances"
                :limit="12"
                :query="{}"
                :params="{
                     'v-instances_fJoinHookResolversQuery': {
                                instance: [['_id','name']],
                                domains: true // [['_id','name','email','avatar']]
                              },
                    userJoin: true,
                    }"
                :columns="columns"
                :form-fields="formFields"
                create-title="Virtual Instance"
                @pagination-changed="setPagination">

    <template v-slot:expand="props">

      <template v-if="props.colName === 'domains'">

        <q-table dense
                 flat
                 :rows="$lget(props,['row','_fastjoin','domains'])"
                 :visible-columns="['name','vInstance','createdAt','updatedAt']"
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
            <q-td v-else-if="$lget(scope,['col','name'])==='vInstance' ">
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
        :rows="$lget(props,['row','_fastjoin','domains'])"
        :visible-columns="['name','vInstance','createdAt','updatedAt']"
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
                        <q-item-label v-if="key === 'vInstance' ">
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
  import {Instances} from '../stores/services/instances';

  export default {
    name: 'v-instances-page',
    components: {
      FDataTable,
      // DataTableTemplate
    },
    setup() {

      const query = computed(()=>({}));
      const params = computed(() =>({
        debounce: 500,
      }));

      let {items: instances} = useFindPaginate({
        // limit: toRef(props, 'limit')
        limit: ref(12),
        model: Instances,
        qid: ref('integrationAuths'),
        query,
        params
      });
      return {
        instances
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
            name: 'instance',
            label: 'Instance',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','instance','name']),
            format: val => val || '',
            sortable: true,
          },
          {
            name: 'domains',
            label: 'Domains',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'domains'], []),
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
            path: 'instance',
            attrs: {
              label: 'Instance',
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
              options: this.instances,
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
