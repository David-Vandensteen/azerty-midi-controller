#! /usr/bin/env node
import { ConfigLoaderService } from '#src/service/config_loader';
import { argService } from '#src/service/arg';
import { ApplicationService } from '#src/index';
import ON_DEATH from 'death';

const runApplication = () => {
  const config = new ConfigLoaderService(argService.get().config).get();
  const application = new ApplicationService(config);

  ON_DEATH(() => { application.dispose(); });

  application.run();
};

runApplication();
