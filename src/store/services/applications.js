import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash,hookCustomizer} from '../../';

const {$lget, $lset, $lisNil, $lmergeWith} = lodash;


Array.prototype.insert = function (index, ...value) {
  this.splice(index, 0, ...value);
  return this;
};



export default async (
  {
    FeathersClient,
    idField= '_id',
    extend_hooks = {},
    extend_class_fn = (superClass) => superClass,
    extend_instance_defaults={},
    state =() => ({}),
    getters = {},
    actions = {},
  } = {}) => {

  if ($lisNil(FeathersClient)) {
    throw Error('FeathersClient argument must be set');
  }


  const {
    default: feathersClient
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;

  if ($lisNil(defineStore)) {
    throw Error('Feathers-Pinia defineStore argument must be set');
  }

  if ($lisNil(BaseModel)) {
    throw Error('Feathers-Pinia  BaseModel argument must be set');
  }

  class Applications extends BaseModel {
    constructor(data, options) {
      super(data, options);
    }
  }



  // Define default properties here
  Applications.instanceDefaults = function () {
    return {
      name: undefined,
      features: [],
      hosts: [],
      ...extend_instance_defaults
    };
  };

  Applications.setupInstance = (data) => {
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

  const servicePath = 'applications';

  let Model = Applications;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(Applications);
  }


  const useApplications = defineStore({
    Model,
    servicePath,
    clients: { api: feathersClient },
    idField,
    state,
    getters,
    actions,
  });

  // const beforeHook = context => {
//   // eslint-disable-next-line no-console
//   console.log('------------->>>> beforeHook - context.method:', context.method);
//   console.log('------------->>>> beforeHook - context.params:', context.params);
//   console.log('------------->>>> beforeHook - context.data:', context.data);
// };

  // Setup the client-side Feathers hooks.
  feathersClient.service(servicePath).hooks($lmergeWith({
    before: {
      all: [/*beforeHook*/],
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

  return useApplications;

};

