import EventEmitter from 'events';
import { MappingError } from '#src/model/error';

export default class MappingService extends EventEmitter {
  #mappings;

  constructor(mappings) {
    super();
    if (mappings === undefined) throw new MappingError('mappings is undefined');

    this.#mappings = mappings;
  }

  handle(sequence) {
    if (sequence === undefined) throw new MappingError('sequence is undefined');
    this.#mappings.forEach((mapping) => {
      if (sequence === mapping.sequence) this.emit('mapping', mapping);
    });
  }

  set(mappings) {
    if (mappings === undefined) throw new MappingError('mappings is undefined');
    this.#mappings = mappings;
  }
}

export { MappingService };
