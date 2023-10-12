import { MidiNormalizer } from 'remote-midi';
import { Keyboard } from '#src/lib/keyboard';
import { MIDIControllerStore } from '#src/lib/midi-controller-store';
import { log } from '#src/lib/log';

const midiControllerState = MIDIControllerStore.getInstance();

const getConfiguredKey = (config, keypressSequence) => {
  const configuredKey = config.key.find(({ sequence }) => sequence === keypressSequence);
  return configuredKey;
};

class KeyboardService extends Keyboard {
  #midiSender;

  #config;

  #state = [];

  constructor({ config, midiSender }) {
    super();
    this.#config = config;
    this.#midiSender = midiSender;
    log.debug('add ID on each sequence');
    this.#config.key.map((k, index) => {
      this.#config.key[index].id = index;
      if (k.controller.cycle) {
        this.#state[index] = {
          cycleIndex: 0,
        };
      }
      return k;
    });
  }

  #getNormalizedMidiController({ controller, sequenceId }) {
    if (controller?.cycle) {
      const { cycleIndex } = this.#state[sequenceId];
      const normalizedMidiController = controller.cycle[cycleIndex];
      this.#state[sequenceId].cycleIndex += 1;
      if (this.#state[sequenceId].cycleIndex >= controller.cycle.length) {
        this.#state[sequenceId].cycleIndex = 0;
      }
      return MidiNormalizer.controller(normalizedMidiController);
    }
    return MidiNormalizer.controller(controller);
  }

  static #getMidiValue({
    type, channel, controller, increment,
  }) {
    const sourceValue = midiControllerState.getValue({ channel, controller });
    const modifiedValue = (type === 'analog')
      ? sourceValue + increment
      : 127;

    return MidiNormalizer.value(modifiedValue);
  }

  start() {
    super.start();
    log.title('midi mapping :');
    log.debug(this.#config);
    this.on('keypress', (keypressEvent) => {
      const sequence = KeyboardService.getNormalizedSequence(keypressEvent);
      log.debug('key trigger sequence :', sequence);
      const configuredKey = getConfiguredKey(this.#config, sequence);

      if (configuredKey) {
        const {
          id, controller, channel, increment, type,
        } = configuredKey;

        const normalizedMidiController = this.#getNormalizedMidiController(
          { controller, sequenceId: id },
        );

        const modifiedValue = KeyboardService.#getMidiValue({
          type,
          channel,
          controller: normalizedMidiController,
          increment,
        });

        const normalizedMidiMessage = MidiNormalizer.message({
          channel,
          value: modifiedValue,
          controller: normalizedMidiController,
        });

        midiControllerState.set(normalizedMidiMessage);
        this.#midiSender('cc', normalizedMidiMessage);
      }
    });
    return this;
  }
}

export default KeyboardService;
export { KeyboardService };
