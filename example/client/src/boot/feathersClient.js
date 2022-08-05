import feathersClient from '../api/feathers-client';
import feathersRestClient from '../api/feathers-rest-client';
import { batchClient } from 'feathers-batch/client';
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({Vue}) => {
  Vue.prototype.$feathersClient = feathersClient;
  Vue.prototype.$feathersRestClient = feathersRestClient;
  feathersClient.configure(batchClient({
    batchService: 'batch',
    exclude: ['authentication'],
  }));
};
