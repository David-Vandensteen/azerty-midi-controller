import { MasterRunnerService } from '#src/service/masterRunner';
import { SlaveRunnerService } from '#src/service/slaveRunner';

export default class ApplicationService {
  static run(config) {
    if (!config?.mode ?? !config) throw new Error('invalid configuration');
    const { host, port, mode } = config;
    if (mode === 'master') {
      const { midiOutputDeviceName, midiInputDeviceName } = config;
      try {
        const master = new MasterRunnerService(
          host,
          port,
          { midiInputDeviceName, midiOutputDeviceName },
        );
        master.start();
      } catch (error) {
        throw new Error(`Error while creating MasterRunnerService: ${error}`);
      }
    }

    if (mode === 'slave') {
      const { keyMappingConfig } = config;
      try {
        const slave = new SlaveRunnerService(
          host,
          port,
          keyMappingConfig,
        );
        slave.start();
      } catch (error) {
        throw new Error(`Error while creating SlaveRunnerService: ${error}`);
      }
    }
  }
}

export { ApplicationService };
