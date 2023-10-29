import { MidiNormalizer } from '#src/lib/midi-normalizer';

let instance;

export default class MidiControllerStore {
  #cache = new Map();

  static getInstance() {
    if (!instance) instance = new MidiControllerStore();
    return instance;
  }

  static decode(id) {
    const controller = Math.floor(id / 128);
    const channel = id % 128;
    return { controller, channel };
  }

  static encode(controller, channel) { return controller * 128 + channel; }

  getValue(controller, channel) {
    if (controller === undefined) throw new Error('controller is undefined');
    if (channel === undefined) throw new Error('channel is undefined');
    const key = MidiControllerStore.encode(controller, channel);
    return this.#cache.get(key) ?? 0;
  }

  clear() {
    this.#cache.clear();
    return this;
  }

  set(controller, channel, value) {
    if (controller === undefined) throw new Error('controller is undefined');
    if (channel === undefined) throw new Error('channel is undefined');
    if (value === undefined) throw new Error('value is undefined');
    const normalizedController = MidiNormalizer.controller(controller);
    const normalizedChannel = MidiNormalizer.channel(channel);
    const normalizedValue = MidiNormalizer.value(value);
    this.#cache.set(
      MidiControllerStore.encode(
        normalizedController,
        normalizedChannel,
      ),
      normalizedValue,
    );
    return this;
  }
}

export {
  MidiControllerStore,
};
