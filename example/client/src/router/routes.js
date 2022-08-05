// eslint-disable-next-line no-unused-vars
export default function ({store, ssrContext}) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {path: '', component: () => import('pages/Index.vue')},

        {
          path: 'login',
          name: 'login',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/login/baseLogin/login')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/register/baseRegister/register')
        },
        {
          path: 'verify',
          name: 'verify',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/verifyEmail/verifyEmail')
        },
        {
          path: 'resetPassword',
          name: 'resetPassword',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/resetPassword/resetPassword')
        },
        {
          path: 'changePassword',
          name: 'changePassword',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/changePassword/changePassword')
        },
        {
          path: 'logout',
          name: 'logout',
          beforeEnter(to, from, next) {
            store.dispatch('auth/logout')
              // eslint-disable-next-line no-unused-vars
              .then(result => {
                // console.log('logout:', result);
                next('/');
              })
              .catch(error => {
                console.error('error logout:', error);
                next();
              });
          },
        },
        {path: 'cornerDetailsCard', component: () => import('pages/testing/common/atoms/cornerDetailsCard/cornerDetailsCard.vue')},
        {path: 'draggableResizable', component: () => import('pages/testing/common/atoms/draggableResizable/draggableResizable.vue')},
        {path: 'flipHoverCard', component: () => import('pages/testing/common/atoms/flipHoverCard/flipHoverCard.vue')},
        {path: 'tabNavbar', component: () => import('pages/testing/common/atoms/tabNavbar/tabNavbar.vue')},
        {path: 'tabStepper', component: () => import('pages/testing/common/atoms/tabStepper/tabStepper.vue')},
        {path: 'dddCarousel', component: () => import('pages/testing/dddCarousel/dddCarousel.vue')},
        // {path: 'mediaPage', component: () => import('pages/testing/common/molecules/mediaPage.vue')},
        // {path: 'StencilSliderPage', component: () => import('pages/testing/common/molecules/StencilSliderPage.vue')},
        // {path: 'CropperStencilPage', component: () => import('pages/testing/common/molecules/CropperStencilPage.vue')},
        {path: 'TogglerPage', component: () => import('pages/testing/common/atoms/TogglerPage.vue')},
        {path: 'ToggleIt', component: () => import('components/common/atoms/ToggleIt/ToggleIt.vue')},
        {path: 'ToggleMe', component: () => import('pages/testing/common/atoms/ToggleMe/ToggleMe.vue')},
        // {path: 'ImageCrop', component: () => import('@iy4u/common-client-lib').then(module => module.ImageCrop)},
        // {path: 'newMedia', component: () => import('@iy4u/common-client-lib').then(module => module.newMedia)},
        // {path: 'carousel', component: () => import('pages/testing/common/molecules/carousel/carousel.vue')},
        {path: 'zoomieCanvas', component: () => import('pages/testing/common/molecules/zoomie/canvas/canvas.vue')},
        {path: 'zoomieImage', component: () => import('pages/testing/common/molecules/zoomie/image/image.vue')},
        {path: 'zoomieImageRotate', component: () => import('pages/testing/common/molecules/zoomie/image/rotate.vue')},
        {path: 'zoomieSwiper', component: () => import('pages/testing/common/molecules/zoomie/swiper/swiper.vue')},
      ]
    }
  ];

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue'),
    });
  }

  return routes;
}

