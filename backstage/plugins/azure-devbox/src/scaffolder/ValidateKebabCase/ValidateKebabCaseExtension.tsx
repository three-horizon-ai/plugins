//packages/app/src/scaffolder/ValidateKebabCase/ValidateKebabCaseExtension.tsx
import React, { useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import {Card, CardContent, Button, FormControl, InputLabel, Input, FormHelperText} from '@material-ui/core';
import { PublicClientApplication } from '@azure/msal-browser';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';

/*
 This is the actual component that will get rendered in the form
*/

// Example config
const msalConfig = {
  auth: {
    clientId: '62ac47b7-e8ea-4ee0-a05a-1a5af8e48cd8', // Replace with your Azure AD client ID
    authority: 'https://login.microsoftonline.com/2a156722-5941-4c63-b535-f5370769efc7', // Replace with your tenant ID
    redirectUri: window.location.origin,
  },
};

export const ValidateKebabCase = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<string>) => {
  
  const [] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Backstage storage API (persists tokens in local storage/session storage)
  const storageApi = useApi(storageApiRef);

  const handleLogin = async () => {
    setIsLoading(true);

    const msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();

    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ['https://devcenter.azure.com/.default'],
      });

      const accessToken = loginResponse.accessToken;
      console.log('Access token:', accessToken);

      // Store token for later use (ex: to inject into Software Templates)
      await storageApi.set('devcenter-access-token', accessToken);

      // Set accessToken in the Input field with id 'name'
      const inputElement = document.getElementById('name') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = accessToken;
        // Call the onChange handler directly
        onChange(accessToken);
      }

    } catch (err) {
      console.error('Login or fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <FormControl
          margin="normal"
          required={required}
          error={rawErrors?.length > 0 && !formData}
        >
          <InputLabel htmlFor="validateName">Access Token</InputLabel>
          <Input
            id="name"
            aria-describedby="entityName"
            onChange={e => onChange(e.target?.value)}
          />
          <FormHelperText id="entityName">
            Click on Dev Center Login to fill the access token
          </FormHelperText>
        </FormControl>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleLogin}
          >
            Dev Center Login
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
