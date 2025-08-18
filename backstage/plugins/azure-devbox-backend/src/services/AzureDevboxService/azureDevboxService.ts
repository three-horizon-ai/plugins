// import fetch from 'node-fetch';
import https from 'https';
import { URLSearchParams } from 'url';

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

  constructor(options: AzureDevboxServiceOptions) {
    this.tenantId = options.tenantId;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.devCenterURI = options.devCenterURI;
  }

  
  public async listDevBoxes(backstageToken: string, msftToken: string): Promise<any> {

    console.log('AzureDevboxService: listDevBoxes called with', { backstageToken });
    
    const userId = 'me';
    console.log("USERID: ", userId);
    // console.log('AzureDevboxService: Retrieved subject from token', sub);
    const bxs = await this.listDevBoxes2(msftToken, userId);
    console.log('AzureDevboxService: Retrieved devboxes:', bxs);

    // For each dev box, fetch its remoteConnection
    const devBoxesResult = bxs as { value: any[] };
    if (devBoxesResult && Array.isArray(devBoxesResult.value)) {
      const remoteConnections = await Promise.all(
        devBoxesResult.value.map(async (devbox: any) => {
          return await this.getRemoteConnectionForDevBox(devbox, msftToken);
        })
      );
      console.log('AzureDevboxService: Retrieved remote connections:', remoteConnections);
      devBoxesResult.value = remoteConnections;
    }
    return bxs;
  }
  /**
   * Fetch remoteConnection for a given dev box
   */
  public  async getRemoteConnectionForDevBox(devbox: any, accessToken: string): Promise<any> {
    console.log('AzureDevboxService: getRemoteConnectionForDevBox called with', { devbox, accessToken });
    try {
      const remoteConnUrl = `${this.devCenterURI}/projects/${devbox.projectName}/users/me/devboxes/${devbox.name}/remoteConnection?api-version=2025-02-01`;
      console.log('AzureDevboxService: Remote connection URL:', remoteConnUrl);
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
      const remoteConnJson = await new Promise((resolve, reject) => {
        const req = https.get(remoteConnUrl, options, res => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          });
        });
        req.on('error', err => {
          reject(err);
        });
      });
      console.log('AzureDevboxService: Retrieved remoteConnection:', devbox, remoteConnJson);
      return { ...devbox, remoteConnection: remoteConnJson };
    } catch (err) {
      console.error(`Error fetching remoteConnection for devbox ${devbox.name}:`, err);
      return { ...devbox, remoteConnection: null };
    }

  }


  getAccessToken2(): Promise<string> {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: 'https://devcenter.azure.com/.default'
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const req = https.request(
            `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`,
            options,
            res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.access_token);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        );

        req.on('error', reject);
        req.write(params.toString());
        req.end();
    });
  }

  listDevBoxes2(accessToken: string, userId: string) {
    const url = `${this.devCenterURI}/projects/your-project-name/users/${userId}/devboxes?api-version=2025-02-01`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    return new Promise((resolve, reject) => {
      const req = https.get(url, options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
            resolve(json);
          } catch (err) {
            console.log(data);
            reject(err);
          }
        });
      });
      req.on('error', err => {
        console.error('Error:', err);
        reject(err);
      });
    });
  }

  

}
