import assert from 'node:assert';
import { MidiTypeModel } from '#src/model/midi/type';
import { MappingError } from '#src/model/error';

export default class MappingModel {
  #type;

  sequence;

  controller;

  channel;

  constructor(sequence, type, controller, channel, { increment, label } = {}) {
    assert(typeof sequence === 'string', new MappingError('invalid sequence'));
    assert(typeof controller === 'number', new MappingError('invalid mapping controller'));
    assert(typeof channel === 'number', new MappingError('invalid mapping channel'));
    assert(type instanceof MidiTypeModel, new MappingError('invalid mapping type'));

    this.#type = type;
    this.sequence = sequence;
    this.controller = controller;
    this.channel = channel;

    if (increment) this.increment = increment;
    if (label) this.label = label;

    Object.defineProperty(this, 'type', {
      enumerable: true,
      get: () => this.#type.toString(),
    });
  }

  static deserialize(json) {
    try {
      return new MappingModel(
        json?.sequence,
        MidiTypeModel.deserialize(json?.type),
        json?.controller,
        json?.channel,
        { increment: json?.increment, label: json?.label },
      );
    } catch (err) {
      throw new MappingError(err);
    }
  }
}

export { MappingModel };
