/* eslint-disable lines-between-class-members */
import { NetKeyboardServer } from 'net-keyboard';
import easymidi from 'easymidi';
import { MidiControllerStore } from 'midi-controller-store';
import { getMappingFromSequence } from '#src/lib/get-mapping-from-sequence';
import { getNextMidiValue } from '#src/lib/get-next-midi-value';
import { log } from 'custom-console-log';

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

      const nextMidiValue = getNextMidiValue(this.#midiControllerStore, t, cc, c, i);

      log.dev('set', 'controller', cc, 'channel', c, 'value', nextMidiValue);

      this.#midiControllerStore.set(cc, c, nextMidiValue);
      console.log(this.#midiControllerStore);
      this.#midiOutInstance.send('cc', {
        controller: cc,
        value: nextMidiValue,
        channel: c,
      });
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
