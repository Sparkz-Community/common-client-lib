<template>
  <div :class="`${wallets.length ? ($q.screen.sm || $q.screen.xs) ?'column': 'row': ''} q-gutter-lg q-pa-md`">

    <div @click="newWalletDio = true" :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : '', maxWidth: '450px'}">
      <div class=" box column items-center justify-center q-pa-xl" style=" position: relative">
        <q-icon name="sp:add_walletIcon_1"
                style="font-size: clamp(60px, 20vw, 90px)"/>
        <!--        <div class="q-pa-sm" style="width: 100%;">-->
        <p class="text-center text-h5 text-bold q-pa-sm"
           style="font-size: clamp(15px, 5vw, 25px)">New Wallet</p>
        <!--        </div>-->
      </div>
    </div>

    <div class="col" v-for="wallet in wallets" :key="$lget(wallet,'_id')">
      <div class="box column items-center justify-center q-pa-xl" style=" position: relative">
        <div class="q-pa-md" style="width: 100%;">
          <p class="text-center text-h4 text-primary text-bold">{{ $lget(wallet,['tally_bank_business_profile','accountName']) }}</p>
          <p class="text-center text-h5 text-positive text-bold">{{ $lget(wallet,['tally_bank_business_profile','availableBalance'],'5400 available') }}</p>
        </div>
        <div class="full-width row justify-end q-gutter-md q-ma-sm" style="position: absolute; bottom: 0; right: 1rem;">
          <q-btn flat color="primary" icon="edit" label="edit" @click="openEditWalletDialog(wallet)"/>
          <q-btn flat color="primary" icon="fas fa-trash" @click="remove(wallet)"/>
        </div>
      </div>
    </div>

    <q-inner-loading :showing="isPending">
      <q-spinner-gears size="50px" color="primary"/>
    </q-inner-loading>


    <q-dialog v-model="newWalletDio">
        <add-wallet-form :account="accountData" @close="newWalletDio=false"/>
      </q-dialog>


  </div>
</template>

<script>

  import {mapActions} from 'pinia';
  import AddWalletForm from './AddWalletForm';
  import {useFindPaginate} from '../../';
  import {reactive, ref} from 'vue';
  import {models} from 'feathers-pinia';

  export default {
    name: 'my-wallets',
    components: {
      AddWalletForm,
    },
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
    },
    setup() {

      const account =  new models.api.Accounts().clone();

      const {items: wallets, isPending} = useFindPaginate({
        limit: 12,
        qid: 'wallets',
        query: {
          account
        },
        params: {
          debounce: 500,
        }
      });

      return {
        wallets,
        isPending,
        isLoading: ref(false),
        formData: reactive(undefined),
        newWalletDio: ref(false),
        accountData: reactive({
        })
      };
    },

    watch: {
      modelValue: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length) {
            this.accountData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    methods: {
      ...mapActions('accounts', {
        patchAccount: 'patch',
      }),
      openEditWalletDialog(value) {
        this.newWalletDio = true;
        this.formData = value;
      },
      async remove(data) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Would you like to delete this wallet from your ${this.$lget(this.modelValue, ['account','name'])} account?`,
          ok: {
            push: true,
            color: 'primary',
          },
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          // console.log('>>>> OK')
          try {
            // await data.patch({
            //   data: {
            //     $pull: {
            //       accounts: this.$lget(this.modelValue, 'account._id'),
            //     },
            //   },
            // });
            this.$q.notify({
              message: ` The ${this.$lget(data, 'name')} company was successfully removed.`,
              color: 'green-4',
              textColor: 'white',
              icon: '',
            });
          } catch (e) {
            this.$q.notify({
              message: e.message,
              color: 'negative',
              textColor: 'white',
              icon: 'warning',
            });
          }
        }).onOk(async () => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          this.clear();
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
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

