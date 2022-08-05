import {DarkMixin} from '../../../../../mixins';

import FormMixin from './form.js';
import OptionSizeMixin from './option-size.js';
import RefocusTargetMixin from './refocus-target.js';
import {slot, mergeSlot, enumValues} from '../../../../../utils';

export default {
  mixins: [DarkMixin, OptionSizeMixin, RefocusTargetMixin, FormMixin],
  inheritAttrs: false,

  props: {
    value: {
      required: true,
      default: null,
    },
    val: {},
    mode: {
      type: String,
      default: 'q-checkbox',
      validator: enumValues(['q-checkbox', 'q-toggle', 'acs-toggle']),
    },
    trueValue: {default: true},
    falseValue: {default: false},
    indeterminateValue: {default: null},

    toggleOrder: {
      type: String,
      validator: v => v === 'tf' || v === 'ft',
    },
    toggleIndeterminate: Boolean,

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number],
  },

  computed: {
    isTrue() {
      return this.modelIsArray === true
        ? this.index > -1
        : this.value === this.trueValue;
    },

    isFalse() {
      return this.modelIsArray === true
        ? this.index === -1
        : this.value === this.falseValue;
    },

    isIndeterminate() {
      return this.isTrue === false && this.isFalse === false;
    },

    index() {
      if (this.modelIsArray === true) {
        return this.value.indexOf(this.val);
      }
    },

    modelIsArray() {
      return this.val !== void 0 && Array.isArray(this.value);
    },

    computedTabindex() {
      return this.disable === true ? -1 : this.tabindex || 0;
    },

    classes() {
      return `${this.mode} cursor-pointer no-outline row inline no-wrap items-center` +
        (this.disable === true ? ' disabled' : '') +
        (this.isDark === true ? ` ${this.mode}--dark` : '') +
        (this.dense === true ? ` ${this.mode}--dense` : '') +
        (this.leftLabel === true ? ' reverse' : '');
    },

    innerClass() {
      const state = this.isTrue === true ? 'truthy' : (this.isFalse === true ? 'falsy' : 'indet');
      const color = this.color !== void 0 && (
        this.keepColor === true ||
        (this.type === 'toggle' ? this.isTrue === true : this.isFalse !== true)
      )
        ? ` text-${this.color}`
        : '';

      return `${this.mode}__inner--${state}${color}`;
    },

    formAttrs() {
      const prop = {type: 'checkbox'};

      this.name !== void 0 && Object.assign(prop, {
        checked: this.isTrue,
        name: this.name,
        value: this.modelIsArray === true
          ? this.val
          : this.trueValue,
      });

      return prop;
    },

    attrs() {
      // eslint-disable-next-line no-unused-vars
      let {style, 'class': classes, ...$attrs} = this.$lget(this.$attrs, ['attrs'], {});;
      const attrs = {
        ...$attrs,
        tabindex: this.computedTabindex,
        role: 'checkbox',
        'aria-label': this.label,
        'aria-checked': this.isIndeterminate === true
          ? 'mixed'
          : (this.isTrue === true ? 'true' : 'false'),
      };

      if (this.disable === true) {
        attrs['aria-disabled'] = 'true';
      }

      return attrs;
    },
  },

  methods: {
    toggle(e) {
      if (this.disable !== true) {
        this.$emit('input', this.getNext(), e);
      }
    },

    getNext() {
      if (this.modelIsArray === true) {
        if (this.isTrue === true) {
          const val = this.value.slice();
          val.splice(this.index, 1);
          return val;
        }

        return this.value.concat([this.val]);
      }

      if (this.isTrue === true) {
        if (this.toggleOrder !== 'ft' || this.toggleIndeterminate === false) {
          return this.falseValue;
        }
      } else if (this.isFalse === true) {
        if (this.toggleOrder === 'ft' || this.toggleIndeterminate === false) {
          return this.trueValue;
        }
      } else {
        return this.toggleOrder !== 'ft'
          ? this.trueValue
          : this.falseValue;
      }

      return this.indeterminateValue;
    },

    doOnKeyup(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.toggle(e);
      }
    },
  },

  render(h) {
    const inner = this.__getInner(h);

    this.disable !== true && this.__injectFormInput(
      inner,
      'unshift',
      `${this.mode}__native absolute q-ma-none q-pa-none`,
    );

    let {style: innerStyle = this.sizeStyle, 'class': innerClasses = this.innerClass} = this.$lget(this.$attrs, ['attrs-inner'], {});
    const child = [
      h('div', {
        style: typeof innerStyle === 'string' ? innerStyle : {
          ...innerStyle,
        },
        class: typeof innerClasses === 'string' ? innerClasses : {
          ...innerClasses,
        },
        attrs: this.$lget(this.$attrs, ['attrs-inner'], {}),
        staticClass: `${this.mode}__inner relative-position non-selectable`,
        // class: this.innerClass,
        // style: this.sizeStyle,
      }, inner),
    ];

    if (this.__refocusTargetEl !== void 0) {
      child.push(this.__refocusTargetEl);
    }

    const label = this.label !== void 0
      ? mergeSlot([this.label], this, 'default')
      : slot(this, 'default');

    let {style: labelStyle = {}, 'class': labelClasses = {}} = this.$lget(this.$attrs, ['attrs-label'], {});
    label !== void 0 && child.push(
      h('div', {
        style: typeof labelStyle === 'string' ? labelStyle : {
          ...labelStyle,
        },
        class: typeof labelClasses === 'string' ? labelClasses : {
          ...labelClasses,
        },
        attrs: this.$lget(this.$attrs, ['attrs-label'], {}),
        staticClass: `${this.mode}__label q-anchor--skip`,
      }, label),
    );
    this.$lset(this.$attrs,
      'attrs.class',
      `${this.classes} ${this.$lget(this.$attrs, 'attrs.class', '')}`,
    );
    let {style = {}, 'class': classes = {}} = this.$lget(this.$attrs, ['attrs'], {});
    return h('div', {
      style: typeof style === 'string' ? style : {

        '--size-ratio': this.$lget(this.$attrs, '--size-ratio', 1.5),
        '--border-radius': this.$lget(this.$attrs, '--border-radius', '5vw'),
        '--height': this.$lget(this.$attrs, '--height', '10vw'),


        ...style,
      },
      class: typeof classes === 'string' ? classes : {
        ...classes,
      },
      attrs: this.attrs,
      on: {
        click: this.toggle,
        keyup: this.doOnKeyup,
      },
    }, child);
  },
};
