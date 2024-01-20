import assert from 'node:assert';
import { ObjectError } from '#src/model/error/object';

export default class MidiTypeModel {
  constructor(type) {
    assert(type === 'analog' || type === 'digital', new ObjectError('invalid type'));
    this.type = type;
  }

  static get analog() {
    return 'analog';
  }

  static get digital() {
    return 'digital';
  }
}

export { MidiTypeModel };
