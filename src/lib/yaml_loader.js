import { readFileSync, existsSync } from 'fs';
import { parse } from 'yaml';
import appRootPath from 'app-root-path';

const { resolve } = appRootPath;

const { error } = console;

const getFromFile = (file) => {
  if (existsSync(file)) {
    const config = parse(readFileSync(file, 'utf8'));
    return config;
  }
  error(file, 'not found');
  return undefined;
};

const getAvailableFile = (yamlfile, fallBackFiles = []) => {
  const processedFiles = [...fallBackFiles, yamlfile].map((file) => resolve(file));
  const foundedFile = processedFiles.find((file) => existsSync(file));
  return foundedFile;
};

export default (yamlFile, options) => {
  if (options && !options?.fallBack) {
    throw new Error('fallBack option not found');
  } else {
    const foundedFile = getAvailableFile(yamlFile, options?.fallBack || '');
    if (foundedFile) return getFromFile(foundedFile);
    throw new Error(`No YAML file was founded ${yamlFile}`);
  }
};
