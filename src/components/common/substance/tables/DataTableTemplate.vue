<template>
  <div class="q-pa-md">
    <!--
    Allow users to complete common actions quickly and without having to navigate to a new page.
    Thus the use of dialogs instead
    -->
    <slot name="form" v-bind="form">
      <q-dialog v-model="openAddForm" persistent>

        <q-card :style="`width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;`">
          <q-form @submit="save">
            <q-toolbar>
              <q-avatar>
                <q-icon :name="icon"/>
              </q-avatar>

              <q-toolbar-title> {{ `${$capitalize(singularize(service))} ${$capitalize(singularize(openAddFormMode))} Form` }}</q-toolbar-title>

              <q-btn flat round dense icon="close" @click="close"/>
            </q-toolbar>
            <q-linear-progress reverse v-show="saving" query/>
            <q-card-section>

              <div class="q-pa-md">

                <template v-for="(component, index) in formFields" :key="index">
                  <component
                    v-if="$lget(component, 'addFormVisiblity', []).length === 0 || $lget(component, 'addFormVisiblity', []).includes(openAddFormMode)"
                    dense
                    v-bind:is="component.name"
                    v-bind="{...component.$attrs}"
                    :label="$lget(component,'$attrs.label', $capitalize(component['path']))"
                    :rules="component.rules"
                    :value="form[component['path']]"
                    @input="setField(component['path'], $event)"/>
                </template>
              </div>

            </q-card-section>

            <q-card-actions align="right" class="q-gutter-sm">

              <q-btn outline label="close" @click="close"/>
              <q-btn :disabled="saving" label="save" push color="dark" type="submit"></q-btn>

            </q-card-actions>

          </q-form>
        </q-card>
      </q-dialog>
    </slot>
