import Vue from 'vue';
import VueRouter from 'vue-router';
import {Notify} from 'quasar';
import {hooks} from '@iy4u/vue-fingerprint';
import Routes from './routes';
import adminRoutes from './adminRoutes';

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({store, ssrContext}) {
  const routes = Routes({store, ssrContext});

  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  const FeathersClient= () => import('../api/feathers-client');

  Router.beforeEach(async (to, from, next) => {

    await hooks.fingerprintRouterBeforeEach(FeathersClient, store);
    if (!store.getters['auth/isAuthenticated']) {
      store.dispatch('auth/authenticate')
        .then(() => {
          // console.log('authenticated');
          // console.log('getters user', store.getters['auth/user']);

          let rules = Router.app.$lget(store.state, 'auth.rules', []);
          Router.app.$ability.update(rules);

          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              // console.log('pass');
              next();
            } else {
              // console.log('not pass', store.state.auth.user);
              Notify.create({
                type: 'negative',
                message: 'Page is restricted',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              next('/login');
            }
          } else {
            next();
          }
        })
        .catch(() => {
          // console.log('not authenticated');
          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              let rules = Router.app.$lget(store.state, 'auth.rules', []);
              Router.app.$ability.update(rules);

              next();
            } else {
              Notify.create({
                type: 'negative',
                message: 'Page is restricted. Please login or register.',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              next('/login');
            }
          } else {
            if (store.getters['auth/isAuthenticated']) {
              let rules = Router.app.$lget(store.state, 'auth.rules', []);
              Router.app.$ability.update(rules);
            }

            next();
          }
        });
    } else {
      let rules = Router.app.$lget(store.state, 'auth.rules', []);
      Router.app.$ability.update(rules);
      next();
    }
  });

  adminRoutes({Router, store, ssrContext});

  return Router;
}
