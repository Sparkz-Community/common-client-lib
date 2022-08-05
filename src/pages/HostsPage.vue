<template>

  <f-data-table title="Hosts"
                service="hosts"
                qid="hosts"
                :limit="12"
                :query="{}"
                :params="{
                     'hosts_fJoinHookResolversQuery': {
                                application: [['_id','name']],
                                environment: [['_id','name']],
                                domain: [['_id','name']],
                              },
                    userJoin: true,
                    }"
                :columns="columns"
                :form-fields="formFields"
                create-title="Host"
                @pagination-changed="setPagination"/>
</template>

<script>
  // import DataTableTemplate from '../components/common/substance/tables/DataTableTemplate';
  import {date} from 'quasar';
  import FDataTable from '../components/common/molecules/feathers/FDataTable/FDataTable';
  import {capitalize, kebabize} from '../utils';
  import {makeFindPaginateMixin} from '../';

  export default {
    name: 'v-instances-page',
    components: {
      FDataTable,
      // DataTableTemplate
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'applications',
        name: 'applications',
        qid: 'applications',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
      makeFindPaginateMixin({
        limit: 12,
        service: 'domains',
        name: 'domains',
        qid: 'domains',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
      makeFindPaginateMixin({
        limit: 12,
        service: 'environments',
        name: 'environments',
        qid: 'environments',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
    ],
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
            name: 'application',
            label: 'Application',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','application','name'],''),
            format: val => val || '',
            sortable: true,
          },
          {
            name: 'domain',
            label: 'Domain',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'domain','name'], ''),
            format: val => val || '',
            sortable: true,
          },
          {
            name: 'environment',
            label: 'Environment',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'environment','name'], ''),
            format: val => val || '',
            sortable: true,
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
            path: 'application',
            attrs: {
              label: 'Application',
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
              options: this.applications,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'environment',
            attrs: {
              label: 'Environment',
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
              options: this.environments,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'domain',
            attrs: {
              label: 'Domain',
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
              options: this.domains,
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