<!--    <pre>{{data}}</pre>-->
    <q-table
      dense
      flat
      :filter="filter"
      v-bind="$attrs"
      :loading="this['isFindDataPending']"
      row-key="_id"
      :data="data"
      v-model:pagination="pagination"
      @request="setPagination"
      :visible-columns="visibleColumns"
      :grid="viewType!=='table'"
      :hide-header="viewType!=='table'"
      :selection="data.length > 0 ? 'multiple':'single'"
      v-model:selected="selected"
      :rows-per-page-label="`${capitalize(kebabize(service).replace('-',' '))} per page`"
    >

      <template #top-left>
        <div class="row q-gutter-sm q-my-md items-center justify-center">

          <slot name="title">

            <table-header
              :label="title"
              :icon="icon"
              @click="openAddForm=true"
            />
            <!--
              <div class="column justify-center self-end">
                <q-btn no-caps color="dark" className="q-pa-xs" outline v-bind="$attrs.button" @click="exportTable">
                  <div class="text-xs">Download</div>
                  <q-icon  right size="1em" name="fas fa-download"/>
                </q-btn>
              </div>-->
          </slot>

          <slot name="top-left-controls">

          </slot>
        </div>
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

      <template v-if="viewType!=='grid' " #body-cell="props">
        <q-td v-if="props.col.name==='__v'">
          <div class="row justify-end q-gutter-sm">
            <q-btn
              v-if="service==='integration-auths'"
              icon-right="fas fa-key"
              no-caps
              flat
              dense
              class="q-mr-sm"
              @click="revokeSecretKey(props.row._id)"
            />
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
        <q-td caption v-else-if="!Object.keys(fastJoinResolverQuery).includes(props.col.name)" size="18px"
              :props="props">

          <component :is="'span'"> {{ props.row[props.col.name] }}</component>

        </q-td>
        <q-td caption v-else>
          <component :is="'span'" v-if="$lget(props.row,['_fastjoin',props.col.name,'name'])">
            {{ props.row._fastjoin[props.col.name].name }}
          </component>
          <component :is="'span'" v-if="$lget(props.row,['_fastjoin',props.col.name,'title'])">
            {{ props.row._fastjoin[props.col.name].title }}
          </component>
        </q-td>
      </template>


      <template v-else #item="props">
        <slot name="item" v-bind="props">

        </slot>
        <div v-if="viewType==='grid'" class=" q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
             :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card flat bordered >
            <q-card-section class="flex">
              <q-checkbox v-if="props.row" dense class="text-bold" :value="selected.some(item => item._id === props.row._id)"
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

                    <q-item-label caption v-if="!Object.keys(fastJoinResolverQuery).includes(key)" size="18px"
                                  :props="props">

                      {{ props.row[key] }}

                    </q-item-label>
                    <q-item-label caption v-else-if="props.row._fastjoin[key]">
                      <q-chip v-if="props.row._fastjoin[key].name">{{ props.row._fastjoin[key].name }}</q-chip>
                      <q-chip v-if="props.row._fastjoin[key].title">{{ props.row._fastjoin[key].title }}</q-chip>
                    </q-item-label>

                  </q-item-section>
                </q-item>
              </template>

            </q-list>
          </q-card>
        </div>
      </template>


      <template v-slot:top-right="scope">
        <div class="row q-gutter-sm q-my-md items-center justify-center">

          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <slot name="top-right-controls" v-bind="scope">

          </slot>
          <q-btn-toggle v-model="viewType"
                        v-bind="$attrs.viewToggleBtns"
                        no-caps
                        rounded
                        flat
                        class="q-mr-lg"
                        :options="[
                        {icon: 'fas fa-th-large', value: 'grid', slot: 'grid'},
                        {icon: 'fas fa-th-list', value: 'table', slot: 'table'}
                      ]">
            <template #table>
              <q-tooltip content-style="font-size: 10pt">Table</q-tooltip>
            </template>

            <template #grid>
              <q-tooltip content-style="font-size: 10pt">Grid</q-tooltip>
            </template>
          </q-btn-toggle>
          <q-select
            v-if="showHideColumns && data.length"
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
            :options-selected-class="`text-${$attrs.color || 'primary'} text-bold`"
            options-cover
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-filter"/>
              <q-tooltip content-style="font-size: 10pt">Hide Columns</q-tooltip>
            </template>
          </q-select>
        </div>
      </template>


      <template #no-data>

        <div class="full-width">
          <div class="q-pa-md">
            No <strong>{{ $capitalize(service) }}</strong> available
          </div>
        </div>
      </template>


      <template v-for="(_, slot) of $slots" :key="slot" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>


    </q-table>
    <slot name="after-table">

    </slot>
