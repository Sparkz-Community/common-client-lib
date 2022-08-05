import Vue from 'vue';

// eslint-disable-next-line no-unused-vars
const createInstance = ({ ref, el, slots, component, root, props }) => {
  let attrs = {
    ...props
  };
  let instance = new Vue({
    // ...testProgrCom,
    // propsData: { ...props },
    render (h) {
      const children = Object.keys(this.$slots).map(slot => h('template', { slot }, this.$slots[slot]));
      return h(component, {
        parent: root,
        // ref: 'ProgrCom',
        props,
        attrs,
        scopedSlots: this.$slots,
      }, children);
    },
  });
  if (slots) {
    Object.keys(slots).forEach(slot_key => {
      if (typeof slots[slot_key] === 'string') {
        instance.$slots[slot_key] = [slots[slot_key]];
      } else {
        let slot_component = slots[slot_key];
        let slot_propsData = {};
        // eslint-disable-next-line no-prototype-builtins
        if (!slot_component.hasOwnProperty('__file') && typeof slot_component === 'object') {
          slot_component = slots[slot_key]['component'];
          slot_propsData = slots[slot_key]['propsData'];
        }
        // let ComponentClass = Vue.extend(slot_component);
        // let slotInstance = new ComponentClass({
        //   parent: root,
        //   propsData: slot_propsData
        // });
        let slotInstance = new Vue({
          render (h) {
            const children = Object.keys(this.$slots).map(slot => h('template', { slot }, this.$slots[slot]));
            return h(slot_component, {
              parent: root,
              props: slot_propsData,
              attrs: slot_propsData,
              scopedSlots: this.$slots,
            }, children);
          },
        });
        slotInstance.$mount();
        slotInstance.$forceUpdate();
        instance.$slots[slot_key] = [slotInstance._vnode];
      }
    });
  }
  instance.$mount();
  return instance;
};

const insertElement = (el, instanceEl, position) => {
  switch (position) {
    case 'before': {
      el.parentNode.insertBefore(instanceEl, el);
      break;
    }
    case 'after': {
      el.parentNode.insertBefore(instanceEl, el.nextSibling);
      break;
    }
    default: {
      el.appendChild(instanceEl);
      break;
    }
  }
};

export default function (DefaultComponent) {
  return ({ ref, el, position = 'in', slots, component, root, ...props }) => {
    if (component === void 0) component = DefaultComponent;
    if (component === void 0) throw Error('DefaultComponent or component need to be set.');
    const positions = ['in', 'before', 'after'];
    if (positions.includes(position)) {
      throw Error(`position: "${position}" needs to be one of these options: ${positions.join(', ')}`);
    }

    let instance = createInstance({ ref, el, slots, component, root, props });

    if (ref) {
      insertElement(root.$refs[ref], instance.$el, position);
    } else if (el) {
      if (el instanceof HTMLCollection || el instanceof NodeList || Array.isArray(el)) {
        let instances = [];
        Array.from(el).forEach(item => {
          let instance = createInstance({ ref, el, component, root, props });
          insertElement(item, instance.$el, position);

          instances.push({instance: instance.$children[0], rootInstance: instance});
        });

        return instances;
      } else {
        insertElement(el, instance.$el, position);
      }
    } else {
      insertElement(document.body, instance.$el, position);
    }

    return {instance: instance.$children[0], rootInstance: instance};
  };
}
