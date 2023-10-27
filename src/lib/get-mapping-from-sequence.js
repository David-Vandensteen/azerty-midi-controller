const getMappingFromSequence = (mapping, keypressSequence) => {
  if (mapping === undefined) throw new Error('mapping is undefined');
  if (keypressSequence === undefined) throw new Error('keypressSequence is undefined');
  const configuredKey = mapping.find(({ sequence }) => sequence === keypressSequence);
  return configuredKey;
};

export default getMappingFromSequence;
export { getMappingFromSequence };
