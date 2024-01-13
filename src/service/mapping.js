import EventEmitter from 'events';
import { log } from 'custom-console-log';

export default class MappingService extends EventEmitter {
  #mappings;

  set(mappings) {
    this.#mappings = mappings;
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
