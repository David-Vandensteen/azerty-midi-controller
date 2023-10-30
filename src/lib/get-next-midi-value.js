import { MidiNormalizer } from 'midi-normalizer';

const getNextMidiValue = (midiControllerStore, type, controller, channel, increment) => {
  if (type === undefined) throw new Error('type is undefinded');
  if (channel === undefined) throw new Error('channel is undefined');
  if (controller === undefined) throw new Error('controller is undefined');
  if (increment === undefined) throw new Error('increment is unedined');
  const fromValue = midiControllerStore.getValue(controller, channel);
  const toValue = (type === 'analog')
    ? fromValue + increment
    : 127;

  return MidiNormalizer.value(toValue);
};

export default getNextMidiValue;
export { getNextMidiValue };
