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
        console.log('list-devboxes API: ' + service);
        const authHeader = _req.headers.authorization;
        if (!authHeader) {
          return res.status(401).send('No token provided');
        }
        const token = authHeader.replace(/^Bearer\s+/i, '');
        console.log('list-devboxes: Retrieved token', token);

       

        try {
          console.log('list-devboxes: Headers', _req.headers);
          let msftToken = _req.headers['custom-msft-access-token'];
          console.log('list-devboxes: Raw msftToken', msftToken);
          console.log('list-devboxes: Type of msftToken', typeof msftToken);
          if (Array.isArray(msftToken)) {
            msftToken = msftToken[0];
          }
          if (typeof msftToken !== 'string' || !msftToken) {
            return res.status(400).send('Invalid or missing Custom-MSFT-Access-Token');
          }
          console.log('list-devboxes: Retrieved msftToken', msftToken);
          const devboxes = await service.listDevBoxes(token, msftToken);
          console.log('DevBoxesResponse: ', devboxes);
          return res.json(devboxes.value);
        } catch (error) {
          console.error('Error fetching devboxes:', error);
          return res.status(500).json({ error: 'Failed to fetch devboxes' });
        }
    });

  return router;
}
