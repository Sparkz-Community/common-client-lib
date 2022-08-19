<template>

  <f-data-table title="Applications"
                service="applications"
                qid="applications"
                :limit="12"
                :query="{}"
                :params="{
                     'applications_fJoinHookResolversQuery': {
                                environments: true,
                                hosts: true,
                                features: true,
                              },
                    userJoin: true,
                    }"
                :columns="columns"
                :form-fields="formFields"
                create-title="Application"
                @pagination-changed="setPagination">

    <template v-slot:expand="props">

      <template v-if="props.colName === 'environments'">

        <q-table dense
                 flat
                 :data="$lget(props,['row','_fastjoin','environments'])"
                 :visible-columns="['name','createdAt','updatedAt']"
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
            <q-td v-else>
              {{ $lget(scope, ['row', scope.col.name]) }}
            </q-td>

          </template>
        </q-table>

      </template>

      <template v-if="props.colName === 'hosts'">

        <q-table dense
                 flat
                 :data="$lget(props,['row','_fastjoin','hosts'])"
                 :visible-columns="['name','createdAt','updatedAt']"
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
            <q-td v-else>
              {{ $lget(scope, ['row', scope.col.name]) }}
            </q-td>

          </template>
        </q-table>

      </template>

      <template v-if="props.colName === 'features'">

        <q-table dense
                 flat
                 :data="$lget(props,['row','_fastjoin','features'])"
                 :visible-columns="['name','createdAt','updatedAt']"
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
            <q-td v-else>
              {{ $lget(scope, ['row', scope.col.name]) }}
            </q-td>

          </template>
        </q-table>

      </template>

    </template>
    <template v-slot:dialog-card-section="props">
      <template v-if="props.colName === 'environments'">
        <q-table
          grid
          dense
          flat
          :data="$lget(props,['row','_fastjoin','environments'])"
          :visible-columns="['name','createdAt','updatedAt']"
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
      <template v-if="props.colName === 'hosts'">
        <q-table
          grid
          dense
          flat
          :data="$lget(props,['row','_fastjoin','hosts'])"
          :visible-columns="['name','createdAt','updatedAt']"
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

      <template v-if="props.colName === 'features'">
        <q-table
          grid
          dense
          flat
          :data="$lget(props,['row','_fastjoin','features'])"
          :visible-columns="['name','createdAt','updatedAt']"
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

  import useEnvironments from '../stores/services/environments';


  export default {
    name: 'applications-page',
    components: {
      FDataTable,
      // DataTableTemplate
    },
    setup() {
      const environmentsStore = useEnvironments();

      const params = computed(() => {
        return {
          debounce: 500,
        };
      });
      const {items: environments, pagination} = useFindPaginate({
        limit: ref(12),
        model: environmentsStore.Model,
        qid: ref('environments'),
        params,
      });

      return {
        environments,
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
            name: 'environments',
            label: 'Environments',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'environments'], []),
            format: val => val,
            sortable: true,
            isExpansion: true,
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
            name: 'features',
            label: 'Features',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'features'], []),
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
            path: 'environments',
            attrs: {
              label: 'Environments',
              'hide-selected': false,
              'fill-input': false,
              multiple: true,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.environments,
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
