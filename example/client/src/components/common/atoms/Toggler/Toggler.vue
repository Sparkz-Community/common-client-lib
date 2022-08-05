<template>
  <div id="toggler" :style="$attrs['toggler']">

    <div class="tgl-wrapper" v-bind="$attrs['wrapper-attrs']">
      <div v-if="mode === 'acs'" :class="mode" :style="$attrs[mode]">

        <component :is="headerLabelElement" v-bind="$attrs[mode]['header-label-attrs']">
          {{ $lget($attrs, `${mode}.header-label-attrs.label`) }}
        </component>
        {{ $attrs[mode]['input-attrs'] }}
        <input class="tgl tgl-input"
               id="cb10"
               type="checkbox"
               style="opacity: 1;"
               v-bind="$attrs[mode]['input-attrs']"
               @click="handleClick"/>
        <label class="tgl-btn tgl-btn-text"
               for="cb10"
               v-bind="$attrs[mode]['label-attrs']">
<!--          <i :class="currentState === null ? '' : currentState ? 'far fa-play-circle' : 'far fa-stop-circle'"></i>-->
        </label>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Toggler',
    inheritAttrs: false,
    props: {
      mode: {
        type: String,
        required: true,
      },
      defaultChecked: {
        type: Boolean,
        default() {
          return true;
        }
      },
      enableIndeterminate: {
        type: Boolean,
        default() {
          return false;
        }
      },
      headerLabelElement: {
        type: String,
        default: 'h4',
      },
    },
    data() {
      return {
        checkbox: undefined,
        indeterminate: this.$lget(this.$attrs, `${this.mode}.input-attrs.indeterminate`),
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          switch (this.mode) {
            case 'acs': {
              this.$lset(newVal, `${this.mode}.header-label-attrs.label`, this.$lget(newVal, `${this.mode}.header-label-attrs.label`, ''));
              this.$lset(newVal, `${this.mode}.header-label-attrs.checkboxOffLabelColor`, this.$lget(newVal, `${this.mode}.header-label-attrs.checkboxOffLabelColor`, 'var(--q-color-dark)'));

              this.$lset(newVal, `${this.mode}.input-attrs.disabled`, this.$lget(newVal, `${this.mode}.input-attrs.disabled`, false));
              if (this.$lget(newVal, `${this.mode}.input-attrs.indeterminate`)) {
                // this.$lset(newVal, `${this.mode}.input-attrs.readOnly`, this.$lget(newVal, `${this.mode}.input-attrs.readOnly`, true));
                this.$lset(newVal, `${this.mode}.input-attrs.indeterminate`, this.$lget(newVal, `${this.mode}.input-attrs.indeterminate`, true));
              }
              // this.$lset(newVal, `${this.mode}.input-attrs.defaultChecked`, this.$lget(newVal, `${this.mode}input-attrs.defaultChecked`, this.defaultChecked || 'false'));

              this.$lset(newVal, `${this.mode}.label-attrs.data-tg-off`, this.$lget(newVal, `${this.mode}.label-attrs.data-tg-off`, 'NO'));
              this.$lset(newVal, `${this.mode}.label-attrs.data-tg-on`, this.$lget(newVal, `${this.mode}.label-attrs.data-tg-on`, 'YES'));
              this.$lset(newVal, `${this.mode}.label-attrs.data-tg-interm`, this.$lget(newVal, `${this.mode}.label-attrs.data-tg-interm`, '?'));

              this.$lset(newVal, `${this.mode}.--size-ratio`, this.$lget(newVal, `${this.mode}.--size-ratio`, .25));
              this.$lset(newVal, `${this.mode}.--border-radius`, this.$lget(newVal, `${this.mode}.--border-radius`, '5vw'));
              this.$lset(newVal, `${this.mode}.--height`, this.$lget(newVal, `${this.mode}.--height`, '10vw'));
              this.$lset(newVal, `${this.mode}.--toggle-text-color`, this.$lget(newVal, `${this.mode}.--toggle-text-color`, 'white'));
              this.$lset(newVal, `${this.mode}.--toggle-border-color-interm`, this.$lget(newVal, `${this.mode}.--toggle-border-color-interm`, '#505557'));
              this.$lset(newVal, `${this.mode}.--toggle-background-color-interm`, this.$lget(newVal, `${this.mode}.--toggle-background-color-interm`, '#505557'));
              this.$lset(newVal, `${this.mode}.--toggle-border-color-off`, this.$lget(newVal, `${this.mode}.--toggle-border-color-off`, '#505557'));
              this.$lset(newVal, `${this.mode}.--toggle-background-color-off`, this.$lget(newVal, `${this.mode}.--toggle-background-color-off`, '#798184'));
              this.$lset(newVal, `${this.mode}.--toggle-border-color-on`, this.$lget(newVal, `${this.mode}.--toggle-border-color-on`, '#bebebe'));
              this.$lset(newVal, `${this.mode}.--switch-border-color-interm`, this.$lget(newVal, `${this.mode}.--switch-border-color-interm`, '#505557'));
              this.$lset(newVal, `${this.mode}.--switch-background-color-interm`, this.$lget(newVal, `${this.mode}.--switch-background-color-interm`, '#bebebe'));
              this.$lset(newVal, `${this.mode}.--switch-border-color-off`, this.$lget(newVal, `${this.mode}.--switch-border-color-off`, '#505557'));
              this.$lset(newVal, `${this.mode}.--switch-background-color-off`, this.$lget(newVal, `${this.mode}.--switch-background-color-off`, '#8f0615'));
              this.$lset(newVal, `${this.mode}.--switch-border-color-on`, this.$lget(newVal, `${this.mode}.--switch-border-color-on`, '#bebebe'));
              this.$lset(newVal, `${this.mode}.--switch-background-color-on`, this.$lget(newVal, `${this.mode}.--switch-background-color-on`, '#1e874a'));


              break;
            }
          }
        },
      },
    },
    computed: {
      checkedValue: {
        get() {
          return this.defaultChecked;
        },
        set(newValue) {
          this.currentState = newValue;
        },
      },
    },
    mounted() {
      this.checkbox = document.getElementById('cb10');
      this.$watch('value', (newVal) => {
        if (this.value === null) {
          if (this.enableIndeterminate) {
            this.indeterminate = this.checkbox.indeterminate = true;
          }
          this.checkbox.checked = false;
        } else {
          this.checkbox.checked = newVal;
        }
      }, { immediate: true});
    },
    methods: {
      handleClick() {
        if (this.checkbox.checked && !this.indeterminate) {
          this.checkbox.checked = false;
          if (this.enableIndeterminate) {
            this.indeterminate = this.checkbox.indeterminate = true;
          }
          this.$emit('input', null);
        } else if (this.checkbox.checked) {
          if (this.enableIndeterminate) {
            this.indeterminate = false;
          }
          this.$emit('input', this.checkbox.checked);
        } else {
          this.$emit('input', this.checkbox.checked);
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_Toggler.scss"></style>

<!--// unchecked, going indeterminate-->
<!--case 0:-->
<!--el.data('checked',1);-->
<!--el.prop('indeterminate',true);-->
<!--break;-->

<!--// indeterminate, going checked-->
<!--case 1:-->
<!--el.data('checked',2);-->
<!--el.prop('indeterminate',false);-->
<!--el.prop('checked',true);-->
<!--break;-->

<!--// checked, going unchecked-->
<!--default:-->
<!--el.data('checked',0);-->
<!--el.prop('indeterminate',false);-->
<!--el.prop('checked',false);-->

<!--}-->
