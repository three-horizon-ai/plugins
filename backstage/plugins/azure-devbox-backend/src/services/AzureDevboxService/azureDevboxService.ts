// azureDevboxService.ts
import fetch from 'node-fetch';

export interface AzureDevboxServiceOptions {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  devCenterURI: string;
}


export class AzureDevboxService {
  private tenantId: string;
  private clientId: string;
  private clientSecret: string;
  private devCenterURI: string;

  private token?: string;
  private tokenExpiresAt?: number;

  constructor(options: AzureDevboxServiceOptions) {
    this.tenantId = options.tenantId;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.devCenterURI = options.devCenterURI;
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
    params.append('scope', 'https://devcenter.azure.com/.default');
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

    console.log('AzureDevboxService: listDevBoxes called with', { projectName, userId });
    
    const accessToken = await this.getAccessToken();

    // Use discovery API if you have a custom proxy for Azure management API (optional)
    // Otherwise fallback to direct URL:
    const baseUrl = this.devCenterURI;

    const url = `${baseUrl}/devboxes?api-version=2025-02-01`;
    console.log('AzureDevboxService: Fetching devboxes from URL:', url);
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
