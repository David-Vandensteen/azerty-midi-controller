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

    if (scenes) {
      // this.scenes = scenes.map(
      //   (scene) => new SceneModel(
      //     scene.id,
      //     scene.mappings,
      //     { label: scene.label },
      //   ),
      // );
      this.scenes = scenes;
    }

    if (port) {
      assert(typeof port === 'number', new ConfigError('invalid port'));
      this.port = port;
    }

    if (navigation) this.navigation = navigation;
    if (global) this.global = global;
  }

  static deserialize(json) {
    try {
      return new ConfigModel(
        json?.name,
        new MidiModel(json?.midi?.in, { midiOut: json?.midi?.out }), // todo factory
        {
          port: json?.port,
          navigation: NavigationModel.deserialize(json?.navigation),
          scenes: json?.scenes?.map((scene) => SceneModel.deserialize(scene)),
          global: GlobalModel.deserialize(json?.global?.mappings),
        },
      );
    } catch (err) {
      console.log(err);
      throw new ConfigError(err);
    }
  }
}

export { ConfigModel };
