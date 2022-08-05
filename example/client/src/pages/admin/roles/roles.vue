<template>
  <q-page id="roles" class="q-pa-md">
    <q-table title="Roles"
             :data="roles"
             :columns="columns"
             row-key="_id"
             selection="multiple"
             :selected.sync="selected"
             :visible-columns="visibleColumns"
             :filter="search"
             :grid="grid"
             grid-header
             dense
             :loading="isFindRolesPending"
             color="accent"
             :pagination.sync="pagination"
             @request="setPagination"
             class="my-sticky-header-table"
             card-container-class="grid-content"
             :rows-per-page-options="[5, 12, 25, 50, 100, 200, 0]">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="search" placeholder="Search" class="q-mr-lg">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>

        <add-or-update-role ref="addOrUpdate"
                            :value="formData"
                            class="q-mr-lg"
                            @saved="rolesRefresh"></add-or-update-role>

        <q-btn-toggle v-model="grid"
                      no-caps
                      rounded
                      unelevated
                      toggle-color="primary"
                      text-color="primary"
                      class="q-mr-lg"
                      style="border: 1px solid var(--q-color-primary);"
                      :options="[
                        {icon: 'fas fa-th-large', value: true, slot: 'grid'},
                        {icon: 'fas fa-th-list', value: false, slot: 'table'}
                      ]">
          <template v-slot:grid>
            <q-tooltip content-style="font-size: 10pt">Grid</q-tooltip>
          </template>

          <template v-slot:table>
            <q-tooltip content-style="font-size: 10pt">Table</q-tooltip>
          </template>
        </q-btn-toggle>

        <q-select v-model="visibleColumns"
                  multiple
                  outlined
                  dense
                  options-dense
                  display-value="Hide Columns"
                  emit-value
                  map-options
                  :options="columns.reduce((acc, col) => {
                    if (!['actions'].includes(col.name) && !col.required) {
                      acc.push({label: col.label, value: col.name});
                    }
                    return acc;
                  }, [])"
                  options-selected-class="text-accent"
                  options-cover
                  style="min-width: 150px">
          <template v-slot:prepend>
            <q-icon name="fas fa-filter"/>
          </template>
        </q-select>
      </template>

      <template v-slot:header-selection="props">
        <q-checkbox v-model="props.selected"/>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected"/>
          </q-td>
          <q-td v-for="col in props.cols"
                :key="col.name"
                :props="props">
            <span
              v-if="['vendorStripeAccounts', 'vendorLocations', 'primaryContacts'].includes(col.name) && col.value.length">
              <q-btn size="sm"
                     color="accent"
                     round
                     @click="setExpanded(props, col.name)"
                     :icon="props.expand && $lget(expandMeta,`${props.pageIndex}.expandKey`) === col.name ? 'remove' : 'add'">
                <q-badge color="secondary" text-color="black" :label="col.value.length" floating transparent rounded/>
              </q-btn>
            </span>
            <span v-else-if="col.name === 'actions'">
              <q-btn color="secondary"
                     icon-right="edit"
                     no-caps
                     flat
                     dense
                     class="q-mr-sm"
                     @click="editDialog(props)"/>
            <q-btn color="negative"
                   icon-right="delete"
                   no-caps
                   flat
                   dense
                   @click="removeRole(props)"/>
            </span>
            <span v-else-if="typeof col.value === 'boolean'">
              <q-icon :name="col.value ? 'check_circle' : 'cancel'"
                      size="sm"
                      :color="col.value ? 'green' : 'red'"></q-icon>
            </span>
            <span v-else-if="col.name === 'avatar'">
              <q-avatar>
                <img :src="col.value">
              </q-avatar>
            </span>
            <span v-else-if="!['vendorStripeAccounts', 'vendorLocations', 'primaryContacts'].includes(col.name)">
              {{ col.value }}
            </span>
            <span v-else>None</span>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div
              v-if="['vendorStripeAccounts', 'vendorLocations'].includes($lget(expandMeta,`${props.pageIndex}.expandKey`))"
              class="text-left scroll q-py-lg"
              style="max-height: 500px">
