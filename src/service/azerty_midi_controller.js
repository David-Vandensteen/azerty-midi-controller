import { NetKeyboardServer } from 'net-keyboard';
import { MidiService } from '#src/service/midi';
import { SceneNavigationService } from '#src/service/scene_navigation';
import { GlobalService } from '#src/service/global';
import { SceneService } from '#src/service/scene';
import { AzertyMidiControllerError } from '#src/model/error';
import { log } from 'custom-console-log';

export default class AzertyMidiControllerService {
  #config;

  #midiService;

  #sceneNavigationService;

  #globalService;

  #sceneService;

  constructor(config, { forceLocal }) {
    log.green('start application');

    if (config === undefined) throw new AzertyMidiControllerError('config is undefined');
    this.#config = config;

    this.#midiService = new MidiService(
      this.#config.midiOut,
      { midiInDeviceName: this.#config.midiIn },
    );

    if (this.#config.sceneNavigation) {
      this.#sceneNavigationService = new SceneNavigationService(
        this.#config.sceneNavigation,
        this.#config.scenes[0],
        this.#config.scenes,
      );
      this.#listenSceneNavigationService();
    }

    if (this.#config.global) {
      this.#globalService = new GlobalService(this.#config.global);
      this.#listenGlobalService();
    }

    if (this.#config.scenes) {
      this.#sceneService = new SceneService(
        this.#config.scenes[0],
        this.#config.scenes,
      );
      this.#listenSceneService();
    }

    this.#listenKeyboard({ forceLocal });
  }

  #handleKeyboard(message) {
    const { sequence } = JSON.parse(message);

    if (this.#sceneNavigationService) this.#sceneNavigationService.handle(sequence);
    if (this.#globalService) this.#globalService.handle(sequence);
    if (this.#sceneService) this.#sceneService.handle(sequence);

    return this;
  }

  #listenSceneNavigationService() {
    this.#sceneNavigationService.on('scene-navigation', (scene) => {
      log.dev('receive scene from scene navigation');
      this.#setScene(scene);
    });
  }

  #listenGlobalService() {
    this.#globalService.on('global', (mapping) => {
      log.dev('receive mapping from global', mapping);
      this.#midiService.send(
        mapping.controller,
        mapping.channel,
        mapping.type,
        { increment: mapping.increment },
      );
    });
  }

  #listenSceneService() {
    this.#sceneService.on('scene', (scene) => {
      log.dev('receive scene from scene', scene);
      this.#setScene(scene);
    });

    this.#sceneService.on('mapping', (mapping) => {
      log.dev('receive mapping from scene', mapping);
      this.#midiService.send(
        mapping.controller,
        mapping.channel,
        mapping.type,
        { increment: mapping?.increment },
      );
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
      if (mapping.label) log.blue(mapping.label, mapping.sequence);
    });
    if (this.#globalService) {
      this.#config.global.mappings.forEach((mapping) => {
        if (mapping.label) log.blue(mapping.label, mapping.sequence);
      });
    }
    this.#sceneService.set(scene);
    if (this.#sceneNavigationService) this.#sceneNavigationService.set(scene);
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
