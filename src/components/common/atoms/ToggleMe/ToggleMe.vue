<!--<template>-->
<!--  <div id="ToggleMe">-->

<!--&lt;!&ndash;    <div class="relative-position non-selectable">&ndash;&gt;-->
<!--&lt;!&ndash;      <input id="cb10" type="checkbox">&ndash;&gt;-->
<!--&lt;!&ndash;      <label for="cb10"></label>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--  </div>-->
<!--</template>-->

<script>
  import ToggleMeMixin from './mixins/ToggleMeMixin';
  // import QIcon from './QIcon.js';

  export default {
    name: 'ToggleMe',
    mixins: [ToggleMeMixin],
    props: {
      icon: {type: String},
      checkedIcon: {type: String},
      uncheckedIcon: {type: String},
      checkedText: {type: String},
      uncheckedText: {type: String},
      indeterminateIcon: {type: String},

      iconColor: {type: String},
    },

    // watch: {
    //   $attrs: {
    //     immediate: true,
    //     deep: true,
    //     handler(newVal) {
    //       // attrs defaults
    //       switch (this.mode) {
    //         case 'acs-toggle': {
    //           this.$lset(newVal, 'label', this.$lget(newVal, 'label', ''));
    //           this.$lset(newVal, 'checkboxOffLabelColor', this.$lget(newVal, 'checkboxOffLabelColor', 'var(--q-color-dark)'));
    //
    //           this.$lset(newVal, 'disabled', this.$lget(newVal, 'disabled', false));
    //           if (this.$lget(newVal, 'indeterminate')) {
    //             this.$lset(newVal, 'indeterminate', this.$lget(newVal, 'indeterminate', true));
    //           }
    //
    //           this.$lset(newVal, 'data-tg-off', this.$lget(newVal, 'data-tg-off', 'NO'));
    //           this.$lset(newVal, 'data-tg-on', this.$lget(newVal, 'data-tg-on', 'YES'));
    //           this.$lset(newVal, 'data-tg-interm', this.$lget(newVal, 'data-tg-interm', '?'));
    //
    //           this.$lset(newVal, '--size-ratio', this.$lget(newVal, '--size-ratio', .25));
    //           this.$lset(newVal, '--border-radius', this.$lget(newVal, '--border-radius', '5vw'));
    //           this.$lset(newVal, '--height', this.$lget(newVal, '--height', '10vw'));
    //           this.$lset(newVal, '--thumb-text-color', this.$lget(newVal, '--thumb-text-color', 'white'));
    //           this.$lset(newVal, '--thumb-border-color-interm', this.$lget(newVal, '--thumb-border-color-interm', '#505557'));
    //           this.$lset(newVal, '--thumb-background-color-interm', this.$lget(newVal, '--thumb-background-color-interm', '#505557'));
    //           this.$lset(newVal, '--thumb-border-color-off', this.$lget(newVal, '--thumb-border-color-off', '#505557'));
    //           this.$lset(newVal, '--thumb-background-color-off', this.$lget(newVal, '--thumb-background-color-off', '#798184'));
    //           this.$lset(newVal, '--thumb-border-color-on', this.$lget(newVal, '--thumb-border-color-on', '#bebebe'));
    //           this.$lset(newVal, '--track-border-color-interm', this.$lget(newVal, '--track-border-color-interm', '#505557'));
    //           this.$lset(newVal, '--track-background-color-interm', this.$lget(newVal, '--track-background-color-interm', '#bebebe'));
    //           this.$lset(newVal, '--track-border-color-off', this.$lget(newVal, '--track-border-color-off', '#505557'));
    //           this.$lset(newVal, '--track-background-color-off', this.$lget(newVal, '--track-background-color-off', '#8f0615'));
    //           this.$lset(newVal, '--track-border-color-on', this.$lget(newVal, '--track-border-color-on', '#bebebe'));
    //           this.$lset(newVal, '--track-background-color-on', this.$lget(newVal, '--track-background-color-on', '#1e874a'));
    //
    //
    //           break;
    //         }
    //       }
    //     },
    //   },
    // },
    watch: {
      $props: {
        immediate: true,
        handler() {
          this.validateProps();
        },
      },
    },

    computed: {
      computedIcon() {
        return (
          this.isTrue === true
            ? this.checkedIcon
            : (this.isIndeterminate === true ? this.indeterminateIcon : this.uncheckedIcon)
        ) || this.icon;
      },

      computedIconColor() {
        if (this.isTrue === true) {
          return this.iconColor;
        } else {
          return null;
        }
      },
    },
    methods: {
      validateProps() {
        if ((this.checkedIcon && this.checkedText) || (this.uncheckedIcon && this.uncheckedText)) {
          throw new Error('Invalid props: overlapping props (checkedIcon, checkedText, or uncheckedIcon, uncheckedText');
        }
      },
      __getInner(h) {

        switch (this.mode) {
          case 'q-checkbox': {
            return [
              h('div', {
                staticClass: `${this.mode}__bg absolute`,
              }, [
                h('svg', {
                  staticClass: `${this.mode}__svg fit absolute-full`,
                  attrs: {focusable: 'false' /* needed for IE11 */, viewBox: '0 0 24 24', 'aria-hidden': 'true'},
                }, [
                  h('path', {
                    staticClass: `${this.mode}__truthy`,
                    attrs: {
                      fill: 'none',
                      d: 'M1.73,12.91 8.1,19.28 22.79,4.59',
                    },
                  }),

                  h('path', {
                    staticClass: `${this.mode}__indet`,
                    attrs: {
                      d: 'M4,14H20V10H4',
                    },
                  }),
                ]),
              ]),
            ];
          }
          case 'q-toggle': {
            return [
              h('div', {staticClass: `${this.mode}__track`}),

              h('div', {staticClass: `${this.mode}__thumb absolute flex flex-center no-wrap`}, this.computedIcon !== void 0
                ? [
                  h('QIcon', {
                    props: {
                      name: this.computedIcon,
                      color: this.computedIconColor,
                    },
                  }),
                ]
                : void 0,
              ),
            ];
          }
          case 'acs-toggle': {
            let {style: trackStyle = {}, 'class': trackClasses = {}} = this.$lget(this.$attrs, ['attrs-track'], {});
            let {style: thumbStyle = {}, 'class': thumbClasses = {}} = this.$lget(this.$attrs, ['attrs-thumb'], {});
            let {
              style: thumbTextStyle = {},
              'class': thumbTextClasses = {},
            } = this.$lget(this.$attrs, ['attrs-thumb-text'], {});

            return [
              h('div',
                {
                  style: typeof trackStyle === 'string' ? trackStyle : {
                    '--track-background-color-interm': this.$lget(this.$attrs, '--track-background-color-interm', '#bebebe'),
                    '--track-background-color-off': this.$lget(this.$attrs, '--track-background-color-falsy', '#8f0615'),
                    '--track-border-color-falsy': this.$lget(this.$attrs, '--track-border-color-falsy', '#505557'),
                    ...trackStyle,
                  },
                  class: typeof trackClasses === 'string' ? trackClasses : {
                    ...trackClasses,
                  },
                  attrs: this.$lget(this.$attrs, ['attrs-track'], {}),
                  staticClass: `${this.mode}__track`,
                },
              ),

              h('div',
                {
                  style: typeof thumbStyle === 'string' ? thumbStyle : {
                    '--thumb-background-color-interm': this.$lget(this.$attrs, '--thumb-background-color-interm', '#bebebe'),
                    '--thumb-background-color-falsy': this.$lget(this.$attrs, '--thumb-background-color-falsy', '#8f0615'),
                    '--thumb-border-color-falsy': this.$lget(this.$attrs, '--thumb-border-color-falsy', '#505557'),
                    ...thumbStyle,
                  },
                  class: typeof thumbClasses === 'string' ? thumbClasses : {
                    ...thumbClasses,
                  },
                  attrs: this.$lget(this.$attrs, ['attrs-thumb'], {}),
                  staticClass: `${this.mode}__thumb absolute flex flex-center no-wrap`,
                },
                this.computedIcon !== void 0
                  ? [
                    h('QIcon', {
                      props: {
                        name: this.computedIcon,
                        color: this.computedIconColor,
                      },
                    }),
                  ]
                  : (this.checkedText || this.uncheckedText) ? [
                    h('div', {
                        style: typeof thumbTextStyle === 'string' ? thumbTextStyle : {
                          ...thumbTextStyle,
                        },
                        class: typeof thumbTextClasses === 'string' ? thumbTextClasses : {
                          ...thumbTextClasses,
                        },
                        attrs: this.$lget(this.$attrs, ['attrs-thumb-text'], {}),
                        staticClass: `${this.mode}__thumb-text flex flex-center no-wrap`,
                      },
                      this.isTrue ? this.checkedText : '' || this.isFalse ? this.uncheckedText : '',
                    ),
                  ] : void 0,
              ),
            ];
          }
        }


      },
    },

  };
</script>

<style scoped lang="scss" src="./_ToggleMe.scss"></style>
