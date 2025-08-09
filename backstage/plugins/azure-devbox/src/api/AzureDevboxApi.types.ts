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
  };
}

export interface AzureDevboxApi {
  listDevboxes(): Promise<DevBox[]>;
}
