import assert from 'node:assert';
import { MidiError } from '#src/model/error';

export default class MidiModel {
  midiOut;

  constructor(midiOut, { midiIn } = {}) {
    assert(typeof midiOut === 'string', new MidiError('invalid midiOut'));

    if (midiIn) {
      assert(typeof midiIn === 'string', new MidiError('invalid midiIn'));
    }

    this.midiOut = midiOut;
    if (midiIn) this.midiIn = midiIn;
  }

  static deserialize(json) {
    try {
      return new MidiModel(
        json?.out,
        { midiIn: json?.in },
      );
    } catch (err) {
      throw new MidiError(err);
    }
  }
}

export { MidiModel };
