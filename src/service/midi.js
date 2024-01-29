import assert from 'node:assert';
import easymidi from 'easymidi';
import { MidiControllerStore } from 'midi-controller-store';
import { MidiModel } from '#src/model/midi';
import { MidiTypeModel } from '#src/model/midi/type';
import { MidiServiceMessageModel } from '#src/model/midi/service/message';
import { log } from 'custom-console-log';
import { MidiError } from '#src/model/error';

export default class MidiService {
  #midiInInstance;

  #midiOutInstance;

  #midiStore;

  constructor(midi) {
    assert(midi instanceof MidiModel, new MidiError('invalid midi'));
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

  send(midiServiceMessage) {
    assert(midiServiceMessage instanceof MidiServiceMessageModel, new MidiError('invalid midi service message'));

    const currentValue = this.#midiStore.getValue(
      midiServiceMessage.controller,
      midiServiceMessage.channel,
    ) || 0;

    let computeValue;

    if (midiServiceMessage.type.toString() === MidiTypeModel.analog) {
      computeValue = currentValue + midiServiceMessage.increment;
      if (computeValue > 127) computeValue = 127;
      if (computeValue < 0) computeValue = 0;
    }

    if (midiServiceMessage.type === MidiTypeModel.digital) {
      computeValue = (currentValue <= 1) ? 127 : 1;
    }

    this.#midiStore.set(midiServiceMessage.controller, midiServiceMessage.channel, computeValue);

    this.#midiOutInstance.send('cc', {
      controller: midiServiceMessage.controller,
      channel: midiServiceMessage.channel,
      value: computeValue,
    });

    log.dev('send cc midi', midiServiceMessage.controller, midiServiceMessage.channel, computeValue);
    log.dev(this.#midiStore.getValue(midiServiceMessage.controller, midiServiceMessage.channel));

    return this;
  }
}

export { MidiService };
