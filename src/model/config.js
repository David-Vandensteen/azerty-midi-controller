import assert from 'node:assert';
import { NavigationModel } from '#src/model/navigation';
import { MidiModel } from '#src/model/midi';
import { GlobalModel } from '#src/model/global';
import { SceneModel } from '#src/model/scene';
import { ConfigError } from '#src/model/error';

export default class ConfigModel {
  name;

  midi;

  constructor(name, midi, {
    port,
    navigation,
    scenes,
    global,
  } = {}) {
    assert(typeof name === 'string', new ConfigError('invalid name'));
    assert(midi instanceof MidiModel, new ConfigError('invalid midi'));

    this.name = name;
    this.midi = midi;

    if (port) {
      assert(typeof port === 'number', new ConfigError('invalid port'));
      this.port = port;
    }

    if (scenes) {
      assert(scenes.every((scene) => scene instanceof SceneModel), new ConfigError('invalid scenes'));
      this.scenes = scenes;
    }

    if (navigation) {
      assert(navigation instanceof NavigationModel, new ConfigError('invalid navigation'));
      this.navigation = navigation;
    }

    if (global) {
      assert(global instanceof GlobalModel, new ConfigError('invalid global'));
      this.global = global;
    }
  }

  static deserialize(json) {
    try {
      return new ConfigModel(
        json?.name,
        MidiModel.deserialize(json?.midi),
        {
          port: json?.port,
          navigation: NavigationModel.deserialize(json?.navigation),
          scenes: json?.scenes?.map((scene) => SceneModel.deserialize(scene)),
          global: GlobalModel.deserialize(json?.global),
        },
      );
    } catch (err) {
      throw new ConfigError(err);
    }
  }
}

export { ConfigModel };
