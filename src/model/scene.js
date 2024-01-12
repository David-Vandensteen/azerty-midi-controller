import assert from 'node:assert';
import { MappingModel } from '#src/model/mapping';
import { ObjectError } from '#src/model/error';

export default class SceneModel {
  constructor(id, sequence, mappings, { label } = {}) {
    assert(typeof id === 'string' || typeof id === 'number', new ObjectError('invalid scene id'));
    assert(typeof sequence === 'string', new ObjectError('invalid scene sequence'));
    assert(Array.isArray(mappings), new ObjectError('invalid scene mapping'));

    this.id = id;
    this.sequence = sequence;

    this.mappings = mappings.map(
      (mapping) => new MappingModel(
        mapping.sequence,
        mapping.type,
        mapping.controller,
        mapping.channel,
        {
          increment: mapping.increment,
          label: mapping.label,
        },
      ),
    );

    if (label !== undefined) this.label = label;
  }
}

export { SceneModel };
