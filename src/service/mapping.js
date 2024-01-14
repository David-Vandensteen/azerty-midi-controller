import EventEmitter from 'events';
import { log } from 'custom-console-log';

export default class MappingService extends EventEmitter {
  #mappings;

  #globalMappings;

  constructor({ globalMappings } = {}) {
    super();
    if (globalMappings) this.#globalMappings = globalMappings;
  }

  set(mappings) {
    this.#mappings = this.#globalMappings !== undefined
      ? [...mappings, ...this.#globalMappings]
      : mappings;

    this.#mappings.forEach((mapping) => {
      if (mapping.label) {
        log.blue(mapping.label, mapping.sequence);
      }
    });

    return this;
  }

  handle(sequence) {
    this.#mappings.forEach((mapping) => {
      if (sequence === mapping.sequence) this.emit('mapping', mapping);
    });

    return this;
  }
}

export { MappingService };
