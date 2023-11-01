import { MappingModel } from '#src/model/mapping';
import {
  MappingError,
  SequenceError,
} from '#src/model/error';

const getMappingFromSequence = (mapping, keypressSequence) => {
  if (mapping === undefined) throw new MappingError('mapping is undefined');
  if (keypressSequence === undefined) throw new SequenceError('keypressSequence is undefined');
  const configuredKey = new MappingModel(
    mapping.find(({ sequence }) => sequence === keypressSequence),
  );
  return configuredKey;
};

export default getMappingFromSequence;
export { getMappingFromSequence };
