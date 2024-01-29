import { MidiModel } from '#src/model/midi';

const { log } = console;

log(new MidiModel('midi out'));

const midiOutObject = { out: 'midi out' };
const midiOut = MidiModel.deserialize(midiOutObject);
log(midiOut);

const midiObject = {
  out: 'midi out',
  in: 'midi in',
};
const midi = MidiModel.deserialize(midiObject);
log(midi);
