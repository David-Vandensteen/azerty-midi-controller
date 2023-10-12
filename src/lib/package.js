import fs from 'fs-extra';
import appRootPath from 'app-root-path';

const { resolve } = appRootPath;

const pkg = fs.readJSONSync(resolve('./package.json'));
const {
  name,
  author,
  version,
  license,
} = pkg;

export default pkg;
export {
  name,
  author,
  version,
  license,
};
