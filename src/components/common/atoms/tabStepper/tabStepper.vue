<template>
  <div id="TabStepper">
    <div class="__tab_stepper" :style="tabStyle">
      <div v-for="(tab, i) in tabs"
           :key="`tab-${i}`"
           @mouseenter="hover = i"
           @mouseleave="hover = -1"
           @touchstart="hover = i"
           @touchend="hover = -1"
           :style="hover === i ? {background: 'rgba(0,0,0,.1)'} : {}"
           :class="`__tab_text flex flex-center text-${isActive(i, tab) ? useTextColor : 'ir-grey-7'}`"
           @click="handleEmit(i, tab)"
      >
        <q-tooltip v-if="tab.tooltip">{{ tab.tooltip }}</q-tooltip>
        <div class="flex items-center">
          <q-avatar class="q-mr-xs" v-if="tab.avatar" size="32px">
            <img :src="tab.avatar">
          </q-avatar>
          <q-icon size="22px" v-if="tab.icon && !tab.avatar" :name="tab.icon"
                  :color="isActive(i, tab) ? useTextColor : 'ir-grey-7'" class="q-mx-sm"></q-icon>
          <div class="text-weight-medium" v-if="!noLabel">
            {{ tab.label }}
            <q-tooltip v-if="noLabel">{{ tab.label }}</q-tooltip>
          </div>
        </div>
      </div>
      <div
        v-for="(tab, idx) in tabs" :key="`tab-progress-${idx}`" class="__progress_bar"
        @click="handleEmit(idx, tab)"
      >
        <div
          :class="`bg-${useTrackColor} ${progress ? '__progress_fill' : '__tab_fill'}`"
          :style="{
          height: '8px',
          right: progress ? valueIdx >= idx ? 0 : '100%' : 'auto',
          width: !progress ? isActive(idx, tab) ? '100%' : 0 : 'undefined',
          borderRadius: idx === 0 ? '8px 0 0 8px' : idx === tabs.length -1 ? '0 8px 8px 0' : 'none'
        }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabStepper',
    props: {
      emitValue: Boolean,
      optionValue: {
        type: String,
        default: 'value',
      },
      noLabel: Boolean,
      progress: {
        type: Boolean,
        default: true,
      },
      color: {
        type: String,
        default: 'primary',
      },
      textColor: String,
      trackColor: String,
      modelValue: {required: true},
      tabs: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    emits: [
      'update:modelValue',
    ],
    data() {
      return {
        hover: -1,
      };
    },
    computed: {
      valueIdx(){
        return this.emitValue ? this.tabs.map(a => a[this.optionValue]).indexOf(this.modelValue) : this.modelValue;
      },
      useTrackColor() {
        return this.trackColor ? this.trackColor : this.color;
      },
      useTextColor() {
        return this.textColor ? this.textColor : this.color;
      },
      tabStyle() {
        return {
          gridTemplateColumns: `repeat(${this.tabs.length},  1fr)`,
        };
      },
    },
    methods: {
      handleEmit(i, tab) {
        let val = this.emitValue ? tab[this.optionValue] : i;
        this.$emit('update:modelValue', val);
      },
      isActive(i, tab) {
        let val = this.emitValue ? tab[this.optionValue] : i;
        return this.modelValue === val;
      },
    },
  };
</script>

<style scoped lang="scss" src="./_tabStepper.scss">

</style>
