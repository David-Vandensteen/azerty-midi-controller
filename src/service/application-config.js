import YAMLLoader from '#src/lib/yaml-loader';

export default class ApplicationConfigService {
  static get(appConfigFiles) {
    return {
      defaultApplicationConfigFiles: appConfigFiles,
      ...YAMLLoader(appConfigFiles[0], { fallBack: appConfigFiles }),
    };
  }
}

export { ApplicationConfigService };
