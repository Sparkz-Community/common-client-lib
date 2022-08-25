<template>
  <select-input @input-value="search = $event"
                @update:modelValue="$emit('update:modelValue', $event)"
                @keydown="preventSpecialCharacter($event)"
                v-model="selection"
                path="auto"
                :slots="['append','after-options', 'option']"
                :div-attrs="{class: ''}"
                :attrs="selectAttrs"
                style="flex: 1;">
    <template v-slot:append>
      <q-icon name="search"/>
    </template>

    <template v-slot:after-options v-if="accounts.length < accountsTotal">
      <q-item>
        <q-item-section @click="accountScroll">
          <div>
            <div>Load More
              <q-icon name="add" size="sm"/>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps"
              v-on="scope.itemEvents">
        <q-item-section avatar>
          <q-avatar text-color="white" color="accent">
            <img v-if="$lget(scope.opt, 'avatar.raw.file')"
                 :src="$lget(scope.opt, 'avatar.raw.file', '')">
            <template v-else>{{ $lget(scope.opt, 'name', '').charAt(0) }}</template>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $lget(scope.opt, 'name', '') }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </select-input>
</template>

<script>
  import SelectInput
    from '@sparkz-community/form-gen-client-lib/src/components/common/atoms/SelectInput/SelectInput';
  import {useFindPaginate} from '../../../';
  import {computed, ref} from 'vue';
  import {Accounts} from '../../../stores/services/accounts';

  export default {
    name: 'AccountSearch',
    components: {
      SelectInput,
    },
    props: {
      filterOut: {
        type: Array,
      },
      multiple: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    emits: [
      'update:modelValue',
    ],
    setup(props) {
      let search = ref('');

      let query = computed(() => {
        let queryD = {
          $sort: {
            name: 1,
          },
          _id: {
            $nin: props.filterOut ? props.filterOut : [],
          },
        };

        if (!['', null, undefined].includes(search.value)) {
          this.$lset(queryD, '$or', [
            {
              name: {$regex: `${search.value}`, $options: 'igm'},
            },
            {
              email: {$regex: `${search.value}`, $options: 'igm'},
            },
          ]);
        }
        return queryD;
      });

      const params = computed(() =>({
        debounce: 500,
      }));

      const {
        items: accounts,
        currentPage: accountsCurrentPage,
        itemsCount: accountsTotal,
      } = useFindPaginate({
        limit: ref(6),
        model: Accounts,
        qid: ref('searchAccounts'),
        infinite: ref(true),
        query,
        params
      });

      return {
        accounts,
        accountsCurrentPage,
        accountsTotal,

        search,
      };
    },
    data() {
      return {
        sort: undefined,
        selection: null,
      };
    },
    computed: {
      selectAttrs() {
        return {
          label: this.multiple ? 'Search For Accounts Here...' : 'Search For an Account Here...',
          // eslint-disable-next-line no-unused-vars
          filterFn(val, update, abort) {
            update(() => {
            });
          },
          'fill-input': !this.multiple,
          hint: 'Search Account Name or Email Address',
          'map-options': true,
          'option-value': '_id',
          'option-label': 'name',
          multiple: this.multiple,
          'hide-selected': !this.multiple,
          filled: true,
          behavior: 'menu',
          style: 'border-radius: 0.6em; overflow: hidden;',
          options: Object.freeze(this.accounts.slice(0)),
        };
      },
    },
    methods: {
      preventSpecialCharacter(e) {
        if (/[^\w ]/.test(e.key)) {
          e.preventDefault();
        }
      },
      accountScroll() {
        this.accountsCurrentPage += 1;
      },
    },
  };
</script>

<style scoped>

</style>
