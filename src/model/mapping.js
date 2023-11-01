import { Model } from '#src/model/model';
import { MappingError } from '#src/model/error';

export default class MappingModel extends Model {
  constructor({
    sequence, pages, type, increment, controller, channel,
  } = {}) {
    if (sequence === undefined ?? sequence === null) throw new MappingError('sequence is undefined or null');
    if (pages === undefined ?? pages === null) throw new MappingError('pages is undefined or null');
    if (type === undefined ?? type === null) throw new MappingError('type is undefined or null');
    if (type !== 'analog' && type !== 'digital') throw new MappingError('unsupported type');
    if (type === 'analog' && (increment === undefined ?? increment === null)) throw new MappingError('increment is undefined or null');
    if (controller === undefined ?? controller === null) throw new MappingError('controller is undefined or null');
    if (channel === undefined ?? channel === null) throw new MappingError('channel is undefined or null');

    super({
      sequence, pages, type, increment, controller, channel,
    });
  }
}

export { MappingModel };
