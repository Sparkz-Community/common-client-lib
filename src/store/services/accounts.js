import { defineStore, BaseModel } from 'feathers-pinia';
import {lodash, hookCustomizer} from '../../index';
const {$lget, $lset, $lisNil, $lmergeWith} = lodash;

export class Accounts extends BaseModel {
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
  Accounts.instanceDefaults = function () {
    return {
      name: undefined,
      email: undefined,
      description: undefined,
      phone: undefined,
      avatar: undefined,
      profileImg: undefined,
      address: undefined,
      addresses: [],
      phones: [],
      socialLinks: [],
      images: [],
      peoples: [],
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

