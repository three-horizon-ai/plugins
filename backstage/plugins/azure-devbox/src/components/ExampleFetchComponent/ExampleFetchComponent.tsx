import React from 'react';
import { Link, Button } from '@material-ui/core';
import {
  Table,
  TableColumn,
} from '@backstage/core-components';
import {useApi } from '@backstage/core-plugin-api';
import { azureDevboxApiRef } from '../../api/AzureDevboxApiRef.ts';
import { DevBox } from '../../api/AzureDevboxApi.types.ts';
import { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

const DenseTable = () => {
  const devboxApi = useApi(azureDevboxApiRef);
  const [devboxes, setDevboxes] = useState<DevBox[]>([]);

const msalConfig = {
  auth: {
    clientId: '62ac47b7-e8ea-4ee0-a05a-1a5af8e48cd8', // Replace with your Azure AD client ID
    authority: 'https://login.microsoftonline.com/2a156722-5941-4c63-b535-f5370769efc7', // Replace with your tenant ID
    redirectUri: window.location.origin,
  },
};
  const msalInstance = new PublicClientApplication(msalConfig);
  

  const handleSearch = async () => {
    console.log('Search button clicked');
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ['https://devcenter.azure.com/.default'],
      });
      const accessToken = loginResponse.accessToken;
      console.log('Access token:', accessToken);
      devboxApi.listDevboxes(accessToken).then(setDevboxes).catch(console.error);

    } catch (err) {
      console.error('Login or fetch failed:', err);
    }
  };

  useEffect(() => {
    // devboxApi.listDevboxes('accessToken').then(setDevboxes).catch(console.error);
  }, [devboxApi]);
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Project', field: 'project' },
    // { title: 'Location', field: 'location' },
    // { title: 'OS', field: 'os' },
    { title: 'vCPUs', field: 'vcpus', type: 'numeric' },
    { title: 'Mem (GB)', field: 'memory', type: 'numeric' },
    { title: 'Disk (GB)', field: 'disk', type: 'numeric' },
    { title: 'Connected', field: 'lastConnected' },
    { title: 'Link', field: 'link' },
  ];
  
  const data = devboxes.map(devbox => ({
    
    name: devbox.name,
    status: devbox.provisioningState,
    project: devbox.projectName,
    location: devbox.location,
    os: devbox.osType,
    vcpus: devbox.hardwareProfile?.vCPUs ?? 0,
    memory: devbox.hardwareProfile?.memoryGB ?? 0,
    disk: devbox.storageProfile?.osDisk?.diskSizeGB ?? 0,
    lastConnected: devbox.lastConnectedTime
      ? new Date(devbox.lastConnectedTime).toLocaleString()
      : 'Never',
    link: (
      <Link href={devbox.remoteConnection.webUrl} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
        Open
      </Link>
    ),
  }));

return (
  <>
    <Button variant="contained" color="primary" onClick={handleSearch}>
      Search
    </Button>
    <Table
      title="Dev Boxes"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  </>
);
};



export const ExampleFetchComponent = () => {

  return <DenseTable />;
};
