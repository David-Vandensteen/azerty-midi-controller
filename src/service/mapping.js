import EventEmitter from 'events';

export default class MappingService extends EventEmitter {
  #mappings;

  set(mappings) {
    this.#mappings = mappings;
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
