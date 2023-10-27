import { ApplicationService } from '#src/service/application';
import YamlLoader from '#src/lib/yaml-loader';
import { log } from '#src/lib/log';

const configFile = './src/config/default.yaml';

const config = YamlLoader(configFile);

if (config) log.green('Config', configFile, 'was loaded');

new ApplicationService(config.port, config.mapping, {
  midiIn: 'Gestionnaire IAC Bus 1',
  midiOut: 'Gestionnaire IAC Bus 1',
}) // TODO :
  .midiConnect()
  .serve();