<!--              <vendor-stripe-accounts-list-->
<!--                v-if="$lget(expandMeta,`${props.pageIndex}.expandKey`) === 'vendorStripeAccounts'"-->
<!--                :vendor="props.row"></vendor-stripe-accounts-list>-->
<!--              <vendor-locations-list-->
<!--                v-if="$lget(expandMeta,`${props.pageIndex}.expandKey`) === 'vendorLocations'"-->
<!--                :vendor="props.row"></vendor-locations-list>-->
            </div>
            <div v-else-if="$lget(expandMeta,`${props.pageIndex}.expandKey`) === 'primaryContacts'" class="text-left">
              primaryContacts
              {{ props.cols.find((col) => col.name === 'primaryContacts').value }}
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
             :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section class="flex">
              <q-checkbox dense v-model="props.selected" :label="props.row.name"/>

              <q-space></q-space>

              <q-btn color="secondary"
                     icon-right="edit"
                     no-caps
                     flat
                     dense
                     class="q-mr-sm"
                     @click="editDialog(props)"/>
              <q-btn color="negative"
                     icon-right="delete"
                     no-caps
                     flat
                     dense
                     @click="removeRole(props)"/>
            </q-card-section>
            <q-separator/>
            <q-list dense>
              <div v-for="col in props.cols" :key="col.name">
                <q-btn v-if="['vendorStripeAccounts', 'vendorLocations', 'primaryContacts'].includes(col.name)"
                       align="left"
                       class="full-width"
                       flat
                       @click="setExpanded(props, col.name)">
                  {{ col.label }}
                  <q-space></q-space>
                  {{ col.value.length }}

                  <q-dialog
                    v-if="['vendorStripeAccounts', 'vendorLocations'].includes($lget(expandMeta,`${props.pageIndex}.expandKey`))"
                    :value="props.expand && $lget(expandMeta,`${props.pageIndex}.expandKey`) === col.name"
                    @hide="setExpanded(props, col.name)"
                    full-height
                    full-width>
                    <q-card>
                      <q-toolbar class="bg-primary text-white shadow-2">
                        <q-toolbar-title>{{ props.row.name }}: {{ col.label }}</q-toolbar-title>
                        <q-btn flat v-close-popup round dense icon="close"/>
                      </q-toolbar>

                      <q-card-section style="max-height: 90vh;" class="scroll">
