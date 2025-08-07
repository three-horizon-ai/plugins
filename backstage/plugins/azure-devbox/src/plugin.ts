import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const azureDevboxPlugin = createPlugin({
  id: 'azure-devbox',
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
