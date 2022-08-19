import {lodash} from '../packages';
const {$lget} = lodash;
export default function hookCustomizer(obj_value, src_value) {
  Array.prototype.insert = function (index, ...value) {
    this.splice(index, 0, ...value);
    return this;
  };
  if (Array.isArray(obj_value)) {
    let list = [...obj_value];
    for (let item of src_value) {
      let set_index = $lget(item, 'index', undefined);
      let set_value = $lget(item, 'value', undefined);
      if (item instanceof Object && !Array.isArray(item) && set_index !== undefined && set_value !== undefined) {
        list.insert(set_index, set_value);
      } else {
        list.push(item);
      }
    }
    return list;
  }
}
