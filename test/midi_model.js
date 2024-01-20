import { MidiModel } from '#src/model/midi';

const { log } = console;

const midiOutObject = {
  midiOut: 'midi out',
};

const midiOut = MidiModel.deserialize(midiOutObject);
log(midiOut);

const midiObject = {
  midiOut: 'midi out',
  midiIn: 'midi in',
};

const midi = MidiModel.deserialize(midiObject);
log(midi);
