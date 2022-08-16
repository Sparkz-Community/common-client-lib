// plugins
import accounts, { Accounts } from './services/accounts';
import applications, { Applications } from './services/applications';
import devices, { Devices } from './services/devices';
import domains, { Domains } from './services/domains';
import environments, { Environments } from './services/environments';
import features, { Features } from './services/features';
import glClasses, { GLClasses } from './services/glClasses';
import glDepartments, { GLDepartments } from './services/glDepartments';
import hosts, { Hosts } from './services/hosts';
import instances, { Instances } from './services/instances';
import integrationAuths, { IntegrationAuths } from './services/integrationAuths';
import integrations, { Integrations } from './services/integrations';
import quickbookCompanies, { QuickbooksCompanies } from './services/quickbookCompanies';
import vInstances, { VInstances } from './services/vInstances';
import wallets, { Wallets } from './services/wallets';

// glClasses
// glDepartments
// quickbookCompanies
// wallets

const classes = {
  Accounts,
  Applications,
  Devices,
  Domains,
  Environments,
  Features,
  GLClasses,
  GLDepartments,
  Hosts,
  Instances,
  IntegrationAuths,
  Integrations,
  QuickbooksCompanies,
  VInstances,
  Wallets,
};

const stores = {
  accounts,
  applications,
  devices,
  domains,
  environments,
  features,
  glClasses,
  glDepartments,
  hosts,
  instances,
  integrationAuths,
  integrations,
  quickbookCompanies,
  vInstances,
  wallets,
};

export default {
  classes,
  stores,
};
