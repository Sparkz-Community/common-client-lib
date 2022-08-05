import {Notify} from 'quasar';
import lget from 'lodash/get';
import {commonRoutes} from '@iy4u/common-client-lib';

// eslint-disable-next-line no-unused-vars
export default function ({Router, store, ssrContext}) {

  function getFormattedRoutes(routes) {
    let children = [], hiddenRoutes = [], baseRoutes = [];
    routes.forEach((route) => {
      if (lget(route, 'children', []).length) {
        route.children.forEach((child) => {
          if (lget(child, 'children', []).length) {
            let nestedRoutes = getFormattedRoutes(child.children);
            children.push(...nestedRoutes);
          }

          if (child.path) {
            let obj = {
              name: child.name,
              path: child.path,
              component: child.component,
              $can: child.$can,
            };
            children.push(obj);
          }
        });
      }
      if (lget(route, 'hiddenRoutes', []).length) {

        route.hiddenRoutes.forEach(hidden => {
          if (lget(hidden, 'hiddenRoutes', []).length) {
            let nestedHiddenRoutes = getFormattedRoutes(hidden.hiddenRoutes);
            hiddenRoutes.push(...nestedHiddenRoutes);
          }

          if (hidden.path) {
            let hiddObj = {
              name: hidden.name,
              path: route.path + '/' + hidden.path,
              component: hidden.component,
              $can: hidden.$can,
            };
            hiddenRoutes.push(hiddObj);
          }
        });
      }
      if (route.path) {
        let obj = {
          name: route.name,
          path: route.path,
          component: route.component,
          $can: route.$can,
        };
        baseRoutes.push(obj);
      }
    });
    return [...baseRoutes, ...children, ...hiddenRoutes];
  }

  // commonRoutes.children = commonRoutes.childrenRoutes.map(child => {
  //
  //   return  {
  //     icon: child.icon,
  //     $can: () => true,
  //     title: child.title,
  //     path: child.routeTo,
  //     name: child.title,
  //     component: child.component,
  //     iconColor: 'orangered',
  //     textColor: 'purple',
  //   };
  // });



// eslint-disable-next-line no-unused-vars
  const adminRouteConfigure = ({router, store, defaultRoute = {}, routeConfigs = []} = {}) => {
    let defaultRoutes = [
      {
        title: 'Preferences',
        icon: 'fas fa-users-cog',
        $can: () => router.app.$can('patch', router.app.$createEntity('users', store.getters['auth/user'])),
        // iconColor: '#00aaf1',
        // textColor: 'red',
        children: [
          {
            icon: 'fas fa-user-circle',
            $can: () => true,
            title: 'My Profile',
            path: 'my-profile',
            name: 'admin-my-profile',
            component: () => import('pages/profile/EditProfile'),
            iconColor: 'orangered',
            textColor: 'purple',
          },
          // {
          //   icon: 'fas fa-location-arrow',
          //   $can: () => true,
          //   title: 'Addresses',
          //   path: 'my-addresses',
          //   name: 'admin-my-addresses',
          //   component: () => import('components/profile/MyAddresses'),
          // },
          {
            icon: 'fab fa-instagram',
            $can: () => true,
            title: 'Social Links',
            path: 'social-links',
            name: 'admin-social-links',
            component: () => import('pages/profile/SocialLinks'),
          },
          {
            icon: 'fas fa-wallet',
            $can: () => true,
            title: 'My Wallet',
            path: 'my-wallet',
            name: 'admin-my-wallet',
            component: () => import('pages/profile/ProfileWallet'),
          },

        ],
      },

      {
        icon: 'admin_panel_settings',
        title: 'Roles and Permissions',
        $can: () => router.app.$can('manage', ['roles', 'abilities', 'rules']),
        // $can: () => true,
        children: [
          {
            icon: 'fas fa-user-shield',
            title: 'Roles',
            $can: () => router.app.$can('manage', 'roles'),
            // $can: () => true,
            path: 'roles',
            name: 'admin-roles',
            component: () => import('../pages/admin/roles/roles'),
          },
          {
            icon: 'fas fa-shield-alt',
            title: 'Abilities',
            $can: () => router.app.$can('manage', 'abilities'),
            // $can: () => true,
            path: 'abilities',
            name: 'admin-abilities',
            component: () => import('../pages/admin/abilities/abilities'),
          },
          {
            icon: 'rule',
            title: 'Rules',
            $can: () => router.app.$can('manage', 'rules'),
            // $can: () => true,
            path: 'rules',
            name: 'admin-rules',
            component: () => import('../pages/admin/rules/rules'),
          },
        ],
      },
      commonRoutes,
      {
        icon: 'fas fa-user-friends',
        title: 'Users',
        $can: () => router.app.$can('manage', 'users'),
        // $can: () => true,
        path: 'user-management',
        name: 'admin-user-management',
        component: () => import('../pages/admin/users/users'),
      },

    ];

    if (Object.keys(defaultRoute).length === 0) {
      defaultRoute = defaultRoutes[0].children[0];
    }

    router.addRoute({
      path: '/admin',
      name: 'admin',
      props() {
        return {
          menuItems: [...routeConfigs, ...defaultRoutes,],
          defaultRoute: defaultRoute,
        };
      },
      beforeEnter(to, from, next) {
        if (!router.app.$can('route', 'admin')) {
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
          next(from);
        } else {
          next();
        }
      },
      meta: {requiresAuth: true},
      component: () => import('layouts/AdminLayout'),
    });

    // if (Object.keys(defaultRoute).length) {
    //   let formattedDefault = getFormattedRoutes([defaultRoute])[0];
    //   router.addRoute('admin', {
    //     name: 'admin-home',
    //     ...formattedDefault,
    //     path: '',
    //     meta: {requiresAuth: true},
    //     // eslint-disable-next-line no-unused-vars
    //     beforeEnter(to, from, next) {
    //
    //     }
    //   });
    // } else {
    //   let formattedDefault = {
    //     path: 'my-profile',
    //     name: 'admin-my-profile',
    //     component: () => import('../pages/profile/EditProfile')
    //   };
    // }

    let routes = getFormattedRoutes([...routeConfigs, ...defaultRoutes]);

    routes.forEach((route) => {
      let {$can, ...link} = route;
      router.addRoute('admin', {
        ...link,
        meta: {requiresAuth: true},
        // eslint-disable-next-line no-unused-vars
        beforeEnter(to, from, next) {
          // $can() ? next() : next(from);
          if ($can && !$can()) {
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
            next(from);
          } else {
            next();
          }
        },
      });
    });

    // console.log('router.options.routes:', router.options.routes);
    // console.log('router.getRoutes():', router.getRoutes());
  };

  adminRouteConfigure({
    router: Router,
    store,
    routeConfigs: [
      {
        icon: 'fas fa-money-bill-wave',
        title: 'Payments',
        // $can: () => router.app.$can('manage', 'payments'),
        $can: () => true,
        path: 'payments',
        name: 'admin-payments',
        component: () => import('../pages/admin/payments/payments'),
      },
    ],
    defaultRoute: {
      icon: 'fas fa-user-friends',
      title: 'Users',
      // $can: () => router.app.$can('manage', 'users'),
      $can: () => true,
      path: 'user-management',
      name: 'admin-user-management',
      component: () => import('../pages/admin/users/users'),
    },
  });
}

