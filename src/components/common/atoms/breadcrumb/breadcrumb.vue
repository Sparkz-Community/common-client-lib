<template>
  <div class="flex items-center">
    <div v-for="(str, i) in useList" :key="`str-${i}`" :class="`text-${size} text-mb-${mbSize} flex items-center cursor-pointer`" @click="$emit('input', str)">
      <div>{{limitStr(str.text, letterLimit, '..')}}</div>
      <q-icon v-if="!!list[i + 1]" :name="icon" :size="iconSize[size]"></q-icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'breadcrumb',
    props: {
      icon: { type: String, default: 'mdi-chevron-right' },
      limit: { type: Number, default: 3 },
      letterLimit: { type: Number, default: 35 },
      list: Array,
      size: { type: String, default: 'xxs' },
      mobileSize: { type: String }
    },
    computed: {
      useList(){
        if(this.list && this.list.length > this.limit){
          return this.list.slice(this.list.length - (this.limit + 1));
        } else return this.list;
      },
      mbSize(){
        return this.mobileSize ? this.mobileSize : this.size;
      },
      iconSize(){
        return {
          'xs': '15',
          'sm': '18',
          'md': '24',
          'lg': '32',
          'xl': '40'
        };
      }
    },
    methods: {
      limitStr(string, limit, append) {
        let apnd = append ? append : [false, null].includes(append) ? '' : '...';
        let appendLength = apnd ? JSON.stringify(apnd).length : 0;
        let stringLength = (string && typeof string === 'string') ? string.length : 0;
        if (limit && stringLength && stringLength > limit) {
          return string.substring(0, limit - appendLength) + apnd;
        } else return string;
      }
    }
  };
</script>

<style scoped>

</style>
