import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash, hookCustomizer} from '../../index';
import {commonSettings, coreFields} from './common/instanceDefaults';
const {$lget, $lset, $lmergeWith} = lodash;

export class Devices extends BaseModel {
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
  Devices.instanceDefaults = function () {
    return {
      fingerprints: [],
      // visits: [],
      counter: undefined,
      // platform: undefined,
      publicKey: undefined,
      // userAgent: undefined,
      lastRoute: {
        name: undefined,
        path: undefined,
        query: undefined,
        params: undefined,
        meta: undefined,
        props: undefined,
      },
      settings: commonSettings,
      ...coreFields,
      ...extend_instance_defaults
    };
  };

  Devices.setupInstance = function (data) {
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

  const servicePath = 'devices';

  let Model = Devices;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(Devices);
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
