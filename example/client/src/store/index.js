import Vue from 'vue';
import Vuex from 'vuex';
import {FeathersVuex} from 'feathers-vuex';

import {plugins as rolesPlugins} from '@iy4u/roles-client-lib';
const {irRolesAbilities, irRolesRoles, irRolesRules} = rolesPlugins;
import {plugins as fpPlugins} from '@iy4u/vue-fingerprint';
import {plugins as commonServicePlugins} from '@iy4u/common-client-lib';
const {instances,vInstances,environments,domains,hosts,devices, features, applications, integrations, integrationAuths} = commonServicePlugins;

import auth from './store.auth';

// import example from './module-example'


Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);


/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default async function (/* { ssrContext } */) {
  console.log('test');
  const irRolesAbilitiesPlugin = await irRolesAbilities({
    FeathersClient: () => import('../api/feathers-client')
  });
  const irRolesRolesPlugin = await irRolesRoles({
    FeathersClient: () => import('../api/feathers-client')
  });
  const irRolesRulesplugin = await irRolesRules({
    FeathersClient: () => import('../api/feathers-client')
  });

  const fingerprintPlugin = await fpPlugins.fingerprints({
    FeathersClient: () => import('../api/feathers-client')
  });

  const myIpPlugin = await fpPlugins.myIp({
    FeathersClient: () => import('../api/feathers-client')
  });

  const fingerprintAuthPlugin = await fpPlugins.fingerprintAuthService({
    FeathersClient: () => import('../api/feathers-client'),
    header:'F-Authorization'
  });

  const instancesPlugin = await instances ({
    FeathersClient: () => import('../api/feathers-client')
  });
  const vInstancesPlugin = await vInstances ({
    FeathersClient: () => import('../api/feathers-client')
  });
  const domainsPlugin = await domains ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const applicationsPlugin = await applications ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const environmentsPlugin = await environments ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const hostsPlugin = await hosts ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const featuresPlugin = await features ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const devicesPlugin = await devices ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const integrationsPlugin = await integrations ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const integrationAuthsPlugin = await integrationAuths ({
    FeathersClient: () => import('../api/feathers-client')
  });

  const Store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},

    modules: {
      // example
    },
    plugins: [
      ...servicePlugins,
      instancesPlugin,
      vInstancesPlugin,
      environmentsPlugin,
      domainsPlugin,
      hostsPlugin,
      devicesPlugin,
      featuresPlugin,
      applicationsPlugin,
      integrationsPlugin,
      integrationAuthsPlugin,
      irRolesAbilitiesPlugin,
      irRolesRolesPlugin,
      irRolesRulesplugin,
      auth,
      myIpPlugin,
      fingerprintPlugin,
      fingerprintAuthPlugin
    ],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });


  return Store;
}
