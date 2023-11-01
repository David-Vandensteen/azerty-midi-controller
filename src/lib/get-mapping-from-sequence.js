import { MappingModel } from '#src/model/mapping';
import {
  PageError,
  MappingError,
  SequenceError,
} from '#src/model/error';

const getMappingFromSequence = (pageId, mapping, keypressSequence) => {
  if (pageId === undefined) throw new PageError('pageId is undefined');
  if (mapping === undefined) throw new MappingError('mapping is undefined');
  if (keypressSequence === undefined) throw new SequenceError('keypressSequence is undefined');

  const currentPageMapping = mapping.filter(({ pages }) => pages.includes(pageId));

  const configuredKey = currentPageMapping.find(({ sequence }) => sequence === keypressSequence);
  if (configuredKey) return new MappingModel(configuredKey);
  return null;
};

export default getMappingFromSequence;
export { getMappingFromSequence };
