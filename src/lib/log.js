import chalk from 'chalk';

const { log, error } = console;

log.title = (...message) => { log(chalk.bgGreen.bold('-', ...message)); };
log.info = (...message) => { log(chalk.magenta.bold('  .', ...message)); };
log.debug = (...message) => { log(...message); };
log.error = (...message) => { error(...message); };

export default log;
export { log };
