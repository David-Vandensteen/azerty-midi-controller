import assert from 'node:assert';
import { NavigationSceneModel } from '#src/model/navigation/scene';
import { NavigationError } from '#src/model/error';

export default class NavigationModel {
  next;

  previous;

  constructor(next, previous, { scenes } = {}) {
    assert(typeof next === 'string', new NavigationError('invalid scene navigation next'));
    assert(typeof previous === 'string', new NavigationError('invalid scene navigation previous'));

    if (scenes) {
      assert(
        Array.isArray(scenes)
        && scenes.every((scene) => scene instanceof NavigationSceneModel),
      );
    }

    if (scenes) this.scenes = scenes.map((scene) => NavigationSceneModel.deserialize(scene));

    this.next = next;
    this.previous = previous;
  }

  static deserialize(json) {
    try {
      return new NavigationModel(
        json?.next,
        json?.previous,
        { scenes: json?.scenes?.map((scene) => NavigationSceneModel.deserialize(scene)) },
      );
    } catch (err) {
      throw new NavigationError(err);
    }
  }
}

export { NavigationModel };
