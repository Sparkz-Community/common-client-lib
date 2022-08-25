<template>
  <account-card :tabs="accountCardTabs"
                :model-value="modelValue"
                :tab="tab"
                v-bind="$attrs">
    <template #wallets="value">
      <my-wallets :model-value="value"/>
    </template>
    <template #accounts="value">
      <div :style="{display: 'flex', 'flex-wrap': 'wrap', 'flex-direction': $q.screen.lt.sm ? 'column' : undefined}">
        <div style="flex: 1;">
          <div style="text-align: center; font-size: 2.1em;">Owners</div>
          <owners  :model-value="value"/>
        </div>

        <div class="q-px-md">
          <q-separator vertical style="height: 100%;"/>
        </div>

        <div style="flex: 1;">
          <div style="text-align: center; font-size: 2.1em;">Members</div>
          <members :model-value="value"/>
        </div>
      </div>
    </template>
    <template #qb_connections="value">
      <div style="text-align: center; font-size: 2.1em;">Quickbook Connections</div>
      <companies-list :model-value="value"/>
    </template>

    <template #addresses="value">
      <account-addresses :model-value="value"/>
    </template>

    <template #phone-numbers="value">
      <account-phones :model-value="value"/>
    </template>

    <template #social-links="value">
      <account-social-links :model-value="value"/>
    </template>
  </account-card>
</template>

<script>
  import AccountCard from './accounts/AccountCard';
  import MyWallets from '../banks/MyWallets';
  import Owners from './accounts/Owners';
  import Members from './accounts/Members';
  import CompaniesList from './companies/CompaniesList';
  import AccountPhones from './accounts/AccountPhones';
  import AccountSocialLinks from './accounts/AccountSocialLinks';
  import AccountAddresses from './accounts/AccountAddresses';

  export default {
    name: 'AccountProfile',
    components: {
      AccountAddresses,
      AccountSocialLinks,
      AccountPhones,
      CompaniesList,
      Members,
      Owners,
      MyWallets,
      AccountCard,
    },
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
      tab: {
        type: String,
      },
    },
    data() {
      return {
        accountCardTabs: [
          {
            name: 'wallets',
            label: 'Wallets',
            icon: 'sp:walletIcon_1',
          },
          {
            name: 'accounts',
            label: 'Accounts',
            icon: 'sp:personIcon_1',
          },
          {
            name: 'qb_connections',
            label: 'Quickbook Connections',
            icon: 'sp:quickBooksIcon',
          },
          {
            name: 'addresses',
            label: 'Addresses',
            icon: 'sp:location_icon',
          },
          {
            name: 'phone-numbers',
            label: 'Phone Numbers',
            icon: 'fas fa-phone-alt',
          },
          {
            name: 'social-links',
            label: 'Social Links',
            icon: 'sp:socialLinks',
          },
        ],
      };
    },
  };
</script>

<style scoped>

</style>
