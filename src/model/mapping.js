import assert from 'node:assert';
import { TypeModel } from '#src/model/type';
import { MappingError } from '#src/model/error';

export default class MappingModel {
  constructor(sequence, type, controller, channel, { increment, label } = {}) {
    assert(typeof sequence === 'string', new MappingError('invalid mapping sequence'));
    assert(typeof controller === 'number', new MappingError('invalid mapping controller'));
    assert(typeof channel === 'number', new MappingError('invalid mapping channel'));

    this.sequence = sequence;
    this.type = new TypeModel(type);
    this.controller = controller;
    this.channel = channel;

    if (increment) this.increment = increment;
    if (label) this.label = label;
  }
}

export { MappingModel };
