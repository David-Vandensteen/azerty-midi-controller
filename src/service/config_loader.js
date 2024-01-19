import YamlLoader from '#src/lib/yaml_loader';
import { ConfigModel } from '#src/model/config';
import { log } from 'custom-console-log';

import {
  ConfigError,
  GlobalError,
  SceneNavigationError,
  SceneError,
  MappingError,
  TypeError,
} from '#src/model/error';

export default class ConfigLoaderService {
  #config;

  constructor(configFile) {
    if (configFile === undefined) throw new ConfigError('configFile is undefined');
    log.magenta('try to load', configFile);
    this.#config = YamlLoader(configFile);
    this.#parse();
  }

  #parse() {
    try {
      (() => new ConfigModel(
        this.#config.midiOut,
        this.#config.scenes,
        {
          midiIn: this.#config.midiIn,
          port: this.#config.port,
          sceneNavigation: this.#config.sceneNavigation,
          global: this.#config.global,
        },
      ))();
    } catch (err) {
      if (err instanceof SceneError) throw new SceneError(err);
      else if (err instanceof GlobalError) throw new GlobalError(err);
      else if (err instanceof SceneNavigationError) throw new SceneNavigationError(err);
      else if (err instanceof MappingError) throw new MappingError(err);
      else if (err instanceof TypeError) throw new TypeError(err);

      throw new ConfigError(err);
    }
  }

  get() { return this.#config; }
}

export { ConfigLoaderService };
