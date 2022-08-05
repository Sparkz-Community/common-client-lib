<template>
  <div class="column justify-center items-start">
    <div class=" text-bold text-uppercase">{{ label}}</div>
    <q-btn no-caps color="dark" className="q-pa-xs" outline v-bind="$attrs.button">
      <div class="text-xs">New</div>
      <q-icon v-if="icon" right size="1em" :name="icon"/>
    </q-btn>
  </div>
</template>

<script>

  export default {
    name: 'table-header',
    props: {
      label: {
        type: String,
      },
      icon: {
        type: String,
      }
    },
  };
</script>
