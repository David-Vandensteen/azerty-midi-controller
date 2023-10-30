import { MidiControllerStore } from 'midi-controller-store';

const { log } = console;

const instance = MidiControllerStore.getInstance();

instance.set(1, 1, 255);
log(instance.getValue(1, 1));
