import assert from 'node:assert';
import { NavigationError } from '#src/model/error';

export default class NavigationSceneModel {
  id;

  sequence;

  constructor(id, sequence) {
    assert(typeof id === 'string' || typeof id === 'number', new NavigationError('invalid scene id'));
    assert(typeof sequence === 'string', new NavigationError('invalid scene sequence'));

    this.id = id;
    this.sequence = sequence;
  }

  static deserialize(json) {
    try {
      return new NavigationSceneModel(
        json?.id,
        json?.sequence,
      );
    } catch (err) {
      throw new NavigationError(err);
    }
  }
}

export { NavigationSceneModel };
