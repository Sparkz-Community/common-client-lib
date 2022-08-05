<template>
  <div id="draggable-resizable-testing">
    <draggable-resizable></draggable-resizable>
  </div>
</template>

<script>

  export default {
    name: 'DraggableResizableTesting',
    components: {
      draggableResizable: () => import('@iy4u/common-client-lib').then(module => module.draggableResizable)
    },
  };
</script>

<style scoped>
  #draggable-resizable-testing {
  }
</style>
