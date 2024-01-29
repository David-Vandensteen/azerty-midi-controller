import assert from 'node:assert';
import { MidiTypeModel } from '#src/model/midi/type';
import { MidiError } from '#src/model/error';

export default class MidiServiceMessageModel {
  #type;

  controller;

  channel;

  constructor(controller, channel, type, increment) {
    assert(typeof controller === 'number', new MidiError('invalid controller'));
    assert(typeof channel === 'number', new MidiError('invalid channel'));
    assert(type instanceof MidiTypeModel, new MidiError('invalid type'));

    if (increment) {
      assert(typeof increment === 'number', new MidiError('invalid increment'));
    }

    this.controller = controller;
    this.channel = channel;
    this.#type = type;

    if (increment) this.increment = increment;

    Object.defineProperty(this, 'type', {
      enumerable: true,
      get: () => this.#type.toString(),
    });
  }

  static deserialize(json) {
    try {
      return new MidiServiceMessageModel(
        json?.controller,
        json?.channel,
        MidiTypeModel.deserialize(json?.type?.toString()),
        json?.increment,
      );
    } catch (err) {
      throw new MidiError(err);
    }
  }
}

export { MidiServiceMessageModel };
