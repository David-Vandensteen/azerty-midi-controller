import assert from 'node:assert';
import { SceneNavigationError } from '#src/model/error';

export default class SceneNavigationModel {
  next;

  previous;

  constructor(next, previous, { scenes } = {}) {
    assert(typeof next === 'string', new SceneNavigationError('invalid scene navigation next'));
    assert(typeof previous === 'string', new SceneNavigationError('invalid scene navigation previous'));

    if (scenes) assert(Array.isArray(scenes), new SceneNavigationError('invalid scenes'));

    this.next = next;
    this.previous = previous;

    if (scenes) this.scenes = scenes;
  }
}

export { SceneNavigationModel };
