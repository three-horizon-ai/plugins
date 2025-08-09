import { createApiRef } from '@backstage/core-plugin-api';
import { AzureDevboxApi } from './AzureDevboxApi.types';

export const azureDevboxApiRef = createApiRef<AzureDevboxApi>({
  id: 'plugin.azure-devbox.service',
});
