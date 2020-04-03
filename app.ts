import config from 'config';
import http from 'http';

import databseConnection from './src/utils/database-connection';

import app from './server';

const PORT: number = parseInt(process.env.PORT as string, 10) || config.get('server.port');

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
  console.info('Shutting down the server...');

  server.close(() => {
    databseConnection.close((err: Error | null) => {
      if (err) {
        console.error(err.message);
      }
      console.log('SQLite connection closed.');
      process.exit(0);
    });
  });
});