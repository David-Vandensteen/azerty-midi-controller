import assert from 'node:assert';
import { SceneNavigationModel } from '#src/model/scene_navigation';
import { GlobalModel } from '#src/model/global';
import { SceneModel } from '#src/model/scene';
import { ConfigError } from '#src/model/error';

export default class ConfigModel {
  constructor(midiOut, {
    midiIn,
    port,
    sceneNavigation,
    scenes,
    global,
  } = {}) {
    assert(typeof midiOut === 'string', new ConfigError('invalid midiOut'));

    this.midiOut = midiOut;

    if (scenes) {
      this.scenes = scenes.map(
        (scene) => new SceneModel(
          scene.id,
          scene.mappings,
          { sequence: scene.sequence, label: scene.label },
        ),
      );
    }

    if (midiIn) {
      assert(typeof midiIn === 'string', new ConfigError('invalid midiIn'));
      this.midiIn = midiIn;
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
