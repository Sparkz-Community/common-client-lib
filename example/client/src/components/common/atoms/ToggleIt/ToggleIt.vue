<template>
  <div id="toggle-it">

    <div v-if="mode === 'light'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <component :is="headerLabelElement ? headerLabelElement : 'h4'" v-bind="$attrs['headerLabelAttrs']">{{ label }}</component>
      <input class="tgl tgl-light"
             :disabled="disabled"
             id="cb1"
             type="checkbox"
             v-bind="$attrs['inputAttrs']"
             :value="value"
             @input="$emit('input', $event)"/>
      <label class="tgl-btn" for="cb1" v-bind="$attrs['labelAttrs']"></label>
    </div>


    <div v-if="mode === 'ios'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <h4>{{ label }}</h4>
      <input class="tgl tgl-ios"
             :disabled="disabled"
             id="cb2"
             type="checkbox"
             v-bind="$attrs['inputAttrs']"
             :value="value"
             @input="$emit('input', $event)"/>
      <label class="tgl-btn" for="cb2"></label>
    </div>


    <div v-if="mode === 'skewed'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <h4>{{ label }}</h4>
      <input class="tgl tgl-skewed"
             :disabled="disabled"
             id="cb3"
             type="checkbox"
             v-bind="$attrs['inputAttrs']"
             :value="value"
             @input="$emit('input', $event)"/>
      <label class="tgl-btn" :data-tg-off="checkboxOffLabel ? checkboxOffLabel : 'OFF'"
             :data-tg-on="checkboxOffLabel ? checkboxOffLabel : 'ON'" for="cb3"></label>
    </div>


    <div v-if="mode === 'flat'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <h4>{{ label }}</h4>
      <input class="tgl tgl-flat"
             :disabled="disabled"
             id="cb4"
             type="checkbox"
             v-bind="$attrs['inputAttrs']"
             :value="value"
             @input="$emit('input', $event)"/>
      <label class="tgl-btn" for="cb4"></label>
    </div>


    <div v-if="mode === 'flip'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <h4>{{ label }}</h4>
      <input class="tgl tgl-flip"
             :disabled="disabled"
             id="cb5"
             type="checkbox"
             v-bind="$attrs['inputAttrs']"
             :value="value"
             @input="$emit('input', $event)"/>
      <label class="tgl-btn" :data-tg-off="checkboxOffLabel ? checkboxOffLabel : 'Nope'"
             :data-tg-on="checkboxOnLabel ? checkboxOnLabel : 'Yeah!'" for="cb5"></label>
    </div>


    <div v-if="mode === 'rocker'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <div class="rocker">
        <h4>{{ label }}</h4>
        <label class="tgl-btn" :data-tg-off="checkboxOffLabel ? checkboxOffLabel : 'OFF'"
               :data-tg-on="checkboxOnLabel ? checkboxOnLabel : 'ON'" for="cb6">
          <input class="tgl tgl-rocker"
                 :disabled="disabled"
                 id="cb6"
                 type="checkbox"
                 v-bind="$attrs['inputAttrs']"
                 :value="value"
                 @input="$emit('input', $event)"/>
          <span class="switch-left">{{ checkboxOnLabel ? checkboxOnLabel : 'Yes' }}</span>
          <span class="switch-right">{{ checkboxOffLabel ? checkboxOffLabel : 'No' }}</span>
        </label>
      </div>
    </div>


    <div v-if="mode === 'check'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <h4>{{ label }}</h4>
      <input class="tgl tgl-check"
             :disabled="disabled"
             id="cb7"
             type="checkbox"
             v-bind="$attrs['inputAttrs']"
             :value="value"
             @input="$emit('input', $event)"/>
      <label class="tgl-btn" for="cb7">
        <span class="check-handler"></span>
      </label>
    </div>

    <div v-if="mode === 'teeter-totter'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <div class="teeter-totter">
        <h4>{{ label }}</h4>
        <div class="checkbox">
          <input type="checkbox"
                 name="teeter-totter"
                 id="cb8"
                 :disabled="disabled"
                 v-bind="$attrs['inputAttrs']"
                 :value="value"
                 @input="$emit('input', $event)"/>
          <div class="checkbox-inner">
            <label for="cb8"></label>
            <span></span>
          </div>
          <div class="checkbox__on">{{ checkboxOnLabel ? checkboxOnLabel : 'ON' }}</div>
          <div class="checkbox__off">{{ checkboxOnLabel ? checkboxOnLabel : 'OFF' }}</div>
        </div>
      </div>
    </div>

    <div v-if="mode === 'round-switch'" class="tgl-wrapper" v-bind="$attrs['wrapperAttrs']">
      <div class="round-switch">
        <div class="round">
          <input type=checkbox
                 id=cb9
                 name=onoff
                 :disabled="disabled"
                 v-bind="$attrs['inputAttrs']"
                 :value="value"
                 @input="$emit('input', $event)"/>
          <div class=back>
            <label class=but for=cb9>
              <span class=on>{{ checkboxOnLabel ? checkboxOnLabel : 'I' }}</span>
              <span class=off>{{ checkboxOffLabel ? checkboxOffLabel : 'O' }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Toggleit',
    inheritAttrs: false,
    props: {
      mode: {
        type: String,
        required: false,
        default: 'round-switch',
      },
      options: {
        type: Object,
        required: false,
      },
      headerLabelElement: {
        type: String
      },
      label: {
        type: String,
        required: false,
      },
      checkboxOnLabel: {
        type: String,
        required: false,
      },
      checkboxOffLabel: {
        type: String,
        required: false,
      },
      defaultState: {
        type: Boolean,
        default: false,
        required: false,
      },
      disabled: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    data() {
      return {
        currentState: this.defaultState,
        selected: false,
        selectedItem: 'unknown',
        defaultOptions: [
          {
            id: 'teeter-totter',
            preSelected: 'unknown',
            disabled: false,
            layout: {
              color: undefined,
              backgroundColor: undefined,
              selectedColor: undefined,
              selectedBackgroundColor: undefined,
              borderColor: undefined,
              fontFamily: 'Arial',
              fontWeight: 'normal',
              fontWeightSelected: 'bold',
            },
            animation: {
              delay: undefined,
              duration: undefined,
              transform: undefined,
            },
            size: {
              fontSize: undefined,
              height: undefined,
              padding: undefined,
              width: undefined,
            },
            labels: [
              {name: 'OFF', color: 'white', backgroundColor: 'red', 'font-family': 'sans-serif'},
              {name: 'ON', color: 'white', backgroundColor: 'green', 'font-family': 'sans-serif'},
            ],
          },
          {
            id: 'check',
            delay: 0.4,
            preSelected: 'unknown',
            disabled: false,
            labels: [
              {name: 'OFF', color: 'white', backgroundColor: 'red', 'font-family': 'sans-serif'},
              {name: 'ON', color: 'white', backgroundColor: 'green', 'font-family': 'sans-serif'},
            ],
          },
        ],
      };
    },
    computed: {
      isActive() {
        return this.currentState;
      },

      checkedValue: {
        get() {
          return this.currentState;
        },
        set(newValue) {
          this.currentState = newValue;
          this.$emit('change', newValue);
        },
      },
    },
    watch: {
      options(val) {
        if (val !== null && val !== undefined) {
          this.mergeDefaultOptionsWithProp(val);
        }
      },
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          if (this.mode) {
            this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));
          }
          this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));
          this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));
          this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));

        }
      },
    },
    methods: {
      mergeDefaultOptionsWithProp(options) {
        var result = this.defaultOptions;
        for (var option in options) {
          if (options[option] !== null && typeof (options[option]) === 'object') {
            for (var subOption in options[option]) {
              if (options[option][subOption] !== undefined && options[option][subOption] !== null) {
                result[option][subOption] = options[option][subOption];
              }
            }
          } else {
            result[option] = options[option];
          }
        }
      },
    },

  };
</script>

<style scoped lang="scss" src="./_ToggleIt.scss"></style>
