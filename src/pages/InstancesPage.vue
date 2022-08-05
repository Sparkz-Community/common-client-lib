<template>

  <f-data-table title="Instances"
                service="instances"
                qid="instances"
                :limit="12"
                :query="{}"
                :params="{
                     'instances_fJoinHookResolversQuery': {
                                vInstances: true // [['_id','name','email','avatar']]
                              },
                    userJoin: true,
                    }"
                :columns="columns"
                :form-fields="formFields"
                create-title="Instance"
                @pagination-changed="setPagination">

    <template v-slot:expand="props">

      <template v-if="props.colName === 'vInstances'">

        <q-table dense
                 flat
                 :data="$lget(props,['row','_fastjoin','vInstances'])"
                 :visible-columns="['name','instance','createdAt','updatedAt']"
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
              <q-td v-else-if="$lget(scope,['col','name'])==='instance' ">
                {{ $lget(props, ['row', 'name']) }}
              </q-td>
              <q-td v-else>
                {{ $lget(scope, ['row', scope.col.name]) }}
              </q-td>

          </template>
        </q-table>
        <!--        <q-table :data="$lget(props,['row','_fastjoin','vInstances'])">
                  <q-td caption v-if="!Object.keys($lget(props,['row','_fastjoin'])).includes(props.col.name)" size="18px"
                        :props="props">

                    <component :is="'span'"> {{ $lget(props,['row','_fastjoin',props.col.name,'name']) }}</component>

                  </q-td>
                </q-table>-->
      </template>

    </template>
    <template v-slot:dialog-card-section="props">
      <q-table
        grid
        dense
        flat
        :data="$lget(props,['row','_fastjoin','vInstances'])"
        :visible-columns="['name','instance','createdAt','updatedAt']"
      >
        <template #item="scope">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3" >
          <q-card bordered>
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
                        <q-item-label v-else-if="key === 'instance' ">
                          {{ $lget(props, ['row', 'name']) }}
                        </q-item-label>
                        <q-item-label v-else>
                          {{ $lget(scope, ['row', key]) }}
                        </q-item-label>

                    </q-item-section>
                  </q-item>

                </template>
              </q-list>
            </q-card-section>
          </q-card>
          </div>
        </template>
      </q-table>
    </template>
  </f-data-table>

</template>

<script>
  import {date} from 'quasar';
  import FDataTable from '../components/common/molecules/feathers/FDataTable/FDataTable';
  import {capitalize, kebabize} from '../utils';

  export default {
    name: 'instances-page',
    components: {
      FDataTable,
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
            required: true,
          },
          {
            name: 'vInstances',
            label: 'Virtual Instances',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'vInstances'], []),
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
