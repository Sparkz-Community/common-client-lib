import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash, hookCustomizer} from '../../index';
import {commonSettings, commonFields} from '@/utils/common-instance-defaults';
const {$lget, $lset, $lmergeWith} = lodash;

export class Accounts extends BaseModel {
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
  Accounts.instanceDefaults = function () {
    return {
      name: '',
      email: '',
      description: '',
      phone: undefined,
      avatar: undefined,
      banner: {},
      profileImg: undefined,
      // address: undefined,
      addresses: [],
      phones: [],
      socialLinks: [],
      images: [],
      ownership: {
        owners: [],
        owns: [],
      },
      membership: {
        members: [],
        membersOf: [],
      },
      authModelName: '',
      // peoples: [],
      responsibleForEnvironments: [],
      settings: commonSettings,
      ...commonFields,
      ...extend_instance_defaults
    };
  };
  
  Accounts.setupInstance = function (data) {
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
  
  const servicePath = 'accounts';
  
  let Model = Accounts;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(Accounts);
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
