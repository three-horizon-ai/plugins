export interface DevBox {
  uri: string;
  name: string;
  provisioningState: string;
  projectName: string;
  poolName: string;
  location: string;
  osType: string;
  user: string;
  lastConnectedTime: string;
  hardwareProfile: {
    vCPUs: number;
    memoryGB: number;
  };
  storageProfile: {
    osDisk: {
      diskSizeGB: number;
    };
  };
  hibernateSupport: string;
  imageReference: {
    name: string;
    version: string;
    publishedDate: string;
  },
  remoteConnection: {
    webUrl: string,
    rdpConnectionUrl: string,
    cloudPcConnectionUrl: string
  }
}

export interface AzureDevboxApi {
  listDevboxes(microsoftAccessToken: string): Promise<DevBox[]>;
}
