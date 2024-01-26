import YamlLoader from '#src/lib/yaml_loader';
import { ConfigModel } from '#src/model/config';
import { MidiModel } from '#src/model/midi';
import { NavigationSceneModel } from '#src/model/navigation/scene';
import { SceneModel } from '#src/model/scene';
import { MappingModel } from '#src/model/mapping';
import { log } from 'custom-console-log';
import { ConfigError } from '#src/model/error';

export default class ConfigLoaderService {
  #config;

  constructor(configFile) {
    if (configFile === undefined) throw new ConfigError('configFile is undefined');
    log.magenta('try to load', configFile);
    this.#config = YamlLoader(configFile);
    this.#parse();
  }

  #load() { // TODO
    log('config load');
    ConfigModel.deserialize(this.#config);
  }

  #parse() {
    // MidiModel.deserialize(this.#config.midi);
    (() => new MidiModel(this.#config?.midi?.out, { midiIn: this.#config?.midi?.in }))();

    if (this.#config?.navigation?.scenes) {
      this.#config.navigation.scenes.forEach((scene) => {
        log('parse scene navigation', scene.id);
        NavigationSceneModel.deserialize(scene);
      });
    }

    if (this.#config?.global?.mappings) {
      this.#config.global.mappings.forEach((mapping) => {
        log('parse global mapping', mapping.sequence); // TODO UNICODE sanitizer
        MappingModel.deserialize(mapping);
      });
    }

    if (this.#config?.scenes) {
      this.#config.scenes.forEach((scene) => {
        scene.mappings.forEach((mapping) => {
          log('parse scene', scene.id, 'mapping', mapping.sequence);
          MappingModel.deserialize(mapping);
        });
        log('parse scene', scene.id);
        SceneModel.deserialize(scene);
      });
    }

    log('parse config', this.#config.name);
    ConfigModel.deserialize(this.#config);

    log('');
    log.green('config :', this.#config.name, 'is compliant');
    log('');
  }

  get() { return this.#config; }
}

export { ConfigLoaderService };
