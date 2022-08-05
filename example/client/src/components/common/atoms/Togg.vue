<template>
  <div id="togg">
    <div class="tgl-wrapper" v-bind="$attrs['wrapper-attrs']">
      <div v-if="mode === 'acs'" :class="mode" :style="$attrs[mode]">
        <input id="cb10"
               ref="checkbox"
               type="checkbox"
               @click="handleClick"/>
        <label class="tgl-btn tgl-btn-text"
               for="cb10"
               v-bind="$lget($attrs, 'mode.label-attrs')"
        ></label>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Togg',
    props: ['value', 'mode'],
    data() {
      return {
        checkbox: undefined,
        indeterminate: undefined,
      };
    },
    mounted() {
      this.checkbox = this.$refs['checkbox'];
      this.$watch('value', (newVal) => {
        if (this.value === null) {
          this.indeterminate = this.checkbox.indeterminate = true;
          this.checkbox.checked = false;
        } else {
          this.checkbox.checked = newVal;
        }
      }, {immediate: true});
    },
    methods: {
      handleClick() {
        if (this.checkbox.checked && !this.indeterminate) {
          this.checkbox.checked = false;
          this.indeterminate = this.checkbox.indeterminate = true;
          this.$emit('input', null);
        } else if (this.checkbox.checked) {
          this.indeterminate = false;
          this.$emit('input', this.checkbox.checked);
        } else {
          this.$emit('input', this.checkbox.checked);
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  #togg {

  }
</style>
