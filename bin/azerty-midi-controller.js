#! /usr/bin/env node
import { argService } from '#src/service/arg';
import { ApplicationService } from '#src/index';
import YamlLoader from '#src/lib/yaml-loader';
import { log } from 'custom-console-log';

const configFile = argService.get().config;
const config = YamlLoader(configFile);
const options = {};

log.green('Config', configFile, 'was loaded');

if (config.midiIn) options.midiIn = config.midiIn;
if (config.midiOut) options.midiOut = config.midiOut;

const application = new ApplicationService(config.port, config.mapping, options ?? {});

if (options?.midiIn ?? options?.midiOut) application.midiConnect();

application.serve();
