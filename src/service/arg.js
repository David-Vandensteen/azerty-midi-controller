import arg from 'arg';
import {
  name,
  author,
  version,
  license,
} from 'package-reader';

const { log } = console;

const showHelp = () => {
  log('');
  log('');
  log(name, '[options]');
  log('');
  log('     Required options:');
  log('');
  log('   -c    --config');
  log('');
  log('     Extra options:');
  log('');
  log('   --help                      -- show help');
  log('version', version, author, license);
  process.exit(0);
};

class ArgService {
  constructor() {
    this.args = arg({
      '--config': String,

      // Aliases
      '-c': '--config',
    });
  }

  get config() { return this.args['--config']; }

  get help() { return this.args['--help']; }

  checkArgumentsAndHelp() {
    if (!this.config) showHelp();
  }
}

const argService = new ArgService();

argService.get = () => {
  argService.checkArgumentsAndHelp();
  return {
    config: argService.config,
  };
};

export default argService;
export { argService };
