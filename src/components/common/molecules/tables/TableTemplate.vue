<template>
  <div>
    <slot v-if="openAddForm" name="form">

    </slot>

    <q-table
      dense
      v-else
      flat
      :filter="filter"
      v-bind="$attrs">

      <template v-slot:top-left>
        <div class="row q-gutter-sm q-mx-md items-center justify-center">

            <slot name="title">
              <div  class="row q-gutter-sm items-center justify-center text-h3">
                {{title}}
              </div>
            </slot>

          <slot name="top-left-controls">

          </slot>
        </div>
      </template>

      <template v-slot:top-right="scope">
        <div class="row q-gutter-sm q-mx-md items-center justify-center">

          <q-input   dense debounce="300" :model-value="filter" @update:model-value="filterHandler" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <slot name="top-right-controls" v-bind="scope">

          </slot>
        </div>
      </template>





      <template  v-for="(_, slot) of $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>


    </q-table>
    <slot name="after-table">

    </slot>
  </div>
</template>

<script>

  export default {
    name: 'table-template',

    props:{
      title:String,
      openAddForm:{
        type:Boolean,
        default: false,
      },
    },

    emits: [
      'filter',
    ],

    data () {
      return {
        showRow:false,
        filter: ''
      };
    },

    methods: {
      filterHandler(value){
        this.filter=value;
        this.$emit('filter',value);
      }
    }

  };
</script>
<style lang="scss" scoped>

</style>
