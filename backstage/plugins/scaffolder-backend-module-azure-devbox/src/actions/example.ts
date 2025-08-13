import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { DeviceCodeCredential } from "@azure/identity";
import AzureDeveloperDevCenter from "@azure-rest/developer-devcenter";

/**
 * Creates an `acme:example` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://example.com} for more information.
 *
 * @public
 */
export function createExampleAction() {
  // For more information on how to define custom actions, see
  //   https://backstage.io/docs/features/software-templates/writing-custom-actions
  return createTemplateAction<{
    devBoxName: string;
    projectName: string;
    poolName: string;
  }>({
    id: 'azure:create-devbox',
    description: 'Creates a new Azure Devbox',
    schema: {
      input: {
        type: 'object',
        required: ['devBoxName', 'projectName'],
        properties: {
          devBoxName: {
            title: 'Dev Box Name',
            description: "The Dev Box name, don't set it to foo",
            type: 'string',
          },projectName: {
            title: 'Project Name',
            default: 'your-project-name',
            description: "The Project name",
            type: 'string',
          },poolName: {
            title: 'Pool Name',
            description: "The Dev Box pool name",
            default: "three-horizons-pool",
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(
        `Running example template with parameters: ${ctx.input.devBoxName}`,
      );

      if (ctx.input.devBoxName === 'foo') {
        throw new Error(`devBoxName cannot be 'foo'`);
      }

      ctx.logger.info("Creating Azure Dev Box..");
      const credential = new DeviceCodeCredential({
        // tenantId: "2a156722-5941-4c63-b535-f5370769efc7", // optional
        userPromptCallback: (info) => {
          ctx.logger.info(info.message);
        },
      });
      ctx.logger.info("DeviceCodeCredential created successfully");

      // Request a token for Azure Resource Manager scope
      // const token: AccessToken | null = await credential.getToken("https://management.azure.com/.default", {requestOptions:{timeout: 60000}});
      // ctx.logger.info(`Access token: ${token?.token}`);
      const userId = "me"; // "me" means current authenticated user
      // const subscriptionId = "aca2dc4a-9d62-4b64-82d4-11e152d98f02"; // Your Azure subscription ID
      const endpoint = "https://2a156722-5941-4c63-b535-f5370769efc7-devbox-demo-paula.eastus.devcenter.azure.com"
      const client = AzureDeveloperDevCenter(endpoint, credential);
      //use the client to create a
      
      ctx.logger.info(`Creating Dev Box with name: ${ctx.input.devBoxName}`);
      
      const response = await client
        .path(
          "/projects/{projectName}/users/{userId}/devboxes/{devBoxName}",
          ctx.input.projectName,
          userId,
          ctx.input.devBoxName
        )
        .put({
          queryParameters: { "api-version": "2025-02-01" },
          body: { poolName: ctx.input.poolName },
          contentType: "application/json",
        });

      if (response.status === "200" || response.status === "201") {
        console.log("Dev Box created:", response.body);
      } else {
        console.error("Failed to create Dev Box:", response);
      }

      await new Promise(resolve => setTimeout(resolve, 60000));
    },
  });
}
