<template>
  <div class="media">
    <pre v-text="$attrs"/>
  </div>
</template>

<script>
  import mediaMixin from './mixins/mediaMixin';

  export default {
    name: 'Media',
    mixins: [mediaMixin()],
  };
</script>
