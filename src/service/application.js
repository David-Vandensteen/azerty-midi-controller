/* eslint-disable lines-between-class-members */
import { NetKeyboardServer } from 'net-keyboard';
import easymidi from 'easymidi';
import { MidiControllerStore } from 'midi-controller-store';
import { MappingModel } from '#src/model/mapping';
import { MidiControllerMessageModel } from '#src/model/midi-controller-message';
import { getMappingFromSequence } from '#src/lib/get-mapping-from-sequence';
import { getNextMidiValue } from '#src/lib/get-next-midi-value';
import { log } from 'custom-console-log';
import {
  MappingError,
  MidiDeviceError,
  PagesError,
  PortError,
} from '#src/model/error';

export default class ApplicationService {
  #port;
  #midiIn;
  #midiOut;
  #midiInInstance;
  #midiOutInstance;
  #midiControllerStore;
  #mapping;
  #page;
  #pages;

  constructor(port, pages, mapping, { midiOut, midiIn } = {}) {
    if (port === undefined) throw new PortError('port is undefined');
    if (mapping === undefined) throw new MappingError('mapping is undefined');
    if (pages === undefined) throw new PagesError('pages is undefined');
    if (midiOut) this.#midiOut = midiOut;
    if (midiIn) this.#midiIn = midiIn;
    this.#mapping = mapping;
    this.#port = port;
    this.#pages = pages;
    this.#midiControllerStore = MidiControllerStore.getInstance();
  }

  midiConnect() {
    log.magenta('available midi outputs', easymidi.getOutputs());
    log.magenta('available midi inputs', easymidi.getInputs());
    if (this.#midiIn === undefined && this.#midiOut === undefined) throw new MidiDeviceError('no midi device is defined');
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
    const mapping = new MappingModel(getMappingFromSequence(this.#mapping, sequence));

    if (mapping) {
      const {
        controller: cc, channel: c, increment: i, type: t,
      } = mapping;

      const nextMidiValue = getNextMidiValue(this.#midiControllerStore, t, cc, c, i);

      const midiMessage = new MidiControllerMessageModel(
        { controller: cc, channel: c, value: nextMidiValue },
      );

      log.dev('set', 'controller', midiMessage.controller, 'channel', midiMessage.channel, 'value', midiMessage.value);

      this.#midiControllerStore.set(midiMessage.controller, midiMessage.channel, midiMessage.value);
      this.#midiOutInstance.send('cc', midiMessage);
    }
  }

  #handleMidiInMessage() {
    log.dev('handle midi in', this.#midiIn);
    this.#midiInInstance
      .on('cc', (message) => {
        log.dev('message from midi in', message);
        this.#midiControllerStore.set(message.controller, message.channel, message.value);
        // console.log('midi store', this.#midiControllerStore.get());
      });
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
