export const commonSettings = {
  theme: undefined,
  hosts: {},
  instances: {},
  applications: {},
  domains: {},
  environments: {},
  accounts: {},
};

export const commonFields = {
  deleted: undefined,
  deletedAt: undefined,
  applications: [],
  environment: undefined,
  createdBy: {
    account: undefined,
    user: undefined,
    login: undefined,
    integration: undefined,
    fingerprint: undefined,
  },
  updatedBy: {
    account: undefined,
    user: undefined,
    login: undefined,
    integration: undefined,
    fingerprint: undefined,
    updatedAt: undefined,
  },
  updatedByHistory: [],
  external: {
    createdBySource: {
      id: '',
      Model: '',
    },
    updatedBySource: {
      id: '',
      Model: '',
    },
    updatedBySourceHistory: {
      updatedBy: '',
      updatedByHistoryModel: '',
      updatedAt: undefined,
    },
    meta: undefined,
  },
};

export const coreFields = {
  nativePermissions: undefined,
  deleted: undefined,
  deletedAt: undefined,
  createdBy: undefined,
  updatedBy: undefined,
  updatedByHistory: [],
  settings: {},
  external: {},
};
