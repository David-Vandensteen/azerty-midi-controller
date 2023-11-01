import {
  PageError,
  PagesError,
  MappingError,
  SequenceError,
} from '#src/model/error';

import { getMappingFromSequence } from '#src/lib/get-mapping-from-sequence';
import { getPageFromSequence } from '#src/lib/get-page-from-sequence';

const getFromSequence = (pageId, pages, mapping, keypressSequence) => {
  if (pageId === undefined) throw new PageError('page is undefined');
  if (pages === undefined) throw new PagesError('pages is undefined');
  if (mapping === undefined) throw new MappingError('mapping is undefined');
  if (keypressSequence === undefined) throw new SequenceError('keypressSequence is undefined');
  return getPageFromSequence(
    pages,
    keypressSequence,
  ) ?? getMappingFromSequence(
    pageId,
    mapping,
    keypressSequence,
  );
};

export default getFromSequence;
export { getFromSequence };
