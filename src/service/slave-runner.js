import { rMidiClient, TCPMessage } from 'remote-midi';
import { MIDIControllerStore } from '#src/lib/midi-controller-store';
import { log } from '#src/lib/log';
import { KeyboardService } from '#src/model/mcc-1/service/keyboard';

const midiControllerState = MIDIControllerStore.getInstance();

const handleMidiData = (dataBuffer) => {
  TCPMessage.decode(dataBuffer).map((message) => {
    if (message.controller) midiControllerState.set(message);
    return message;
  });
};

const clientStart = (host, port, keyMappingConfig) => {
  const midiClient = rMidiClient(host, port);
  midiClient.on('data', handleMidiData);
  midiClient.start();
  const key = new KeyboardService({
    config: keyMappingConfig,
    midiSender: midiClient.send.bind(midiClient),
  });
  key.start();
};

export default class SlaveRunnerService {
  #host;

  #port;

  #keyMappingConfig;

  constructor(host, port, keyMappingConfig) {
    this.#host = host;
    this.#port = port;
    this.#keyMappingConfig = keyMappingConfig;
  }

  start() {
    try {
      clientStart(this.#host, this.#port, this.#keyMappingConfig);
    } catch (error) {
      log(error);
      process.exit(1);
    }
  }
}

export { SlaveRunnerService };
