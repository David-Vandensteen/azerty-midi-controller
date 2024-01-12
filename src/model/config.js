import assert from 'node:assert';
import { SceneNavigationModel } from '#src/model/scene_navigation';
import { SceneModel } from '#src/model/scene';
import { ConfigError } from '#src/model/error';

export default class ConfigModel {
  constructor(midiOut, scenes, { midiIn, port, sceneNavigation } = {}) {
    assert(typeof midiOut === 'string', new ConfigError('invalid midiOut'));
    assert(Array.isArray(scenes), new ConfigError('invalid scenes'));

    this.midiOut = midiOut;

    this.scenes = scenes.map(
      (scene) => new SceneModel(
        scene.id,
        scene.sequence,
        scene.mappings,
        { label: scene.label },
      ),
    );

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
  }
}

export { ConfigModel };
