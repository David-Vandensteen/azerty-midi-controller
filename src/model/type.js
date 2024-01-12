import assert from 'node:assert';
import { ObjectError } from '#src/model/error/object';

export default class TypeModel {
  constructor(type) {
    assert(type === 'analog' || type === 'digital', new ObjectError('invalid type'));
    this.type = type;
  }
}

export { TypeModel };
