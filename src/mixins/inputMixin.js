const lget= require('lodash/get');
export default function inputMixin({ name = 'handleInput', valuePath = 'value', multiple, idPath = '_id', emitValue, inputEvent = 'input', convertInputFn, log }) {
  let mixin = {
    computed: {},
    methods: {
      [`${name}`](payload, afterFn) {
        let val = convertInputFn ? this[`${convertInputFn}`](payload) : payload;
        if(log) console.log('handling Input', val, payload, afterFn);
        let mltpl = this[`${name}Multiple`];
        let ev = this[`${name}EmitValue`];
        let vId = lget(val, this[`${name}IdPath`], val);
        if(log) console.log('vId', vId,this[`${name}IdPath`], val, val[this[`${name}IdPath`]]);

        let selected = this[`${valuePath}`];
        if(log) console.log('first selected set', selected);

        let idx = -1;

        if(selected && Array.isArray(selected)){
            idx = selected.map(a => lget(a, this[`${name}IdPath`], a)).indexOf(vId);
        } else if(lget(selected, this[`${name}IdPath`], selected) === vId) idx = 0;
        if (idx === -1) {
          if(log) console.log('idx -1');
          if (mltpl) {
           selected ? selected = [...this[`${valuePath}`], val] : [val];
          } else {
            selected = typeof val === 'object' ? selected = Object.assign({}, val) : selected = JSON.parse(JSON.stringify(val));
          }
        } else {
          if(log) console.log('idx', idx);
          mltpl ? selected.splice(idx, 1) : selected = undefined;
        }
        let finalVal = selected ? ev ? Array.isArray(selected) ? selected.map(a => lget(a, this[`${name}IdPath`])) : selected[this[`${name}IdPath`]] : selected : selected;
        if(log) console.log('emitting', inputEvent, selected, ev, name, this[`${name}IdPath`], finalVal);
        this.$emit(inputEvent, finalVal);
        if(afterFn) afterFn(val);
      }
    }
  };
  mixin.computed[`${name}Multiple`] = typeof multiple === 'function' ? multiple : () => multiple;
  mixin.computed[`${name}IdPath`] = typeof idPath === 'function' ? idPath : () => idPath;
  mixin.computed[`${name}EmitValue`] = typeof emitValue === 'function' ? emitValue : () => emitValue;
  return mixin;
}
