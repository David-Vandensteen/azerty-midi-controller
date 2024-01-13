import { MappingModel } from '#src/model/mapping';

export default class GlobalModel {
  constructor({ mappings } = {}) {
    if (mappings) {
      this.mappings = mappings.map(
        (mapping) => new MappingModel(
          mapping.sequence,
          mapping.type,
          mapping.controller,
          mapping.channel,
          {
            increment: mapping.increment,
            label: mapping.label,
          },
        ),
      );

      this.mappings = mappings;
    }
  }
}

export { GlobalModel };
