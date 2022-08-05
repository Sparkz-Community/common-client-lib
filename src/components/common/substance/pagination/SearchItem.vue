<template>
  <div style="width: 100%">
    <q-input
      v-bind="searchAttrs"
      @keyup.enter="$emit('search', value)"
      @input="$emit('input', $event)"
      :value="value"
      clearable
      @clear="$emit('clear')">
      <template v-slot:prepend>
        <q-btn style="transition: all .4s ease-out"
               round
               :flat="!value || !value.length"
               :color="$lget(searchAttrs, 'color')"
               @click="$emit('search', value)"
               :push="value && typeof value !== 'undefined'"
               icon="mdi-magnify"/>
      </template>
    </q-input>
  </div>
</template>

<script>
  export default {
    name: 'SearchItem',
    props: {
      searchAttrs: {
        type: Object,
        default: () => {
          return {
            placeholder: 'Search...',
            color: 'dark',
            outlined: true,
            rounded: true
          };
        }
      },
      value: String
    },
  };
</script>
