import { rMidiServer } from 'remote-midi';
import { log } from '#src/lib/log';

export default class MasterRunnerService {
  #host;

  #port;

  #options;

  constructor(host, port, options) {
    this.#host = host;
    this.#port = port;
    this.#options = options;
  }

  start() {
    try {
      const midiServer = rMidiServer(this.#host, this.#port, this.#options);
      midiServer.start();
    } catch (error) {
      log(error);
      process.exit(1);
    }
  }
}

export { MasterRunnerService };