<!--                        <vendor-stripe-accounts-list-->
<!--                          v-if="$lget(expandMeta,`${props.pageIndex}.expandKey`) === 'vendorStripeAccounts'"-->
<!--                          :vendor="props.row"></vendor-stripe-accounts-list>-->
<!--                        <vendor-locations-list-->
<!--                          v-if="$lget(expandMeta,`${props.pageIndex}.expandKey`) === 'vendorLocations'"-->
<!--                          :vendor="props.row"></vendor-locations-list>-->
                      </q-card-section>
                    </q-card>
                  </q-dialog>
                  <q-dialog v-else-if="$lget(expandMeta,`${props.pageIndex}.expandKey`) === 'primaryContacts'"
                            :value="props.expand && $lget(expandMeta,`${props.pageIndex}.expandKey`) === col.name"
                            @hide="setExpanded(props, col.name)">
                    <q-card :style="`width: ${$data.$windowWidth < 520 ? $data.$windowWidth - 10 : 500}px;`">
                      <div>
                        <q-toolbar class="bg-primary text-white shadow-2">
                          <q-toolbar-title>{{ col.label }}</q-toolbar-title>
                          <q-btn flat v-close-popup round dense icon="close"/>
                        </q-toolbar>

                        <q-list bordered style="max-height: 90vh;" class="scroll">
                          <q-item v-for="contact in col.value" :key="contact.id" class="q-mb-sm" clickable v-ripple>
                            <q-item-section avatar>
                              <!--                                <q-avatar>-->
                              <!--                                  <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`">-->
                              <!--                                </q-avatar>-->
                              <q-avatar color="primary" text-color="white">
                                {{ $lget(contact, '_fastjoin.role.name', 'Unknown').substring(0, 1) }}
                              </q-avatar>
                            </q-item-section>

                            <q-item-section>
                              <q-item-label>{{ $lget(contact, '_fastjoin.role.name', 'Unknown') }}</q-item-label>
                              <q-item-label caption lines="1">
                                {{ $lget(contact, '_fastjoin.role.email', 'Unknown') }}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section side>
                              <q-icon name="chat_bubble" color="grey"/>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </q-card>
                  </q-dialog>
                </q-btn>
                <template v-else-if="col.name === 'actions'">
                </template>
                <q-item v-else-if="typeof col.value === 'boolean'">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon :name="col.value ? 'check_circle' : 'cancel'"
                            size="sm"
                            :color="col.value ? 'green' : 'red'"></q-icon>
                  </q-item-section>
                </q-item>
                <q-item v-else-if="col.name === 'avatar'">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-avatar>
                      <img :src="col.value">
                    </q-avatar>
                  </q-item-section>
                </q-item>
                <q-item v-else>
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-card>
        </div>
      </template>

    </q-table>
  </q-page>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {date} from 'quasar';

  import addOrUpdateRole from 'pages/admin/roles/addOrUpdateRole/addOrUpdateRole';

  export default {
    name: 'roles',
    components: {
      addOrUpdateRole,
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'ir-roles-roles',
        name: 'roles',
        qid: 'rolesAdmin',
        query() {
          return {
            $or: [
              {
                name: {$regex: `${this.search}`, $options: 'igm'},
              },
            ],
            $sort: this.sort,
          };
        },
        params() {
          return {
            userJoin: true,
            withAbilities: true,
            debounce: 500,
          };
        },
      }),
    ],
    data() {
      let columns = [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          required: true,
        },
        {
          name: '_fastjoin.abilities',
          label: 'Abilities',
          align: 'left',
          field: row => this.$lget(row, '_fastjoin.abilities', []),
          format: val => val.map(ability => ability.name).join(', '),
          sortable: true,
        },
        {
          name: 'active',
          label: 'Active',
          align: 'left',
          field: row => row.active,
          format: val => val,
          sortable: true,
        },
        {
          name: 'createdBy',
          label: 'Created By',
          align: 'left',
          field: row => this.$lget(row, '_fastjoin.createdBy.email'),
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'updatedBy',
          label: 'Updated By',
          align: 'left',
          field: row => this.$lget(row, '_fastjoin.updatedBy.email'),
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'createdAt',
          label: 'Created At',
          align: 'left',
          field: row => date.formatDate(row.createdAt, 'DD-MM-YYYY hh:mm A'),
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'updatedAt',
          label: 'Updated At',
          align: 'left',
          field: row => date.formatDate(row.updatedAt, 'DD-MM-YYYY hh:mm A'),
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
      return {
        sort: {
          name: 1,
          createdAt: -1,
        },
        formData: {},
        grid: false,
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 1,
          rowsPerPage: 12,
          rowsNumber: this.rolesTotal,
        },
        expandMeta: {},
        search: '',
        selected: [],
        visibleColumns: columns.reduce((acc, col) => {
          if (!['actions'].includes(col.name) && !col.required) {
            acc.push(col.name);
          }
          return acc;
        }, []),
        columns,
      };
    },
    watch: {
      // pagination: {
      //   deep: true,
      //   immediate: true,
      //   handler(newVal) {
      //     this.rolesLimit = newVal.rowsPerPage;
      //     this.rolesCurrentPage = newVal.page;
      //   }
      // },
      rolesTotal(newVal) {
        this.pagination.rowsNumber = newVal;
      },
      // 'grid': {
      //   immediate: true,
      //   handler(newVal) {
      //     if (newVal) {
      //       this.visibleColumns = this.visibleColumns.filter(name => !['actions'].includes(name));
      //     } else {
      //       this.visibleColumns = [...new Set([...this.visibleColumns, 'actions'])];
      //     }
      //   },
      // },
    },
    methods: {
      setExpanded(props, key) {
        if (this.$lget(this.expandMeta, `${props.pageIndex}.expandKey`) === key) {
          props.expand = false;
          this.expandMeta = Object.assign({}, this.$lset(this.expandMeta, `${props.pageIndex}.expandKey`, null));
        } else {
          props.expand = true;
          this.expandMeta = Object.assign({}, this.$lset(this.expandMeta, `${props.pageIndex}.expandKey`, key));
        }
      },
      setPagination(newVal) {
        // console.log(newVal.pagination);
        this.rolesLimit = newVal.pagination.rowsPerPage === 0 ? this.rolesTotal : newVal.pagination.rowsPerPage;
        this.rolesCurrentPage = newVal.pagination.page;
        this.pagination = newVal.pagination;

        if (newVal.pagination.sortBy) {
          // console.log(newVal.pagination.sortBy, newVal.pagination.descending);
          this.sort = {[newVal.pagination.sortBy]: newVal.pagination.descending ? -1 : 1};
        } else {
          this.sort = {
            name: 1,
            createdAt: -1,
          };
        }
      },
      editDialog(props) {
        console.log(props);
        this.$refs['addOrUpdate'].dialogForm = !this.$refs['addOrUpdate'].dialogForm;
        this.$lset(this.formData, 'role', props.row);
        this.formData = this.$lcloneDeep(this.formData);
      },
      removeRole(props) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to remove "${props.row.name}"?`,
          ok: {
            push: true,
            color: 'negative',
          },
          cancel: true,
          persistent: true,
        }).onOk(() => {
          props.row.remove({disableSoftDelete: true})
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
    },
  };
</script>

<style scoped lang="scss">
  #roles {
  }
</style>
