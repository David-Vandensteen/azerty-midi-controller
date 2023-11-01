import { Model } from '#src/model/model';
import { PageError } from '#src/model/error';

export default class PageModel extends Model {
  constructor({ sequence, id }) {
    if (sequence === undefined ?? sequence === null) throw new PageError('sequence is undefined or null');
    if (id === undefined ?? id === null) throw new PageError('id is undefined or null');
    super({ sequence, id });
  }
}

export { PageModel };
