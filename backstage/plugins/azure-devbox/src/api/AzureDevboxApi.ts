import { AzureDevboxApi, DevBox } from './AzureDevboxApi.types.ts';
import { IdentityApi, DiscoveryApi } from '@backstage/core-plugin-api';

export class AzureDevboxClient implements AzureDevboxApi {
  constructor(
    private readonly identityApi: IdentityApi,
    private readonly discoveryApi: DiscoveryApi,
  ) {}

  async listDevboxes(microsoftAccessToken: string ): Promise<DevBox[]> {
    console.log('AzureDevboxClient: listDevboxes called with token:', microsoftAccessToken);

    const { token } = await this.identityApi.getCredentials();
    console.log('AzureDevboxClient: Retrieved token', token);
    const baseUrl = await this.discoveryApi.getBaseUrl('azure-devbox');
    console.log('AzureDevboxClient: Retrieved baseUrl', baseUrl);
    const resp = await fetch(`${baseUrl}/list-devboxes`, {
      headers: { 
          Authorization: `Bearer ${token}` ,
        'custom-msft-access-token': microsoftAccessToken },
    });
    console.log('AzureDevboxClient: Fetch response', resp);

    if (!resp.ok) {
      throw new Error(`Failed to fetch devboxes: ${resp.statusText}`);
    }

    return resp.json();
  }
}
