import { MappingModel } from '#src/model/mapping';
import { GlobalError } from '#src/model/error';

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

  static deserialize(json) {
    try {
      return new GlobalModel(
        { mappings: json?.mappings },
      );
    } catch (err) {
      throw new GlobalError(err);
    }
  }
}

export { GlobalModel };
