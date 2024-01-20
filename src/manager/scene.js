import EventEmitter from 'events';
import { SceneNavigationService } from '#src/service/scene_navigation';
import { SceneService } from '#src/service/scene';
import { SceneNavigationError, SceneError } from '#src/model/error';

export default class SceneManager extends EventEmitter {
  #sceneNavigationService;

  #sceneService;

  constructor(sceneNavigation, scenes) {
    super();
    if (sceneNavigation === undefined) throw new SceneNavigationError('sceneNavigation is undefined');
    if (scenes === undefined) throw new SceneError('scenes is undefined');

    this.#sceneNavigationService = new SceneNavigationService(sceneNavigation, scenes);
    this.#sceneService = new SceneService(scenes);

    this.#listenSceneNavigationService();
    this.#listenSceneService();
  }

  #listenSceneNavigationService() {
    this.#sceneNavigationService.on('scene-navigation', (scene) => {
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
    this.#sceneNavigationService.handle(sequence);
    this.#sceneService.handle(sequence);
  }

  set(scene) {
    if (scene === undefined) throw new SceneNavigationError('scene is undefined');
    this.#sceneNavigationService.set(scene);
    this.#sceneService.set(scene);
  }
}

export { SceneManager };
