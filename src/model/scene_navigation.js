import assert from 'node:assert';
import { SceneNavigationError } from '#src/model/error';

export default class SceneNavigationModel {
  constructor(next, previous) {
    assert(typeof next === 'string', new SceneNavigationError('invalid scene navigation next'));
    assert(typeof previous === 'string', new SceneNavigationError('invalid scene navigation previous'));

    this.next = next;
    this.previous = previous;
  }
}

export { SceneNavigationModel };
