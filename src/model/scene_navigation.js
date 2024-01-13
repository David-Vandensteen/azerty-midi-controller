import assert from 'node:assert';
import { ObjectError } from '#src/model/error';

export default class SceneNavigationModel {
  constructor(next, previous) {
    assert(typeof next === 'string', new ObjectError('invalid scene navigation next'));
    assert(typeof previous === 'string', new ObjectError('invalid scene navigation previous'));

    this.next = next;
    this.previous = previous;
  }
}

export { SceneNavigationModel };
