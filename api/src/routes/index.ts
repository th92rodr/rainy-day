import { Router } from 'express';

import weatherRoutes from './weather.routes';

const routes = Router();

routes.use('/weather', weatherRoutes);

routes.use('*', (request, response) => {
  return response.status(404).json({ message: 'Not Found' });
});

export default routes;
