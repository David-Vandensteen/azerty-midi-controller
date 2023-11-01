#! /usr/bin/env node
import { ConfigLoaderService } from '#src/service/config-loader';
import { argService } from '#src/service/arg';
import { ApplicationService } from '#src/index';

const config = new ConfigLoaderService(argService.get().config).get();
const options = {};

if (config.midiIn) options.midiIn = config.midiIn;
if (config.midiOut) options.midiOut = config.midiOut;

const application = new ApplicationService(
  config.port,
  config.pages,
  config.mapping,
  options ?? {},
);

if (options?.midiIn ?? options?.midiOut) application.midiConnect();

application.serve();
