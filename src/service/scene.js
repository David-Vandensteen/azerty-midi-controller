import EventEmitter from 'events';
import { MappingService } from '#src/service/mapping';
import { SceneError } from '#src/model/error';

export default class SceneService extends EventEmitter {
  #scenes;

  #mappingService;

  constructor({ mappings }, scenes) {
    super();
    if (mappings === undefined) throw new SceneError('mappings is undefined');
    if (scenes === undefined) throw new SceneError('scenes is undefined');
    this.#scenes = scenes;
    this.#mappingService = new MappingService(mappings);
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
