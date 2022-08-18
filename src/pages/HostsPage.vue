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
                create-title="Host"/>
</template>

<script>
  // import DataTableTemplate from '../components/common/substance/tables/DataTableTemplate';
  import {date} from 'quasar';
  import FDataTable from '../components/common/molecules/feathers/FDataTable/FDataTable';
  import {capitalize, kebabize} from '../utils';
  import {useFindPaginate} from '../';
  import {computed, ref} from 'vue/dist/vue';

  import useApplicationStore from '../store/services/applications';
  import useDomainStore from '../store/services/domains';
  import useEnvironmentStore from '../store/services/environments';

  export default {
    name: 'v-instances-page',
    components: {
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
      const {items: domains} = useFindPaginate({
        limit: ref(12),
        model: useDomainStore().Model,
        qid: ref('domains'),
        params,
      });
      const {items: environments} = useFindPaginate({
        limit: ref(12),
        model: useEnvironmentStore().Model,
        qid: ref('environments'),
        params,
      });

      return {
        applications,
        domains,
        environments,
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
      formatDate(yourDate) {
        return date.formatDate(yourDate, 'DD-MM-YYYY hh:mm A');
      },

    },
  };
</script>
