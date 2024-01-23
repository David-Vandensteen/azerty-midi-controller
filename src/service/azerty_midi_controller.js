import { NetKeyboardServer } from 'net-keyboard';
import { MidiServiceMessage } from '#src/model/midi/service/message';
import { MidiService } from '#src/service/midi';
import { SceneManager } from '#src/manager/scene';
import { GlobalService } from '#src/service/global';
import { AzertyMidiControllerError } from '#src/model/error';
import { log } from 'custom-console-log';

const sanitizeSequence = (sequence) => {
  if (sequence === ' ') return 'space';
  if (sequence === '\u001b[C') return 'right';
  if (sequence === '\u001b[D') return 'left';
  return sequence;
};

export default class AzertyMidiControllerService {
  #config;

  #midiService;

  #sceneManager;

  #globalService;

  constructor(config, { forceLocal }) {
    log.green('start application');

    if (config === undefined) throw new AzertyMidiControllerError('config is undefined');
    this.#config = config;

    this.#midiService = new MidiService(this.#config.midi);

    if (this.#config.navigation && this.#config.scenes) {
      this.#sceneManager = new SceneManager(
        this.#config.navigation,
        this.#config.scenes,
      );
      this.#listenSceneManager();
    }

    if (this.#config.global) {
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
      log.dev('receive scene from scene manager', scene);
      this.#setScene(scene);
    });

    this.#sceneManager.on('mapping', (mapping) => {
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
