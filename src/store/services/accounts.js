import { defineStore, BaseModel } from 'feathers-pinia';
import {hookCustomizer,lodash} from '../../';

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
    default: feathersClient,
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;


  class Accounts extends BaseModel {
    constructor(data, options) {
      super(data, options);
    }
  }


  // Define default properties here
  Accounts.instanceDefaults = function () {
    return {
      name: undefined,
      email: undefined,
      description: undefined,
      avatar: {},
      banner: {},
      profileImg: '',
      addresses: [],
      phones: [],
      socialLinks: [],
      logins: {
        ownedBy: [],
        members: [],
      },
      images: [],
      ownership: {
        owners: undefined,
        owns: undefined,
      },
      membership: {
        members: undefined,
        membersOf: undefined,
      },
      authOwnerId: undefined,
      authModelName: undefined,
      responsibleForEnvironments: [],
      settings: {
        theme: undefined,
        hosts: undefined,
        instances: undefined,
        applications: undefined,
        domains: undefined,
        environments: undefined,
        accounts: undefined,
      },
      participant: undefined,
      deleted: undefined,
      deletedAt: undefined,
      applications: [],
      environment: undefined,
      createdBy: {
        account: undefined,
        user: undefined,
        login: undefined,
        integration: undefined,
        fingerprint: undefined,
      },
      updatedBy: {
        account: undefined,
        user: undefined,
        login: undefined,
        integration: undefined,
        fingerprint: undefined,
      },
      updatedByHistory: {
        account: undefined,
        user: undefined,
        login: undefined,
        integration: undefined,
        fingerprint: undefined,
        updatedAt: undefined,
      },
      external: {
        createdBySource: {
          id: undefined,
          Model: undefined,
        },
        updatedBySource: {
          id: undefined,
          Model: undefined,
        },
        updatedBySourceHistory: {
          updatedBy: undefined,
          updatedByHistoryModel: undefined,
          updatedAt: undefined,
        },
        meta: undefined,
      },
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

  const useAccounts = defineStore({
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

  return useAccounts;

};

