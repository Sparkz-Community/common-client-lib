import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash, hookCustomizer} from '../../index';
const {$lget, $lset, $lisNil, $lmergeWith} = lodash;

export class Environments extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
}

export default async (
  {
    FeathersClient,
    idField = '_id',
    extend_hooks = {},
    extend_class_fn = (superClass) => superClass,
    extend_instance_defaults={},
    state = () => ({}),
    getters = {},
    actions = {},
  } = {}) => {

  if ($lisNil(FeathersClient)) {
    throw Error('FeathersClient argument must be set');
  }
  const {
    default: feathersClient,
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;

  // Define default properties here
  Environments.instanceDefaults = function () {
    return {
      name: undefined,
      instance: undefined,
      domains: [],
      ...extend_instance_defaults
    };
  };

  Environments.setupInstance = function (data, { /*store, */models }) {
    // const createdAt = formatDate(data.createdAt);
    // $lset(data, 'createdAt', createdAt);
    // const updatedAt = formatDate(data.updatedAt);
    // $lset(data, 'updatedAt', updatedAt);

    let responsibleAccount = $lget(data, '_fastjoin.responsibleAccount');
    if (responsibleAccount) {
      $lset(data, '_fastjoin.responsibleAccount', new models.api.Accounts(responsibleAccount));
    }

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

  const servicePath = 'environments';

  let Model = Environments;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(Environments);
  }


  const useStore = defineStore({
    Model,
    servicePath,
    clients: { api: feathersClient },
    idField: idField,
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

