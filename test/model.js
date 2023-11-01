import { Model } from '#src/model/model';
import { MappingModel } from '#src/model/mapping';

const { log } = console;

const model = new Model({ controller: 10, value: 20 });
log(model);

const mappingModel = new MappingModel({
  sequence: 'a',
  pages: ['default'],
  type: 'analog',
  increment: 1,
  controller: 3,
  channel: 0,
});

log(mappingModel);
