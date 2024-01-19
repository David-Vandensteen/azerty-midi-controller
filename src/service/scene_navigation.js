import EventEmitter from 'events';
import { SceneNavigationError } from '#src/model/error';

export default class SceneNavigationService extends EventEmitter {
  #sceneNavigation;

  #scenes;

  #scene;

  constructor(sceneNavigation, scenes) {
    super();
    if (sceneNavigation === undefined) throw new SceneNavigationError('sceneNavigation is undefined');
    if (scenes === undefined) throw new SceneNavigationError('scenes is undefined');

    this.#sceneNavigation = sceneNavigation;
    [this.#scene] = scenes;
    this.#scenes = scenes;
  }

  #next() {
    let index = this.#scenes.findIndex((scene) => scene.id === this.#scene.id) + 1;
    if (index >= this.#scenes.length) index = 0;
    this.#scene = this.#scenes[index];
    this.emit('scene-navigation', this.#scene);

    return this;
  }

  #previous() {
    let index = this.#scenes.findIndex((scene) => scene.id === this.#scene.id) - 1;
    if (index < 0) index = this.#scenes.length - 1;
    this.#scene = this.#scenes[index];
    this.emit('scene-navigation', this.#scene);
  }

  handle(sequence) {
    if (sequence === undefined) throw new SceneNavigationError('sequence is undefined');
    if (sequence === this.#sceneNavigation.next) this.#next();
    if (sequence === this.#sceneNavigation.previous) this.#previous();
  }

  set(scene) {
    if (scene === undefined) throw new SceneNavigationError('scene is undefined');
    this.#scene = scene;
  }
}

export { SceneNavigationService };
