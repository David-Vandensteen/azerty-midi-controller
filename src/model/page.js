import { Model } from '#src/model/model';
import { PageError } from '#src/model/error';

export default class PageModel extends Model {
  constructor({ sequence, page }) {
    if (sequence === undefined ?? sequence === null) throw new PageError('sequence is undefined or null');
    if (page === undefined ?? page === null) throw new PageError('page is undefined or null');
    super({ sequence, page });
  }
}

export { PageModel };
