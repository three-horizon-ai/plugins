import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { azureDevboxPlugin, AzureDevboxPage } from '../src/plugin';

createDevApp()
  .registerPlugin(azureDevboxPlugin)
  .addPage({
    element: <AzureDevboxPage />,
    title: 'Root Page',
    path: '/azure-devbox',
  })
  .render();
