import assert from 'node:assert';
import { MidiError } from '#src/model/error';

export default class MidiModel {
  out;

  constructor(out, { in: midiIn, socketIO } = {}) {
    assert(typeof out === 'string', new MidiError('invalid midiOut'));

    if (midiIn) {
      assert(typeof midiIn === 'string', new MidiError('invalid midiIn'));
    }

    if (socketIO) {
      assert(typeof socketIO === 'boolean', new MidiError('invalid socketIO'));
    }

    this.out = out;
    if (midiIn) this.in = midiIn;
    if (socketIO) this.socketIO = socketIO;
  }

  static deserialize(json) {
    try {
      return new MidiModel(
        json?.out,
        {
          in: json?.in,
          socketIO: json?.socketIO,
        },
      );
    } catch (err) {
      throw new MidiError(err);
    }
  }
}

export { MidiModel };
