import assert from 'node:assert';
import { MappingModel } from '#src/model/mapping';
import { ObjectError } from '#src/model/error';

export default class SceneModel {
  constructor(id, mappings, { sequence, label } = {}) {
    assert(typeof id === 'string' || typeof id === 'number', new ObjectError('invalid id'));
    assert(Array.isArray(mappings), new ObjectError('invalid mapping'));

    this.id = id;

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

    if (sequence) {
      assert(typeof sequence === 'string', new ObjectError('invalid sequence'));
      this.sequence = sequence;
    }

    if (label) {
      assert(typeof label === 'string', new ObjectError('invalid label'));
      this.label = label;
    }
  }
}

export { SceneModel };
