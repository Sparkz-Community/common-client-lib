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
          <q-item-label>{{ member.name }}</q-item-label>
          <q-item-label caption lines="1">{{ member.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-spinner v-if="isDeleting"/>
          <q-icon v-else
                  size="xs"
                  name="fas fa-trash"
                  color="negative"
                  class="cursor-pointer"
                  @click="removeMember(member._id)"/>
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
      :filter-out="[account._id, ...account.membership.member]"
    />


  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin} from '../../../';
  import AccountFormDialog from './AccountFormDialog';

  export default {
    name: 'Members',
    components: {
      AccountFormDialog,
    },
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'accounts',
        name: 'members',
        infinite: true,
        query() {
          return {
            _id: {
              $in: this.$lget(this.account, 'membership.members', []),
            },
            $select: ['_id', 'name', 'email', 'avatar'],
          };
        },
        params() {
          return {
            qid: `accountMembers-${this.$lget(this.account, '_id')}`,
          };
        }
      }),
    ],
    data() {
      return {
        accountData: {
          account: new models.api.Accounts().clone(),
        },
        newMemberDialog: false,
        isDeleting: false,
        isAdding: false,
        accountSelection: null,
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && Object.keys(newVal).length && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.accountData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    computed: {
      account() {
        return this.$lget(this.accountData, 'account', {});
      },
    },
    methods: {
      addMember(account) {
        if (account !== null) {
          this.isAdding = true;

          // if the members array doesn't exist on the account, this adds it
          if (!this.$lget(this.accountData, 'account.membership.members')) {
            this.$lset(this.accountData, 'account.membership.members', []);
          }

          this.$lget(this.accountData, 'account.membership.members', []).push(account._id);
          this.$lget(this.accountData, 'account').patch({
            data: {
              'membership.members': this.$lget(this.accountData, 'account.membership.members'),
            }
          })
            .then(() => {
              this.$q.notify({
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
              this.isAdding = false;
              this.newMemberDialog = false;
            })
            .catch(err => {
              this.$q.notify({
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
              this.isAdding = false;
            });
        }
      },
      removeMember(accountId) {
        this.isDeleting = true;
        const index = this.$lget(this.accountData, 'account.membership.members', []).indexOf(accountId);
        this.$lget(this.accountData, 'account.membership.members', []).splice(index, 1);
        this.$lget(this.accountData, 'account').patch({
          data: {
            'membership.members': this.$lget(this.accountData, 'account.membership.members'),
          }
        })
          .then(() => {
            this.$q.notify({
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
            this.isDeleting = false;
          })
          .catch(err => {
            this.$q.notify({
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
            this.isDeleting = false;
          });
      },
    },
  };
</script>

<style scoped>

</style>
