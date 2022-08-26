// plugins
import accounts, { Accounts } from './services/accounts';
import applications, { Applications } from './services/applications';
import devices, { Devices } from './services/devices';
import domains, { Domains } from './services/domains';
import environments, { Environments } from './services/environments';
import features, { Features } from './services/features';
import geocode, { Geocode } from './services/geocode';
import glClasses, { GLClasses } from './services/gl-classes';
import glDepartments, { GLDepartments } from './services/gl-departments';
import hosts, { Hosts } from './services/hosts';
import instances, { Instances } from './services/instances';
import integrationAuths, { IntegrationAuths } from './services/integration-auths';
import integrations, { Integrations } from './services/integrations';
import placesAutoComplete, { PlacesAutoComplete } from './services/places-auto-complete';
import quickbookCompanies, { QuickbooksCompanies } from './services/quickbook-companies';
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
  Geocode,
  GLClasses,
  GLDepartments,
  Hosts,
  Instances,
  IntegrationAuths,
  Integrations,
  PlacesAutoComplete,
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
  geocode,
  glClasses,
  glDepartments,
  hosts,
  instances,
  integrationAuths,
  integrations,
  placesAutoComplete,
  quickbookCompanies,
  vInstances,
  wallets,
};

export {
  classes,
  stores,
};
