import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { azureDevboxApiRef } from './api/AzureDevboxApiRef.ts';
import { AzureDevboxClient } from './api/AzureDevboxApi.ts';

export const azureDevboxPlugin = createPlugin({
  id: 'azure-devbox',
  apis: [
    createApiFactory({
      api: azureDevboxApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new AzureDevboxClient(identityApi, discoveryApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const AzureDevboxPage = azureDevboxPlugin.provide(
  createRoutableExtension({
    name: 'AzureDevboxPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
