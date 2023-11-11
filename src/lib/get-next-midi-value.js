import { MidiNormalizer } from 'midi-normalizer';

const getNextMidiValue = (midiControllerStore, type, controller, channel, increment) => {
  if (type === undefined) throw new Error('type is undefinded');
  if (channel === undefined) throw new Error('channel is undefined');
  if (controller === undefined) throw new Error('controller is undefined');
  if (type === 'analog' && increment === undefined) throw new Error('increment is unedined');
  const fromValue = midiControllerStore.getValue(controller, channel);
  let toValue;

  if (type === 'analog') toValue = fromValue + increment;
  if (type === 'digital') toValue = (fromValue > 0) ? 1 : 127; // TODO parametric on off values

  return MidiNormalizer.value(toValue);
};

export default getNextMidiValue;
export { getNextMidiValue };
