#! /usr/bin/env node
import { ConfigLoaderService } from '#src/service/config_loader';
import { argService } from '#src/service/arg';
import { AzertyMidiControllerManager } from '#src/index';
import { ExpressService } from '#src/service/express';
import ON_DEATH from 'death';

const runApplication = () => {
  const config = new ConfigLoaderService(argService.get().config).get();
  const application = new AzertyMidiControllerManager(
    config,
    { forceLocal: argService.forceLocal },
  );
  console.log(config);

  ExpressService.run('127.0.0.1', config?.web?.api?.port);

  ON_DEATH(() => { application.dispose(); });
};

runApplication();
