import React from 'react';
import { Link } from '@material-ui/core';
import {
  Table,
  TableColumn,
} from '@backstage/core-components';
import {useApi } from '@backstage/core-plugin-api';
import { azureDevboxApiRef } from '../../api/AzureDevboxApiRef.ts';
import { DevBox } from '../../api/AzureDevboxApi.types.ts';
import { useEffect, useState } from 'react';

export const DenseTable = () => {
  
  const devboxApi = useApi(azureDevboxApiRef);
  const [devboxes, setDevboxes] = useState<DevBox[]>([]);

  useEffect(() => {
    devboxApi.listDevboxes().then(setDevboxes).catch(console.error);
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
  console.log('Rendering DenseTable with devboxes:', devboxes);
  
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
      <Link href={devbox.uri} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
        Open
      </Link>
    ),
  }));

  return (
    <Table
      title="Dev Boxes"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};


export const ExampleFetchComponent = () => {
  
  // const discoveryApi = useApi(discoveryApiRef);
  // const { value, loading, error } = useAsync(async (): Promise<DevBox[]> => {
  //   console.log('Fetching baseUrl from discoveryApi...');
  //   const baseUrl = await discoveryApi.getBaseUrl('azure-devbox');
  //   console.log('Fetching data from API... '+baseUrl);
  //   const response = await fetch(`${baseUrl}/list-devboxes`);
  //   // const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   // });

  //   const data = await response.json();
  //   console.log('Data from API:', data);
  //   // Would use fetch in a real world example
  //   // return exampleUsers.results;
  //   return data;
  // }, []);

  // if (loading) {
  //   return <Progress />;
  // } else if (error) {
  //   return <ResponseErrorPanel error={error} />;
  // }

  return <DenseTable/>;
};
