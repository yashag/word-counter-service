import express, { Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';

import wordCountEndpoint from './src/word-counter';
import wordStatisticsEndpoint from './src/word-statistics';
import { errorHandler } from './src/utils/error-handler';

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(compression());

app.use(express.json());

// Routing and endpoints
app.use('/word-counter', wordCountEndpoint);
app.use('/word-statistics', wordStatisticsEndpoint);

// Error handling
app.use(errorHandler);

export default app;