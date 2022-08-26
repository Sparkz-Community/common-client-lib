import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash, hookCustomizer} from '../../index';
import {coreFields} from '../../utils/common-instance-defaults';
const {$lget, $lset, $lmergeWith} = lodash;

export class VInstances extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
}

export default (
  {
    feathersClient,
    idField = '_id',
    extend_hooks = {},
    extend_class_fn = (superClass) => superClass,
    extend_instance_defaults = {},
    state = () => ({}),
    getters = {},
    actions = {},
  } = {}) => {
  // Define default properties here
  VInstances.instanceDefaults = function () {
    return {
      name: undefined,
      instance: undefined,
      domains: [],
      ...coreFields,
      ...extend_instance_defaults
    };
  };

  VInstances.setupInstance = function (data) {
    let createdAt = $lget(data, 'createdAt');
    if (typeof createdAt === 'string') {
      $lset(data, 'createdAt', new Date(createdAt));
    }
    let updatedAt = $lget(data, 'updatedAt');
    if (typeof updatedAt === 'string') {
      $lset(data, 'updatedAt', new Date(updatedAt));
    }
    return data;
  };

  const servicePath = 'v-instances';

  let Model = VInstances;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(VInstances);
  }


  const useStore = defineStore({
    Model,
    servicePath,
    clients: { api: feathersClient },
    idField,
    state,
    getters,
    actions,
  });

  // Setup the client-side Feathers hooks.
  feathersClient.service(servicePath).hooks($lmergeWith({
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: [],
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: [],
    },
    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: [],
    },
  }, extend_hooks, hookCustomizer));

  return useStore;
};
