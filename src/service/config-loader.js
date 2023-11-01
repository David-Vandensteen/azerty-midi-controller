/* eslint-disable lines-between-class-members */
import YamlLoader from '#src/lib/yaml-loader';
import { MappingModel } from '#src/model/mapping';
import { PageModel } from '#src/model/page';
import { log } from 'custom-console-log';

import {
  ConfigError,
  MappingError,
  PageError,
  PagesError,
} from '#src/model/error';

export default class ConfigLoaderService {
  #config;
  constructor(configFile) {
    log.magenta('Try to load', configFile);
    this.#config = YamlLoader(configFile);
    this.#parse();

    log.green(configFile, 'is loaded');
  }

  get() { return this.#config; }

  #parse() {
    if (!this.#config) throw new ConfigError('config is undefined or null');
    if (!this.#config.mapping) throw new MappingError('mapping is undefined or null');
    if (!this.#config.pages) throw new PagesError('pages is undefined or null');

    const { mapping, pages } = this.#config;

    pages.forEach((page) => {
      try {
        (() => new PageModel(page))();
      } catch (err) {
        if (err instanceof PageError) {
          const messsage = `${err.message} ${JSON.stringify(page)}`;
          log.red(messsage);
          throw new PageError(messsage);
        }
        throw err;
      }
    });

    mapping.forEach((map) => {
      try {
        (() => new MappingModel(map))();
      } catch (err) {
        if (err instanceof MappingError) {
          const messsage = `${err.message} ${JSON.stringify(map)}`;
          log.red(messsage);
          throw new MappingError(messsage);
        }
        throw err;
      }
    });
  }
}

export { ConfigLoaderService };
