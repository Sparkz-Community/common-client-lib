import { defineStore, BaseModel } from 'feathers-pinia';
import {hookCustomizer,lodash} from '../../';

const {$lisNil, $lmergeWith} = lodash;

Array.prototype.insert = function (index, ...value) {
  this.splice(index, 0, ...value);
  return this;
};

export class Geocode extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
}

export default async (
  {
    FeathersClient,
    idField= 'place_id',
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

  // Define default properties here
  Geocode.instanceDefaults = function () {
    return {
      input: '',
      ...extend_instance_defaults
    };
  };

  Geocode.setupInstance = function (data) {

    return data;
  };

  const servicePath = 'geocode';

  let Model = Geocode;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(Geocode);
  }

  const useGeocode = defineStore({
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

  return useGeocode;

};

