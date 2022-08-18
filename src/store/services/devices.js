import { defineStore, BaseModel } from 'feathers-pinia';
import {hookCustomizer,lodash} from '../../';

const {$lget, $lset, $lisNil, $lmergeWith} = lodash;


export default async (
  {
    FeathersClient,
    idField= '_id',
    extend_hooks = {},
    extend_class_fn = (superClass) => superClass,
    extend_instance_defaults={},
    state = {},
    getters = {},
    actions = {},
  } = {}) => {

  if ($lisNil(FeathersClient)) {
    throw Error('FeathersClient argument must be set');
  }


  const {
    default: feathersClient,
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;

  class Devices extends BaseModel {
    constructor(data, options) {
      super(data, options);
    }
  }

  // Define default properties here
  Devices.instanceDefaults = function () {
    return {
      fingerprints: [],
      visits: [],
      counter: undefined,
      platform: undefined,
      publicKey: undefined,
      userAgent: undefined,
      user: undefined,
      users: [],
      lastRoute: undefined,
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


  const useDevices = defineStore({
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

  return useDevices;

};

