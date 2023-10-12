import { ApplicationService } from '#src/service/application';
import { ConfigManager } from '#src/manager/config';

ApplicationService.run(
  ConfigManager.get([
    'src/config/application.yaml',
    'config/application.yaml']),
);
