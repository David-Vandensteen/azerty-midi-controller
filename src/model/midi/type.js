import assert from 'node:assert';
import { ObjectError } from '#src/model/error/object';

export default class MidiTypeModel {
  type;

  constructor(type) {
    assert(type === MidiTypeModel.analog || type === MidiTypeModel.digital, new ObjectError('invalid type'));
    this.type = type;
  }

  toString() {
    return this.type;
  }

  static get analog() {
    return 'analog';
  }

  static get digital() {
    return 'digital';
  }

  static deserialize(json) {
    try {
      return new MidiTypeModel(json);
    } catch (err) {
      throw new ObjectError(err);
    }
  }
}

export { MidiTypeModel };
