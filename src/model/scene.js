import assert from 'node:assert';
import { MappingModel } from '#src/model/mapping';
import { SceneError } from '#src/model/error';

export default class SceneModel {
  constructor(id, mappings, { label } = {}) {
    assert(typeof id === 'string' || typeof id === 'number', new SceneError('invalid id'));
    assert(Array.isArray(mappings), new SceneError('invalid mapping'));

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

    if (label) {
      assert(typeof label === 'string', new SceneError('invalid label'));
      this.label = label;
    }
  }

  static deserialize(json) {
    try {
      return new SceneModel(
        json?.id,
        json?.mappings,
        { label: json?.label },
      );
    } catch (err) {
      throw new SceneError(err);
    }
  }
}

export { SceneModel };
