import { useRouter, useRoute } from 'vue-router';

export default function useRouters() {
  const router = useRouter();
  const route = useRoute();

  function $routerPreserve({name, params, query, hash, path} = {}) {
    let routerObj = {};
    if (params && JSON.stringify(params) !== JSON.stringify(route.params)) routerObj.params = params;
    if (query && JSON.stringify(query) !== JSON.stringify(route.query)) routerObj.query = query;
    if (hash && JSON.stringify(hash) !== JSON.stringify(route.hash)) routerObj.hash = hash;
    if (name && name !== route.name) routerObj.name = name;
    if (path && path !== route.path) routerObj.path = path;
    if (Object.keys(routerObj).length) {
      let obj = {
        ...{
          params: route.params,
          query: route.query,
          hash: route.hash,
        },
        ...routerObj,
      };
      router.push(obj).catch((err) => {
        throw new Error(`iy-common-client-lib -> global mixin -> $routerPreserve -> $router.push: ${err}.`);
      });
    }
  }

  function $rHistory({name, params, query, hash, path} = {}) {
    let routerObj = {};
    if (params && JSON.stringify(params) !== JSON.stringify(route.params)) routerObj.params = params;
    if (query && JSON.stringify(query) !== JSON.stringify(route.query)) routerObj.query = query;
    if (hash && JSON.stringify(hash) !== JSON.stringify(route.hash)) routerObj.hash = hash;
    if (name && name !== route.name) routerObj.name = name;
    if (path && path !== route.path) routerObj.path = path;
    if (Object.keys(routerObj).length) {
      let obj = {
        ...{
          params: route.params,
          query: route.query,
          hash: route.hash,
        },
        ...routerObj,
      };
      const {href} = router.resolve(obj);
      window.history.pushState({}, null, href);
    }
  }
  return {
    $routerPreserve,
    $rHistory,
  };
}