<secret-key-dialog :secret-key="secretKey" v-model="openSecretKeyDialog" @close="openSecretKeyDialog=false"/>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin} from '../../../../mixins';
  import TableHeader from './TableHeader';
  import {capitalize, kebabize, singularize} from '../../../../utils';
  import SecretKeyDialog from './SecretKeyDialog';


  // import {exportFile} from 'quasar';

  /*  function wrapCsvValue(val, formatFn) {
      let formatted = formatFn !== void 0
        ? formatFn(val)
        : val;

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted);

      formatted = formatted.split('"').join('""');
      /!**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       *!/
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`;
    }*/


  export default {
    name: 'data-table-template',
    components: {SecretKeyDialog, TableHeader},
    props: {
      service: {
        type: String,
        required: true,
      },
      title: String,
      icon: String,
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
        defaultValue: 10,
      },
      qid: String,
      searchByProps: {
        type: Array,
        default() {
          return ['name'];
        },
      },
      showHideColumns: {
        type: Boolean,
        default: true,
      },
      columnsToShowFirst: {
        type: Array,
      },
      formFields: {
        type: Array,
        default() {
          return [];
        },
      },
      fastJoinResolverQuery: {
        type: Object,
        default() {
          return {};
        },
      },
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
              $or: this.searchQueries,
            };
          },
          params() {
            return {
              ...this.params,
              qid: this.qid,
              [`${this.service}_fJoinHookResolversQuery`]: this.fastJoinResolverQuery,
            };
          },
        },
      ),
    ],
    data() {
      const ModelName = models.api.byServicePath[this.service].modelName;

      return {
        viewType: 'table',
        showRow: false,
        filter: '',
        selected: [],
        visibleColumns: [],
        columns: [],
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 1,
        },
        openAddForm: false,
        form: new models.api[ModelName]().clone(),
        saving: false,
        openSecretKeyDialog: false,
        secretKey:undefined,
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
      columns(newVal) {
        const cols = this.columnsToShowFirst || newVal;
        this.visibleColumns = ['__v', ...cols];
      },
      data: {
        immediate: true,
        handler(newVal) {
          if (!Array.isArray(newVal) || Array.isArray(newVal) && !newVal[0]) {
            this.columns = [];
          } else {
            const cols = Object.keys(newVal[0]).filter(column => column !== '__v' && column !== '_fastjoin' && column !== 'updatedByHistory' && column !== '_id');
            this.columns = cols.map(col => ({
              label: this.capitalize(this.kebabize(col).replace('-', ' ')),
              value: col,
            }));
          }
        },
      },
      dataTotal: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.pagination.rowsPerPage = this.dataLimit;
            this.pagination.rowsNumber = newVal;
          }
        },
      },
    },
    computed: {
      searchQueries() {
        return this.searchByProps.map(key => ({
          [key]: {$regex: `${this.filter}`, $options: 'igm'},
        }));
      },
      openAddFormMode() {
        return this.form._id ? 'edit' : 'create';
      },

    },
    methods: {
      capitalize,
      kebabize,
      singularize,
      isDate(date) {
        if (!date) return false;
        if (typeof date === 'string') return (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date));
        return date instanceof Date;
      },
      handleSelected(value) {
        if (this.selected.some(item => item._id === this.$lget(value, '_id'))) {
          /* vendors contains the element we're looking for */
          this.selected = this.selected.filter(item => item._id !== value._id);
        } else {
          this.selected.push(value);
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
      edit(item) {
        const ModelName = models.api.byServicePath[this.service].modelName;
        this.form = new models.api[ModelName]().clone(item);
        this.openAddForm = true;
      },
      async save() {
        this.saving = true;
        try {
          // console.log(this.form);
          const data = {};
          this.formFields.map(field => Object.assign(data, {[field.path]: this.$lget(this.form, field.path)}));

          if (this.service !== 'integrations') {
            await this.form.save({data});
          } else {
            const {secretKey} = await this.form.save({data});
            this.secretKey = secretKey;
            this.openSecretKeyDialog = true;
          }
          this.dataRefresh();
          this.close();
          this.$q.notify({
            type: 'positive',
            message: `Successfully Saved ${this.singularize(this.service)}.`,
            timeout: 10000,
            actions: [
              {
                icon: 'close', color: 'white', handler: () => {
                  /* ... */
                },
              },
            ]
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
          this.saving = false;
          this.openAddForm = false;
        }
      },
      close() {
        const ModelName = models.api.byServicePath[this.service].modelName;
        this.form = new models.api[ModelName]().clone();
        this.saving = false;
        this.openAddForm = false;
        this.secretKey = undefined;
        this.openSecretKeyDialog = false;
      },
      remove(val) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to remove this ${singularize(this.service)}?`,
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
            }); /**/
        });
      },
      async revokeSecretKey(integrationID) {

        const result = await this.$feathersClient.service('new-integration-auth-secret').create({
          integrationID,
        });

        this.secretKey = this.$lget(result, 'secretKey');
        this.openSecretKeyDialog = true;
      },
      setField(path, newValue) {
        this.$set(this.form, path, newValue);
        this.form = this.$lcloneDeep(this.form);
      }
      /*  exportTable() {
          // naive encoding to csv format
          const content = [this.columns.map(col => wrapCsvValue(col.name))].concat(
            this.data.map(row => this.columns.map(col => wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
            )).join(',')),
          ).join('\r\n');

          const status = exportFile(
            'table-export.csv',
            content,
            'text/csv',
          );

          if (status !== true) {
            this.$q.notify({
              message: 'Browser denied file download...',
              color: 'negative',
              icon: 'warning',
            });
          }
        },*/

    },
  };
</script>
<style lang="scss" scoped>

</style>
