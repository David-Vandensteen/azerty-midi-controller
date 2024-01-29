import EventEmitter from 'events';
import { NavigationService } from '#src/service/navigation';
import { SceneService } from '#src/service/scene';
import { NavigationError, SceneError } from '#src/model/error';

export default class SceneManager extends EventEmitter {
  #navigationService;

  #sceneService;

  constructor(navigation, scenes) {
    super();
    if (navigation === undefined) throw new NavigationError('sceneNavigation is undefined');
    if (scenes === undefined) throw new SceneError('scenes is undefined');

    this.#navigationService = new NavigationService(navigation, scenes);
    this.#sceneService = new SceneService(scenes);

    this.#listenNavigationService();
    this.#listenSceneService();
  }

  #listenNavigationService() {
    this.#navigationService.on('navigation', (scene) => {
      this.emit('scene', scene);
    });
  }

  #listenSceneService() {
    this.#sceneService.on('scene', (scene) => {
      this.emit('scene', scene);
    });

    this.#sceneService.on('mapping', (mapping) => {
      this.emit('mapping', mapping);
    });
  }

  handle(sequence) {
    this.#navigationService.handle(sequence);
    this.#sceneService.handle(sequence);
  }

  set(scene) {
    if (scene === undefined) throw new NavigationError('scene is undefined');
    this.#navigationService.set(scene);
    this.#sceneService.set(scene);
  }
}

export { SceneManager };
