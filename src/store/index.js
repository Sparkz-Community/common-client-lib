// plugins
import instances from './services/instances';
import vInstances from './services/vInstances';
import domains from './services/domains';
import applications from './services/applications';
import environments from './services/environments';
import hosts from './services/hosts';
import devices from './services/devices';
import features from './services/features';
import integrations from './services/integrations';
import integrationAuths from './services/integrationAuths';

const modules = {
  // example,
};




const plugins = {
  instances,
  vInstances,
  domains,
  applications,
  environments,
  hosts,
  devices,
  features,
  integrations,
  integrationAuths
};

export {
  modules,
  plugins,
};
