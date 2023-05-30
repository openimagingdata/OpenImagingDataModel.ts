import { z } from 'zod';

import { indexCodeSchema } from './indexCode';

export const bodyPartSchema = z.object({
  name: z.string(),
  index_codes: indexCodeSchema.optional(),
});

export type BodyPartData = z.infer<typeof bodyPartSchema>;

export class BodyPart {
  private _data: BodyPartData;

  constructor(inData: BodyPartData) {
    this._data = { ...inData };
  }

  get name() {
    return this._data.name;
  }

  get indexCode() {
    return this._data.index_codes;
  }
}
