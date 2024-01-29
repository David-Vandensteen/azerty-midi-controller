import assert from 'node:assert';
import { ConfigModel } from '#src/model/config';
import { NavigationModel } from '#src/model/navigation';
import { GlobalModel } from '#src/model/global';
import { SceneModel } from '#src/model/scene';
import { MappingModel } from '#src/model/mapping';
import { NetKeyboardServer } from 'net-keyboard';
import { MidiServiceMessage } from '#src/model/midi/service/message';
import { MidiService } from '#src/service/midi';
import EventEmitter from 'node:events';
import { SceneManager } from '#src/manager/scene';
import { GlobalService } from '#src/service/global';
import { AzertyMidiControllerError } from '#src/model/error';
import { log } from 'custom-console-log';

const sanitizeSequence = (sequence) => {
  if (sequence === ' ') return 'space';
  if (sequence === '\u001b[C') return '\u2192'; // right
  if (sequence === '\u001b[D') return '\u2190'; // left
  // u2191 // up
  // u2193 // down
  return sequence;
};

export default class AzertyMidiControllerService extends EventEmitter {
  #config;

  #midiService;

  #sceneManager;

  #globalService;

  constructor(config, { forceLocal }) {
    super();
    log.green('start application');

    assert(config instanceof ConfigModel, new AzertyMidiControllerError('invalid config'));
    this.#config = config;

    this.#midiService = new MidiService(this.#config.midi);

    if (this.#config.navigation && this.#config.scenes) {
      assert(this.#config.navigation instanceof NavigationModel, new AzertyMidiControllerError('invalid navigation'));
      assert(this.#config.scenes.every((scene) => scene instanceof SceneModel), new AzertyMidiControllerError('invalid scenes'));
      this.#sceneManager = new SceneManager(
        this.#config.navigation,
        this.#config.scenes,
      );
      this.#listenSceneManager();
    }

    if (this.#config.global) {
      assert(this.#config.global instanceof GlobalModel, new AzertyMidiControllerError('invalid global'));
      this.#globalService = new GlobalService(this.#config.global);
      this.#listenGlobalService();
    }

    this.#listenKeyboard({ forceLocal });
    if (this.#config.navigation || this.#config.scenes) this.#setScene(this.#config.scenes[0]);
  }

  #handleKeyboard(message) {
    const { sequence } = JSON.parse(message);

    if (this.#globalService) this.#globalService.handle(sequence);
    if (this.#sceneManager) this.#sceneManager.handle(sequence);

    return this;
  }

  #listenSceneManager() {
    this.#sceneManager.on('scene', (scene) => {
      assert(scene instanceof SceneModel, new AzertyMidiControllerError('invalid received scene'));
      log.dev('receive scene from scene manager', scene);

      this.#setScene(scene);
    });

    this.#sceneManager.on('mapping', (mapping) => {
      assert(mapping instanceof MappingModel, new AzertyMidiControllerError('invalid received mapping'));
      log.dev('receive mapping from scene manager', mapping);

      this.#midiService.send(MidiServiceMessage.deserialize(mapping));
    });
  }

  #listenGlobalService() {
    this.#globalService.on('global', (mapping) => {
      log.dev('receive mapping from global', mapping);
      this.#midiService.send(MidiServiceMessage.deserialize(mapping));
    });
  }

  #listenKeyboard({ forceLocal }) {
    if (this.#config.port && forceLocal === undefined) log.blue('listen keyboard from', this.#config.port);
    let port;
    if (forceLocal === undefined) port = this.#config.port;
    else port = undefined;

    new NetKeyboardServer({ port })
      .on('data', (message) => {
        log.dev('receive keyboard message', message);
        this.#handleKeyboard(message);
      })
      .serve();
  }

  #setScene(scene) {
    assert(scene instanceof SceneModel, new AzertyMidiControllerError('invalid scene'));

    if (scene.label) log.magenta('scene', scene.label);
    else log.magenta('scene', scene.id);

    scene.mappings.forEach((mapping) => {
      if (mapping.label) log.blue(mapping.label, sanitizeSequence(mapping.sequence));
    });

    if (this.#globalService) {
      log.info('');
      this.#config.global.mappings.forEach((mapping) => {
        if (mapping.label) log.blue(mapping.label, sanitizeSequence(mapping.sequence));
      });
    }

    if (this.#sceneManager) {
      this.#sceneManager.set(scene);
      log.info('');
      this.#config.navigation.scenes.forEach((navigationScene) => {
        if (navigationScene.label) log.blue('scene', navigationScene.label, sanitizeSequence(navigationScene.sequence));
        else log.blue('scene', navigationScene.id, sanitizeSequence(navigationScene.sequence));
      });
      log.info('');
      log.blue('scene previous', sanitizeSequence(this.#config.navigation.previous));
      log.blue('scene next', sanitizeSequence(this.#config.navigation.next));
    }
  }

  dispose() {
    log.blue('exiting application');
    // this.#sceneService.dispose();
    // this.#midiService.dispose();
    log.dev('dispose application');
    process.exit();
  }
}

export { AzertyMidiControllerService };
