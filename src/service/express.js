import { Server } from 'node:http';
import express from 'express';
import death from 'death';
import appRouter from '#src/router/app';
import { log } from 'custom-console-log';

export default class ExpressService {
  static run() {
    const app = express();
    const appServer = new Server(app);
    app.use('/', appRouter);

    appServer.listen(8080, 'localhost', () => {
      log.green('web app server listening');
    });

    death(async () => {
      await appServer.close();
      log.green('web app server closed');
    });
  }
}

export { ExpressService };
