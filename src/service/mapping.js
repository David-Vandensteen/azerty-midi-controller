import assert from 'node:assert';
import EventEmitter from 'events';
import { MappingModel } from '#src/model/mapping';
import { MappingError } from '#src/model/error';

export default class MappingService extends EventEmitter {
  #mappings;

  constructor(mappings) {
    super();
    assert(mappings.every((mapping) => mapping instanceof MappingModel), new MappingError('invalid mappings'));

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
