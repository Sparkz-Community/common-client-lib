
const $lcamelCase = require('lodash/camelCase');
// const $lget = require('lodash/get');
// const $lset = require('lodash/set');

export default function (
  {
    name,
    query = {},
    // eslint-disable-next-line no-unused-vars
    parseQuery = (value, key) => value,
    params = {},
    hash = '',
    runWhen = true,
  } = {}) {
  const prefix = $lcamelCase(name);

  let mixin = {
    data() {
      return {
        [`${prefix}CurrentRoute`]: {},
      };
    },
    mounted() {
      let self = this;
      window.addEventListener('popstate', () => {
        let route = self.$router.resolve(window.location.href.replace(window.location.origin, ''));
        if (route) self[`${prefix}CurrentRoute`] = route;
        // console.log('popstate', e, window.location, route);
      });
      let route = self.$router.resolve(window.location.href.replace(window.location.origin, ''));
      if (route) self[`${prefix}CurrentRoute`] = route;
      // console.log('popstate', window.location, route);
    },
    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler(to) {
          if (this[`${prefix}RunWhenCust`]) { // console.log('$route');
            Object.keys(to.query || {}).forEach(query_key => {
              if ((query_key in this) && (query_key in this[`${prefix}RouteQueryCust`]) && to.query[query_key] !== this[query_key]) {
                try {
                  this[query_key] = parseQuery(to.query[query_key], query_key);
                } catch (e) {
                  console.error(e);
                }
              }
            }, this);

            Object.keys(to.params || {}).forEach(params_key => {
              if ((params_key in this) && (params_key in this[`${prefix}RouteParamsCust`]) && to.params[params_key] !== this[params_key]) {
                try {
                  this[params_key] = to.params[params_key];
                } catch (e) {
                  console.error(e);
                }
              }
            }, this);
          }
        },
      },
      [`${prefix}CurrentRoute`]: {
        immediate: true,
        deep: true,
        handler(to) {
          // console.log([`${prefix}CurrentRoute`], to);
          if (this[`${prefix}RunWhenCust`]) { // console.log('$route');
            Object.keys(to.query || {}).forEach(query_key => {
              if ((query_key in this) && (query_key in this[`${prefix}RouteQueryCust`]) && to.query[query_key] !== this[query_key]) {
                try {
                  this[query_key] = parseQuery(to.query[query_key], query_key);
                } catch (e) {
                  console.error(e);
                }
              }
            }, this);

            Object.keys(to.params || {}).forEach(params_key => {
              if ((params_key in this) && (params_key in this[`${prefix}RouteParamsCust`]) && to.params[params_key] !== this[params_key]) {
                try {
                  this[params_key] = to.params[params_key];
                } catch (e) {
                  console.error(e);
                }
              }
            }, this);
          }
        },
      },
      [`${prefix}RouteQueryCust`]: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (Object.keys(newVal).length && this[`${prefix}RunWhenCust`]) {
            this[`${prefix}RouteChange`]({
              r_query: {...this.$route.query, ...newVal},
              r_params: {...this.$route.params, ...this[`${prefix}RouteParamsCust`]},
              r_hash: this[`${prefix}RouteHashCust`] || this.$route.hash,
            });
          }
        },
      },
      [`${prefix}RouteParamsCust`]: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (Object.keys(newVal).length && this[`${prefix}RunWhenCust`]) {
            this[`${prefix}RouteChange`]({
              r_query: {...this.$route.query, ...this[`${prefix}RouteQueryCust`]},
              r_params: {...this.$route.params, ...newVal},
              r_hash: this[`${prefix}RouteHashCust`] || this.$route.hash,
            });
          }
        },
      },
      [`${prefix}RouteHashCust`]: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (Object.keys(newVal).length && this[`${prefix}RunWhenCust`]) {
            this[`${prefix}RouteChange`]({
              r_query: {...this.$route.query, ...this[`${prefix}RouteQueryCust`]},
              r_params: {...this.$route.params, ...this[`${prefix}RouteParamsCust`]},
              r_hash: newVal || this.$route.hash,
            });
          }
        },
      },
    },
    computed: {
      [`${prefix}Prefix`]() {
        return prefix;
      },
    },
    methods: {
      [`${prefix}RouteChange`]({r_query = {}, r_params = {}, r_hash = ''} = {}) {
        let router_obj = {};
        if (Object.keys(this.$route.query).length || Object.keys(r_query).length) {
          let is_query_diff = Object.keys(r_query).some(key => {
            return (!(key in this.$route.query) || ((key in this.$route.query) && this.$route.query[key] !== String(r_query[key])));
          }, this);
          if (is_query_diff) {
            router_obj.query = {...this.$route.query, ...r_query};
          }
        }
        if (Object.keys(this.$route.params).length || Object.keys(r_params).length) {
          let is_params_diff = Object.keys(r_params).some(key => {
            return (!(key in this.$route.params) || ((key in this.$route.params) && this.$route.params[key] !== r_params[key]));
          }, this);
          if (is_params_diff) {
            router_obj.params = {...this.$route.params, ...r_params};
          } else if (router_obj.query && Object.keys(router_obj.query).length) {
            router_obj.params = this.$route.params;
          }
        }
        if ((this.$route.hash && this.$route.hash !== '') || (r_hash && r_hash !== '')) {
          let is_hash_diff = this.$route.hash !== r_hash;
          if (is_hash_diff) {
            router_obj.hash = r_hash || this.$route.hash;
          }
        }
        if (this.$route.name && Object.keys(router_obj).length) router_obj.name = this.$route.name;

        if (Object.keys(router_obj).length) {
          let route = this.$router.resolve(router_obj);
          // .catch(err => {
          //   throw new Error(`routerMixin.js -> ${prefix}RouteChange -> $router.replace: ${err}.`);
          // });
          window.history.pushState({}, null, route.href);
          window.dispatchEvent(new Event('popstate'));
        }
      },
    },
  };

  mixin.computed[`${prefix}RouteQueryCust`] = typeof query === 'function' ? query : () => query;
  mixin.computed[`${prefix}RouteParamsCust`] = typeof params === 'function' ? params : () => params;
  mixin.computed[`${prefix}RouteHashCust`] = typeof hash === 'function' ? hash : () => hash;
  mixin.computed[`${prefix}RunWhenCust`] = typeof runWhen === 'function' ? runWhen : () => runWhen;

  return mixin;
}
