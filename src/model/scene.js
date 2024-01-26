import assert from 'node:assert';
import { MappingModel } from '#src/model/mapping';
import { SceneError } from '#src/model/error';

export default class SceneModel {
  id;

  mappings;

  constructor(id, mappings, { label } = {}) {
    assert(typeof id === 'string' || typeof id === 'number', new SceneError('invalid id'));
    assert(Array.isArray(mappings), new SceneError('invalid mappings'));
    assert(mappings.every((mapping) => mapping instanceof MappingModel), new SceneError('invalid mappings'));

    this.id = id;
    this.mappings = mappings;

    if (label) {
      assert(typeof label === 'string', new SceneError('invalid label'));
      this.label = label;
    }
  }

  static deserialize(json) {
    try {
      return new SceneModel(
        json?.id,
        json?.mappings?.map((mapping) => MappingModel.deserialize(mapping)),
        { label: json?.label },
      );
    } catch (err) {
      throw new SceneError(err);
    }
  }
}

export { SceneModel };
