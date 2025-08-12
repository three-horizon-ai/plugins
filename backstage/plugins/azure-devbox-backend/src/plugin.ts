import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
// import { createTodoListService } from './services/TodoListService';
import { AzureDevboxService } from './services/AzureDevboxService/azureDevboxService';


/**
 * azureDevboxPlugin backend plugin
 *
 * @public
 */
export const azureDevboxPlugin = createBackendPlugin({
  pluginId: 'azure-devbox',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
        config: coreServices.rootConfig,
      },
      async init({ logger, auth, httpAuth, httpRouter, catalog, config }) {
       const subscriptionId = config.getString('azureDevBox.subscriptionId');
       const tenantId = config.getString('azureDevBox.tenantId');
       const clientId = config.getString('azureDevBox.clientId');
       const clientSecret = config.getString('azureDevBox.clientSecret');
       const devCenterURI = config.getString('azureDevBox.devCenterURI');
       
       console.log('AzureDevboxService subscriptionId: '+ subscriptionId)
       console.log('AzureDevboxService config: ', logger, auth, catalog);
        const service = new AzureDevboxService({
          tenantId: tenantId || '',
          clientId: clientId || '',
          clientSecret: clientSecret || '',
          devCenterURI: devCenterURI || '',
        });
        console.log('AzureDevboxService initialized:'+ service)
        httpRouter.use(
          await createRouter({
            httpAuth,
            service,
          }),
        );

      },
    });
  },
});
