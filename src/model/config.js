import assert from 'node:assert';
import { SceneNavigationModel } from '#src/model/scene_navigation';
import { MidiModel } from '#src/model/midi';
import { GlobalModel } from '#src/model/global';
import { SceneModel } from '#src/model/scene';
import { ConfigError } from '#src/model/error';

export default class ConfigModel {
  midi;

  constructor(midi, {
    port,
    sceneNavigation,
    scenes,
    global,
  } = {}) {
    this.midi = MidiModel.deserialize(midi);

    if (scenes) {
      this.scenes = scenes.map(
        (scene) => new SceneModel(
          scene.id,
          scene.mappings,
          { sequence: scene.sequence, label: scene.label },
        ),
      );
    }

    if (port) {
      assert(typeof port === 'number', new ConfigError('invalid port'));
      this.port = port;
    }

    if (sceneNavigation) {
      this.sceneNavigation = new SceneNavigationModel(
        sceneNavigation.next,
        sceneNavigation.previous,
      );
    }

    if (global) {
      this.global = new GlobalModel({ mappings: global.mappings });
    }
  }
}

export { ConfigModel };
