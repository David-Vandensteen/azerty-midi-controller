import assert from 'node:assert';
import { MappingModel } from '#src/model/mapping';
import { GlobalError } from '#src/model/error';

export default class GlobalModel {
  mappings;

  constructor({ mappings } = {}) {
    if (mappings) {
      assert(mappings.every((mapping) => mapping instanceof MappingModel), new GlobalError('invalid mappings'));
      // this.mappings = mappings.map(
      //   (mapping) => new MappingModel(
      //     mapping.sequence,
      //     mapping.type,
      //     mapping.controller,
      //     mapping.channel,
      //     {
      //       increment: mapping.increment,
      //       label: mapping.label,
      //     },
      //   ),
      // );

      this.mappings = mappings;
    }
  }

  static deserialize(json) {
    try {
      return new GlobalModel(
        // { mappings: json?.mappings },
        { mappings: json?.mappings?.map((mapping) => MappingModel.deserialize(mapping)) },
      );
    } catch (err) {
      throw new GlobalError(err);
    }
  }
}

export { GlobalModel };
