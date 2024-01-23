import EventEmitter from 'events';
import { NavigationError } from '#src/model/error';

export default class NavigationService extends EventEmitter {
  #navigation;

  #scenes;

  #scene;

  constructor(navigation, scenes) {
    super();
    if (navigation === undefined) throw new NavigationError('navigation is undefined');
    if (scenes === undefined) throw new NavigationError('scenes is undefined');

    this.#navigation = navigation;
    [this.#scene] = scenes;
    this.#scenes = scenes;
  }

  #getSceneById(id) {
    return this.#scenes.find((scene) => scene.id === id);
  }

  #getSceneBySequence(sequence) {
    const sceneNavigationFromSequence = this.#getNavigationSceneBySequence(sequence);

    if (sceneNavigationFromSequence && this.#getSceneById(sceneNavigationFromSequence.id)) {
      return this.#getSceneById(sceneNavigationFromSequence.id);
    }
    return undefined;
  }

  #getNavigationSceneBySequence(sequence) {
    return this.#navigation.scenes.find(
      (navigationScene) => navigationScene.sequence === sequence,
    );
  }

  #next() {
    let index = this.#scenes.findIndex((scene) => scene.id === this.#scene.id) + 1;
    if (index >= this.#scenes.length) index = 0;
    this.#scene = this.#scenes[index];
    this.emit('navigation', this.#scene);

    return this;
  }

  #previous() {
    let index = this.#scenes.findIndex((scene) => scene.id === this.#scene.id) - 1;
    if (index < 0) index = this.#scenes.length - 1;
    this.#scene = this.#scenes[index];
    this.emit('navigation', this.#scene);
  }

  handle(sequence) {
    if (sequence === undefined) throw new NavigationError('sequence is undefined');
    if (sequence === this.#navigation.next) this.#next();
    if (sequence === this.#navigation.previous) this.#previous();

    if (this.#getSceneBySequence(sequence)) {
      this.emit('navigation', this.#getSceneBySequence(sequence));
    }
  }

  set(scene) {
    if (scene === undefined) throw new NavigationError('scene is undefined');
    this.#scene = scene;
  }
}

export { NavigationService };
