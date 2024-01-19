import assert from 'node:assert';
import { MidiTypeModel } from '#src/model/midi/type';
import { MidiError } from '#src/model/error';

export default class MidiServiceMessage {
  controller;

  channel;

  type;

  constructor(controller, channel, type, increment) {
    assert(typeof controller === 'number', new MidiError('invalid controller'));
    assert(typeof channel === 'number', new MidiError('invalid channel'));
    assert(type === MidiTypeModel.analog || type === MidiTypeModel.digital, new MidiError('invalid type'));

    if (increment) {
      assert(typeof increment === 'number', new MidiError('invalid increment'));
    }

    this.controller = controller;
    this.channel = channel;
    this.type = type;

    if (increment) this.increment = increment;
  }

  static deserialize(json) {
    try {
      return new MidiServiceMessage(
        json.controller,
        json.channel,
        json.type,
        json.increment,
      );
    } catch (err) {
      throw new MidiError(err);
    }
  }
}

export { MidiServiceMessage };
