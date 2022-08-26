export const commonSettings = {
  theme: undefined,
  hosts: undefined,
  instances: undefined,
  applications: undefined,
  domains: undefined,
  environments: undefined,
  accounts: undefined,
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
      id: undefined,
      Model: undefined,
    },
    updatedBySource: {
      id: undefined,
      Model: undefined,
    },
    updatedBySourceHistory: {
      updatedBy: undefined,
      updatedByHistoryModel: undefined,
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
  settings: undefined,
  external: undefined,
};
