import config from 'config';
import express, { Express } from 'express';
import http from 'http';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import wordCountEndpoint from './src/word-counter';
import wordStatisticsEndpoint from './src/word-statistics';
import { errorHandler } from './src/utils/error-handler';
import databseConnection from './src/utils/database-connection';

const app: Express = express();

const PORT: number = parseInt(process.env.PORT as string, 10) || config.get('server.port');

// Middlewares
app.use(helmet());
app.use(compression());
app.use(bodyParser.text({ limit: '50gb' }));

// Routing and endpoints
app.use('/word-counter', wordCountEndpoint);
app.use('/word-statistics', wordStatisticsEndpoint);

// Error handling
app.use(errorHandler);

// Server
const server: http.Server = app.listen(PORT, err => {
  if (err) {
    // tslint:disable-next-line: no-console
    return console.error(err);
  }
  // tslint:disable-next-line: no-console
  return console.log(`server is listening on ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');

  server.close(() => {
    console.log('Http server closed.');

    databseConnection.close((err: Error | null) => {
      if (err) {
        console.error(err.message);
      }
      console.log('SQLite connection closed.');
      process.exit(0);
    });
  });
});