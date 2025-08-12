import { HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { AzureDevboxService } from './services/AzureDevboxService';

export async function createRouter({
  service,
}: {
  httpAuth: HttpAuthService;
  service: AzureDevboxService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/list-devboxes', async (_req, res) => {
    console.log('list-devboxes API: ' +service);
    service.listDevBoxes('projectName A', 'userId vinicius').then((devboxes) => {
      console.log('DevBoxesResponse: ', devboxes);
      console.log('DevBoxesResponseValue: ', devboxes.value);
      res.json(devboxes.value);
    }).catch((error) => {
      console.error('Error fetching devboxes:', error);
      res.status(500).json({ error: 'Failed to fetch devboxes' });
    });
    
});

  return router;
}
