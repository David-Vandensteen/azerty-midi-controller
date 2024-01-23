import assert from 'node:assert';
import { NavigationModel } from '#src/model/navigation';
import { MidiModel } from '#src/model/midi';
import { GlobalModel } from '#src/model/global';
import { SceneModel } from '#src/model/scene';
import { ConfigError } from '#src/model/error';

export default class ConfigModel {
  midi;

  constructor(midi, {
    port,
    navigation,
    scenes,
    global,
  } = {}) {
    this.midi = MidiModel.deserialize(midi);

    if (scenes) {
      this.scenes = scenes.map(
        (scene) => new SceneModel(
          scene.id,
          scene.mappings,
          { label: scene.label },
        ),
      );
    }

    if (port) {
      assert(typeof port === 'number', new ConfigError('invalid port'));
      this.port = port;
    }

    if (navigation) {
      this.navigation = new NavigationModel(
        navigation.next,
        navigation.previous,
      );
    }

    if (global) {
      this.global = new GlobalModel({ mappings: global.mappings });
    }
  }
}

export { ConfigModel };
