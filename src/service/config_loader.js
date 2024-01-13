import YamlLoader from '#src/lib/yaml_loader';
import { ConfigModel } from '#src/model/config';
import { log } from 'custom-console-log';

export default class ConfigLoaderService {
  #config;

  constructor(configFile) {
    log.magenta('try to load', configFile);
    this.#config = YamlLoader(configFile);
    this.#parse();
  }

  #parse() {
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
  }

  get() { return this.#config; }
}

export { ConfigLoaderService };
