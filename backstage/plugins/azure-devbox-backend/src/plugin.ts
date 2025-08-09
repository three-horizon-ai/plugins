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
       console.log('AzureDevboxService subscriptionId: '+ subscriptionId)
       console.log('AzureDevboxService config: ', logger, auth, catalog);
        const service = new AzureDevboxService({
          tenantId: process.env.AZURE_TENANT_ID || '',
          clientId: process.env.AZURE_CLIENT_ID || '',
          clientSecret: process.env.AZURE_CLIENT_SECRET || '',
          subscriptionId: subscriptionId,
          devCenterName: process.env.AZURE_DEV_CENTER_NAME || '',
          resourceGroupName: process.env.AZURE_RESOURCE_GROUP_NAME || '',
        });
        console.log('AzureDevboxService initialized:'+ service)
        httpRouter.use(
          await createRouter({
            httpAuth,
            service,
          }),
        );

        // const todoListService = await createTodoListService({
        //   logger,
        //   auth,
        //   catalog,
        // });

        // httpRouter.use(
        //   await createRouter({
        //     httpAuth,
        //     todoListService,
        //   }),
        // );
      },
    });
  },
});
