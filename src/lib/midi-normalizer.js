export default class MidiNormalizer {
  static controller(controller) {
    if (controller >= 127) return 127;
    if (controller <= 0) return 0;
    return controller;
  }

  static channel(channel) {
    if (channel >= 15) return 15;
    if (channel <= 0) return 0;
    return channel;
  }

  static value(value) {
    if (value >= 127) return 127;
    if (value <= 0) return 0;
    return value;
  }
}

export { MidiNormalizer };
