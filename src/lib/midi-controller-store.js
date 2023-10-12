let instance;

// eslint-disable-next-line no-unused-vars
const decode = (id) => {
  const controller = Math.floor(id / 128);
  const channel = id % 128;
  return { controller, channel };
};

const encode = (controller, channel) => controller * 128 + channel;

export default class MIDIControllerStore {
  #cache = new Map();

  static getInstance() {
    if (!instance) instance = new MIDIControllerStore();
    return instance;
  }

  getValue({ controller, channel }) {
    const key = encode(controller, channel);
    return this.#cache.get(key) ?? 0;
  }

  reset() {
    this.#cache.clear();
    return this;
  }

  set({ controller, channel, value }) {
    this.#cache.set(encode(controller, channel), value);
    return this;
  }
}

export { MIDIControllerStore };
