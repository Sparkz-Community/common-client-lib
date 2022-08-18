<template>
  <q-dialog v-bind="$attrs">
    <q-card class="q-dialog-plugin q-pa-md text-center">
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <q-img v-if="!loading" :src="require('../../../assets/plaid.png')" alt="plaid"/>

      <q-spinner-grid v-else color="primary" size="xl"/>

      <q-card-section v-if="!loading" class="text-caption">
        <slot name="custom-message">

        </slot>
        Together with plaid, we make it easy for you to connect to your bank
      </q-card-section>
      <q-card-section v-else class="text-caption">
        Finalizing ...
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="between">
        <q-btn :disabled="loading" @click="emit('clear')" color="light" text-color="primary" outline label="Cancel"/>
        <plaid-link
          :clientName="account?.email"
          :env="environment"
          :link_token="linkToken"
          :products="products"
          webhook="https://requestb.in"
          :onSuccess="onSuccess"
          :onExit="onExit"
        >
          <q-btn :disabled="loading" color="primary" label="connect"/>
        </plaid-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import PlaidLink from 'vue-plaid-link2';
  import {ref, defineProps, defineEmits} from 'vue';
  import {useQuasar} from 'quasar';

  const $q = useQuasar();
  const emit = defineEmits(['clear', 'verified']);

  // props
  defineProps({
    linkToken: {
      type: String,
      required: true,
    },
    environment: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      default() {
        return ['auth'];
      },
    },
    data_to_tokenize: {
      type: Object,
      required: true,
    },
    stripe_publishable: {
      type: String,
      required: false,
    },
    account: {
      type: Object,
      required: true,
    },
  });

  //data
  let loading = ref(false);

  // methods

  async function onSuccess(token, metadata) {
    try {
      loading.value = true;
      emit('verified', {token, metadata});
      loading.value = false;
      emit('clear');
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: `Error on access token processing: ${e.message}.`,
      });
      loading.value = false;
      emit('clear');
    }
  }

  function onExit(err, metadata) {
    console.log({err, metadata});
    $q.notify({
      type: 'negative',
      message: 'Error initializing plaid connection.',
    });
    loading.value = false;
    emit('clear');
  }

</script>
