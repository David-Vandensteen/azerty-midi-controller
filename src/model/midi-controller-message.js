import { Model } from '#src/model/model';
import { MidiNormalizer } from 'midi-normalizer';
import { MidiControllerMessageError } from '#src/model/error';

export default class MidiControllerMessageModel extends Model {
  constructor({
    controller,
    channel,
    value,
  }) {
    if (controller === undefined ?? controller === null) throw new MidiControllerMessageError('controller is undefined or null');
    if (channel === undefined ?? channel === null) throw new MidiControllerMessageError('channel is undefined or null');
    if (value === undefined ?? value === null) throw new MidiControllerMessageError('value is undefined or null');
    super({
      controller: MidiNormalizer.controller(controller),
      channel: MidiNormalizer.channel(channel),
      value: MidiNormalizer.value(value),
    });
  }
}

export { MidiControllerMessageModel };
