import assert from 'node:assert';
import { NavigationModel } from '#src/model/navigation';
import { MidiModel } from '#src/model/midi';
import { GlobalModel } from '#src/model/global';
import { SceneModel } from '#src/model/scene';
import { ConfigError } from '#src/model/error';

export default class ConfigModel {
  midi;

  constructor(name, midi, {
    port,
    navigation,
    scenes,
    global,
  } = {}) {
    assert(typeof name === 'string', new ConfigError('invalid name'));

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

    if (navigation) this.navigation = NavigationModel.deserialize(navigation);
    if (global) this.global = GlobalModel.deserialize(global.mappings);
  }

  static deserialize(json) {
    try {
      return new ConfigModel(
        json?.name,
        json?.midi,
        {
          port: json?.port,
          navigation: json?.navigation,
          scenes: json?.scenes,
          global: json?.global,
        },
      );
    } catch (err) {
      throw new ConfigError(err);
    }
  }
}

export { ConfigModel };
