/* eslint-disable lines-between-class-members */
// import { MasterRunnerService } from '#src/service/master-runner';
// import { SlaveRunnerService } from '#src/service/slave-runner';

// export default class ApplicationService {
//   static run(config) {
//     if (!config?.mode ?? !config) throw new Error('invalid configuration');
//     const { host, port, mode } = config;
//     if (mode === 'master') {
//       const { midiOutputDeviceName, midiInputDeviceName } = config;
//       try {
//         const master = new MasterRunnerService(
//           host,
//           port,
//           { midiInputDeviceName, midiOutputDeviceName },
//         );
//         master.start();
//       } catch (error) {
//         throw new Error(`Error while creating MasterRunnerService: ${error}`);
//       }
//     }

//     if (mode === 'slave') {
//       const { keyMappingConfig } = config;
//       try {
//         const slave = new SlaveRunnerService(
//           host,
//           port,
//           keyMappingConfig,
//         );
//         slave.start();
//       } catch (error) {
//         throw new Error(`Error while creating SlaveRunnerService: ${error}`);
//       }
//     }
//   }
// }

// export { ApplicationService };

import { NetKeyboardServer } from 'net-keyboard';
import easymidi from 'easymidi';
import { MidiControllerStore } from '#src/lib/midi-controller-store';
import { getMappingFromSequence } from '#src/lib/get-mapping-from-sequence';
import { getNextMidiValue } from '#src/lib/get-next-midi-value';
import { log } from '#src/lib/log';

export default class ApplicationService {
  #port;
  #midiIn;
  #midiOut;
  #midiInInstance;
  #midiOutInstance;
  #midiControllerStore;
  #mapping;

  constructor(port, mapping, { midiOut, midiIn } = {}) {
    if (port === undefined) throw new Error('port is undefined');
    if (mapping === undefined) throw new Error('mapping is undefined');
    if (midiOut) this.#midiOut = midiOut;
    if (midiIn) this.#midiIn = midiIn;
    this.#mapping = mapping;
    this.#port = port;
    this.#midiControllerStore = MidiControllerStore.getInstance();
  }

  midiConnect() {
    log.magenta('available midi outputs', easymidi.getOutputs());
    log.magenta('available midi inputs', easymidi.getInputs());
    if (this.#midiIn === undefined && this.#midiOut === undefined) throw new Error('no midi device is defined');
    if (this.#midiIn) this.#midiInInstance = new easymidi.Input(this.#midiIn);
    if (this.#midiOut) this.#midiOutInstance = new easymidi.Output(this.#midiOut);

    if (this.#midiInInstance) {
      this.#handleMidiInMessage();
      log.green('midi in connected', this.#midiIn);
    }
    if (this.#midiOutInstance) log.green('midi out connected', this.#midiOut);
    return this;
  }

  #handleNetKeyboardMessage(jsonMessage) {
    const message = JSON.parse(jsonMessage);
    const { sequence } = message;

    log.dev('sequence', sequence);
    const mapping = getMappingFromSequence(this.#mapping, sequence);

    if (mapping) {
      const {
        controller: cc, channel: c, increment: i, type: t,
      } = mapping;

      const nextMidiValue = getNextMidiValue(this.#midiControllerStore, t, c, cc, i);

      log.dev('set', 'controller', cc, 'channel', c, 'value', nextMidiValue);

      this.#midiControllerStore.set(cc, c, nextMidiValue);
      this.#midiOutInstance.send('cc', {
        controller: cc,
        value: nextMidiValue,
        channel: c,
      });

      console.log(this.#midiControllerStore.get());
    }
  }

  #handleMidiInMessage() {
    console.log('handle midi in', this.#midiIn);
    this.#midiInInstance
      .on('cc', (message) => {
        console.log('message from midi in', message);
        this.#midiControllerStore.set(message.controller, message.channel, message.value);
        // console.log('midi store', this.#midiControllerStore.get());
      })
      .on('cc', () => { console.log('cc'); });
      // .on('clock', () => { console.log('clock receive '); })
      // .on('noteon', () => { console.log('note on'); });
  }

  serve() {
    if (this.#midiInInstance) this.#handleMidiInMessage();
    new NetKeyboardServer(this.#port)
      .on('message', (jsonMessage) => {
        log.dev('app receive', jsonMessage);
        this.#handleNetKeyboardMessage(jsonMessage);
      })
      .serve();
    log.green('Application is ready');
    return this;
  }
}

export { ApplicationService };
