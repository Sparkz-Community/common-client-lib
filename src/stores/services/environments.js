import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash, hookCustomizer} from '../../index';
import {coreFields} from './common/instanceDefaults';
const {$lget, $lset, $lmergeWith} = lodash;

export class Environments extends BaseModel {
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
  Environments.instanceDefaults = function () {
    return {
      name: undefined,
      applications: [],
      hosts: [],
      integrationAuths: [],
      responsibleAccount: undefined,
      routes: [],
      instance: undefined,
      // domains: [],
      ...coreFields,
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
      let accountModel = new models.api.Accounts(responsibleAccount);
      accountModel.addToStore();
      $lset(data, '_fastjoin.responsibleAccount', accountModel);
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
