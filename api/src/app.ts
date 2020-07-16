require('dotenv').config();

import express from 'express';
import { errors } from 'celebrate';

import routes from './routes';
import loggerMiddleware from './middlewares/logger';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use(routes);

app.use(errors());

export default app;
