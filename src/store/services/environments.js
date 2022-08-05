import {diff, lodash} from '../../index';

const {$lget, $lset, $lisNil, $lmergeWith} = lodash;


Array.prototype.insert = function (index, ...value) {
  this.splice(index, 0, ...value);
  return this;
};

function hookCustomizer(obj_value, src_value) {
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


export default async (
  {
    FeathersClient,
    extend_hooks = {},
    extend_class_fn = (superClass) => superClass,
    extend_instance_defaults={},
    state = {},
    getters = {},
    mutations = {},
    actions = {},
  } = {}) => {

  if ($lisNil(FeathersClient)) {
    throw Error('FeathersClient argument must be set');
  }
  const {
    default: feathersClient,
    makeServicePlugin,
    BaseModel,
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;

  class Environments extends BaseModel {
    constructor(data, options) {
      super(data, options);
    }
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  Environments.modelName = 'Environments';
  Environments.diffOnPatch = function (data) {
    // console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = Environments.store.state['environments'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  };

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


  const servicePlugin = makeServicePlugin({
    Model,
    service: feathersClient.service(servicePath),
    servicePath,
    state,
    getters,
    mutations,
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

  return servicePlugin;

};

