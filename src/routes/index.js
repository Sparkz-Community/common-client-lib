const environmentRoutes = {
  icon: 'fab fa-battle-net',
  title: 'Environment Management',
  $can: () => true,
  children: [
    {
      icon: 'fa fa-database',
      title: 'Instances',
      $can: () => true,
      path: 'instances',
      name: 'instances',
      component: () => import('../pages/InstancesPage'),
    },
    {
      icon: 'fas fa-dice-d20',
      title: 'Virtual Instances',
      $can: () => true,
      path: 'v-instances',
      name: 'v-instances',
      component: () => import('../pages/VInstancesPage'),
    },
    {
      icon: 'http',
      title: 'Domains',
      $can: () => true,
      path: 'domains',
      name: 'domains',
      component: () => import('../pages/DomainsPage'),
    },
    {
      icon: 'apps',
      title: 'Applications',
      $can: () => true,
      path: 'applications',
      name: 'applications',
      component: () => import('../pages/ApplicationsPage'),
    },
    {
      icon: 'fas fa-server',
      title: 'Environments',
      // $can: () => router.app.$can('patch', 'roles'),
      $can: () => true,
      path: 'environments',
      name: 'environments',
      component: () => import('../pages/EnvironmentsPage'),
    },
    {
      icon: 'fas fa-network-wired',
      title: 'Hosts',
      $can: () => true,
      path: 'hosts',
      name: 'hosts',
      component: () => import('../pages/HostsPage'),
    },
    {
      icon: 'fas fa-link',
      title: 'Integrations',
      $can: () => true,
      path: 'integrations',
      name: 'integrations',
      component: () => import('../pages/IntegrationsPage'),
    },
    // {
    //   icon: 'fas fa-key',
    //   title: 'Integration Authentications',
    //   $can: () => true,
    //   path: 'integration-auths',
    //   name: 'integration-auths',
    //   component: () => import('../pages/IntegrationAuthsPage'),
    // },
  ],
};

const packageRoutes = [
  {
    path: 'quickbooks-connect',
    name: 'quickbooks-connect',
    meta: {requiresAuth: true},
    component: () => import ('../pages/ConnectQuickbooks.vue'),
  },
];

export {
  environmentRoutes,
  packageRoutes,
};
