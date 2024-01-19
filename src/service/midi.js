import easymidi from 'easymidi';
import { MidiControllerStore } from 'midi-controller-store';
import { TypeModel } from '#src/model/type';
import { log } from 'custom-console-log';
import { MidiError } from '#src/model/error';

export default class MidiService {
  #midiInInstance;

  #midiOutInstance;

  #midiStore;

  constructor(midi) {
    if (midi.out === undefined) throw new MidiError('invalid midiOutDeviceName');

    log.magenta('available midi outputs', easymidi.getOutputs());
    log.magenta('available midi inputs', easymidi.getInputs());

    this.#midiOutInstance = new easymidi.Output(midi.out);
    log.green('midi out connected', this.#midiOutInstance.name);

    if (midi.in) {
      this.#midiInInstance = new easymidi.Input(midi.in);
      log.green('midi in connected', this.#midiInInstance.name);
    }

    this.#midiStore = MidiControllerStore.getInstance();
    if (this.#midiInInstance) this.#listenMidi();
  }

  #listenMidi() {
    log.blue('listen midi cc input from', this.#midiInInstance.name);
    this.#midiInInstance.on('cc', (message) => {
      log.dev('message from', this.#midiInInstance.name, message);
      this.#midiStore.set(message.controller, message.channel, message.value);
    });
    return this;
  }

  dispose() {
    log.dev('midi service dispose');
    if (this.#midiInInstance) this.#midiInInstance.close();
    this.#midiOutInstance.close();
  }

  send(controller, channel, type, { increment }) {
    if (controller === undefined) throw new MidiError('invalid controller');
    if (channel === undefined) throw new MidiError('invalid channel');
    if (type === undefined) throw new MidiError('invalid type');

    const currentValue = this.#midiStore.getValue(controller, channel) || 0;
    let computeValue;

    if (type === TypeModel.analog) {
      computeValue = currentValue + increment;
      if (computeValue > 127) computeValue = 127;
      if (computeValue < 0) computeValue = 0;
    }

    if (type === TypeModel.digital) computeValue = (currentValue <= 1) ? 127 : 1;

    this.#midiStore.set(controller, channel, computeValue);

    this.#midiOutInstance.send('cc', {
      controller,
      channel,
      value: computeValue,
    });

    log.dev('send cc midi', controller, channel, computeValue);
    log.dev(this.#midiStore.getValue(controller, channel));

    return this;
  }
}

export { MidiService };
