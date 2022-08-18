<template>
  <div class="q-pa-none credit-card-field-wrapper">
    <slot name="control">
      <div class="row">
        <q-input mask="#### #### #### ####" v-model="card.number" max="19" type="text"
                 placeholder="CARD NUMBER"
                 dense flat filled square
                 input-class="text-grey-8 q-ma-sm"
                 label-col="grey-6"
                 class="col-6 col-xs-12"
                 :rules="[validateCardNo]"
        >
          <template #prepend>
            <q-icon :name="brand" class="credit-card-field-icon" width="23.33" height="20"/>
          </template>
        </q-input>
        <div class="col-6 col-xs-12 row">
          <q-input v-model="card.expiration" type="text"
                   mask="##/##"
                   dense flat filled square
                   input-class="text-grey-8 text-center"
                   placeholder="MM/YY" maxlength="7" class="col"
                   lazy-rules
                   :rules="[validateExpirationDate]"
          />
          <q-input v-model="card.cvc" type="text" placeholder="CVC"
                   mask="###"
                   dense outline filled square
                   input-class="text-grey-8 text-center"
                   autocomplete="off" class="col"
                   lazy-rules
                   :rules="[validateCvc]"
          />
          <q-input v-model="card.postalCode"
                   mask="#####"
                   dense flat filled square
                   input-class="text-grey-8 text-center"
                   max="5" type="text" placeholder="ZIP" maxlength="5"
                   class="col"
                   lazy-rules
                   :rules="[validatePostalCode]"
          />
        </div>
        <div class="q-px-md text-grey-8 text-caption">No monthly fees, no set up fee: You pay a transaction fee of <span
          class="text-bold">1.9% + $0.10</span></div>

      </div>
    </slot>
  </div>
</template>

<script setup>
  import validator from 'card-validator';
  import {computed, onUpdated, reactive, ref, watch, defineEmits} from 'vue';

  const emit = defineEmits(['tokenize']);

  let brand = ref('fas fa-credit-card');
  let card = reactive({
    brand: null,
    number: null,
    expiration: null,
    cvc: null,
    postalCode: null,
  });

  // the watcher

  watch(() => card, (currentValue) => {
          const numberValidation = validator.number(currentValue.number);
          if (numberValidation.card) {
            switch (numberValidation.card.type) {
              case 'jcb':
                brand.value = 'fab fa-cc-jcb';
                break;
              case 'visa':
                brand.value = 'fab fa-cc-visa';
                break;
              case 'american-express':
                brand.value = 'fab fa-cc-amex';
                break;
              case 'diners-club':
                brand.value = 'fab fa-cc-diners-club';
                break;
              case 'discover':
                brand.value = 'fab fa-cc-discover';
                break;
              case 'mastercard':
                brand.value = 'fab fa-cc-mastercard';
                break;
              default:
                brand.value = 'far fa-credit-card';
            }
          } else {
            brand.value= 'fas fa-credit-card';
          }
        },
        {deep: true},
  );

  // the computed

  let validCard = computed(function () {
    const validCardNo = validator.number(card.number).isValid;
    const validCardExpDate = validator.expirationDate(card.expiration).isValid;
    const validCardCVC = validator.cvv(card.cvc).isValid;
    const validPostalCode = validator.postalCode(card.postalCode).isValid;
    return validCardNo && validCardExpDate && validCardCVC && validPostalCode;
  });

  //life cycle hook
  onUpdated(function (){
    if(validCard.value){
      emit('tokenize',card);
    }
  });

  // the methods
  function validateCardNo(value) {
    return validator.number(value).isPotentiallyValid;
  }

  function validateCvc(value) {
    return validator.cvv(value).isValid;
  }

  function validatePostalCode(value) {
    return validator.postalCode(value).isValid;
  }

  function validateExpirationDate(value) {
    return validator.expirationDate(value).isValid;
  }

</script>
<style lang="scss" scoped>

</style>
