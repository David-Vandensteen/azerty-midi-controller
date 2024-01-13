import easymidi from 'easymidi';
import { MidiControllerStore } from 'midi-controller-store';
import { log } from 'custom-console-log';
import { ServiceError } from '#src/model/error/service';

export default class MidiService {
  #midiInInstance;

  #midiOutInstance;

  #midiStore;

  constructor(midiOutDeviceName, { midiInDeviceName } = {}) {
    log.magenta('available midi outputs', easymidi.getOutputs());
    log.magenta('available midi inputs', easymidi.getInputs());

    if (midiOutDeviceName === undefined) throw new ServiceError('invalid midiOutDeviceName');

    this.#midiOutInstance = new easymidi.Output(midiOutDeviceName);
    log.green('midi out connected', this.#midiOutInstance.name);

    if (midiInDeviceName) {
      this.#midiInInstance = new easymidi.Input(midiInDeviceName);
      log.green('midi in connected', this.#midiInInstance.name);
    }

    this.#midiStore = MidiControllerStore.getInstance();
    this.#listenMidi();
  }

  #listenMidi() {
    log.blue('listen midi cc input from', this.#midiInInstance.name);
    this.#midiInInstance.on('cc', (message) => {
      log.dev('message from', this.#midiInInstance.name, message);
      this.#midiStore.set(message.controller, message.channel, message.value);
    });
    return this;
  }

  handle(controller, channel, type, { increment }) {
    if (controller === undefined) throw new ServiceError('invalid controller');
    if (channel === undefined) throw new ServiceError('invalid channel');
    if (type === undefined) throw new ServiceError('invalid type');

    const currentValue = this.#midiStore.getValue(controller, channel) || 0;
    let computeValue;

    if (type === 'analog') {
      computeValue = currentValue + increment;
      if (computeValue > 127) computeValue = 127;
      if (computeValue < 0) computeValue = 0;
    }

    if (type === 'digital') computeValue = (currentValue <= 1) ? 127 : 1;

    this.#midiStore.set(controller, channel, computeValue);

    this.#midiOutInstance.send('cc', {
      controller,
      channel,
      value: computeValue,
    });

    log.dev(this.#midiStore.getValue(controller, channel));

    return this;
  }

  dispose() {
    log.dev('midi service dispose');
    if (this.#midiInInstance) this.#midiInInstance.close();
    this.#midiOutInstance.close();
  }
}

export { MidiService };
