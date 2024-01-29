import assert from 'node:assert';
import EventEmitter from 'events';
import { MappingModel } from '#src/model/mapping';
import { MappingService } from '#src/service/mapping';
import { GlobalError } from '#src/model/error';

export default class GlobalService extends EventEmitter {
  #mappingService;

  constructor({ mappings }) {
    assert(mappings.every((mapping) => mapping instanceof MappingModel), new GlobalError('invalid mappings'));
    super();
    if (global === undefined) throw new GlobalError('global is undefined');

    this.#mappingService = new MappingService(mappings);
    this.#listenMappingService();
  }

  #listenMappingService() {
    this.#mappingService.on('mapping', (mapping) => {
      assert(mapping instanceof MappingModel, new GlobalError('invalid mapping'));
      this.emit('global', mapping);
    });
  }

  handle(sequence) {
    if (sequence === undefined) throw new GlobalError('sequence is undefined');
    this.#mappingService.handle(sequence);
  }
}

export { GlobalService };
