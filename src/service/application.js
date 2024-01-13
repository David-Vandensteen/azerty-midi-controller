import { NetKeyboardServer } from 'net-keyboard';
import { SceneService } from '#src/service/scene';
import { MidiService } from '#src/service/midi';
import { log } from 'custom-console-log';
import { ApplicationError } from '#src/model/error/application';

export default class ApplicationService {
  #config;

  #midiService;

  #sceneService;

  constructor(config) {
    if (config === undefined) throw new ApplicationError('config is undefined');
    this.#config = config;

    this.#midiService = new MidiService(
      this.#config.midiOut,
      { midiInDeviceName: this.#config.midiIn },
    );
  }

  #handleKeyboard(message) {
    const { sequence } = JSON.parse(message);

    this.#sceneService.handle(sequence);

    return this;
  }

  #listenKeyboard() {
    log.blue('listen keyboard from', this.#config.port);
    new NetKeyboardServer(this.#config.port)
      .on('message', (message) => {
        log.dev('receive keyboard message', message);
        this.#handleKeyboard(message);
      })
      .serve();

    return this;
  }

  #listenSceneService() {
    this.#sceneService.on('mapping', (mapping) => {
      this.#midiService.handle(
        mapping.controller,
        mapping.channel,
        mapping.type,
        { increment: mapping.increment },
      );
    });

    return this;
  }

  dispose() {
    log.blue('exiting application');
    this.#sceneService.dispose();
    this.#midiService.dispose();
    log.dev('dispose application');
    process.exit();
  }

  run() {
    log.green('start application');
    this.#sceneService = new SceneService(
      this.#config.scenes[0],
      this.#config.scenes,
      { sceneNavigation: this.#config.sceneNavigation },
    );

    this
      .#listenSceneService()
      .#listenKeyboard();
  }
}

export { ApplicationService };
