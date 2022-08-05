<template>
  <data-table-template
    icon="fas fa-key"
    title="IntegrationAuths"
    service="integration-auths"
    class="my-sticky-header-table"
    card-container-class="grid-content"
    :rows-per-page-options="[5, 12, 25, 50, 100, 200, 0]"
    :columns-to-show-first="['name','integration','createdAt', 'updatedAt']"
    :search-by-props="['name',]"
    :limit="5"
    :form-fields="formFields"
    table-header-class="text-h2 bg-grey-3 text-bolder"
    :fast-join-resolver-query="fastJoinHookResolversQuery"
  />
</template>

<script>
  import DataTableTemplate from '../components/common/substance/tables/DataTableTemplate';
  export default {
    name: 'integrations-page',
    components: {DataTableTemplate},
    data() {
      return {
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
        fastJoinHookResolversQuery: {
          integration: true,
        },
      };
    },
  };
</script>
