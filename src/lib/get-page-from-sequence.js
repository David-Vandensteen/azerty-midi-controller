import { PageModel } from '#src/model/page';
import {
  PagesError,
  SequenceError,
} from '#src/model/error';

const getPageFromSequence = (pages, keypressSequence) => {
  if (pages === undefined) throw new PagesError('pages is undefined');
  if (keypressSequence === undefined) throw new SequenceError('keypressSequence is undefined');
  const configuredKey = pages.find(({ sequence }) => sequence === keypressSequence);
  if (configuredKey) return new PageModel(configuredKey);
  return null;
};

export default getPageFromSequence;
export { getPageFromSequence };
