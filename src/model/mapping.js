import assert from 'node:assert';
import { MidiTypeModel } from '#src/model/midi/type';
import { MappingError } from '#src/model/error';

export default class MappingModel {
  constructor(type, controller, channel, { increment, label } = {}) {
    assert(typeof controller === 'number', new MappingError('invalid mapping controller'));
    assert(typeof channel === 'number', new MappingError('invalid mapping channel'));

    this.type = new MidiTypeModel(type);
    this.controller = controller;
    this.channel = channel;

    if (increment) this.increment = increment;
    if (label) this.label = label;
  }
}

export { MappingModel };
