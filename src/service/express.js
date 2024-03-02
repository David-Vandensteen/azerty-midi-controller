import { Server } from 'node:http';
import express from 'express';
import death from 'death';
import appRouter from '#src/router/app';
import { log } from 'custom-console-log';

export default class ExpressService {
  static run(host, port) {
    if (host === undefined) throw new Error('express host is undefined');
    if (port === undefined) throw new Error('express port is undefined');

    const app = express();
    const appServer = new Server(app);
    app.use('/', appRouter);

    appServer.listen(port, host, () => {
      log.green('web app server listening', host, port);
    });

    death(async () => {
      await appServer.close();
      log.green('web app server closed');
    });
  }
}

export { ExpressService };
