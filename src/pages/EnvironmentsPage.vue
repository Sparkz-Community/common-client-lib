<template>

  <f-data-table title="Environments"
                service="environments"
                qid="environments"
                :limit="12"
                :query="{}"
                :params="params"
                :columns="columns"
                :form-fields="formFields"
                create-title="Environment">

    <template v-slot:expand="props">

      <template v-if="props.colName === 'applications'">

        <q-table dense
                 flat
                 :rows="$lget(props,['row','_fastjoin','applications'])"
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
                 :rows="$lget(props,['row','_fastjoin','hosts'])"
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

      <template v-if="props.colName === 'integrationAuths'">

        <q-table dense
                 flat
                 :rows="$lget(props,['row','_fastjoin','integrationAuths'])"
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

      <template v-if="props.colName === 'responsibleAccount'">

        <account-profile
          tab="wallets"
          v-if="$lget(props,['row','responsibleAccount'])"
          :model-value="{account: getResponsibleAccount($lget(props,['row','responsibleAccount']))}"
          square
        />

        <div v-else class="row justify-around q-gutter-md q-pa-xl">

          <div @click="openToAdd" class="box new-address"
               :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : '', maxWidth: '450px'}">
            <div class=" box column items-center justify-center q-pa-xl" style=" position: relative">
              <q-icon name="fas fa-plus" size="xl"/>
              <div class="q-pa-md" style="width: 100%;">
                <p class="text-center text-h5 text-primary text-bold q-mb-none">Responsible Account</p>
                <p class="text-center text-caption text-bold q-mt-none">(Add a brand new one)</p>
              </div>
              <div class="full-width row justify-end q-gutter-md q-ma-sm"
                   style="position: absolute; bottom: 0; right: 1rem;">
                <q-space/>
              </div>
            </div>
          </div>

          <div @click="openToSelect" class="box new-address"
               :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : '', maxWidth: '450px'}"
          >
            <div class=" box column items-center justify-center q-pa-xl" style=" position: relative">
              <q-icon name="fas fa-hand-lizard" size="xl"/>
              <div class="q-pa-md" style="width: 100%;">
                <p class="text-center text-h5 text-primary text-bold q-mb-none">Responsible Account</p>
                <p class="text-center text-caption text-bold q-mt-none">(Select from existing ones)</p>
              </div>
              <div class="full-width row justify-end q-gutter-md q-ma-sm"
                   style="position: absolute; bottom: 0; right: 1rem;">
                <q-space/>
              </div>
            </div>
          </div>

        </div>

        <account-form-dialog
          :select-existing="selectExisting"
          v-model="openResponsibleAccount"
          @saved="addResponsibleAccount($lget(props,'row'),$event)"
          @close="closeAccountForm"
        />


      </template>

    </template>
    <template v-slot:dialog-card-section="props">
      <template v-if="props.colName === 'applications'">
        <q-table
          grid
          dense
          flat
          :rows="$lget(props,['row','_fastjoin','applications'])"
          :visible-columns="['name','createdAt','updatedAt']"
        >

          <template #item="scope">
            <q-card class="q-ma-md" bordered>
              <q-card-section>
                <q-list dense>
                  <template v-for="(key) in Object.keys(scope.colsMap)" :key="key">
                    <q-item>
                      <q-item-section>
                        <q-item-label header class="text-bold text-capitalize">
                          {{ capitalize(kebabize(key).replace('-', ' ')) }}
                        </q-item-label>
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
          :rows="$lget(props,['row','_fastjoin','hosts'])"
          :visible-columns="['name','createdAt','updatedAt']"
        >

          <template #item="scope">
            <q-card class="q-ma-md" bordered>
              <q-card-section>
                <q-list dense>
                  <template v-for="(key) in Object.keys(scope.colsMap)" :key="key">
                    <q-item>
                      <q-item-section>
                        <q-item-label header class="text-bold text-capitalize">
                          {{ capitalize(kebabize(key).replace('-', ' ')) }}
                        </q-item-label>
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

      <template v-if="props.colName === 'integrationAuths'">
        <q-table
          grid
          dense
          flat
          :rows="$lget(props,['row','_fastjoin','integrationAuths'])"
          :visible-columns="['name','createdAt','updatedAt']"
        >

          <template #item="scope">
            <q-card class="q-ma-md" bordered>
              <q-card-section>
                <q-list dense>
                  <template v-for="(key) in Object.keys(scope.colsMap)" :key="key">
                    <q-item>
                      <q-item-section>
                        <q-item-label header class="text-bold text-capitalize">
                          {{ capitalize(kebabize(key).replace('-', ' ')) }}
                        </q-item-label>
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
      <template v-if="props.colName === 'responsibleAccount'">
        <account-profile
          tab="wallets"
          v-if="$lget(props,['row','responsibleAccount'])"
          :model-value="{account: getResponsibleAccount($lget(props,['row','responsibleAccount']))}"
        />
        <div v-else class="row justify-around q-gutter-md q-pa-xl">

          <div @click="openToAdd" class="box new-address"
               :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : '', maxWidth: '450px'}">
            <div class=" box column items-center justify-center q-pa-xl" style=" position: relative">
              <q-icon name="fas fa-plus" size="xl"/>
              <div class="q-pa-md" style="width: 100%;">
                <p class="text-center text-h5 text-primary text-bold q-mb-none">Responsible Account</p>
                <p class="text-center text-caption text-bold q-mt-none">(Add a brand new one)</p>
              </div>
              <div class="full-width row justify-end q-gutter-md q-ma-sm"
                   style="position: absolute; bottom: 0; right: 1rem;">
                <q-space/>
              </div>
            </div>
          </div>

          <div @click="openToSelect" class="box new-address"
               :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : '', maxWidth: '450px'}"
          >
            <div class=" box column items-center justify-center q-pa-xl" style=" position: relative">
              <q-icon name="fas fa-hand-lizard" size="xl"/>
              <div class="q-pa-md" style="width: 100%;">
                <p class="text-center text-h5 text-primary text-bold q-mb-none">Responsible Account</p>
                <p class="text-center text-caption text-bold q-mt-none">(Select from existing ones)</p>
              </div>
              <div class="full-width row justify-end q-gutter-md q-ma-sm"
                   style="position: absolute; bottom: 0; right: 1rem;">
                <q-space/>
              </div>
            </div>
          </div>

        </div>

        <account-form-dialog
          :select-existing="selectExisting"
          v-model="openResponsibleAccount"
          @saved="addResponsibleAccount($lget(props,'row'),$event)"
          @close="closeAccountForm"
        />

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
  import {mapState} from 'pinia';
  import AccountFormDialog from '../components/profile/accounts/AccountFormDialog';
  import {models} from 'feathers-pinia';
  import AccountProfile from '../components/profile/AccountProfile';
  import {ref} from 'vue';
  import {computed} from 'vue';

  import useApplicationStore from '../stores/services/applications';
  import useIntegrationAuthStore from '../stores/services/integration-auths';
  import useAccountStore from '../stores/services/accounts';

  export default {
    name: 'environments-page',
    components: {
      AccountProfile,
      AccountFormDialog,
      FDataTable,
      // DataTableTemplate
    },
    setup() {
      const params = computed(() => {
        return {
          debounce: 500,
        };
      });

      const {items: applications} = useFindPaginate({
        limit: ref(12),
        model: useApplicationStore().Model,
        qid: ref('applications'),
        params,
      });

      const {items: integrationAuths} = useFindPaginate({
        limit: ref(12),
        model: useIntegrationAuthStore().Model,
        qid: ref('integrationAuths'),
        params,
      });

      const {items: accounts} = useFindPaginate({
        limit: ref(12),
        model: useAccountStore().Model,
        qid: ref('accounts'),
        params,
      });

      return {
        applications,
        integrationAuths,
        accounts,
      };
    },
    data() {
      return {
        accountCardTabs: [
          {
            name: 'wallets',
            label: 'Wallets',
            icon: 'fas fa-wallet',
          },
          {
            name: 'accounts',
            label: 'Accounts',
            icon: 'mdi-account-circle',
          },
          {
            name: 'qb_connections',
            label: 'Quickbook Connections',
            icon: 'fas fa-building',
          },
          {
            name: 'addresses',
            label: 'Addresses',
            icon: 'fas fa-location-arrow',
          },
          {
            name: 'phone-numbers',
            label: 'Phone Numbers',
            icon: 'fas fa-phone-alt',
          },
          {
            name: 'social-links',
            label: 'Social Links',
            icon: 'fab fa-instagram',
          },
        ],
        openResponsibleAccount: false,
        selectExisting: false,
      };
    },
    computed: {
      ...mapState(useAccountStore, {
        getResponsibleAccount: 'getFromStore',
      }),

      params() {
        return {
          'environments_fJoinHookResolversQuery': {
            applications: true,
            hosts: true,
            integrationAuths: true,
            responsibleAccount: true,
          },
          userJoin: true,
        };
      },

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
            name: 'responsibleAccount',
            label: 'Responsible',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'responsibleAccount'], ''),
            format: val => val ? {account: val} : [],
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'applications',
            label: 'Applications',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'applications'], []),
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
            name: 'integrationAuths',
            label: 'Integration Auths',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'integrationAuths'], []),
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
            path: 'applications',
            attrs: {
              label: 'Applications',
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
              options: this.applications,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'responsibleAccount',
            attrs: {
              label: 'Responsible Account',
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
              options: this.accounts,
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
      formatDate(yourDate) {
        return date.formatDate(yourDate, 'DD-MM-YYYY hh:mm A');
      },
      openToAdd() {
        this.openResponsibleAccount = true;
        this.selectExisting = false;
      },
      openToSelect() {
        this.openResponsibleAccount = true;
        this.selectExisting = true;
      },
      closeAccountForm() {
        this.openResponsibleAccount = false;
        this.selectExisting = false;
      },
      async addResponsibleAccount(environment, account) {
        try {
          await new models.api['Environments']({...environment}).save({
            ...this.params,
            data: {responsibleAccount: this.$lget(account, '_id')},
          });
          this.$q.notify({
            type: 'positive',
            message: `Successfully Assigned "${account.name}" account to be responsible for ${environment.name} environment`,
            timeout: 10000,
            actions: [
              {
                icon: 'close', color: 'white', handler: () => {
                  /* ... */
                },
              },
            ],
          });
        } catch (err) {
          this.$q.notify({
            type: 'negative',
            message: err.message,
            timeout: 30000,
            actions: [
              {
                icon: 'close', color: 'white', handler: () => {
                  /* ... */
                },
              },
            ],
          });
        }
      },
    },
  };
</script>
<style scoped lang="scss">
  .box {
    max-width: 450px;
    height: calc(100% + 1vh);
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.25);
    transition: 0.2s all;

    &:hover {
      background-color: #edeff3;
      transform: scale(1.05);
      cursor: pointer;
    }
  }
</style>
