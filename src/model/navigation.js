import assert from 'node:assert';
import { NavigationError } from '#src/model/error';

export default class NavigationModel {
  next;

  previous;

  constructor(next, previous, { scenes } = {}) {
    assert(typeof next === 'string', new NavigationError('invalid scene navigation next'));
    assert(typeof previous === 'string', new NavigationError('invalid scene navigation previous'));

    if (scenes) assert(Array.isArray(scenes), new NavigationError('invalid scenes'));

    this.next = next;
    this.previous = previous;

    if (scenes) this.scenes = scenes;
  }
}

export { NavigationModel };
