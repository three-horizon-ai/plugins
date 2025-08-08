import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { TodoListService } from './services/TodoListService/types';

export async function createRouter({
  httpAuth,
  todoListService,
}: {
  httpAuth: HttpAuthService;
  todoListService: TodoListService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  // TEMPLATE NOTE:
  // Zod is a powerful library for data validation and recommended in particular
  // for user-defined schemas. In this case we use it for input validation too.
  //
  // If you want to define a schema for your API we recommend using Backstage's
  // OpenAPI tooling: https://backstage.io/docs/next/openapi/01-getting-started
  const todoSchema = z.object({
    title: z.string(),
    entityRef: z.string().optional(),
  });

  router.post('/todos', async (req, res) => {
    const parsed = todoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const result = await todoListService.createTodo(parsed.data, {
      credentials: await httpAuth.credentials(req, { allow: ['user'] }),
    });

    res.status(201).json(result);
  });

  router.get('/todos', async (_req, res) => {
    res.json(await todoListService.listTodos());
  });

  router.get('/todos/:id', async (req, res) => {
    res.json(await todoListService.getTodo({ id: req.params.id }));
  });

  router.get('/list-devboxes', async (_req, res) => {
    console.log('list-devboxes API:');
  // Call Azure Dev Box REST API using token/config
  // const result = await fetch('https://management.azure.com/....', {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const json = await result.json();
  const json = [
      {
        "uri": "https://8a40af38-3b4c-4672-a6a4-5e964b1870ed-contosodevcenter.centralus.devcenter.azure.com/projects/myProject/users/b08e39b4-2ac6-4465-a35e-48322efb0f98/devboxes/MyDevBox",
        "name": "MyDevBox",
        "provisioningState": "Succeeded",
        "projectName": "ContosoProject",
        "poolName": "LargeDevWorkStationPool",
        "location": "centralus",
        "osType": "Windows",
        "user": "b08e39b4-2ac6-4465-a35e-48322efb0f98",
        "lastConnectedTime": "2022-04-01T00:13:23.323Z",
        "hardwareProfile": {
          "vCPUs": 8,
          "memoryGB": 32
        },
        "storageProfile": {
          "osDisk": {
            "diskSizeGB": 1024
          }
        },
        "hibernateSupport": "Enabled",
        "imageReference": {
          "name": "DevImage",
          "version": "1.0.0",
          "publishedDate": "2022-03-01T00:13:23.323Z"
        }
      },
      {
        "uri": "https://8a40af38-3b4c-4672-a6a4-5e964b1870ed-contosodevcenter.centralus.devcenter.azure.com/projects/myProject/users/b08e39b4-2ac6-4465-a35e-48322efb0f98/devboxes/MyDevBox",
        "name": "MyDevBox",
        "provisioningState": "Failed",
        "projectName": "ContosoProject",
        "poolName": "LargeDevWorkStationPool",
        "location": "centralus",
        "osType": "Windows",
        "user": "b08e39b4-2ac6-4465-a35e-48322efb0f98",
        "lastConnectedTime": "2022-04-01T00:13:23.323Z",
        "hardwareProfile": {
          "vCPUs": 8,
          "memoryGB": 32
        },
        "storageProfile": {
          "osDisk": {
            "diskSizeGB": 1024
          }
        },
        "hibernateSupport": "Enabled",
        "imageReference": {
          "name": "DevImage",
          "version": "1.0.0",
          "publishedDate": "2022-03-01T00:13:23.323Z"
        }
     
  }];
  res.json(json);
});

  return router;
}
