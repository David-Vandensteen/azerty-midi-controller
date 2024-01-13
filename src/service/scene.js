import EventEmitter from 'events';
import { SceneNavigationModel } from '#src/model/scene_navigation';
import { MappingService } from '#src/service/mapping';
import { log } from 'custom-console-log';

export default class SceneService extends EventEmitter {
  #scene;

  #scenes;

  #sceneNavigation;

  #mappingService;

  constructor(scene, scenes, { sceneNavigation } = {}) {
    super();
    this.#scene = scene;
    this.#scenes = scenes;
    this.#mappingService = new MappingService();

    if (sceneNavigation) {
      this.#sceneNavigation = new SceneNavigationModel(
        sceneNavigation.next,
        sceneNavigation.previous,
      );
    }

    if (this.#scene.label) log.magenta('scene', this.#scene.label);
    else log.magenta('scene', this.#scene.id);

    this.#mappingService.set(this.#scene.mappings);

    this.#listenMappingService();
  }

  #listenMappingService() {
    this.#mappingService.on('mapping', (mapping) => {
      this.emit('mapping', mapping);
    });

    return this;
  }

  #next() {
    let index = this.#scenes.findIndex((scene) => scene.id === this.#scene.id) + 1;
    if (index >= this.#scenes.length) index = 0;
    this.#scene = this.#scenes[index];

    if (this.#scene.label) log.magenta('scene', this.#scene.label);
    else log.magenta('scene', this.#scene.id);

    this.#mappingService.set(this.#scene.mappings);

    return this;
  }

  #previous() {
    let index = this.#scenes.findIndex((scene) => scene.id === this.#scene.id) - 1;
    if (index < 0) index = this.#scenes.length - 1;
    this.#scene = this.#scenes[index];

    if (this.#scene.label) log.magenta('scene', this.#scene.label);
    else log.magenta('scene', this.#scene.id);

    this.#mappingService.set(this.#scene.mappings);

    return this;
  }

  handle(sequence) {
    if (sequence === this.#sceneNavigation?.next) this.#next();
    if (sequence === this.#sceneNavigation?.previous) this.#previous();

    const { id } = this.#scene;

    this.#scene = this.#scenes.find(
      ({ sequence: sceneSequence }) => sceneSequence === sequence,
    ) || this.#scene;

    if (id !== this.#scene.id || this.#scene?.sequence === sequence) {
      if (this.#scene.label) log.magenta('scene', this.#scene.label);
      else log.magenta('scene', this.#scene.id);

      this.#mappingService.set(this.#scene.mappings);
    }

    this.#mappingService.handle(sequence);

    return this;
  }

  dispose() {
    log.dev('scene service dispose');
    return this;
  }
}

export { SceneService };
