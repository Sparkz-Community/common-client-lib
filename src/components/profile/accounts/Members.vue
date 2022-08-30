<template>
  <div>
    <div v-if="!members.length" class="text-center q-ma-lg" style="font-size: 20px">
      No Members
    </div>

    <q-list v-else bordered separator>
      <q-item v-for="(member, index) in members"
              :key="index"
              class="q-my-sm">
        <q-item-section avatar>
          <q-avatar square color="accent" text-color="white">
            <img v-if="$lget(member, 'avatar.raw.file')" :src="$lget(member, 'avatar.raw.file')">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ member?.name }}</q-item-label>
          <q-item-label caption lines="1">{{ member?.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-spinner v-if="isDeleting"/>
          <q-icon v-else
                  size="xs"
                  name="fas fa-trash"
                  color="negative"
                  class="cursor-pointer"
                  @click="removeMember(member?._id)"/>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="flex justify-center q-ma-md">
      <q-btn icon="sp:add_memberIcon"
             label="Add Member"
             @click="newMemberDialog = true"/>
    </div>

    <account-form-dialog
        select-existing
        v-model="newMemberDialog"
        @saved="addMember"
        @close="newMemberDialog=false"
        :filter-out="[account._id, ...account?.membership?.member]"
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
    name: 'Members',
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

      let newMemberDialog = ref(false);
      let isDeleting = ref(false);
      let isAdding = ref(false);
      let accountSelection = ref(null);

      watch(modelValue, (newVal, oldVal) => {
        if (newVal && Object.keys(newVal).length && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          accountData.value = $lcloneDeep(newVal);
        }
      }, {deep: true, immediate: true});

      let account = computed(() => $lget(accountData.value, 'account', {}));

      function addMember(account) {
        if (account !== null) {
          isAdding.value = true;

          // if the members array doesn't exist on the account, this adds it
          if (!$lget(accountData.value, 'account.membership.members')) {
            $lset(accountData.value, 'account.membership.members', []);
          }

          $lget(accountData.value, 'account.membership.members', []).push(account._id);
          $lget(accountData.value, 'account').patch({
            data: {
              'membership.members': $lget(accountData.value, 'account.membership.members'),
            },
          })
            .then(() => {
              $q.notify({
                type: 'positive',
                message: 'Successfully added member',
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
              newMemberDialog.value = false;
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
              isAdding.value = false;
            });
        }
      }

      function removeMember(accountId) {
        isDeleting.value = true;
        const index = $lget(accountData.value, 'account.membership.members', []).indexOf(accountId);
        $lget(accountData.value, 'account.membership.members', []).splice(index, 1);
        $lget(accountData.value, 'account').patch({
          data: {
            'membership.members': $lget(accountData.value, 'account.membership.members'),
          },
        })
          .then(() => {
            $q.notify({
              type: 'positive',
              message: 'Successfully removed member',
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
            isDeleting.value = false;
          });
      }

      const query = computed(() =>({
        _id: {
          $in: $lget(account, 'membership.members', []),
        },
        $select: ['_id', 'name', 'email', 'avatar'],
      }));

      const params = computed(() =>({
        qid: `accountMembers-${$lget(account, '_id')}`,
      }));

      const {items: members} = useFindPaginate({
        limit: ref(12),
        model: $Accounts,
        qid: ref('members'),
        infinite: ref(true),
        query,
        params
      });

      return {
        accountData,
        newMemberDialog,
        isDeleting,
        isAdding,
        accountSelection,
        account,
        addMember,
        removeMember,
        members,
      };
    },
  };
</script>

<style scoped>

</style>
