// azureDevboxService.ts
import fetch from 'node-fetch';

export interface AzureDevboxServiceOptions {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  subscriptionId: string;
  devCenterName: string;
  resourceGroupName: string;
}


export class AzureDevboxService {
  private tenantId: string;
  private clientId: string;
  private clientSecret: string;
  private subscriptionId: string;
  private devCenterName: string;
  private resourceGroupName: string;

  private token?: string;
  private tokenExpiresAt?: number;

  constructor(options: AzureDevboxServiceOptions) {
    this.tenantId = options.tenantId;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.subscriptionId = options.subscriptionId;
    this.devCenterName = options.devCenterName;
    this.resourceGroupName = options.resourceGroupName;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();

    if (this.token && this.tokenExpiresAt && now < this.tokenExpiresAt - 60000) {
      // return cached token if not expired (minus 1min buffer)
      return this.token;
    }

    const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('scope', 'https://management.azure.com/.default');
    params.append('grant_type', 'client_credentials');

    const res = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to get token: ${res.status} ${await res.text()}`);
    }

    const json = await res.json();

    this.token = json.access_token;
    this.tokenExpiresAt = now + json.expires_in * 1000;

    return this.token!;
  }

  public async listDevBoxes(
    projectName: string,
    userId: string,
  ): Promise<any> {


    
    const accessToken = await this.getAccessToken();

    // Use discovery API if you have a custom proxy for Azure management API (optional)
    // Otherwise fallback to direct URL:
    const baseUrl = `https://management.azure.com`;

    const url = `${baseUrl}/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroupName}/providers/Microsoft.DevCenter/devcenters/${this.devCenterName}/projects/${projectName}/users/${userId}/devboxes?api-version=2023-04-01`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${await res.text()}`);
    }

    return res.json();
  }
}
