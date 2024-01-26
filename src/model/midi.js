import assert from 'node:assert';
import { MidiError } from '#src/model/error';

export default class MidiModel {
  out;

  constructor(out, { in: midiIn } = {}) {
    assert(typeof out === 'string', new MidiError('invalid midiOut'));

    if (midiIn) {
      assert(typeof midiIn === 'string', new MidiError('invalid midiIn'));
    }

    this.out = out;
    if (midiIn) this.in = midiIn;
  }

  static deserialize(json) {
    try {
      return new MidiModel(
        json?.out,
        { in: json?.in },
      );
    } catch (err) {
      throw new MidiError(err);
    }
  }
}

export { MidiModel };
