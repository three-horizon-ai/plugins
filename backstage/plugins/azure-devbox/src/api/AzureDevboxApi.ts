import { AzureDevboxApi, DevBox } from './AzureDevboxApi.types.ts';
import { IdentityApi, DiscoveryApi } from '@backstage/core-plugin-api';

export class AzureDevboxClient implements AzureDevboxApi {
  constructor(
    private readonly identityApi: IdentityApi,
    private readonly discoveryApi: DiscoveryApi,
  ) {}

  async listDevboxes(): Promise<DevBox[]> {
    console.log('AzureDevboxClient: Starting listDevboxes()');
    const { token } = await this.identityApi.getCredentials();
    console.log('AzureDevboxClient: Retrieved token', token);
    const baseUrl = await this.discoveryApi.getBaseUrl('azure-devbox');
    console.log('AzureDevboxClient: Retrieved baseUrl', baseUrl);
    const resp = await fetch(`${baseUrl}/list-devboxes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('AzureDevboxClient: Fetch response', resp);

    if (!resp.ok) {
      throw new Error(`Failed to fetch devboxes: ${resp.statusText}`);
    }

//       const discoveryApi = useApi(discoveryApiRef);
//   const { value, loading, error } = useAsync(async (): Promise<DevBox[]> => {
//     console.log('Fetching baseUrl from discoveryApi...');
//     const baseUrl = await discoveryApi.getBaseUrl('azure-devbox');
//     console.log('Fetching data from API... '+baseUrl);
//     const response = await fetch(`${baseUrl}/list-devboxes`);
//     // const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     // });

//     const data = await response.json();
//     console.log('Data from API:', data);
//     // Would use fetch in a real world example
//     // return exampleUsers.results;
//     return data;
//   }, []);

//   if (loading) {
//     return <Progress />;
//   } else if (error) {
//     return <ResponseErrorPanel error={error} />;
//   }

    return resp.json();
  }
}
