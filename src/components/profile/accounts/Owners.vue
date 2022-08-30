<template>
  <div>
    <div v-if="!owners.length" class="text-center q-ma-lg" style="font-size: 20px">
      No Owners
    </div>

    <q-list v-else bordered separator>
      <q-item v-for="(owner, index) in owners"
              :key="index"
              class="q-my-sm">
        <q-item-section avatar>
          <q-avatar square color="accent" text-color="white">
            <img v-if="$lget(owner, 'avatar.raw.file')" :src="$lget(owner, 'avatar.raw.file')">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ owner.name }}</q-item-label>
          <q-item-label caption lines="1">{{ owner.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-spinner v-if="isDeleting"/>
          <q-icon v-else
                  size="xs"
                  name="fas fa-trash"
                  color="negative"
                  class="cursor-pointer"
                  @click="removeOwner(owner._id)"/>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="flex justify-center q-ma-md">
      <q-btn icon="sp:add_ownerIcon"
             label="Add Owner"
             @click="newOwnerDialog = true"/>
    </div>
    <account-form-dialog
      select-existing
      v-model="newOwnerDialog"
      @saved="addOwner"
      @close="newOwnerDialog = false"
      :filter-out="[account._id, ...ownerIds]"
    />
  </div>
</template>

<script>
  import {models} from 'feathers-pinia';
  import {useFindPaginate} from '../../../';
  import AccountFormDialog from './AccountFormDialog';
  // import {Accounts} from '../../../stores/services/accounts';
  import {computed, inject, ref, watch, toRef} from 'vue';
  import {useQuasar} from 'quasar';

  export default {
    name: 'Owners',
    components: {
      AccountFormDialog,
    },
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const modelValue = toRef(props, 'modelValue');
      let $lget = inject('$lget');
      let $lset = inject('$lset');
      let $lcloneDeep = inject('$lcloneDeep');
      let $q = useQuasar();
      let $Accounts = inject('$Accounts');

      let accountData = ref({
        account: new models.api.Accounts(),
      });

      let newOwnerDialog = ref(false);
      let isDeleting = ref(false);
      let isAdding = ref(false);
      let accountSelection = ref(null);

      watch(modelValue, (newVal, oldVal) => {
        if (newVal && Object.keys(newVal).length && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          accountData.value = $lcloneDeep(newVal);
        }
      }, {deep: true, immediate: true});

      let account = computed(() => $lget(accountData.value, 'account', {}));
      let ownerIds = computed(() => $lget(account, 'ownership.owners', []).map(i => i.id));

      function addOwner(account) {
        if (account !== null) {
          isAdding.value = true;

          // if the owners array doesn't exist on the account, this adds it
          if (!$lget(accountData.value, 'account.ownership.owners')) {
            $lset(accountData.value, 'account.ownership.owners', []);
          }

          $lget(accountData.value, 'account.ownership.owners', []).push({id: account._id});
          $lget(accountData.value, 'account').patch({
            data: {
              'ownership.owners': $lget(accountData.value, 'account.ownership.owners'),
            },
          })
            .then(() => {
              $q.notify({
                type: 'positive',
                message: 'Successfully added owner',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              isAdding.value = false;
              newOwnerDialog.value = false;
            })
            .catch(err => {
              $q.notify({
                type: 'negative',
                message: err.message,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            });
        }
      }

      function removeOwner(accountId) {
        isDeleting.value = true;
        let newOwners = $lget(accountData.value, 'account.ownership.owners', []).filter(obj => {
          return obj.id !== accountId;
        });
        $lset(accountData.value, 'account.ownership.owners', newOwners);
        $lget(accountData.value, 'account').patch({
          data: {
            'ownership.owners': $lget(accountData.value, 'account.ownership.owners'),
          },
        })
          .then(() => {
            $q.notify({
              type: 'positive',
              message: 'Successfully removed owner',
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
            isDeleting.value = false;
          })
          .catch(err => {
            $q.notify({
              type: 'negative',
              message: err.message,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
      }

      const query = computed(() => ({
        _id: {
          $in: ownerIds,
        },
        $select: ['_id', 'name', 'email', 'avatar'],
      }));

      const params = computed(()=>({
        qid: `accountOwners-${$lget(account, '_id')}`,
      }));

      const {items: owners} = useFindPaginate({
        limit: ref(12),
        model: $Accounts,
        qid: ref('owners'),
        infinite: ref(true),
        query,
        params,
      });
      return {
        owners,
        accountData,
        newOwnerDialog,
        isDeleting,
        isAdding,
        accountSelection,
        account,
        ownerIds,
        addOwner,
        removeOwner,
      };
    },
  };
</script>

<style scoped>

</style>
