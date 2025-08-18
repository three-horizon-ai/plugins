import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';


export const ExampleComponent = () => {
  

  return (
    <Page themeId="tool">
      <Header title="Welcome to azure-devbox!" subtitle="">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
          <ExampleFetchComponent />
      </Content>
    </Page>
  );
};
