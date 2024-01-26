import assert from 'node:assert';
import EventEmitter from 'events';
import { NavigationSceneModel } from '#src/model/navigation/scene';
import { SceneModel } from '#src/model/scene';
import { MappingModel } from '#src/model/mapping';
import { MappingService } from '#src/service/mapping';
import { SceneError } from '#src/model/error';

export default class SceneService extends EventEmitter {
  #scenes;

  #mappingService;

  constructor(scenes) {
    super();

    assert(
      scenes.every((scene) => scene instanceof SceneModel)
      || scenes.every((scene) => scene instanceof NavigationSceneModel),
      new SceneError('invalid scenes'),
    );

    if (scenes.every((scene) => scene instanceof SceneModel)) {
      assert(
        scenes.every(
          (scene) => scene.mappings?.every((mapping) => mapping instanceof MappingModel),
        ),
        new SceneError('invalid mappings'),
      );
    }

    if (scenes === undefined) throw new SceneError('scenes is undefined');
    this.#scenes = scenes;
    this.#mappingService = new MappingService(scenes[0].mappings);
    this.#listenMappingService();
  }

  #listenMappingService() {
    this.#mappingService.on('mapping', (mapping) => {
      this.emit('mapping', mapping);
    });
  }

  handle(sequence) {
    if (sequence === undefined) throw new SceneError('sequence is undefined');
    const nextScene = this.#scenes.find((scene) => scene.sequence === sequence);
    if (nextScene) this.emit('scene', nextScene);
    this.#mappingService.handle(sequence);
  }

  set({ mappings }) {
    if (mappings === undefined) throw new SceneError('mappings is undefined');
    this.#mappingService.set(mappings);
  }
}

export { SceneService };
