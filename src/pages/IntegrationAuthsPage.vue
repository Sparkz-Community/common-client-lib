
<template>

  <f-data-table title="Integration Auths"
                service="integrationAuths"
                qid="integrationAuths"
                :limit="12"
                :query="{}"
                :params="{
                     'integration-auths_fJoinHookResolversQuery': {
                        integration: true,
                     },
                    userJoin: true,
                    }"
                :columns="columns"
                :form-fields="formFields"
                create-title="Integration Auth"
                @pagination-changed="setPagination">

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
            name: 'integration',
            label: 'Integration',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'integration'],undefined),
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
      formFields: [
        {
          name: 'q-input',
          path: 'name',
          $attrs: {
            outlined: true,
          },
          rules: [
            val => !!val || '* Required',
            val => val.length > 2 || 'Name should be at least 3 characters long',
          ],
        },
        {
          name: 's-select',
          path: 'integration',
          $attrs: {
            outlined: true,
            service: 'integrations',
          },
          rules: [
            val => !!val || '* Required',
          ],
        },
        {
          name: 's-select',
          path: 'environments',
          $attrs: {
            multiple: true,
            outlined: true,
            service: 'environments',
          },
          rules: [
            val => !!val || '* Required',
          ],
        },
      ],

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

